import "./PremiumFooter.css";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaGlobe,
  FaMapMarkerAlt,
  FaMailchimp,
  FaEnvelope,
} from "react-icons/fa";

const PremiumFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ABOUT */}

        <div className="footer-column">
          <h2>CareerSync</h2>

          <h3>About Us</h3>

          <p>
            CareerSync is an AI Powered Job Recommendation System that
            intelligently matches users with better career opportunities based
            on their skills, profiles and preferences.
          </p>
        </div>

        {/* QUICK LINKS */}

        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <a href="/">Home</a>
            </li>

            <li>
              <a href="/feed">Feed</a>
            </li>

            <li>
              <a href="/profile">Profile</a>
            </li>

            <li>
              <a href="/contact">Contact Us</a>
            </li>

            <li>
              <a href="/about">About Us</a>
            </li>
          </ul>
        </div>

        {/* IMPORTANT LINKS */}

        <div className="footer-column">
          <h3>Important Links</h3>

          <ul>
            <li>
              <a href="/login">Login</a>
            </li>

            <li>
              <a href="/register">Register</a>
            </li>

            <li>
              <a href="/application-tracking">Application Tracking</a>
            </li>

            <li>
              <a href="/search-profiles">Search Profiles</a>
            </li>

            <li>
              <a href="/chat">Career Chat</a>
            </li>
          </ul>
        </div>

        {/* OTHER LINKS */}

        <div className="footer-column">
          <h3>Other Links</h3>

          <ul>
            <li>
              <a href="#">Privacy Policy</a>
            </li>

            <li>
              <a href="#">Resume Builder</a>
            </li>

            <li>
              <a href="#">AI Recommendation</a>
            </li>

            <li>
              <a href="#">Terms & Conditions</a>
            </li>

            <li>
              <a href="#">Smart Ranking System</a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}

        <div className="footer-column">
          <h3>Contact Us</h3>

          <p>
            <FaMapMarkerAlt />
            &nbsp;&nbsp; Kolkata, West Bengal, India
          </p>

          <p>
            <FaPhoneAlt />
            &nbsp;&nbsp; +91 6291123845
          </p>

          <p>
            <FaEnvelope />
            &nbsp;&nbsp; 
            <a href="mailto:careersync4@gmail.com">
                careersync4@gmail.com
            </a>
          </p>

          <h3 className="follow">Follow Us</h3>

          <div className="social-icons">
            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

            <a href="https://www.youtube.com/@CareerSync-jobs">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="copyright">©2026 CareerSync. All Rights Reserved.</div>
    </footer>
  );
};

export default PremiumFooter;
