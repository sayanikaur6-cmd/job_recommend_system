import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditableField from "../components/EditableField";
import Experience from "../components/profile/Experience";
import Skills from "../components/profile/Skills";
import Education from "../components/profile/Education";
import Resume from "../components/profile/Resume";
import PersonalDetails from "../components/profile/PersonalDetails";
import PreferredLanguage from "../components/profile/PreferredLanguage";
import Bio from "../components/profile/Bio";
import { getEducations } from "../api/educationApi";

const Profile = () => {
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const viewOnly = location.state?.viewOnly === true;
  const profileUserId = location.state?.profileUserId;

  const [languages, setLanguages] = useState([]);
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

  const [newSkill, setNewSkill] = useState("");
  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    year: "",
  });

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const theme = {
    bg: "#f8faff",
    cardBg: "#ffffff",
    primaryPurple: "#6366f1",
    accentBlue: "#0ea5e9",
    textDark: "#1e293b",
    textLight: "#64748b",
    border: "#e2e8f0",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const url =
          viewOnly && profileUserId
            ? `http://localhost:5000/api/profile-search/${profileUserId}`
            : "http://localhost:5000/api/users/profile";

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          const profileData = data.profile || data.user || data;

          setUser(profileData);

          setEditedUser({
            name: profileData.name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            location: profileData.location || "",
            dob: profileData.dob || "",
            linkedin: profileData.linkedin || "",
            github: profileData.github || "",
            facebook: profileData.facebook || "",
          });

          setSkills(
            profileData.skills ||
              data.skills ||
              []
          );

          setExperience(
            profileData.experience ||
              profileData.experiences ||
              data.experience ||
              data.experiences ||
              []
          );

          setEducation(
            profileData.education ||
              profileData.educations ||
              data.education ||
              data.educations ||
              []
          );

          setLanguages(
            profileData.languages ||
              data.languages ||
              []
          );
        }
      } catch (error) {
        console.log("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, [viewOnly, profileUserId]);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        if (viewOnly) return;

        const data = await getEducations();
        setEducation(data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEducation();
  }, [viewOnly]);

  if (!user) {
    return (
      <div className="text-center mt-5">
        <h4 style={{ color: theme.primaryPurple }}>Loading Dashboard...</h4>
      </div>
    );
  }

  const handleImageChange = async (e) => {
    if (viewOnly) return;

    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/profile-picture",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.user || data);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleProfileSave = async () => {
    if (viewOnly) return;
    window.location.reload();
  };

  const saveLanguages = async (updatedLanguages) => {
    if (viewOnly) return;

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/users/update-field", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        field: "languages",
        value: updatedLanguages,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user || data);
      setLanguages((data.user || data).languages || []);
    }
  };

  const updateField = async (field, value) => {
    if (viewOnly) return user;

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

    return data;
  };

  const getProfileImage = () => {
    if (selectedImage) return selectedImage;

    if (user.profilePic) {
      return user.profilePic.startsWith("http")
        ? user.profilePic
        : `http://localhost:5000${user.profilePic}`;
    }

    return "https://via.placeholder.com/150";
  };

  const getResumeLink = () => {
    if (!user.resume) return null;

    return user.resume.startsWith("http")
      ? user.resume
      : `http://localhost:5000${user.resume}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not added";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString();
  };

  const getSkillName = (skill) => {
    if (!skill) return "Skill";
    if (typeof skill === "object") return skill.name || skill.skill || "Skill";
    return skill;
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
        {viewOnly && (
          <>
            <button
              className="btn mb-4 shadow-sm d-inline-flex align-items-center gap-2"
              style={{
                background: "#fff",
                color: theme.primaryPurple,
                border: `1px solid ${theme.border}`,
                borderRadius: "12px",
                fontWeight: "600",
              }}
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i>
              Back
            </button>

            <div
              className="alert alert-info border-0 shadow-sm mb-4"
              style={{ borderRadius: "16px" }}
            >
              You are viewing this profile in read-only mode.
            </div>
          </>
        )}

        <div className="row">
          <div className="col-md-4">
            <div
              className="card border-0 p-4 text-center mb-4 shadow-sm"
              style={{ borderRadius: "20px", background: theme.cardBg }}
            >
              <div className="position-relative d-inline-block mx-auto mb-3">
                <img
                  src={getProfileImage()}
                  className="rounded-circle p-1"
                  style={{
                    border: `3px solid ${theme.primaryPurple}`,
                    objectFit: "cover",
                  }}
                  width="130"
                  height="130"
                  alt="Profile"
                />

                {!viewOnly && (
                  <>
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
                  </>
                )}
              </div>

              {viewOnly ? (
                <h3 className="fw-bold fs-4">
                  {user.name || "No name added"}
                </h3>
              ) : (
                <EditableField
                  value={user.name}
                  field="name"
                  onSave={updateField}
                  textClass="fw-bold justify-content-center fs-4"
                  inputClass="text-center"
                />
              )}

              <div className="text-muted mb-1 d-flex justify-content-center align-items-center gap-2">
                {viewOnly ? (
                  <span>{user.email || "No email added"}</span>
                ) : (
                  <EditableField
                    value={user.email}
                    field="email"
                    type="email"
                    onSave={updateField}
                  />
                )}
              </div>

              <div className="text-muted d-flex justify-content-center align-items-center gap-2">
                {viewOnly ? (
                  <span>{user.phone || "No phone added"}</span>
                ) : (
                  <EditableField
                    value={user.phone}
                    field="phone"
                    type="tel"
                    placeholder="Add Phone"
                    onSave={updateField}
                  />
                )}
              </div>
            </div>

            {!viewOnly ? (
              <>
                <PersonalDetails
                  editedUser={editedUser}
                  setEditedUser={setEditedUser}
                  theme={theme}
                  updateField={updateField}
                  user={user}
                  setUser={setUser}
                />

                <Bio
                  user={user}
                  setUser={setUser}
                  theme={theme}
                  updateField={updateField}
                />

                <PreferredLanguage
                  languages={languages}
                  setLanguages={setLanguages}
                  saveLanguages={saveLanguages}
                  theme={theme}
                />

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
              </>
            ) : (
              <>
                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{ borderRadius: "20px", background: theme.cardBg }}
                >
                  <h5 className="fw-bold mb-3">Personal Details</h5>

                  <div className="mb-3">
                    <small className="text-muted d-block">Location</small>
                    <span>{user.location || "Not added"}</span>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Date of Birth</small>
                    <span>{formatDate(user.dob)}</span>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">LinkedIn</small>
                    {user.linkedin ? (
                      <a href={user.linkedin} target="_blank" rel="noreferrer">
                        View LinkedIn
                      </a>
                    ) : (
                      <span>Not added</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">GitHub</small>
                    {user.github ? (
                      <a href={user.github} target="_blank" rel="noreferrer">
                        View GitHub
                      </a>
                    ) : (
                      <span>Not added</span>
                    )}
                  </div>

                  <div>
                    <small className="text-muted d-block">Facebook</small>
                    {user.facebook ? (
                      <a href={user.facebook} target="_blank" rel="noreferrer">
                        View Facebook
                      </a>
                    ) : (
                      <span>Not added</span>
                    )}
                  </div>
                </div>

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{ borderRadius: "20px", background: theme.cardBg }}
                >
                  <h5 className="fw-bold mb-3">About</h5>
                  <p className="text-muted mb-0">
                    {user.bio || user.about || "No bio added yet."}
                  </p>
                </div>

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{ borderRadius: "20px", background: theme.cardBg }}
                >
                  <h5 className="fw-bold mb-3">Languages</h5>

                  {languages.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {languages.map((lang, index) => (
                        <span
                          key={index}
                          className="badge"
                          style={{
                            background: theme.primaryPurple,
                            padding: "8px 12px",
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No languages added.</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="col-md-8">
            {!viewOnly ? (
              <>
                <Skills
                  skills={skills}
                  setSkills={setSkills}
                  newSkill={newSkill}
                  setNewSkill={setNewSkill}
                  theme={theme}
                  availableSkills={availableSkills}
                  viewOnly={viewOnly}
                />

                <Education
                  education={education}
                  setEducation={setEducation}
                  newEdu={newEdu}
                  setNewEdu={setNewEdu}
                  theme={theme}
                  viewOnly={viewOnly}
                />

                <Experience
                  experience={experience}
                  setExperience={setExperience}
                  theme={theme}
                  user={user}
                  viewOnly={viewOnly}
                />

                <Resume
                  user={user}
                  theme={theme}
                  setUser={setUser}
                  viewOnly={viewOnly}
                />
              </>
            ) : (
              <>
                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{ borderRadius: "20px", background: theme.cardBg }}
                >
                  <h5 className="fw-bold mb-3">Skills</h5>

                  {skills.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={skill._id || index}
                          className="badge"
                          style={{
                            background: "#eef2ff",
                            color: theme.primaryPurple,
                            border: `1px solid ${theme.border}`,
                            padding: "8px 12px",
                          }}
                        >
                          {getSkillName(skill)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No skills added.</p>
                  )}
                </div>

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{ borderRadius: "20px", background: theme.cardBg }}
                >
                  <h5 className="fw-bold mb-3">Education</h5>

                  {education.length > 0 ? (
                    education.map((edu, index) => (
                      <div
                        key={edu._id || index}
                        className={`p-3 rounded-4 bg-light ${
                          index !== education.length - 1 ? "mb-3" : ""
                        }`}
                        style={{
                          borderLeft: `4px solid ${theme.accentBlue}`,
                        }}
                      >
                        <h6 className="fw-bold mb-1">
                          {edu.degree || "Degree not added"}
                        </h6>

                        <p className="text-muted mb-1">
                          {edu.institution ||
                            edu.institute ||
                            edu.school ||
                            edu.college ||
                            "Institution not added"}
                        </p>

                        <small className="text-muted d-block">
                          {edu.year ||
                            edu.passing_year ||
                            edu.graduationYear ||
                            "Year not added"}
                        </small>

                        {edu.grade && (
                          <small className="text-muted d-block">
                            Grade: {edu.grade}
                          </small>
                        )}

                        {edu.location && (
                          <small className="text-muted d-block">
                            Location: {edu.location}
                          </small>
                        )}

                        {edu.description && (
                          <p className="text-muted mb-0 mt-2">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted mb-0">No education added.</p>
                  )}
                </div>

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{ borderRadius: "20px", background: theme.cardBg }}
                >
                  <h5 className="fw-bold mb-3">Experience</h5>

                  {experience.length > 0 ? (
                    experience.map((exp, index) => (
                      <div
                        key={exp._id || index}
                        className={`p-3 rounded-4 bg-light ${
                          index !== experience.length - 1 ? "mb-3" : ""
                        }`}
                        style={{
                          borderLeft: `4px solid ${theme.primaryPurple}`,
                        }}
                      >
                        <h6 className="fw-bold mb-1">
                          {exp.role || "Role not added"}
                        </h6>

                        <p className="text-muted mb-1">
                          {exp.company_name ||
                            exp.company ||
                            "Company not added"}
                        </p>

                        <small className="text-muted d-block mb-1">
                          {exp.emp_type || "Employment type not added"}
                          {exp.location ? ` • ${exp.location}` : ""}
                        </small>

                        <small className="text-muted d-block">
                          {exp.start_date
                            ? formatDate(exp.start_date)
                            : "Start date not added"}{" "}
                          -{" "}
                          {exp.end_date ? formatDate(exp.end_date) : "Present"}
                        </small>

                        {exp.description && (
                          <p className="text-muted mb-0 mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted mb-0">No experience added.</p>
                  )}
                </div>

                <div
                  className="card border-0 p-4 mb-4 shadow-sm"
                  style={{ borderRadius: "20px", background: theme.cardBg }}
                >
                  <h5 className="fw-bold mb-3">Resume</h5>

                  {getResumeLink() ? (
                    <a
                      href={getResumeLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn fw-bold"
                      style={{
                        background: theme.primaryPurple,
                        color: "#fff",
                        borderRadius: "12px",
                      }}
                    >
                      View Resume
                    </a>
                  ) : (
                    <p className="text-muted mb-0">No resume uploaded.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;