import { useEffect, useState } from "react";
import {
  getExperiences,
  addExperienceAPI,
  updateExperienceAPI,
  deleteExperienceAPI,
} from "../../api/experienceApi";

const Experience = ({ experience = [], setExperience, theme, user }) => {
  const [openIndex, setOpenIndex] = useState(null);

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

    if (!user?._id) return alert("User not found");

    if (!exp.role || !exp.company || !exp.startDate) {
      return alert("Role, Company and Start Date are required");
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
      let res = exp._id
        ? await updateExperienceAPI(exp._id, payload)
        : await addExperienceAPI(payload);

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
        if (!res.success) return alert(res.message || "Delete failed");
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
        borderRadius: "26px",
        background: "#fff",
        boxShadow: "0 16px 35px rgba(15, 23, 42, 0.07)",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-3"
        style={{
          borderRadius: "22px",
          background: `linear-gradient(135deg, ${theme.primaryPurple}, ${theme.accentBlue})`,
          boxShadow: "0 12px 25px rgba(99, 102, 241, 0.25)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontSize: "24px",
            }}
          >
            <i className="bi bi-briefcase-fill"></i>
          </div>

          <div>
            <h5 className="fw-bold text-white mb-1">Experience</h5>
            <small className="text-white-50">
              Roles, companies and professional journey
            </small>
          </div>
        </div>

        <i
          className="bi bi-plus-circle-fill text-white"
          title="Add Experience"
          onClick={addExperience}
          style={{
            fontSize: "30px",
            cursor: "pointer",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.18))",
          }}
        ></i>
      </div>

      {experience.length === 0 && (
        <div
          className="text-center p-5 rounded-4"
          style={{
            background: "linear-gradient(180deg, #f8fafc, #ffffff)",
            border: "1px dashed #cbd5e1",
          }}
        >
          <i
            className="bi bi-briefcase-fill"
            style={{ fontSize: "46px", color: theme.accentBlue }}
          ></i>
          <h6 className="fw-bold mt-3 mb-1">No experience added yet</h6>
          <small className="text-muted">
            Click the plus icon to add your first experience.
          </small>
        </div>
      )}

      <div className="position-relative">
        {experience.length > 0 && (
          <div
            style={{
              position: "absolute",
              left: "14px",
              top: "10px",
              bottom: "10px",
              width: "2px",
              background: "#e2e8f0",
            }}
          ></div>
        )}

        {experience.map((exp, i) => (
          <div
            key={exp._id || i}
            className="p-3 mb-3 rounded-4 position-relative"
            style={{
              marginLeft: "34px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderLeft: `5px solid ${theme.accentBlue}`,
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "-28px",
                top: "22px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: theme.primaryPurple,
                border: "3px solid #fff",
                boxShadow: "0 0 0 4px #eef2ff",
              }}
            ></div>

            <div className="d-flex justify-content-between align-items-start">
              <div className="pe-4">
                <h6 className="fw-bold mb-1">
                  {exp.role || "Job Role"}
                </h6>

                <p className="text-muted small mb-1">
                  <i className="bi bi-building me-1"></i>
                  {exp.company || "Company Name"}
                </p>

                <div className="d-flex flex-wrap gap-2 mt-2">
                  {(exp.startDate || exp.endDate) && (
                    <span
                      className="badge"
                      style={{
                        background: "#eef2ff",
                        color: theme.primaryPurple,
                        borderRadius: "999px",
                        padding: "7px 10px",
                      }}
                    >
                      <i className="bi bi-calendar3 me-1"></i>
                      {exp.startDate || "Start"} - {exp.endDate || "Present"}
                    </span>
                  )}

                  {exp.employmentType && (
                    <span
                      className="badge"
                      style={{
                        background: "#ecfeff",
                        color: "#0891b2",
                        borderRadius: "999px",
                        padding: "7px 10px",
                      }}
                    >
                      <i className="bi bi-person-workspace me-1"></i>
                      {exp.employmentType}
                    </span>
                  )}

                  {exp.location && (
                    <span
                      className="badge"
                      style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        borderRadius: "999px",
                        padding: "7px 10px",
                      }}
                    >
                      <i className="bi bi-geo-alt me-1"></i>
                      {exp.location}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p className="text-muted small mt-2 mb-0">
                    {exp.description}
                  </p>
                )}
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
              <div
                className="mt-3 p-3 rounded-4"
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 22px rgba(15, 23, 42, 0.06)",
                }}
              >
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      className="form-control border-0 shadow-sm"
                      style={{ borderRadius: "14px", padding: "10px 14px" }}
                      placeholder="Role / Designation"
                      value={exp.role}
                      onChange={(e) => handleChange(i, "role", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control border-0 shadow-sm"
                      style={{ borderRadius: "14px", padding: "10px 14px" }}
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(i, "company", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <select
                      className="form-select border-0 shadow-sm"
                      style={{ borderRadius: "14px", padding: "10px 14px" }}
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
                      className="form-control border-0 shadow-sm"
                      style={{ borderRadius: "14px", padding: "10px 14px" }}
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
                      className="form-control border-0 shadow-sm"
                      style={{ borderRadius: "14px", padding: "10px 14px" }}
                      value={exp.startDate}
                      onChange={(e) =>
                        handleChange(i, "startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control border-0 shadow-sm"
                      style={{ borderRadius: "14px", padding: "10px 14px" }}
                      value={exp.endDate}
                      onChange={(e) =>
                        handleChange(i, "endDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      rows="3"
                      className="form-control border-0 shadow-sm"
                      style={{ borderRadius: "14px", padding: "10px 14px" }}
                      placeholder="Work description / responsibilities"
                      value={exp.description}
                      onChange={(e) =>
                        handleChange(i, "description", e.target.value)
                      }
                    ></textarea>
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light fw-bold px-3"
                      style={{ borderRadius: "12px" }}
                      onClick={() => setOpenIndex(null)}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="btn text-white fw-bold px-4"
                      style={{
                        background: theme.primaryPurple,
                        borderRadius: "12px",
                      }}
                      onClick={() => saveExperience(i)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;