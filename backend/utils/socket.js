const { Server } = require("socket.io");
require("dotenv").config();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      io.to(roomId).emit("messageReceived", {
        sender: userId,
        firstName,
        text,
      });
    });

    socket.on("disconnect", () => {
      // you can log if needed
      // console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
