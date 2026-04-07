import { useEffect, useRef } from "react";
import { useCallStore } from "../store/useCallStore";
import { PhoneIcon, PhoneOffIcon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react";

function CallOverlay() {
  const {
    callState,
    callType,
    callerInfo,
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    answerCall,
    rejectCall,
    hangup,
    toggleMute,
    toggleVideo,
  } = useCallStore();

  const remoteAudioRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // bind the remote audio stream to the audio element when it updates
  useEffect(() => {
    if (callType === "audio" && remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, callType]);

  // bind video streams
  useEffect(() => {
    if (callType === "video" && callState === "active") {
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }
  }, [callType, callState, localStream, remoteStream]);

  if (callState === "idle") return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Hidden audio element to play the remote caller's voice for audio calls */}
      {callType === "audio" && <audio ref={remoteAudioRef} autoPlay />}

      <div
        className={`w-full ${
          callType === "video" && callState === "active" ? "max-w-4xl h-[80vh]" : "max-w-sm"
        } bg-[#1a1a2e] rounded-3xl p-8 flex flex-col items-center border border-violet-500/20 shadow-2xl relative overflow-hidden transition-all duration-500`}
      >
        {/* Breathing background effect for ringing */}
        {(callState === "ringing-incoming" || callState === "ringing-outgoing") && (
          <div className="absolute inset-0 bg-violet-600/10 animate-[pulse-dot_2s_ease-in-out_infinite]" />
        )}

        {/* User Info or Video Streams */}
        {callType === "video" && callState === "active" ? (
          <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
            {/* Remote Video (Main) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (PIP) */}
            <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] aspect-video bg-gray-900 rounded-xl overflow-hidden border-2 border-violet-500/50 shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center mb-10 w-full text-center flex-1 justify-center">
            <img
              src={callerInfo?.profilePic || "/avatar.png"}
              alt="caller"
              className={`w-28 h-28 rounded-full border-4 border-[#1a1a2e] shadow-xl ${
                callState === "active" ? "ring-4 ring-emerald-500" : "ring-4 ring-violet-500"
              } object-cover mb-6`}
            />
            <h2 className="text-2xl font-bold text-white mb-2">
              {callerInfo?.fullName || "Unknown User"}
            </h2>
            <p className="text-violet-300 font-medium tracking-wide text-sm bg-violet-500/10 px-4 py-1.5 rounded-full">
              {callState === "ringing-incoming" && "Incoming " + (callType === "video" ? "Video " : "") + "Call..."}
              {callState === "ringing-outgoing" && "Calling..."}
              {callState === "active" && "In Call"}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="relative z-10 flex items-center justify-center gap-6 w-full mt-auto">
          {callState === "ringing-incoming" ? (
            <>
              {/* Accept & Decline */}
              <button
                onClick={rejectCall}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all"
              >
                <PhoneOffIcon className="size-6 text-white" />
              </button>
              <button
                onClick={answerCall}
                className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg hover:bg-emerald-600 hover:scale-110 transition-all animate-bounce"
              >
                <PhoneIcon className="size-6 text-white" />
              </button>
            </>
          ) : callState === "ringing-outgoing" ? (
            <>
              {/* Cancel Outgoing Call */}
              <button
                onClick={hangup}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all"
              >
                <PhoneOffIcon className="size-6 text-white" />
              </button>
            </>
          ) : (
            <>
              {/* Active Call Controls */}
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all ${
                  isMuted ? "bg-slate-700" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {isMuted ? (
                  <MicOffIcon className="size-6 text-white" />
                ) : (
                  <MicIcon className="size-6 text-white" />
                )}
              </button>

              {callType === "video" && (
                <button
                  onClick={toggleVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all ${
                    !isVideoEnabled ? "bg-slate-700" : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {!isVideoEnabled ? (
                    <VideoOffIcon className="size-6 text-white" />
                  ) : (
                    <VideoIcon className="size-6 text-white" />
                  )}
                </button>
              )}

              <button
                onClick={hangup}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all"
              >
                <PhoneOffIcon className="size-6 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CallOverlay;
