const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const fetchJobsByLocation = require("./services/fetchJobsByLocation");
const statesAndCities = require("./config/state.json");
const session = require("express-session");
const passport = require("./config/passport");
app.use(cors());
app.use(express.json());
// 🔐 Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// 🔑 Passport
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));



app.get("/get-state", async (req, res) => {
  const { lat, lng } = req.query;

  try {
    // 1️⃣ Get state from coordinates
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: { lat, lon: lng, format: "json" },
        headers: { "User-Agent": "travel-tourism-app" }
      }
    );

    const state = response.data.address.state || response.data.address.county || "Unknown";

    // 2️⃣ Get all major cities for this state
    const cities = statesAndCities[state] || [];

    let allJobs = [];

    // 3️⃣ Fetch jobs for each city
    for (const city of cities) {
      const jobs = await fetchJobsByLocation(city);
      allJobs = allJobs.concat(jobs);
    }

    res.json({
      latitude: lat,
      longitude: lng,
      state: state,
      full_address: response.data.display_name,
      jobs: allJobs // all jobs in state cities
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "Location fetch failed" });
  }
});

module.exports = app;