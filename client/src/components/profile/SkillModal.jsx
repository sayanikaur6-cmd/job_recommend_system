import { useEffect, useState } from "react";
import axios from "axios";

const SkillModal = ({ setShowModal, skills = [], setSkills, theme }) => {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [tempSkills, setTempSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const res = await axios.get("http://localhost:5000/api/skill");
      setAvailableSkills(res.data);
    };
    fetchSkills();
  }, []);

  const handleAdd = () => {
    const skillObj = availableSkills.find((s) => s._id === selectedSkill);
    if (!skillObj) return;

    const alreadyAdded =
      tempSkills.some((s) => s._id === skillObj._id) ||
      skills.some((s) => s._id === skillObj._id);

    if (!alreadyAdded) {
      setTempSkills([...tempSkills, skillObj]);
    }

    setSelectedSkill("");
  };

  const removeTempSkill = (id) => {
    setTempSkills(tempSkills.filter((s) => s._id !== id));
  };

  const handleSave = async () => {
    try {
      const skillIds = tempSkills.map((s) => s._id);
      if (skillIds.length === 0) return setShowModal(false);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/users/skills",
        { skills: skillIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSkills([...skills, ...tempSkills]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Skills save failed");
    }
  };

  return (
    <div
      className="p-4 mb-3 rounded-4"
      style={{
        background: "linear-gradient(180deg, #f8fafc, #ffffff)",
        border: "1px solid #e2e8f0",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: "#eef2ff",
              color: theme.primaryPurple,
              fontSize: "20px",
            }}
          >
            <i className="bi bi-stars"></i>
          </span>

          <div>
            <h6 className="fw-bold mb-0">Add Skills</h6>
            <small className="text-muted">
              Select skills and save them to your profile
            </small>
          </div>
        </div>

        <i
          className="bi bi-x-circle-fill"
          onClick={() => setShowModal(false)}
          style={{
            cursor: "pointer",
            fontSize: "22px",
            color: "#64748b",
          }}
        ></i>
      </div>

      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select border-0 shadow-sm"
          style={{
            borderRadius: "14px",
            padding: "11px 14px",
          }}
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">Select a skill</option>
          {availableSkills.map((s) => (
            <option key={s._id} value={s._id}>
              {s.skill}
            </option>
          ))}
        </select>

        <i
          className="bi bi-plus-circle-fill d-flex align-items-center"
          title="Add selected skill"
          onClick={handleAdd}
          style={{
            cursor: "pointer",
            fontSize: "32px",
            color: theme.primaryPurple,
          }}
        ></i>
      </div>

      {tempSkills.length > 0 && (
        <div className="mb-3">
          <small className="fw-bold text-muted">Selected Skills</small>

          <div className="d-flex flex-wrap gap-2 mt-2">
            {tempSkills.map((skill) => (
              <span
                key={skill._id}
                className="d-flex align-items-center gap-2"
                style={{
                  background: "#eef2ff",
                  color: theme.primaryPurple,
                  borderRadius: "999px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                <i className="bi bi-check2-circle"></i>
                {skill.skill}

                <i
                  className="bi bi-x-circle-fill"
                  style={{ cursor: "pointer", fontSize: "14px" }}
                  onClick={() => removeTempSkill(skill._id)}
                ></i>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-light fw-bold px-3"
          style={{ borderRadius: "12px" }}
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn fw-bold px-4"
          style={{
            borderRadius: "12px",
            background: theme.primaryPurple,
            color: "#fff",
          }}
          onClick={handleSave}
        >
          Save Skills
        </button>
      </div>
    </div>
  );
};

export default SkillModal;