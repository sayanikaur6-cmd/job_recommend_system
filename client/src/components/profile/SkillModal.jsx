import { useEffect, useState } from "react";
import axios from "axios";

const SkillModal = ({ setShowModal, skills, setSkills }) => {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [tempSkills, setTempSkills] = useState([]); // 🔥 temp storage

  useEffect(() => {
    const fetchSkills = async () => {
      const res = await axios.get("http://localhost:5000/api/skill");
      setAvailableSkills(res.data);
    };
    fetchSkills();
  }, []);

  // ➕ Add to temp list
  const handleAdd = () => {
    const skillObj = availableSkills.find(s => s._id === selectedSkill);

    if (!skillObj) return;

    // duplicate avoid (temp + existing both)
    if (
      !tempSkills.some(s => s._id === skillObj._id) &&
      !skills.some(s => s._id === skillObj._id)
    ) {
      setTempSkills([...tempSkills, skillObj]);
    }

    setSelectedSkill("");
  };

  // ❌ remove from temp
  const removeTempSkill = (id) => {
    setTempSkills(tempSkills.filter(s => s._id !== id));
  };

  // 💾 Final Save
  const handleSave = async () => {
    try {
      const skillIds = tempSkills.map(s => s._id);
      const token = localStorage.getItem("token");
      // 🔥 backend call
      await axios.post("http://localhost:5000/api/users/skills", {
        skills: skillIds
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      // UI update
      setSkills([...skills, ...tempSkills]);

      setShowModal(false);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Select Skills</h5>

          {/* Dropdown + Add */}
          <div className="d-flex gap-2 my-3">
            <select
              className="form-select"
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

            <button className="btn btn-success" onClick={handleAdd}>
              Add
            </button>
          </div>

          {/* 🔥 Selected Skills Preview */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {tempSkills.map((skill) => (
              <span
                key={skill._id}
                className="badge bg-primary d-flex align-items-center gap-2"
              >
                {skill.skill}
                <i
                  className="bi bi-x-lg"
                  style={{ cursor: "pointer", fontSize: "10px" }}
                  onClick={() => removeTempSkill(skill._id)}
                ></i>
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button className="btn btn-primary" onClick={handleSave}>
              Save All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;