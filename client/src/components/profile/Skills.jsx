import { useState } from "react";
import SkillModal from "./SkillModal";
import axios from "axios";
const Skills = ({ skills, setSkills, theme }) => {
  const [showModal, setShowModal] = useState(false);

  const removeSkill = (id) => {
    const token = localStorage.getItem("token");
    axios.post("http://localhost:5000/api/users/remskills", {
      skills: [id]
    },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
    setSkills(skills.filter((s) => s._id !== id));
  };

  return (
    <div className="card border-0 p-4 mb-4 shadow-sm" style={{ borderRadius: "20px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="fw-bold" style={{ color: theme.primaryPurple }}>
          Skills & Expertise
        </h5>

        {/* ➕ Add Button */}
        <button
          className="btn"
          style={{ background: theme.primaryPurple, color: "#fff" }}
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>

      {/* Skills List */}
      <div className="d-flex flex-wrap gap-2 mt-3">
        {skills.map((skill) => (
          <span
            key={skill._id}
            className="badge px-3 py-2 d-flex align-items-center gap-2"
            style={{
              background: "#eef2ff",
              color: theme.primaryPurple,
              borderRadius: "8px",
            }}
          >
            {skill.skill}
            <i
              className="bi bi-x-lg"
              style={{ cursor: "pointer", fontSize: "10px" }}
              onClick={() => removeSkill(skill._id)}
            ></i>
          </span>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <SkillModal
          setShowModal={setShowModal}
          skills={skills}
          setSkills={setSkills}
        />
      )}
    </div>
  );
};

export default Skills;