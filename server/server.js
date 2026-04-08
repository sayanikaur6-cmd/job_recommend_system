require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const session = require("express-session");
connectDB();

app.listen(5000, () => console.log("Server running"));