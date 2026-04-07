import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  socket.on("markMessagesAsRead", async ({ senderId }) => {
    try {
      // Import Message model dynamically to avoid circular dependency
      const Message = (await import("../models/Message.js")).default;
      await Message.updateMany({ senderId, receiverId: userId, read: false }, { read: true });
      
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", { receiverId: userId });
      }
    } catch (error) {
      console.error("Error marking messages as read via socket:", error);
    }
  });

  // ----- CALL SIGNALING EVENTS -----

  // 1. Initiate a call
  socket.on("callUser", ({ userToCall, signalData, from, callerInfo }) => {
    const receiverSocketId = getReceiverSocketId(userToCall);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", { signal: signalData, from, callerInfo });
    }
  });

  // 2. Answer a call
  socket.on("answerCall", (data) => {
    const callerSocketId = getReceiverSocketId(data.to);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", data.signal);
    }
  });

  // 3. Reject a call
  socket.on("rejectCall", (data) => {
    const callerSocketId = getReceiverSocketId(data.to);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected");
    }
  });

  // 4. Send ICE Candidates
  socket.on("iceCandidate", ({ to, candidate }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("iceCandidate", candidate);
    }
  });

  // 5. End Call
  socket.on("endCall", ({ to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callEnded");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
