import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPublicProfile,
  sendConnectionRequest,
} from "../api/profileSearchApi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getImage = (pic) => {
    if (!pic) return "https://via.placeholder.com/150";
    if (pic.startsWith("http")) return pic;
    return `${API}${pic}`;
  };

  const formatDate = (date) => {
    if (!date) return "Present";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getPublicProfile(userId);
      setProfile(data.profile);
    } catch (error) {
      alert(error.response?.data?.message || "Profile load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const handleConnect = async () => {
    try {
      await sendConnectionRequest(userId);
      alert("Connection request sent");
      loadProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Request failed");
    }
  };

  if (loading) {
    return <div className="container py-4">Loading...</div>;
  }

  if (!profile) {
    return <div className="container py-4">Profile not found</div>;
  }

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 22 }}>
        <div
          style={{
            height: 160,
            background: "linear-gradient(135deg, #6f42c1, #0d6efd)",
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
          }}
        />

        <div className="p-4 position-relative">
          <img
            src={getImage(profile.profilePic)}
            alt={profile.name}
            className="rounded-circle border border-4 border-white position-absolute"
            style={{
              width: 130,
              height: 130,
              objectFit: "cover",
              top: -70,
              left: 30,
              background: "#fff",
            }}
          />

          <div style={{ marginTop: 65 }}>
            <h2 className="fw-bold mb-1">{profile.name}</h2>
            <p className="text-muted mb-1">
              {profile.role || "Professional"}
            </p>
            <p className="text-muted mb-3">
              {profile.location || "Location not added"}
            </p>

            <div className="d-flex gap-2">
              {profile.connectionStatus === "self" && (
                <button className="btn btn-outline-secondary" disabled>
                  This is your profile
                </button>
              )}

              {profile.connectionStatus === "none" && (
                <button className="btn btn-primary" onClick={handleConnect}>
                  Connect
                </button>
              )}

              {profile.connectionStatus === "pending_sent" && (
                <button className="btn btn-warning" disabled>
                  Request Pending
                </button>
              )}

              {profile.connectionStatus === "pending_received" && (
                <button className="btn btn-outline-primary" disabled>
                  Request Received
                </button>
              )}

              {profile.connectionStatus === "connected" && (
                <>
                  <button className="btn btn-success" disabled>
                    Connected
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/chat/${profile._id}`)}
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 20 }}>
        <h4 className="fw-bold mb-3">About</h4>
        <p className="text-muted mb-0">
          {profile.bio || profile.about || "No about added yet."}
        </p>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 20 }}>
        <h4 className="fw-bold mb-3">Skills</h4>

        <div className="d-flex flex-wrap gap-2">
          {(profile.skills || []).length > 0 ? (
            profile.skills.map((skill, index) => (
              <span className="badge bg-primary p-2" key={index}>
                {skill.name || skill}
              </span>
            ))
          ) : (
            <p className="text-muted">No skills added.</p>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 20 }}>
        <h4 className="fw-bold mb-3">Experience</h4>

        {(profile.experience || []).length > 0 ? (
          profile.experience.map((exp) => (
            <div className="border-start border-3 ps-3 mb-3" key={exp._id}>
              <h6 className="fw-bold mb-1">{exp.role}</h6>
              <p className="mb-1">{exp.company_name}</p>
              <p className="text-muted small mb-1">
                {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
              </p>
              <p className="text-muted small mb-0">{exp.description}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No experience added.</p>
        )}
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 20 }}>
        <h4 className="fw-bold mb-3">Education</h4>

        {(profile.education || []).length > 0 ? (
          profile.education.map((edu) => (
            <div className="border-start border-3 ps-3 mb-3" key={edu._id}>
              <h6 className="fw-bold mb-1">{edu.degree}</h6>
              <p className="mb-1">{edu.institute || edu.institution}</p>
              <p className="text-muted small mb-0">{edu.year}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No education added.</p>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;