const Experience = ({ experience,theme }) => {
  return (
    <div
              className="card border-0 p-4 mb-4 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <h5 className="fw-bold" style={{ color: theme.primaryPurple }}>
                Experience
              </h5>
              <div className="mt-3">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className="p-3 mb-2 bg-light rounded-4 position-relative border-start border-4"
                    style={{ borderColor: theme.primaryPurple }}
                  >
                    <h6 className="fw-bold mb-0">
                      {exp.role} @ {exp.company}
                    </h6>
                    <span className="text-muted small">
                      {exp.startDate} - {exp.endDate}
                    </span>
                    <i
                      className="bi bi-trash3 text-danger position-absolute"
                      style={{ right: "15px", top: "18px", cursor: "pointer" }}
                      onClick={() => removeExperience(i)}
                    ></i>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-sm mt-2 fw-bold"
                style={{ color: theme.primaryPurple }}
                onClick={() => addExperience()}
              >
                + Add Professional Experience
              </button>
            </div>
  );
};

export default Experience;