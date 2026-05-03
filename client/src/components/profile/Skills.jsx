import { useState } from "react";
import SkillModal from "./SkillModal";
import axios from "axios";

const Skills = ({ skills = [], setSkills, theme }) => {
  const [showModal, setShowModal] = useState(false);

  const removeSkill = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/users/remskills",
        { skills: [id] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSkills(skills.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Skill remove failed");
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
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center p-3 mb-3"
        style={{
          borderRadius: "22px",
          background: `linear-gradient(135deg, ${theme.primaryPurple}, ${theme.accentBlue})`,
          boxShadow: "0 12px 25px rgba(99, 102, 241, 0.22)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontSize: "22px",
            }}
          >
            <i className="bi bi-stars"></i>
          </div>

          <div>
            <h5 className="fw-bold text-white mb-1">Skills & Expertise</h5>
            <small className="text-white-50">
              Add technologies, tools and strengths
            </small>
          </div>
        </div>

        <i
          className="bi bi-plus-circle-fill text-white"
          title="Add Skill"
          onClick={() => setShowModal(true)}
          style={{
            fontSize: "30px",
            cursor: "pointer",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.18))",
          }}
        ></i>
      </div>

      {/* Empty State */}
      {skills.length === 0 && (
        <div
          className="text-center p-5 rounded-4"
          style={{
            background: "linear-gradient(180deg, #f8fafc, #ffffff)",
            border: "1px dashed #cbd5e1",
          }}
        >
          <i
            className="bi bi-lightning-charge-fill"
            style={{ fontSize: "44px", color: theme.accentBlue }}
          ></i>
          <h6 className="fw-bold mt-3 mb-1">No skills added yet</h6>
          <small className="text-muted">
            Click the plus icon to add your first skill.
          </small>
        </div>
      )}

      {/* Skills List */}
      {skills.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {skills.map((skill) => (
            <span
              key={skill._id}
              className="d-flex align-items-center gap-2"
              style={{
                background: "#eef2ff",
                color: theme.primaryPurple,
                borderRadius: "999px",
                padding: "9px 13px",
                fontSize: "13px",
                fontWeight: "700",
                boxShadow: "0 6px 14px rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.12)",
              }}
            >
              <i className="bi bi-check2-circle"></i>
              {skill.skill}

              <i
                className="bi bi-x-circle-fill"
                title="Remove"
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  opacity: 0.75,
                }}
                onClick={() => removeSkill(skill._id)}
              ></i>
            </span>
          ))}
        </div>
      )}

      {showModal && (
        <SkillModal
          setShowModal={setShowModal}
          skills={skills}
          setSkills={setSkills}
          theme={theme}
        />
      )}
    </div>
  );
};

export default Skills;