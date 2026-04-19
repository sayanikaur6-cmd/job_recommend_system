// config/db.js
const mongoose = require("mongoose");

const mainDB = mongoose.createConnection(process.env.MONGO_URI, {
  dbName: "jobrecommend",
});

const chatDB = mongoose.createConnection(process.env.CHAT_URI, {
  dbName: "chatDB",
});

module.exports = { mainDB, chatDB };