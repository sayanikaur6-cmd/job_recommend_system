import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EditableField from "../components/EditableField";
const Profile = () => {
  const [user, setUser] = useState(null);

  // -- Edit Mode States --
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // -- Form States --
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    dob: "",
    linkedin: "",
    github: "",
    facebook: "",
  });
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  // States for adding *new* items
  const [newSkill, setNewSkill] = useState("");
  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    year: "",
  });
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    startDate: "",
    endDate: "",
  });

  // -- Profile Photo Handling --
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();
  const availableSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "Java",
    "SQL",
    "DevOps",
    "UI/UX",
    "C++",
  ];

  // Custom Styles for the Purple/Blue Theme
  const theme = {
    bg: "#f8faff",
    cardBg: "#ffffff",
    primaryPurple: "#6366f1", // Indigo/Purple
    accentBlue: "#0ea5e9", // Light Blue
    textDark: "#1e293b",
    textLight: "#64748b",
    border: "#e2e8f0",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setEditedUser({ ...data });
        setSkills(data.skills || []);
        setEducation(data.education || []);
        setExperience(data.experience || []);
      }
    };
    fetchProfile();
  }, []);

  if (!user)
    return (
      <div className="text-center mt-5">
        <h4 style={{ color: theme.primaryPurple }}>Loading Dashboard...</h4>
      </div>
    );

  // --- Handlers (Logic remains unchanged) ---
  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const token = localStorage.getItem("token");
  // 🔹 preview (তোরটা ঠিক আছে)
  setImageFile(file);
  const reader = new FileReader();
  reader.onloadend = () => {
    setSelectedImage(reader.result);
  };
  reader.readAsDataURL(file);

  // 🔥 backend upload
  const formData = new FormData();
  formData.append("profilePhoto", file);

  try {
    const res = await fetch("http://localhost:5000/api/users/profile-picture", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // JWT token
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded user:", data);

  } catch (error) {
    console.error("Upload error:", error);
  }
};

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addEducation = () => {
    if (newEdu.degree && newEdu.institution) {
      setEducation([...education, newEdu]);
      setNewEdu({ degree: "", institution: "", year: "" });
    }
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    if (newExp.role && newExp.company) {
      setExperience([...experience, newExp]);
      setNewExp({ role: "", company: "", startDate: "", endDate: "" });
    }
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleProfileSave = async () => {
    const updatedData = { ...editedUser, skills, education, experience };
    if (imageFile) {
      const formData = new FormData();
      formData.append("profilePic", imageFile);
      try {
        const token = localStorage.getItem("token");
        const imgRes = await fetch(
          "http://localhost:5000/api/users/upload/profilepic",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );
        const imgData = await imgRes.json();
        if (imgRes.ok) {
          updatedData.profilePic = imgData.profilePic;
        } else {
          alert("Failed to upload image.");
          return;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        alert("Profile Updated Successfully!");
        setIsEditingName(false);
        setIsEditingEmail(false);
        setIsEditingPhone(false);
        setImageFile(null);
        setSelectedImage(null);
      }
    } catch (error) {
      alert("Server error.");
    }
  };
  const updateField = async (field, value) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/update-field", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ field, value }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser((prev) => ({ ...prev, [field]: value }));
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.textDark,
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="container">
        <div className="row">
          {/* LEFT COLUMN */}
          <div className="col-md-4">
            {/* PROFILE CARD */}
            <div
              className="card border-0 p-4 text-center mb-4 shadow-sm"
              style={{ borderRadius: "20px", background: theme.cardBg }}
            >
              <div className="position-relative d-inline-block mx-auto mb-3">
                <img
                  src={
                    selectedImage
                      ? selectedImage
                      : user.profilePic
                        ? `http://localhost:5000${user.profilePic}`
                        : "https://via.placeholder.com/150"
                  }
                  className="rounded-circle p-1"
                  style={{
                    border: `3px solid ${theme.primaryPurple}`,
                    objectFit: "cover",
                  }}
                  width="130"
                  height="130"
                  alt="Profile"
                />
                <button
                  className="btn btn-sm position-absolute shadow"
                  style={{
                    bottom: "5px",
                    right: "5px",
                    background: theme.primaryPurple,
                    color: "#fff",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="bi bi-camera-fill"></i>
                </button>
                <input
                  type="file"
                  name="profilePhoto"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              <EditableField
                value={user.name}
                field="name"
                onSave={updateField}
                textClass="fw-bold justify-content-center fs-4"
                inputClass="text-center"
              />

              <div className="text-muted mb-1 d-flex justify-content-center align-items-center gap-2">
                <EditableField
                  value={user.email}
                  field="email"
                  type="email"
                  onSave={updateField}
                />
              </div>

              <div className="text-muted d-flex justify-content-center align-items-center gap-2">
                <EditableField
                  value={user.phone}
                  field="phone"
                  type="tel"
                  placeholder="Add Phone"
                  onSave={updateField}
                />
              </div>
            </div>

            {/* DETAILS & LINKS */}
            <div
              className="card border-0 p-4 mb-4 shadow-sm"
              style={{ borderRadius: "20px", background: theme.cardBg }}
            >
              <h6
                className="fw-bold mb-3"
                style={{ color: theme.primaryPurple }}
              >
                Personal Details
              </h6>
              <div className="mb-3">
                <label className="small fw-bold text-muted">Location</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i
                      className="bi bi-geo-alt-fill"
                      style={{ color: theme.accentBlue }}
                    ></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    value={editedUser.location}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted">
                  Date of Birth
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i
                      className="bi bi-calendar3"
                      style={{ color: theme.accentBlue }}
                    ></i>
                  </span>

                  <input
                    type="date"
                    className="form-control bg-light border-0"
                    value={user.dob || ""}
                    max={new Date().toISOString().split("T")[0]} // future date block
                    onChange={async (e) => {
                      const newDob = e.target.value;

                      // UI instant update
                      setUser((prev) => ({ ...prev, dob: newDob }));

                      // backend update
                      await updateField("dob", newDob);
                    }}
                  />
                </div>
              </div>

              <h6
                className="fw-bold mt-4 mb-3"
                style={{ color: theme.primaryPurple }}
              >
                Social Links
              </h6>
              <div className="input-group mb-2">
                <span className="input-group-text bg-light border-0">
                  <i
                    className="bi bi-linkedin"
                    style={{ color: "#0077b5" }}
                  ></i>
                </span>
                <input
                  type="url"
                  className="form-control bg-light border-0"
                  placeholder="LinkedIn"
                  value={editedUser.linkedin}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, linkedin: e.target.value })
                  }
                />
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-github" style={{ color: "#333" }}></i>
                </span>
                <input
                  type="url"
                  className="form-control bg-light border-0"
                  placeholder="GitHub"
                  value={editedUser.github}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, github: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              className="btn w-100 fw-bold shadow-sm py-2"
              style={{
                background: theme.primaryPurple,
                color: "#fff",
                borderRadius: "12px",
              }}
              onClick={handleProfileSave}
            >
              Save All Changes
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-8">
            {/* SKILLS */}
            <div
              className="card border-0 p-4 mb-4 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <h5 className="fw-bold" style={{ color: theme.primaryPurple }}>
                Skills & Expertise
              </h5>
              <div className="d-flex gap-2 my-3">
                <select
                  className="form-select border-0 bg-light"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                >
                  <option value="">Select a Skill</option>
                  {availableSkills.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  className="btn px-4"
                  style={{ background: theme.accentBlue, color: "#fff" }}
                  onClick={addSkill}
                >
                  Add
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="badge px-3 py-2 d-flex align-items-center gap-2"
                    style={{
                      background: "#eef2ff",
                      color: theme.primaryPurple,
                      borderRadius: "8px",
                      fontWeight: "500",
                    }}
                  >
                    {skill}{" "}
                    <i
                      className="bi bi-x-lg"
                      style={{ cursor: "pointer", fontSize: "10px" }}
                      onClick={() => removeSkill(skill)}
                    ></i>
                  </span>
                ))}
              </div>
            </div>

            {/* EDUCATION */}
            <div
              className="card border-0 p-4 mb-4 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <h5 className="fw-bold" style={{ color: theme.primaryPurple }}>
                Education
              </h5>
              <div className="mt-3">
                {education.map((edu, i) => (
                  <div
                    key={i}
                    className="p-3 mb-2 bg-light rounded-4 position-relative border-start border-4"
                    style={{ borderColor: theme.accentBlue }}
                  >
                    <h6 className="fw-bold mb-0">{edu.degree}</h6>
                    <span className="text-muted small">
                      {edu.institution} • {edu.year}
                    </span>
                    <i
                      className="bi bi-trash3 text-danger position-absolute"
                      style={{ right: "15px", top: "18px", cursor: "pointer" }}
                      onClick={() => removeEducation(i)}
                    ></i>
                  </div>
                ))}
              </div>
              <div
                className="mt-3 p-3 rounded-4"
                style={{ border: `1px dashed ${theme.border}` }}
              >
                <div className="row g-2">
                  <div className="col-md-5">
                    <input
                      type="text"
                      placeholder="Degree"
                      className="form-control form-control-sm border-0 bg-light"
                      onChange={(e) =>
                        setNewEdu({ ...newEdu, degree: e.target.value })
                      }
                      value={newEdu.degree}
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      placeholder="Institution"
                      className="form-control form-control-sm border-0 bg-light"
                      onChange={(e) =>
                        setNewEdu({ ...newEdu, institution: e.target.value })
                      }
                      value={newEdu.institution}
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-sm w-100"
                      style={{ background: theme.primaryPurple, color: "#fff" }}
                      onClick={addEducation}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* EXPERIENCE */}
            <div
              className="card border-0 p-4 mb-4 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <h5 className="fw-bold" style={{ color: theme.primaryPurple }}>
                Experience
              </h5>
              <div className="mt-3">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className="p-3 mb-2 bg-light rounded-4 position-relative border-start border-4"
                    style={{ borderColor: theme.primaryPurple }}
                  >
                    <h6 className="fw-bold mb-0">
                      {exp.role} @ {exp.company}
                    </h6>
                    <span className="text-muted small">
                      {exp.startDate} - {exp.endDate}
                    </span>
                    <i
                      className="bi bi-trash3 text-danger position-absolute"
                      style={{ right: "15px", top: "18px", cursor: "pointer" }}
                      onClick={() => removeExperience(i)}
                    ></i>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-sm mt-2 fw-bold"
                style={{ color: theme.primaryPurple }}
                onClick={() => addExperience()}
              >
                + Add Professional Experience
              </button>
            </div>

            {/* RESUME */}
            <div
              className="card border-0 p-4 shadow-sm"
              style={{
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${theme.primaryPurple}, ${theme.accentBlue})`,
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-white mb-0">My Resume</h5>
                {user.resume ? (
                  <a
                    href={`http://localhost:5000${user.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-light fw-bold text-primary px-4 shadow-sm"
                  >
                    View PDF
                  </a>
                ) : (
                  <span className="text-white-50">No resume uploaded.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
