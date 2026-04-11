import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted Data:", formData);
    alert("Profile Updated Successfully ✅");

    navigate("/profile");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72')",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
            boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        >
          <h2 className="text-center fw-bold mb-4">
            Edit Professional Profile
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Preferred Role</label>
                <input
                  type="text"
                  className="form-control"
                  name="preferredRole"
                  placeholder="Frontend Developer"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Skills</label>
                <input
                  type="text"
                  className="form-control"
                  name="skills"
                  placeholder="React, Node, MongoDB"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Experience</label>
                <input
                  type="text"
                  className="form-control"
                  name="experience"
                  placeholder="2 years"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Education</label>
                <input
                  type="text"
                  className="form-control"
                  name="education"
                  placeholder="B.Tech CSE"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>LinkedIn</label>
                <input
                  type="text"
                  className="form-control"
                  name="linkedin"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>GitHub / Portfolio</label>
                <input
                  type="text"
                  className="form-control"
                  name="github"
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mb-3">
                <label>About Yourself</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="bio"
                  onChange={handleChange}
                />
              </div>

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
                <label>Certificates / Docs</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="form-control"
                  name="documents"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              className="btn w-100 mt-4"
              style={{
                background: "#fff",
                color: "#4c51bf",
                fontWeight: "700",
                borderRadius: "30px",
                padding: "12px",
                fontSize: "17px",
              }}
            >
              Save Professional Profile 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;