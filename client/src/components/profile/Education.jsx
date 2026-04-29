const Education = ({ education, setEducation, newEdu, setNewEdu, theme }) => {
  const addEducation = () => {
    setEducation([...education, newEdu]);
    setNewEdu({ degree: "", institution: "", year: "" });
  };

  return (
    <div
              className="card border-0 p-4 mb-4 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <h5 className="fw-bold" style={{ color: theme.primaryPurple }}>
                Education
              </h5>
              <div className="mt-3">
                {education.map((edu, i) => (
                  <div
                    key={i}
                    className="p-3 mb-2 bg-light rounded-4 position-relative border-start border-4"
                    style={{ borderColor: theme.accentBlue }}
                  >
                    <h6 className="fw-bold mb-0">{edu.degree}</h6>
                    <span className="text-muted small">
                      {edu.institution} • {edu.year}
                    </span>
                    <i
                      className="bi bi-trash3 text-danger position-absolute"
                      style={{ right: "15px", top: "18px", cursor: "pointer" }}
                      onClick={() => removeEducation(i)}
                    ></i>
                  </div>
                ))}
              </div>
              <div
                className="mt-3 p-3 rounded-4"
                style={{ border: `1px dashed ${theme.border}` }}
              >
                <div className="row g-2">
                  <div className="col-md-5">
                    <input
                      type="text"
                      placeholder="Degree"
                      className="form-control form-control-sm border-0 bg-light"
                      onChange={(e) =>
                        setNewEdu({ ...newEdu, degree: e.target.value })
                      }
                      value={newEdu.degree}
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      placeholder="Institution"
                      className="form-control form-control-sm border-0 bg-light"
                      onChange={(e) =>
                        setNewEdu({ ...newEdu, institution: e.target.value })
                      }
                      value={newEdu.institution}
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-sm w-100"
                      style={{ background: theme.primaryPurple, color: "#fff" }}
                      onClick={addEducation}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
  );
};

export default Education;