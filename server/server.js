require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

require("./config/db"); // DB connect

const app = require("./app");
const socketHandler = require("./socket/socket");

// 🔥 Create HTTP server
const server = http.createServer(app);

// 🔥 Attach socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 🔥 Socket logic
socketHandler(io);

// 🔥 Start server
server.listen(5000, () => {
  console.log("Server running on 5000");
});