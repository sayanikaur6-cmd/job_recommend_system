<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProfiles, sendConnectionRequest } from "../api/profileSearchApi";
=======
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchUsers } from "../api/userApi";
import { sendConnectionRequest } from "../api/connectionApi";
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getProfilePic = (user) => {
  if (user?.profilePic) {
    return user.profilePic.startsWith("http")
      ? user.profilePic
      : `${API}${user.profilePic}`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "User"
  )}&background=111827&color=fff`;
};

const SearchProfiles = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState(location.state?.users || []);
  const [query, setQuery] = useState(location.state?.query || "");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const result = await searchUsers(query.trim());
      setUsers(result || []);
    } catch (error) {
      alert(error.response?.data?.message || "Search failed");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim()) handleSearch();
    // eslint-disable-next-line
  }, []);

  const openProfile = (userId) => {
    navigate("/profile", {
      state: {
        viewOnly: true,
        profileUserId: userId,
      },
    });
  };

  const handleConnect = async (userId) => {
    try {
      const data = await sendConnectionRequest(userId);
      alert(data.message || "Connection request sent");

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, connectionStatus: "pending_sent" }
            : user
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Request failed");
    }
  };

  const renderConnectionButton = (user) => {
    const base = "connect-btn w-100";

    if (user.connectionStatus === "pending_sent") {
      return (
        <button className={`${base} muted`} disabled>
          <i className="bi bi-hourglass-split me-2"></i>
          Request Sent
        </button>
      );
    }

    if (user.connectionStatus === "pending_received") {
      return (
        <button className={`${base} warning`} disabled>
          <i className="bi bi-inbox me-2"></i>
          Request Received
        </button>
      );
    }

    if (user.connectionStatus === "connected") {
      return (
        <button className={`${base} success`} disabled>
          <i className="bi bi-check2-circle me-2"></i>
          Connected
        </button>
      );
    }

    if (user.connectionStatus === "self") {
      return (
        <button className={`${base} self`} disabled>
          <i className="bi bi-person-circle me-2"></i>
          Your Profile
        </button>
      );
    }

    return (
      <button
        className={`${base} primary`}
        onClick={(e) => {
          e.stopPropagation();
          handleConnect(user._id);
        }}
      >
        <i className="bi bi-person-plus-fill me-2"></i>
        Connect
      </button>
    );
  };

  return (
    <div className="people-page">
      <style>{`
        .people-page {
          min-height: 100vh;
          padding: 45px 20px;
          background:
            radial-gradient(circle at 10% 5%, rgba(37,99,235,.28), transparent 30%),
            radial-gradient(circle at 90% 10%, rgba(147,51,234,.24), transparent 32%),
            radial-gradient(circle at 50% 100%, rgba(14,165,233,.18), transparent 35%),
            linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #fff7ed 100%);
          position: relative;
          overflow-x: hidden;
        }

        .people-page::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.55) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.55) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, black, transparent 78%);
        }

        .people-container {
          max-width: 1160px;
          margin: auto;
          position: relative;
          z-index: 2;
        }

        .hero-panel {
          background: rgba(255,255,255,.78);
          backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 34px;
          padding: 30px;
          box-shadow:
            0 24px 75px rgba(30,64,175,.13),
            inset 0 1px 0 rgba(255,255,255,.9);
          position: relative;
          overflow: hidden;
        }

        .hero-panel::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,.16), transparent 70%);
          top: -120px;
          right: -90px;
        }

        .hero-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 950;
          letter-spacing: -1.8px;
          line-height: 1.05;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #111827, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          color: #64748b;
          font-size: 16px;
          font-weight: 600;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 15px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff, #f5f3ff);
          color: #2563eb;
          font-weight: 900;
          font-size: 13px;
          border: 1px solid #dbeafe;
          margin-bottom: 16px;
        }

        .search-shell {
          background: rgba(248,250,252,.95);
          border-radius: 999px;
          padding: 8px;
          box-shadow:
            inset 0 0 0 1px rgba(226,232,240,.9),
            0 12px 30px rgba(15,23,42,.06);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #2563eb;
          background: #ffffff;
          box-shadow: 0 8px 18px rgba(15,23,42,.08);
          flex-shrink: 0;
        }

        .search-input {
          border: 0;
          background: transparent;
          outline: none;
          flex: 1;
          min-width: 0;
          font-weight: 700;
          color: #0f172a;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-btn {
          border: 0;
          border-radius: 999px;
          padding: 12px 24px;
          font-weight: 900;
          color: white;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          box-shadow: 0 14px 28px rgba(37,99,235,.27);
          transition: .25s;
          white-space: nowrap;
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 38px rgba(37,99,235,.35);
        }

        .search-btn:disabled {
          opacity: .65;
          transform: none;
        }

        .result-bar {
          margin: 24px 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .result-count {
          color: #475569;
          font-weight: 900;
        }

        .result-chip {
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,.75);
          border: 1px solid rgba(226,232,240,.9);
          color: #64748b;
          font-size: 13px;
          font-weight: 800;
        }

        .profile-card {
          height: 100%;
          border: 0;
          border-radius: 30px;
          overflow: hidden;
          cursor: pointer;
          background: rgba(255,255,255,.82);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,.9);
          box-shadow:
            0 20px 60px rgba(15,23,42,.09),
            inset 0 1px 0 rgba(255,255,255,.95);
          transition: .28s ease;
          position: relative;
        }

        .profile-card:hover {
          transform: translateY(-8px);
          box-shadow:
            0 30px 85px rgba(15,23,42,.16),
            inset 0 1px 0 rgba(255,255,255,.95);
        }

        .profile-cover {
          height: 108px;
          background:
            radial-gradient(circle at 20% 10%, rgba(255,255,255,.42), transparent 28%),
            linear-gradient(135deg, #2563eb, #7c3aed 55%, #06b6d4);
          position: relative;
        }

        .profile-cover::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(45deg, rgba(255,255,255,.14) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,.14) 25%, transparent 25%);
          background-size: 28px 28px;
          opacity: .35;
        }

        .avatar-wrap {
          width: 104px;
          height: 104px;
          border-radius: 30px;
          padding: 5px;
          margin: -58px auto 14px;
          background: linear-gradient(135deg, #ffffff, #dbeafe);
          box-shadow: 0 18px 35px rgba(15,23,42,.18);
          position: relative;
          z-index: 2;
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 25px;
          background: white;
        }

        .profile-body {
          padding: 0 24px 24px;
          text-align: center;
        }

        .profile-name {
          font-size: 20px;
          font-weight: 950;
          color: #0f172a;
          margin-bottom: 5px;
          letter-spacing: -.3px;
        }

        .profile-role {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
          padding: 6px 12px;
          border-radius: 999px;
          color: #2563eb;
          background: #eff6ff;
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .profile-location {
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .profile-bio {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          min-height: 68px;
          margin-bottom: 18px;
        }

        .connect-btn {
          border: 0;
          border-radius: 999px;
          padding: 12px 16px;
          font-weight: 950;
          transition: .25s;
        }

        .connect-btn.primary {
          color: white;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          box-shadow: 0 14px 28px rgba(37,99,235,.25);
        }

        .connect-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 35px rgba(37,99,235,.34);
        }

        .connect-btn.success {
          color: #047857;
          background: #d1fae5;
        }

        .connect-btn.warning {
          color: #92400e;
          background: #fef3c7;
        }

        .connect-btn.muted {
          color: #475569;
          background: #e2e8f0;
        }

        .connect-btn.self {
          color: #334155;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .empty-state {
          border-radius: 30px;
          padding: 55px 20px;
          text-align: center;
          background: rgba(255,255,255,.82);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,.9);
          box-shadow: 0 20px 60px rgba(15,23,42,.08);
        }

        .empty-icon {
          width: 76px;
          height: 76px;
          border-radius: 27px;
          margin: 0 auto 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #dbeafe, #ede9fe);
          color: #2563eb;
          font-size: 32px;
        }

        @media (max-width: 768px) {
          .people-page {
            padding: 25px 12px;
          }

          .hero-panel {
            padding: 22px;
            border-radius: 26px;
          }

          .search-shell {
            border-radius: 24px;
            align-items: stretch;
            flex-wrap: wrap;
          }

          .search-icon {
            display: none;
          }

          .search-input {
            width: 100%;
            flex-basis: 100%;
            padding: 12px 14px;
          }

          .search-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="people-container">
        <div className="hero-panel">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="hero-badge">
                <i className="bi bi-stars"></i>
                CareerSync People Search
              </div>

              <h1 className="hero-title">
                Discover people who match your career network.
              </h1>

              <p className="hero-subtitle mb-0">
                Search users by name, email, location or role and connect with them instantly.
              </p>
            </div>

            <div className="col-lg-6">
              <div className="search-shell">
                <div className="search-icon">
                  <i className="bi bi-search"></i>
                </div>

                <input
                  className="search-input"
                  value={query}
                  placeholder="Search people, role, location..."
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />

                <button className="search-btn" onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Searching
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search-heart me-2"></i>
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="result-bar">
          <div className="result-count">
            Showing {users.length} result{users.length !== 1 ? "s" : ""}
          </div>

          {query && (
            <div className="result-chip">
              <i className="bi bi-filter-circle me-1"></i>
              Query: {query}
            </div>
          )}
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bi bi-person-x"></i>
            </div>

            <h5 className="fw-bold mb-2">No people found</h5>
            <p className="text-muted mb-0">Try searching another name, role or location.</p>
          </div>
        ) : (
          <div className="row g-4">
            {users.map((user) => (
              <div className="col-md-6 col-lg-4" key={user._id}>
                <div className="profile-card" onClick={() => openProfile(user._id)}>
                  <div className="profile-cover"></div>

<<<<<<< HEAD
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
                    onClick={() =>
                      navigate("/profile", {
                        state: {
                          viewOnly: true,
                          profileUserId: user._id,
                        },
                      })
                    }
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
                        background: "linear-gradient(135deg, #0d6efd, #6f42c1)",
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
=======
                  <div className="profile-body">
                    <div className="avatar-wrap">
                      <img src={getProfilePic(user)} alt="" className="profile-avatar" />
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
                    </div>

                    <h5 className="profile-name">{user.name}</h5>

                    <div className="profile-role">
                      <i className="bi bi-briefcase me-1"></i>
                      {user.headline || user.role || "CareerSync User"}
                    </div>

                    <div className="profile-location">
                      <i className="bi bi-geo-alt me-1"></i>
                      {user.location || "Location not added"}
                    </div>

                    <p className="profile-bio">
                      {user.bio
                        ? user.bio.length > 95
                          ? `${user.bio.slice(0, 95)}...`
                          : user.bio
                        : "No bio added yet. Visit profile to know more about this user."}
                    </p>

                    {renderConnectionButton(user)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProfiles;
