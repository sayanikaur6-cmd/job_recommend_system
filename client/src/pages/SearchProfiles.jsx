import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchProfiles,
  sendConnectionRequest,
} from "../api/profileSearchApi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SearchProfiles = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const getImage = (pic) => {
    if (!pic) return "https://via.placeholder.com/100";
    if (pic.startsWith("http")) return pic;
    return `${API}${pic}`;
  };

  const loadUsers = async () => {
    if (!query.trim()) {
      setUsers([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const data = await searchProfiles(query.trim());
      setUsers(data.users || []);
    } catch (error) {
      alert(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e, userId) => {
    e.stopPropagation();

    try {
      await sendConnectionRequest(userId);
      alert("Connection request sent");
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Request failed");
    }
  };

  const renderButton = (user) => {
    if (user.connectionStatus === "self") {
      return (
        <button className="btn btn-light border w-100 rounded-pill" disabled>
          Your Profile
        </button>
      );
    }

    if (user.connectionStatus === "connected") {
      return (
        <button className="btn btn-success w-100 rounded-pill" disabled>
          <i className="bi bi-check-circle me-1"></i>
          Connected
        </button>
      );
    }

    if (user.connectionStatus === "pending_sent") {
      return (
        <button className="btn btn-warning w-100 rounded-pill" disabled>
          Pending
        </button>
      );
    }

    return (
      <button
        className="btn btn-primary w-100 rounded-pill"
        onClick={(e) => handleConnect(e, user._id)}
      >
        <i className="bi bi-person-plus me-1"></i>
        Connect
      </button>
    );
  };

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background:
          "linear-gradient(135deg, #eef4ff 0%, #f8f9ff 50%, #ffffff 100%)",
      }}
    >
      <div className="container">
        <div
          className="card border-0 shadow-lg p-4 mb-4"
          style={{ borderRadius: 26 }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h2 className="fw-bold mb-1">
                Find <span className="text-primary">People</span>
              </h2>
              <p className="text-muted mb-0">
                Search users by name, email, or location.
              </p>
            </div>

            <div
              className="d-flex align-items-center gap-2 bg-light p-2"
              style={{ borderRadius: 18, minWidth: "45%" }}
            >
              <i className="bi bi-search text-muted ms-2"></i>

              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none"
                placeholder="Search profile..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") loadUsers();
                }}
              />

              <button
                className="btn btn-primary px-4 rounded-pill"
                onClick={loadUsers}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {!searched && (
          <div
            className="card border-0 shadow-sm text-center p-5"
            style={{ borderRadius: 24 }}
          >
            <i
              className="bi bi-people text-primary mb-3"
              style={{ fontSize: 50 }}
            ></i>
            <h4 className="fw-bold">Search profiles</h4>
            <p className="text-muted mb-0">
              Type a name, email, or location to find people.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="text-muted mt-3">Searching profiles...</p>
          </div>
        )}

        {searched && !loading && users.length === 0 && (
          <div
            className="card border-0 shadow-sm text-center p-5"
            style={{ borderRadius: 24 }}
          >
            <i
              className="bi bi-search text-muted mb-3"
              style={{ fontSize: 46 }}
            ></i>
            <h5 className="fw-bold">No profiles found</h5>
            <p className="text-muted mb-0">
              Try searching with another name, email, or location.
            </p>
          </div>
        )}

        {searched && !loading && users.length > 0 && (
          <>
            <p className="text-muted mb-3">
              Showing {users.length} result{users.length > 1 ? "s" : ""}
            </p>

            <div className="row">
              {users.map((user) => (
                <div className="col-md-6 col-lg-4 mb-4" key={user._id}>
                  <div
                    className="card border-0 shadow-sm h-100 overflow-hidden"
                    style={{
                      borderRadius: 24,
                      cursor: "pointer",
                      transition: "0.25s ease",
                    }}
                    onClick={() => navigate(`/public-profile/${user._id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 40px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 0.125rem 0.25rem rgba(0,0,0,.075)";
                    }}
                  >
                    <div
                      style={{
                        height: 80,
                        background:
                          "linear-gradient(135deg, #0d6efd, #6f42c1)",
                      }}
                    ></div>

                    <div className="p-4 text-center position-relative">
                      <img
                        src={getImage(user.profilePic)}
                        alt={user.name}
                        className="rounded-circle border border-4 border-white shadow-sm"
                        style={{
                          width: 92,
                          height: 92,
                          objectFit: "cover",
                          marginTop: -72,
                          background: "#fff",
                        }}
                      />

                      <h5 className="fw-bold mt-3 mb-1">{user.name}</h5>

                      <p className="text-primary small fw-semibold mb-1">
                        {user.role || "Professional"}
                      </p>

                      <p className="text-muted small mb-3">
                        <i className="bi bi-geo-alt me-1"></i>
                        {user.location || "Location not added"}
                      </p>

                      <p
                        className="text-muted small mb-4"
                        style={{ minHeight: 40 }}
                      >
                        {user.bio
                          ? user.bio.slice(0, 90) + "..."
                          : "No bio added yet."}
                      </p>

                      {renderButton(user)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchProfiles;