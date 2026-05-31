import { Link, useNavigate } from "react-router-dom";
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
<<<<<<< HEAD
        {/* 🔍 Search Component */}
=======
        {/* SEARCH */}
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
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
            {/* PEOPLE */}
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-2"
              onClick={() => navigate("/search-profiles")}
            >
              <i className="bi bi-people-fill"></i>
              People
            </button>

            {/* CONNECTIONS */}
            <Link to="/connections" style={{ textDecoration: "none" }}>
              <button className="btn btn-outline-success d-flex align-items-center gap-2">
                <i className="bi bi-person-check-fill"></i>
                Connections
              </button>
            </Link>

            {/* FEED */}
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/feed")}
            >
              <i className="bi bi-file-post"></i>
              Feed
            </button>

<<<<<<< HEAD
            
            <div className="dropdown">
              <i
                className="bi bi-person-circle dropdown-toggle"
                style={{ fontSize: "26px", cursor: "pointer" }}
                data-bs-toggle="dropdown"
              ></i>

              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4">
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/profile")}>
                    <i className="bi bi-person me-2"></i>
                    View Profile
                  </button>
                </li>

                <li>
                  <button className="dropdown-item" onClick={() => navigate("/saved-jobs")}>
                    <i className="bi bi-bookmark-heart me-2"></i>
                    Saved Jobs
                  </button>
                </li>

                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/application-tracking")}
                  >
                    <i className="bi bi-clipboard-check me-2"></i>
                    Application Tracking
                  </button>
                </li>
              </ul>
            </div>

            {/* 🚪 LOGOUT */}
=======
            {/* PROFILE */}
            <i
              className="bi bi-person-circle"
              style={{
                fontSize: "26px",
                cursor: "pointer",
              }}
              title="Profile"
              onClick={() => navigate("/profile")}
            ></i>

            {/* LOGOUT */}
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
