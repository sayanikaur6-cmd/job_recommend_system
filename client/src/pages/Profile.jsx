import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EditableField from "../components/EditableField";
import Experience from "../components/profile/Experience";
import Skills from "../components/profile/Skills";
import Education from "../components/profile/Education";
import Resume from "../components/profile/Resume";
import PersonalDetails from "../components/profile/PersonalDetails";
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

            {/* Personal Details */}
            <PersonalDetails
              editedUser={editedUser}
              setEditedUser={setEditedUser}
              theme={theme}
              updateField={updateField}
              user={user}
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
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-8">
            {/* SKILLS */}
            <Skills
              skills={skills}
              setSkills={setSkills}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              theme={theme}
              availableSkills={availableSkills}
            />

            {/* EDUCATION */}
            <Education
              education={education}
              setEducation={setEducation}
              newEdu={newEdu}
              setNewEdu={setNewEdu}
              theme={theme}
            />

            {/* EXPERIENCE */}
            <Experience experience={experience} theme={theme}/>

            {/* RESUME */}
            <Resume user={user} theme={theme}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
