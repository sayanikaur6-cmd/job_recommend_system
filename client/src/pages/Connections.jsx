import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReceivedRequests,
  getSentRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectedPeople,
} from "../api/connectionApi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImg = (user) => {
  if (user?.profilePic) {
    return user.profilePic.startsWith("http")
      ? user.profilePic
      : `${API}${user.profilePic}`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "User"
  )}&background=6366f1&color=fff&bold=true`;
};

const Connections = () => {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [connected, setConnected] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const theme = {
    primary: "#6366f1",
    secondary: "#0ea5e9",
    dark: "#0f172a",
    muted: "#64748b",
    border: "rgba(148,163,184,0.22)",
    glass: "rgba(255,255,255,0.82)",
  };

  const openProfile = (userId) => {
    navigate("/profile", {
      state: {
        viewOnly: true,
        profileUserId: userId,
      },
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const receivedReq = await getReceivedRequests();
      const sentReq = await getSentRequests();
      const people = await getConnectedPeople();

      setReceived(receivedReq || []);
      setSent(sentReq || []);
      setConnected(people || []);
    } catch (error) {
      console.log("CONNECTION PAGE ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const acceptReq = async (id) => {
    await acceptConnectionRequest(id);
    await loadData();
  };

  const rejectReq = async (id) => {
    await rejectConnectionRequest(id);
    await loadData();
  };

  const UserMiniCard = ({ user, action, status }) => (
    <div
      className="d-flex justify-content-between align-items-center p-3 mb-3"
      style={{
        background: "rgba(248,250,252,0.9)",
        border: `1px solid ${theme.border}`,
        borderRadius: "22px",
        boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
      }}
    >
      <div
        className="d-flex align-items-center gap-3"
        style={{ cursor: "pointer" }}
        onClick={() => openProfile(user?._id)}
      >
        <div style={{ position: "relative" }}>
          <img
            src={getImg(user)}
            alt=""
            width="62"
            height="62"
            className="rounded-circle"
            style={{
              objectFit: "cover",
              border: "4px solid #fff",
              boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
            }}
          />

          <span
            style={{
              position: "absolute",
              right: "2px",
              bottom: "4px",
              width: "13px",
              height: "13px",
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid white",
            }}
          ></span>
        </div>

        <div>
          <h6 className="fw-bold mb-1" style={{ color: theme.dark }}>
            {user?.name || "Unknown User"}
          </h6>

          <small style={{ color: theme.muted }}>
            {user?.role || user?.location || user?.email || "CareerSync user"}
          </small>
        </div>
      </div>

      <div>{action || status}</div>
    </div>
  );

  const EmptyBox = ({ text }) => (
    <div
      className="text-center py-5"
      style={{
        background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
        borderRadius: "22px",
        border: `1px dashed ${theme.border}`,
      }}
    >
      <div
        className="mx-auto mb-3 d-flex align-items-center justify-content-center"
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "22px",
          background: "#fff",
          boxShadow: "0 14px 30px rgba(15,23,42,0.08)",
        }}
      >
        <i
          className="bi bi-people"
          style={{ fontSize: "32px", color: theme.primary }}
        ></i>
      </div>

      <p className="text-muted mb-0">{text}</p>
    </div>
  );

  const SectionCard = ({ title, subtitle, count, children, icon }) => (
    <div
      className="card border-0 p-4 mb-4"
      style={{
        borderRadius: "30px",
        background: theme.glass,
        backdropFilter: "blur(18px)",
        boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "16px",
              background: "linear-gradient(135deg,#6366f1,#0ea5e9)",
              color: "#fff",
              boxShadow: "0 12px 24px rgba(99,102,241,0.30)",
            }}
          >
            <i className={`bi ${icon}`} style={{ fontSize: "22px" }}></i>
          </div>

          <div>
            <h4 className="fw-bold mb-0" style={{ color: theme.dark }}>
              {title}
            </h4>
            <small style={{ color: theme.muted }}>{subtitle}</small>
          </div>
        </div>

        <span
          className="fw-bold"
          style={{
            background: "#eef2ff",
            color: theme.primary,
            padding: "9px 15px",
            borderRadius: "999px",
          }}
        >
          {count}
        </span>
      </div>

      {children}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #dbeafe 0, transparent 35%), radial-gradient(circle at top right, #ede9fe 0, transparent 35%), linear-gradient(135deg,#f8fbff,#eef4ff)",
        padding: "42px 20px",
      }}
    >
      <div className="container">
        <div
          className="p-4 mb-4"
          style={{
            borderRadius: "34px",
            background: "linear-gradient(135deg,#111827,#312e81,#0ea5e9)",
            color: "#fff",
            boxShadow: "0 30px 70px rgba(15,23,42,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              right: "-60px",
              top: "-80px",
            }}
          ></div>

          <div className="row align-items-center position-relative">
            <div className="col-md-8">
              <span
                className="badge mb-3"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "999px",
                }}
              >
                CareerSync Network
              </span>

              <h1 className="fw-bold mb-2">Connections Hub</h1>

              <p className="mb-0" style={{ opacity: 0.85 }}>
                Manage requests, track pending connections, and explore your
                professional network in one premium dashboard.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-4 mt-md-0">
              <button
                className="btn fw-bold px-4 py-2"
                onClick={loadData}
                style={{
                  background: "#fff",
                  color: theme.primary,
                  borderRadius: "999px",
                  boxShadow: "0 15px 35px rgba(255,255,255,0.25)",
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          {[
            ["Received", received.length, "bi-inbox"],
            ["Sent", sent.length, "bi-send"],
            ["Connected", connected.length, "bi-person-check"],
          ].map((item) => (
            <div className="col-md-4" key={item[0]}>
              <div
                className="p-4 h-100"
                style={{
                  borderRadius: "26px",
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <small className="text-muted">{item[0]}</small>
                    <h2 className="fw-bold mb-0">{item[1]}</h2>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "18px",
                      background: "linear-gradient(135deg,#eef2ff,#e0f2fe)",
                      color: theme.primary,
                    }}
                  >
                    <i className={`bi ${item[2]}`} style={{ fontSize: "24px" }}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div
            className="alert border-0 mb-4"
            style={{
              borderRadius: "20px",
              background: "#eef2ff",
              color: theme.primary,
              boxShadow: "0 12px 30px rgba(99,102,241,0.12)",
            }}
          >
            <i className="bi bi-hourglass-split me-2"></i>
            Loading connections...
          </div>
        )}

        <SectionCard
          title="Received Requests"
          subtitle="People who want to connect with you"
          count={received.length}
          icon="bi-inbox-fill"
        >
          {received.length === 0 ? (
            <EmptyBox text="No received requests." />
          ) : (
            received.map((req) => (
              <UserMiniCard
                key={req._id}
                user={req.sender}
                action={
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm fw-bold px-3"
                      style={{
                        background: "linear-gradient(135deg,#22c55e,#16a34a)",
                        color: "#fff",
                        borderRadius: "999px",
                      }}
                      onClick={() => acceptReq(req._id)}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-sm fw-bold px-3"
                      style={{
                        background: "#fff",
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                        borderRadius: "999px",
                      }}
                      onClick={() => rejectReq(req._id)}
                    >
                      Reject
                    </button>
                  </div>
                }
              />
            ))
          )}
        </SectionCard>

        <SectionCard
          title="Sent Requests"
          subtitle="Requests waiting for approval"
          count={sent.length}
          icon="bi-send-fill"
        >
          {sent.length === 0 ? (
            <EmptyBox text="No sent requests." />
          ) : (
            sent.map((req) => (
              <UserMiniCard
                key={req._id}
                user={req.receiver}
                status={
                  <span
                    className="fw-bold"
                    style={{
                      background: "#fff7ed",
                      color: "#f97316",
                      padding: "8px 14px",
                      borderRadius: "999px",
                    }}
                  >
                    Pending
                  </span>
                }
              />
            ))
          )}
        </SectionCard>

        <SectionCard
          title="Connected People"
          subtitle="Your professional network"
          count={connected.length}
          icon="bi-people-fill"
        >
          {connected.length === 0 ? (
            <EmptyBox text="No connected people yet." />
          ) : (
            <div className="row g-4">
              {connected.map((user) => (
                <div className="col-md-4" key={user._id}>
                  <div
                    className="text-center h-100 p-4"
                    style={{
                      cursor: "pointer",
                      borderRadius: "28px",
                      background:
                        "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
                      border: `1px solid ${theme.border}`,
                      boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
                      transition: "0.25s ease",
                    }}
                    onClick={() => openProfile(user._id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 25px 55px rgba(99,102,241,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 40px rgba(15,23,42,0.08)";
                    }}
                  >
                    <img
                      src={getImg(user)}
                      alt=""
                      width="90"
                      height="90"
                      className="rounded-circle mb-3"
                      style={{
                        objectFit: "cover",
                        border: "5px solid #fff",
                        boxShadow: "0 12px 28px rgba(99,102,241,0.22)",
                      }}
                    />

                    <h6 className="fw-bold mb-1" style={{ color: theme.dark }}>
                      {user.name}
                    </h6>

                    <small className="text-muted d-block mb-3">
                      {user.role || user.location || user.email}
                    </small>

                    <button
                      className="btn btn-sm fw-bold px-3"
                      style={{
                        background: "#eef2ff",
                        color: theme.primary,
                        borderRadius: "999px",
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default Connections;