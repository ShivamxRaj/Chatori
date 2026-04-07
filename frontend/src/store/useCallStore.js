import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
  ],
};

export const useCallStore = create((set, get) => ({
  callState: "idle", // 'idle', 'ringing-outgoing', 'ringing-incoming', 'active'
  callType: "audio", // 'audio' or 'video'
  callerInfo: null, // User info of the person calling us or being called
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  isMuted: false,
  isVideoEnabled: true,

  subscribeToCallEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("incomingCall", async ({ signal, from, callerInfo, callType }) => {
      // If already in a call, we essentially ignore or reject automatically (simplified here just ignores)
      if (get().callState !== "idle") return;

      set({
        callState: "ringing-incoming",
        callerInfo: callerInfo,
        callType: callType || "audio",
        // we temporarily store the offer signal in the store to answer later
        incomingSignal: signal,
        incomingFrom: from,
      });
      // Play ringing sound
      get().playRingtone();
    });

    socket.on("callAccepted", async (signal) => {
      const pc = get().peerConnection;
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          set({ callState: "active" });
          get().stopRingtone();
        } catch (e) {
          console.error("Error setting remote description:", e);
        }
      }
    });

    socket.on("callRejected", () => {
      toast.error("Call was declined.");
      get().resetCall();
    });

    socket.on("iceCandidate", async (candidate) => {
      const pc = get().peerConnection;
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ice candidate:", e);
        }
      }
    });

    socket.on("callEnded", () => {
      toast("The call ended.");
      get().resetCall();
    });
  },

  unsubscribeFromCallEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("incomingCall");
    socket.off("callAccepted");
    socket.off("callRejected");
    socket.off("iceCandidate");
    socket.off("callEnded");
  },

  setupPeerConnection: (userToConnect) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    const socket = useAuthStore.getState().socket;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          to: userToConnect,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      set({ remoteStream: event.streams[0] });
    };

    const localStream = get().localStream;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    set({ peerConnection: pc });
    return pc;
  },

  initiateCall: async (userToCall, type = "audio") => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: type === "video" 
      });
      
      set({ 
        localStream: stream, 
        callState: "ringing-outgoing", 
        callerInfo: userToCall,
        callType: type,
        isVideoEnabled: type === "video"
      });
      
      get().playRingtone();

      const pc = get().setupPeerConnection(userToCall._id);
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("callUser", {
        userToCall: userToCall._id,
        signalData: offer,
        from: authUser._id,
        callerInfo: authUser,
        callType: type,
      });

    } catch (err) {
      console.error("Microphone permission denied or err:", err);
      toast.error("Could not access microphone.");
      get().resetCall();
    }
  },

  answerCall: async () => {
    const socket = useAuthStore.getState().socket;
    const { incomingFrom, callerInfo, incomingSignal, callType } = get();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: callType === "video" 
      });
      
      set({ 
        localStream: stream, 
        callState: "active" ,
        isVideoEnabled: callType === "video"
      });
      get().stopRingtone();

      const pc = get().setupPeerConnection(incomingFrom);
      
      await pc.setRemoteDescription(new RTCSessionDescription(incomingSignal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answerCall", {
        signal: answer,
        to: incomingFrom,
      });

    } catch (err) {
      console.error("Microphone error:", err);
      toast.error("Could not access microphone.");
      get().rejectCall();
    }
  },

  rejectCall: () => {
    const socket = useAuthStore.getState().socket;
    const { incomingFrom } = get();
    socket.emit("rejectCall", { to: incomingFrom });
    get().resetCall();
  },

  hangup: () => {
    const socket = useAuthStore.getState().socket;
    const { callerInfo, callState, incomingFrom } = get();
    
    // figure out who to notify
    const toNotify = callState === "ringing-incoming" ? incomingFrom : callerInfo?._id;
    if (toNotify) {
      socket.emit("endCall", { to: toNotify });
    }
    
    get().resetCall();
  },

  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = isMuted;
      set({ isMuted: !isMuted });
    }
  },

  toggleVideo: () => {
    const { localStream, isVideoEnabled } = get();
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        set({ isVideoEnabled: !isVideoEnabled });
      }
    }
  },

  resetCall: () => {
    const { localStream, peerConnection } = get();
    
    get().stopRingtone();

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }
    set({
      callState: "idle",
      callType: "audio",
      callerInfo: null,
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      incomingSignal: null,
      incomingFrom: null,
      isMuted: false,
      isVideoEnabled: true,
    });
  },

  // Helpers for sound
  ringtoneInterval: null,
  playRingtone: () => {
    // We use the existing notification sound, playing it every 2 seconds
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch(e => console.log("Audio permission:", e));
    
    const interval = setInterval(() => {
      const ping = new Audio("/sounds/notification.mp3");
      ping.play().catch(e => console.log("Audio permission:", e));
    }, 2500);
    
    set({ ringtoneInterval: interval });
  },
  stopRingtone: () => {
    const { ringtoneInterval } = get();
    if (ringtoneInterval) {
      clearInterval(ringtoneInterval);
      set({ ringtoneInterval: null });
    }
  }
}));
