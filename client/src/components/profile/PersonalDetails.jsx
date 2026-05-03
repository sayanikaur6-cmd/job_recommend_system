import { useState, useRef } from "react";

const PersonalDetails = ({
  editedUser,
  setEditedUser,
  theme,
  updateField,
  setUser,
}) => {
  const inputRefs = useRef({});

  const [editMode, setEditMode] = useState({
    location: false,
    linkedin: false,
    github: false,
  });

  // ✅ URL validation
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // ✅ SAVE + DISABLE
  const handleBlur = async (field) => {
    const value = editedUser[field];

    if ((field === "linkedin" || field === "github") && value) {
      if (!isValidURL(value)) {
        alert("Enter valid URL");
        return;
      }
    }

    try {
      const updatedUser = await updateField(field, value);

      if (updatedUser) {
        setUser(updatedUser);
        setEditedUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
    }

    if (field !== "dob") {
      setEditMode((prev) => ({ ...prev, [field]: false }));
    }
  };

  // ✅ enable edit
  const enableEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));

    setTimeout(() => {
      inputRefs.current[field]?.focus();
    }, 0);
  };

  // ✅ NORMAL FIELD
  const renderField = (field, icon, type = "text", label) => (
    <div className="mb-3">
      <label className="small fw-bold text-muted">{label}</label>

      <div className="input-group">
        <span
          className="input-group-text bg-light border-0"
          style={{ cursor: "pointer" }}
          onClick={() => enableEdit(field)}
        >
          <i className={icon} style={{ color: theme.accentBlue }}></i>
        </span>

        <input
          ref={(el) => (inputRefs.current[field] = el)}
          type={type}
          disabled={!editMode[field]}
          className="form-control bg-light border-0"
          value={editedUser[field] || ""}
          onChange={(e) =>
            setEditedUser({
              ...editedUser,
              [field]: e.target.value,
            })
          }
          onBlur={() => handleBlur(field)}
        />

        <span
          className="input-group-text bg-light border-0"
          style={{ cursor: "pointer" }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => enableEdit(field)}
        >
          <i className="bi bi-pencil"></i>
        </span>
      </div>
    </div>
  );

  // ✅ DOB FIELD WITH ICON INSIDE
  const renderDOB = () => (
    <div className="mb-3">
      <label className="small fw-bold text-muted">Date of Birth</label>

      <div className="position-relative">
        {/* 🔵 ICON INSIDE INPUT */}
        <i
          className="bi bi-calendar3"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#0ea5e9", // blue
            pointerEvents: "none",
          }}
        ></i>

        <input
          type="date"
          className="form-control bg-light border-0"
          style={{ paddingLeft: "40px" }} // space for icon
          value={editedUser.dob || ""}
          onChange={(e) =>
            setEditedUser({
              ...editedUser,
              dob: e.target.value,
            })
          }
          onBlur={() => handleBlur("dob")}
        />
      </div>
    </div>
  );

  return (
    <div
      className="card border-0 p-4 mb-4 shadow-sm"
      style={{ borderRadius: "20px", background: theme.cardBg }}
    >
      <h6 className="fw-bold mb-3" style={{ color: theme.primaryPurple }}>
        Personal Details
      </h6>

      {/* 📍 LOCATION */}
      {renderField("location", "bi bi-geo-alt-fill", "text", "Location")}

      {/* 📅 DOB */}
      {renderDOB()}

      <h6 className="fw-bold mt-4 mb-3" style={{ color: theme.primaryPurple }}>
        Social Links
      </h6>

      {/* 🔗 LinkedIn */}
      {renderField("linkedin", "bi bi-linkedin", "url", "LinkedIn")}

      {/* 🐙 GitHub */}
      {renderField("github", "bi bi-github", "url", "GitHub")}
    </div>
  );
};

export default PersonalDetails;