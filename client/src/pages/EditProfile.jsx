import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    preferredRole: "",
    skills: "",
    experience: "",
    education: "",
    linkedin: "",
    github: "",
    bio: "",
    profilePhoto: null,
    resume: null,
    documents: null,
  });

  // ✅ FETCH OLD DATA
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({
          ...formData,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          preferredRole: data.preferredRole || "",
          skills: data.skills?.join(", ") || "",
          experience: data.experience || "",
          education: data.education || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          bio: data.bio || "",
        });

        setPreview(data.profilePic);
      }
    };

    fetchProfile();
  }, []);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      if (name === "profilePhoto") {
        setPreview(URL.createObjectURL(files[0]));
      }

      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // ✅ SUBMIT WITH FILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "skills") {
        data.append(key, JSON.stringify(formData.skills.split(",")));
      } else {
        data.append(key, formData[key]);
      }
    });

    const res = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await res.json();

    if (res.ok) {
      alert("Profile Updated Successfully ✅");
      navigate("/profile");
    } else {
      alert("Update Failed ❌");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72')",
        backgroundSize: "cover",
        padding: "50px 0",
      }}
    >
      <div className="container">
        <div
          className="p-5"
          style={{
            maxWidth: "900px",
            margin: "auto",
            borderRadius: "25px",
            background: "rgba(76, 81, 191, 0.25)",
            backdropFilter: "blur(20px)",
            color: "#fff",
          }}
        >
          <h2 className="text-center mb-4">Edit Professional Profile</h2>

          {/* PROFILE PREVIEW */}
          <div className="text-center mb-4">
            <img
              src={preview || "https://via.placeholder.com/120"}
              alt="preview"
              className="rounded-circle"
              width="120"
              height="120"
              style={{ objectFit: "cover" }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">

              {/* NAME */}
              <div className="col-md-6 mb-3">
                <label>Full Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}
              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  className="form-control"
                  value={formData.email}
                  disabled
                />
              </div>

              {/* PHONE */}
              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* LOCATION */}
              <div className="col-md-6 mb-3">
                <label>Location</label>
                <input
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* ROLE */}
              <div className="col-md-6 mb-3">
                <label>Preferred Role</label>
                <input
                  className="form-control"
                  name="preferredRole"
                  value={formData.preferredRole}
                  onChange={handleChange}
                />
              </div>

              {/* SKILLS */}
              <div className="col-md-6 mb-3">
                <label>Skills</label>
                <input
                  className="form-control"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              {/* FILE UPLOAD */}
              <div className="col-md-4 mb-3">
                <label>Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="profilePhoto"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Resume (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="form-control"
                  name="resume"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Documents</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="form-control"
                  name="documents"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn btn-light w-100 mt-3">
              Save Profile 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;