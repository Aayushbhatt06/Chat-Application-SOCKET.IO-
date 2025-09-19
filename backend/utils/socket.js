const socket = require("socket.io");
require("dotenv");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://3.108.61.73:3000",
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
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
