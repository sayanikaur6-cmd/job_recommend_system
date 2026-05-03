import { useEffect, useState } from "react";
import {
  getExperiences,
  addExperienceAPI,
  updateExperienceAPI,
  deleteExperienceAPI,
} from "../../api/experienceApi";

const Experience = ({ experience = [], setExperience, theme, user }) => {
  const [openIndex, setOpenIndex] = useState(null);

  // Backend theke data load
  useEffect(() => {
    const fetchExperience = async () => {
      if (!user?._id) return;

      try {
        const res = await getExperiences(user._id);

        if (res.success) {
          const formatted = res.experiences.map((exp) => ({
            _id: exp._id,
            role: exp.role || "",
            company: exp.company_name || "",
            employmentType: exp.emp_type || "",
            location: exp.location || "",
            startDate: exp.start_date ? exp.start_date.slice(0, 10) : "",
            endDate: exp.end_date ? exp.end_date.slice(0, 10) : "",
            description: exp.description || "",
          }));

          setExperience(formatted);
        }
      } catch (error) {
        console.log("Experience fetch error:", error);
      }
    };

    fetchExperience();
  }, [user?._id, setExperience]);

  const addExperience = () => {
    const newExp = {
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      employmentType: "",
      description: "",
    };

    setExperience((prev) => [newExp, ...prev]);
    setOpenIndex(0);
  };

  const handleChange = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const saveExperience = async (index) => {
    const exp = experience[index];

    if (!user?._id) {
      alert("User not found");
      return;
    }

    if (!exp.role || !exp.company || !exp.startDate) {
      alert("Role, Company and Start Date are required");
      return;
    }

    const payload = {
      user_id: user._id,
      role: exp.role,
      company_name: exp.company,
      emp_type: exp.employmentType,
      location: exp.location,
      start_date: exp.startDate,
      end_date: exp.endDate || null,
      description: exp.description,
    };

    try {
      let res;

      if (exp._id) {
        res = await updateExperienceAPI(exp._id, payload);
      } else {
        res = await addExperienceAPI(payload);
      }

      if (res.success) {
        const updated = [...experience];

        updated[index] = {
          _id: res.experience._id,
          role: res.experience.role || "",
          company: res.experience.company_name || "",
          employmentType: res.experience.emp_type || "",
          location: res.experience.location || "",
          startDate: res.experience.start_date
            ? res.experience.start_date.slice(0, 10)
            : "",
          endDate: res.experience.end_date
            ? res.experience.end_date.slice(0, 10)
            : "",
          description: res.experience.description || "",
        };

        setExperience(updated);
        setOpenIndex(null);
      } else {
        alert(res.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Experience save error:", error);
      alert("Experience save failed");
    }
  };

  const removeExperience = async (index) => {
    const exp = experience[index];

    try {
      if (exp._id) {
        const res = await deleteExperienceAPI(exp._id);

        if (!res.success) {
          alert(res.message || "Delete failed");
          return;
        }
      }

      setExperience(experience.filter((_, i) => i !== index));
    } catch (error) {
      console.log("Experience delete error:", error);
      alert("Experience delete failed");
    }
  };

  return (
    <div
      className="card border-0 p-4 mb-4 shadow-sm"
      style={{
        borderRadius: "22px",
        background: "#fff",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0" style={{ color: theme.primaryPurple }}>
          Experience
        </h5>

        <i
          className="bi bi-plus-circle-fill"
          title="Add Experience"
          onClick={addExperience}
          style={{
            fontSize: "24px",
            color: theme.primaryPurple,
            cursor: "pointer",
          }}
        ></i>
      </div>

      {experience.length === 0 && (
        <div
          className="text-center p-4 rounded-4"
          style={{
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
          }}
        >
          <i
            className="bi bi-briefcase"
            style={{ fontSize: "32px", color: theme.accentBlue }}
          ></i>
          <p className="text-muted mt-2 mb-0">No experience added yet</p>
        </div>
      )}

      <div className="mt-2">
        {experience.map((exp, i) => (
          <div
            key={exp._id || i}
            className="p-3 mb-3 rounded-4 position-relative"
            style={{
              background: "#f8fafc",
              borderLeft: `5px solid ${theme.primaryPurple}`,
            }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold mb-1">{exp.role || "Job Role"}</h6>

                <p className="text-muted small mb-1">
                  <i className="bi bi-building me-1"></i>
                  {exp.company || "Company Name"}
                </p>

                <p className="text-muted small mb-0">
                  <i className="bi bi-calendar-event me-1"></i>
                  {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                </p>
              </div>

              <div className="d-flex gap-3">
                <i
                  className="bi bi-pencil-square"
                  title="Edit"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    cursor: "pointer",
                    color: theme.accentBlue,
                    fontSize: "18px",
                  }}
                ></i>

                <i
                  className="bi bi-trash3"
                  title="Delete"
                  onClick={() => removeExperience(i)}
                  style={{
                    cursor: "pointer",
                    color: "#ef4444",
                    fontSize: "18px",
                  }}
                ></i>
              </div>
            </div>

            {openIndex === i && (
              <div className="mt-3">
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      className="form-control border-0 bg-white shadow-sm"
                      placeholder="Role / Designation"
                      value={exp.role}
                      onChange={(e) =>
                        handleChange(i, "role", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control border-0 bg-white shadow-sm"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(i, "company", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <select
                      className="form-select border-0 bg-white shadow-sm"
                      value={exp.employmentType}
                      onChange={(e) =>
                        handleChange(i, "employmentType", e.target.value)
                      }
                    >
                      <option value="">Employment Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control border-0 bg-white shadow-sm"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) =>
                        handleChange(i, "location", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control border-0 bg-white shadow-sm"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleChange(i, "startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control border-0 bg-white shadow-sm"
                      value={exp.endDate}
                      onChange={(e) =>
                        handleChange(i, "endDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      rows="3"
                      className="form-control border-0 bg-white shadow-sm"
                      placeholder="Work description / responsibilities"
                      value={exp.description}
                      onChange={(e) =>
                        handleChange(i, "description", e.target.value)
                      }
                    ></textarea>
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setOpenIndex(null)}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="btn text-white"
                      onClick={() => saveExperience(i)}
                      style={{
                        background: theme.primaryPurple,
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {exp.employmentType && (
              <span
                className="badge mt-2"
                style={{
                  background: "#eef2ff",
                  color: theme.primaryPurple,
                }}
              >
                {exp.employmentType}
              </span>
            )}

            {exp.location && (
              <span className="badge bg-light text-muted ms-2 mt-2">
                <i className="bi bi-geo-alt me-1"></i>
                {exp.location}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;