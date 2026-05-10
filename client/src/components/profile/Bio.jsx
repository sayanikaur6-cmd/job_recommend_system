import { useState, useRef } from "react";
import { generateBioAPI } from "../../api/bioApi";
const Bio = ({ user, setUser, theme, updateField }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || "");
  const textareaRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleGenerateBio = async () => {
    try {
      setLoading(true);

      const res = await generateBioAPI();

      if (res.success) {
        setBio(res.bio);

        const updatedUser = await updateField("bio", res.bio);

        if (updatedUser) {
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Bio generate failed");
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    if (bio === user.bio) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedUser = await updateField("bio", bio);

      if (updatedUser) {
        setUser(updatedUser);
      }

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="card border-0 p-4 mb-4 shadow-sm"
      style={{
        borderRadius: "24px",
        background: "#fff",
      }}
    >
      {/* 🔹 Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: theme.primaryPurple }}>
            About Me
          </h5>
          <small className="text-muted">
            Tell something about yourself
          </small>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-sm text-white"
            style={{
              background: theme.primaryPurple,
              borderRadius: "12px",
            }}
            onClick={handleGenerateBio}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Bio"}
          </button>

          <i
            className="bi bi-pencil-square"
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: theme.primaryPurple,
            }}
            onClick={() => {
              setIsEditing(true);
              setTimeout(() => textareaRef.current?.focus(), 0);
            }}
          ></i>
        </div>
      </div>

      {/* 🔹 Content */}
      {!isEditing ? (
        <p
          className="text-muted"
          style={{
            minHeight: "80px",
            lineHeight: "1.6",
          }}
        >
          {user.bio || "Write something about yourself..."}
        </p>
      ) : (
        <textarea
          ref={textareaRef}
          className="form-control border-0 shadow-sm"
          style={{
            borderRadius: "16px",
            padding: "12px",
            minHeight: "100px",
            resize: "none",
          }}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          onBlur={handleSave} // 🔥 auto save
        />
      )}
    </div>
  );
};

export default Bio;