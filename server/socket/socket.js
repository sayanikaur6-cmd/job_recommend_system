// socket/socket.js
const Message = require("../models/message");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🔹 Join room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`Joined room: ${roomId}`);
    });

    // 🔹 Send message
    socket.on("send_message", async (data) => {
      try {
        const newMsg = new Message({
          roomId: data.room,
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
        });

        await newMsg.save();

        // 🔥 Send to others in room
        socket.to(data.room).emit("receive_message", newMsg);

      } catch (err) {
        console.error("Message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketHandler;