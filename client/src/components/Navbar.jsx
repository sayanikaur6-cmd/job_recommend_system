import { useNavigate } from "react-router-dom";
import AnimatedSearch from "./AnimatedSearch";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm">
      {/* LOGO */}
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Career<span className="text-primary">Sync</span>
      </h3>

      {/* RIGHT SIDE */}
      <div className="d-flex align-items-center gap-3">
        {/* 🔍 Search Component */}
        <AnimatedSearch />

        {!isLoggedIn ? (
          <>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            {/* 👥 PEOPLE SEARCH */}
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-2"
              onClick={() => navigate("/search-profiles")}
            >
              <i className="bi bi-people-fill"></i>
              People
            </button>

            {/* 🔔 CONNECTION REQUESTS */}
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/feed")}
            >
              <i className="bi bi-file-post"></i>
              Feed
            </button>

            {/* 👤 PROFILE */}
            <i
              className="bi bi-person-circle"
              style={{ fontSize: "26px", cursor: "pointer" }}
              title="Profile"
              onClick={() => navigate("/profile")}
            ></i>

            {/* 🚪 LOGOUT */}
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
