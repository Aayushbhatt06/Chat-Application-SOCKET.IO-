import { Server } from "socket.io";
import "dotenv/config";
import http from "http";

interface JoinChatData {
  userId: string;
  targetUserId: string;
}

interface SendMessageData {
  firstName: string;
  userId: string;
  targetUserId: string;
  text: string;
}

interface TypingData {
  userId: string;
  targetUserId: string;
}

const initializeSocket = (server: http.Server): void => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL as string, "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }: JoinChatData) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }: SendMessageData) => {
      const roomId = [userId, targetUserId].sort().join("_");

      io.to(roomId).emit("messageReceived", {
        sender: userId,
        firstName,
        text,
      });
    });

    socket.on("typing", ({ userId, targetUserId }: TypingData) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.to(roomId).emit("typing", { userId });
    });

    socket.on("stopTyping", ({ userId, targetUserId }: TypingData) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.to(roomId).emit("stopTyping", { userId });
    });

    socket.on("disconnect", () => {
      socket.rooms.forEach((roomId) => {
        socket.to(roomId).emit("stopTyping", { userId: socket.id });
      });
    });
  });
};

export default initializeSocket;
