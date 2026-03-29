import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
      style={{ background: "#fff" }}
    >
      {/* LOGO */}
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Career<span className="text-primary">Sync</span>
      </h3>

      {/* RIGHT SIDE */}
      <div className="d-flex align-items-center gap-3">

        {/* 🔥 Animated Search */}
        <div
          className="d-flex align-items-center"
          style={{
            position: "relative",
            transition: "all 0.4s ease",
          }}
        >
          {/* Input Field */}
          <input
            type="text"
            placeholder="Search jobs..."
            className="form-control"
            style={{
              width: showSearch ? "200px" : "0px",
              opacity: showSearch ? 1 : 0,
              padding: showSearch ? "6px 10px" : "0px",
              marginRight: showSearch ? "10px" : "0px",
              transition: "all 0.4s ease",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          />

          {/* Search Icon */}
          <i
            className="bi bi-search"
            style={{
              fontSize: "20px",
              cursor: "pointer",
              transform: showSearch ? "rotate(90deg) scale(1.2)" : "none",
              transition: "all 0.4s ease",
            }}
            onClick={() => setShowSearch(!showSearch)}
          ></i>
        </div>

        {/* Login */}
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        {/* Register */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </nav>
  );
}