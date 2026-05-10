import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react"; // ✅ ADD THIS
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import SearchResults from "./pages/SearchResults";
import JobDetails from "./pages/JobDetails";
import SearchProfiles from "./pages/SearchProfiles";
import PublicProfile from "./pages/PublicProfile";
import Chat from "./pages/Chat";
import Feed from "./pages/Feed";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔥 Check token on reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/search-profiles" element={<SearchProfiles />} />
        <Route path="/public-profile/:userId" element={<PublicProfile />} />
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </>
  );
}

export default App;
