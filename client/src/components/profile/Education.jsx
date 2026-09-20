
import { useEffect, useState } from "react";
import {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../../api/educationApi";

const emptyEdu = {
  degree: "",
  institution: "",
  year: "",
  grade: "",
  location: "",
  description: "",
};

const Education = ({ education = [], setEducation, theme, user }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(emptyEdu);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // FETCH EDUCATION FROM DATABASE
  // =========================================================
  useEffect(() => {
    const fetchEducation = async () => {
      if (!user?._id) {
        console.log("Education: user not available");
        return;
      }

      try {
        setLoading(true);

        const educationData = await getEducations();

        console.log("Education fetched from DB:", educationData);

        if (Array.isArray(educationData)) {
          const formattedEducation = educationData.map((edu) => ({
            _id: edu._id,
            degree: edu.degree || "",
            institution: edu.institution || "",
            year: edu.year || "",
            grade: edu.grade || "",
            location: edu.location || "",
            description: edu.description || "",
          }));

          setEducation(formattedEducation);
        } else {
          setEducation([]);
        }
      } catch (error) {
        console.log("Education fetch error:", error);

        if (error.response) {
          console.log(
            "Education API error response:",
            error.response.data
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [user?._id, setEducation]);

  // =========================================================
  // OPEN ADD FORM
  // =========================================================
  const openAddForm = () => {
    setEditIndex(null);
    setFormData({ ...emptyEdu });
    setFormOpen(true);
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================
  const openEditForm = (edu, index) => {
    setEditIndex(index);

    setFormData({
      ...emptyEdu,
      ...edu,
    });

    setFormOpen(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================
  const closeForm = () => {
    setFormOpen(false);
    setEditIndex(null);
    setFormData({ ...emptyEdu });
  };

  // =========================================================
  // HANDLE FORM INPUT
  // =========================================================
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // SAVE EDUCATION
  // ADD / UPDATE
  // =========================================================
  const handleSave = async () => {
    if (!user?._id) {
      alert("User not found. Please login again.");
      return;
    }

    if (!formData.degree.trim() || !formData.institution.trim()) {
      alert("Degree and Institution are required");
      return;
    }

    try {
      setSaving(true);

      // -------------------------------------------------------
      // UPDATE EXISTING EDUCATION
      // -------------------------------------------------------
      if (editIndex !== null) {
        const currentEducation = education[editIndex];

        if (!currentEducation?._id) {
          alert("Education ID not found");
          return;
        }

        const updatedEdu = await updateEducation(
          currentEducation._id,
          formData
        );

        console.log("Education updated:", updatedEdu);

        const updated = [...education];

        updated[editIndex] = {
          ...updatedEdu,
          _id: updatedEdu._id || currentEducation._id,
        };

        setEducation(updated);
      }

      // -------------------------------------------------------
      // ADD NEW EDUCATION
      // -------------------------------------------------------
      else {
        const newEdu = await addEducation(formData);

        console.log("Education added:", newEdu);

        setEducation((prev) => [
          {
            ...newEdu,
          },
          ...prev,
        ]);
      }

      closeForm();
    } catch (error) {
      console.log("Education save error:", error);

      if (error.response) {
        console.log(
          "Education save API response:",
          error.response.data
        );

        alert(
          error.response.data?.message ||
            "Education save failed"
        );
      } else {
        alert("Education save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE EDUCATION
  // =========================================================
  const removeEducation = async (index) => {
    const edu = education[index];

    if (!edu) return;

    if (!window.confirm("Delete this education?")) {
      return;
    }

    try {
      // -------------------------------------------------------
      // IF EDUCATION IS ALREADY IN DATABASE
      // -------------------------------------------------------
      if (edu._id) {
        await deleteEducation(edu._id);
      }

      // -------------------------------------------------------
      // REMOVE FROM FRONTEND STATE
      // -------------------------------------------------------
      setEducation((prev) =>
        prev.filter((_, i) => i !== index)
      );

      // If deleted item was being edited
      if (editIndex === index) {
        closeForm();
      }
    } catch (error) {
      console.log("Education delete error:", error);

      if (error.response) {
        console.log(
          "Education delete API response:",
          error.response.data
        );

        alert(
          error.response.data?.message ||
            "Education delete failed"
        );
      } else {
        alert("Education delete failed");
      }
    }
  };

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <div
        className="card border-0 p-4 mb-4 shadow-sm"
        style={{
          borderRadius: "26px",
          background: "#ffffff",
          boxShadow:
            "0 16px 35px rgba(15, 23, 42, 0.07)",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center p-3"
          style={{
            borderRadius: "22px",
            background: `linear-gradient(
              135deg,
              ${theme.primaryPurple},
              ${theme.accentBlue}
            )`,
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
              <i className="bi bi-mortarboard-fill"></i>
            </div>

            <div>
              <h5 className="fw-bold text-white mb-1">
                Education
              </h5>

              <small className="text-white-50">
                Loading academic journey...
              </small>
            </div>
          </div>
        </div>

        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{
              color: theme.primaryPurple,
            }}
            role="status"
          ></div>

          <p className="text-muted small mt-3 mb-0">
            Loading your education...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card border-0 p-4 mb-4 shadow-sm"
      style={{
        borderRadius: "26px",
        background: "#ffffff",
        boxShadow:
          "0 16px 35px rgba(15, 23, 42, 0.07)",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-3"
        style={{
          borderRadius: "22px",
          background: `linear-gradient(
            135deg,
            ${theme.primaryPurple},
            ${theme.accentBlue}
          )`,
          boxShadow:
            "0 12px 25px rgba(99, 102, 241, 0.25)",
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
            <i className="bi bi-mortarboard-fill"></i>
          </div>

          <div>
            <h5 className="fw-bold text-white mb-1">
              Education
            </h5>

            <small className="text-white-50">
              Academic journey, grades & achievements
            </small>
          </div>
        </div>

        <i
          className={
            formOpen
              ? "bi bi-x-circle-fill text-white"
              : "bi bi-plus-circle-fill text-white"
          }
          title={formOpen ? "Close" : "Add Education"}
          onClick={() =>
            formOpen ? closeForm() : openAddForm()
          }
          style={{
            fontSize: "30px",
            cursor: "pointer",
            filter:
              "drop-shadow(0 4px 8px rgba(0,0,0,0.18))",
          }}
        ></i>
      </div>

      {/* =====================================================
          ADD / EDIT FORM
      ====================================================== */}
      {formOpen && (
        <div
          className="p-4 mb-4 rounded-4"
          style={{
            background:
              "linear-gradient(180deg, #f8fafc, #ffffff)",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 14px 30px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <span
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "14px",
                background: "#eef2ff",
                color: theme.primaryPurple,
              }}
            >
              <i className="bi bi-journal-plus"></i>
            </span>

            <div>
              <h6 className="fw-bold mb-0">
                {editIndex !== null
                  ? "Update Education"
                  : "Add Education"}
              </h6>

              <small className="text-muted">
                Fill details below. Degree and institution
                are required.
              </small>
            </div>
          </div>

          <div className="row g-3">
            {/* DEGREE */}
            <div className="col-md-6">
              <label className="small fw-bold text-muted mb-1">
                Degree
              </label>

              <input
                type="text"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 14px",
                }}
                className="form-control"
                placeholder="B.Tech in CSE"
                value={formData.degree}
                onChange={(e) =>
                  handleChange("degree", e.target.value)
                }
              />
            </div>

            {/* INSTITUTION */}
            <div className="col-md-6">
              <label className="small fw-bold text-muted mb-1">
                Institution
              </label>

              <input
                type="text"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 14px",
                }}
                className="form-control"
                placeholder="ABC Engineering College"
                value={formData.institution}
                onChange={(e) =>
                  handleChange(
                    "institution",
                    e.target.value
                  )
                }
              />
            </div>

            {/* YEAR */}
            <div className="col-md-4">
              <label className="small fw-bold text-muted mb-1">
                Year
              </label>

              <input
                type="text"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 14px",
                }}
                className="form-control"
                placeholder="2026"
                value={formData.year}
                onChange={(e) =>
                  handleChange("year", e.target.value)
                }
              />
            </div>

            {/* GRADE */}
            <div className="col-md-4">
              <label className="small fw-bold text-muted mb-1">
                Grade / CGPA
              </label>

              <input
                type="text"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 14px",
                }}
                className="form-control"
                placeholder="8.5 CGPA"
                value={formData.grade}
                onChange={(e) =>
                  handleChange("grade", e.target.value)
                }
              />
            </div>

            {/* LOCATION */}
            <div className="col-md-4">
              <label className="small fw-bold text-muted mb-1">
                Location
              </label>

              <input
                type="text"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 14px",
                }}
                className="form-control"
                placeholder="Kolkata"
                value={formData.location}
                onChange={(e) =>
                  handleChange("location", e.target.value)
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div className="col-12">
              <label className="small fw-bold text-muted mb-1">
                Highlights
              </label>

              <textarea
                rows="3"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "10px 14px",
                }}
                className="form-control"
                placeholder="Achievements, relevant coursework, activities..."
                value={formData.description}
                onChange={(e) =>
                  handleChange(
                    "description",
                    e.target.value
                  )
                }
              ></textarea>
            </div>
          </div>

          {/* FORM BUTTONS */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-light fw-bold px-3"
              onClick={closeForm}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn fw-bold px-4"
              style={{
                background: theme.primaryPurple,
                color: "#fff",
                borderRadius: "12px",
              }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>

                  Saving...
                </>
              ) : editIndex !== null ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {education.length === 0 && !formOpen && (
        <div
          className="text-center p-5 rounded-4"
          style={{
            background:
              "linear-gradient(180deg, #f8fafc, #ffffff)",
            border: "1px dashed #cbd5e1",
          }}
        >
          <i
            className="bi bi-mortarboard-fill"
            style={{
              fontSize: "46px",
              color: theme.accentBlue,
            }}
          ></i>

          <h6 className="fw-bold mt-3 mb-1">
            No education added yet
          </h6>

          <small className="text-muted">
            Click the plus icon to add your first academic
            record.
          </small>
        </div>
      )}

      {/* =====================================================
          EDUCATION TIMELINE
      ====================================================== */}
      <div className="position-relative">
        {education.length > 0 && (
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

        {education.map((edu, i) => (
          <div
            key={edu._id || `education-${i}`}
            className="p-3 mb-3 rounded-4 position-relative"
            style={{
              marginLeft: "34px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderLeft: `5px solid ${theme.accentBlue}`,
              boxShadow:
                "0 8px 20px rgba(15, 23, 42, 0.05)",
            }}
          >
            {/* TIMELINE DOT */}
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

            {/* EDUCATION CONTENT */}
            <div className="d-flex justify-content-between align-items-start">
              <div className="pe-4">
                <h6 className="fw-bold mb-1">
                  {edu.degree || "Degree / Course"}
                </h6>

                <p className="text-muted small mb-2">
                  <i className="bi bi-building me-1"></i>

                  {edu.institution || "Institution Name"}
                </p>

                {/* BADGES */}
                <div className="d-flex flex-wrap gap-2">
                  {/* YEAR */}
                  {edu.year && (
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

                      {edu.year}
                    </span>
                  )}

                  {/* GRADE */}
                  {edu.grade && (
                    <span
                      className="badge"
                      style={{
                        background: "#ecfeff",
                        color: "#0891b2",
                        borderRadius: "999px",
                        padding: "7px 10px",
                      }}
                    >
                      <i className="bi bi-award me-1"></i>

                      {edu.grade}
                    </span>
                  )}

                  {/* LOCATION */}
                  {edu.location && (
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

                      {edu.location}
                    </span>
                  )}
                </div>

                {/* DESCRIPTION */}
                {edu.description && (
                  <p className="text-muted small mt-2 mb-0">
                    {edu.description}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="d-flex gap-3">
                {/* EDIT */}
                <i
                  className="bi bi-pencil-square"
                  title="Edit"
                  onClick={() =>
                    openEditForm(edu, i)
                  }
                  style={{
                    cursor: "pointer",
                    color: theme.accentBlue,
                    fontSize: "18px",
                  }}
                ></i>

                {/* DELETE */}
                <i
                  className="bi bi-trash3"
                  title="Delete"
                  onClick={() =>
                    removeEducation(i)
                  }
                  style={{
                    cursor: "pointer",
                    color: "#ef4444",
                    fontSize: "18px",
                  }}
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;

