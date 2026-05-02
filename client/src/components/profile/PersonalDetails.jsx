import { useState, useRef } from "react";

const PersonalDetails = ({
  editedUser,
  setEditedUser,
  theme,
  updateField,
  user,
  setUser,
}) => {
  const inputRefs = useRef({});
  const [editMode, setEditMode] = useState({
    location: false,
    dob: false,
    linkedin: false,
    github: false,
  });

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleBlur = async (field) => {
    const value = editedUser[field];

    if (!value) return;

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

      setEditMode((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      console.error(err);
    }
  };

  const renderField = (field, icon, type = "text") => (
    <div className="mb-3">
      <label className="small fw-bold text-muted text-capitalize">
        {field}
      </label>

      <div className="input-group">
        <span className="input-group-text bg-light border-0">
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
          onMouseDown={(e) => e.preventDefault()} // 🔥 THIS LINE FIXES BLUR ISSUE
          onClick={() => {
            setEditMode((prev) => ({
              ...prev,
              [field]: true,
            }));

            setTimeout(() => {
              inputRefs.current[field]?.focus();
            }, 0);
          }}
        >
          <i className="bi bi-pencil"></i>
        </span>
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

      {renderField("location", "bi bi-geo-alt-fill")}
      {renderField("dob", "bi bi-calendar3", "date")}

      <h6 className="fw-bold mt-4 mb-3" style={{ color: theme.primaryPurple }}>
        Social Links
      </h6>

      {renderField("linkedin", "bi bi-linkedin", "url")}
      {renderField("github", "bi bi-github", "url")}
    </div>
  );
};

export default PersonalDetails;