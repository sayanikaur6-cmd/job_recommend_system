import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function JobDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  if (!job) {
    return <h3 className="text-center mt-5">No Job Data Found</h3>;
  }

  return (
    <div
      className="container-fluid py-5 px-md-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
      }}
    >
      {/* 🔙 BACK */}
      <button
        className="btn mb-4"
        style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>

      <div className="row g-4">

        {/* 🔥 LEFT SIDE (MAIN DETAILS) */}
        <div
          className="col-lg-8"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate
              ? "translateY(0px)"
              : "translateY(40px)",
            transition: "all 0.6s ease",
          }}
        >
          <div
            className="p-4 p-md-5"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            {/* HEADER */}
            <div className="d-flex align-items-center gap-4 mb-4">
              <img
                src={
                  job.employer_logo ||
                  "https://via.placeholder.com/80"
                }
                alt="logo"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "16px",
                  objectFit: "cover",
                }}
              />

              <div>
                <h2 className="fw-bold mb-1">
                  {job.job_title}
                </h2>
                <p className="text-muted mb-2">
                  🏢 {job.employer_name}
                </p>

                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                    📍 {job.job_location}
                  </span>
                  <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                    💼 {job.job_employment_type}
                  </span>
                  <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                    🕒 {job.job_posted_at}
                  </span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div
              className="p-4"
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h5 className="fw-bold mb-3">
                📄 Job Description
              </h5>

              <div
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: "1.7",
                  color: "#374151",
                }}
              >
                {job.job_description}
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 RIGHT SIDE (STICKY PANEL) */}
        <div
          className="col-lg-4"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate
              ? "translateY(0px)"
              : "translateY(40px)",
            transition: "all 0.8s ease",
          }}
        >
          <div
            className="p-4"
            style={{
              position: "sticky",
              top: "30px",
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            }}
          >
            <h5 className="fw-bold mb-3">Job Overview</h5>

            <p className="mb-2">🏢 {job.employer_name}</p>
            <p className="mb-2">📍 {job.job_location}</p>
            <p className="mb-2">💼 {job.job_employment_type}</p>
            <p className="mb-3">🕒 {job.job_posted_at}</p>

            {/* APPLY */}
            <button
              className="btn w-100 mb-2"
              style={{
                background:
                  "linear-gradient(90deg,#4f46e5,#7c3aed)",
                color: "#fff",
                borderRadius: "25px",
                fontWeight: "600",
                padding: "10px",
              }}
              onClick={() =>
                window.open(job.job_apply_link, "_blank")
              }
            >
              🚀 Apply Now
            </button>

            {/* COMPANY */}
            <button
              className="btn btn-outline-dark w-100 rounded-pill"
              onClick={() =>
                window.open(job.employer_website, "_blank")
              }
            >
              🌐 Visit Company
            </button>

            {/* TAGS */}
            <div className="mt-4 d-flex flex-wrap gap-2">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                {job.job_country}
              </span>

              {job.job_is_remote && (
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                  Remote
                </span>
              )}

              <span className="badge bg-warning bg-opacity-10 text-dark px-3 py-2 rounded-pill">
                {job.job_publisher}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}