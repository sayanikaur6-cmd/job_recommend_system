const Resume = ({ user, theme }) => {
  return (
    <div
              className="card border-0 p-4 shadow-sm"
              style={{
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${theme.primaryPurple}, ${theme.accentBlue})`,
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-white mb-0">My Resume</h5>
                {user.resume ? (
                  <a
                    href={`http://localhost:5000${user.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-light fw-bold text-primary px-4 shadow-sm"
                  >
                    View PDF
                  </a>
                ) : (
                  <span className="text-white-50">No resume uploaded.</span>
                )}
              </div>
            </div>
  );
};

export default Resume;