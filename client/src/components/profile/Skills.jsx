const Skills = ({ skills, setSkills, newSkill, setNewSkill, theme ,availableSkills}) => {
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  return (
    <div
              className="card border-0 p-4 mb-4 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <h5 className="fw-bold" style={{ color: theme.primaryPurple }}>
                Skills & Expertise
              </h5>
              <div className="d-flex gap-2 my-3">
                <select
                  className="form-select border-0 bg-light"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                >
                  <option value="">Select a Skill</option>
                  {availableSkills.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  className="btn px-4"
                  style={{ background: theme.accentBlue, color: "#fff" }}
                  onClick={addSkill}
                >
                  Add
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="badge px-3 py-2 d-flex align-items-center gap-2"
                    style={{
                      background: "#eef2ff",
                      color: theme.primaryPurple,
                      borderRadius: "8px",
                      fontWeight: "500",
                    }}
                  >
                    {skill}{" "}
                    <i
                      className="bi bi-x-lg"
                      style={{ cursor: "pointer", fontSize: "10px" }}
                      onClick={() => removeSkill(skill)}
                    ></i>
                  </span>
                ))}
              </div>
            </div>
  );
};

export default Skills;