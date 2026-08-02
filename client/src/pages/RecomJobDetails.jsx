import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Exactloc from "../components/Exactloc";
export default function RecomJobDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  console.log("Job details:", job);

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
      {/* Back */}
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
        {/* LEFT */}
        <div
          className="col-lg-8"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0px)" : "translateY(40px)",
            transition: "all .6s ease",
          }}
        >
          <div
            className="p-4 p-md-5"
            style={{
              background: "rgba(255,255,255,.75)",
              backdropFilter: "blur(12px)",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,.1)",
            }}
          >
            {/* Header */}
            <div className="d-flex align-items-center gap-4 mb-4">
              <img
                src={
                  job.company_logo ||
                  "https://via.placeholder.com/80?text=Logo"
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
                <h2 className="fw-bold mb-1">{job.title}</h2>

                <p className="text-muted mb-2">
                  🏢 {job.company}
                </p>

                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                    📍 {job.location}
                  </span>

                  <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                    💼 {job.employment_type}
                  </span>

                  <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                    🕒 {job.posted_at}
                  </span>
                </div>
                <Exactloc
                    company={job.company}
                    city={job.city}
                    state={job.state}
                    country={job.country}
                    lat={job.latitude}
                    lng={job.longitude}
                  />
              </div>
            </div>

            {/* Description */}
            <div
              className="p-4"
              style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,.05)",
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
                {job.description}
              </div>

              {/* Skills */}
              {job.skills?.length > 0 && (
                <>
                  <h5 className="fw-bold mt-4 mb-3">
                    💻 Required Skills
                  </h5>

                  <div className="d-flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge bg-primary px-3 py-2 rounded-pill"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Matched Skills */}
              {job.matchedSkills?.length > 0 && (
                <>
                  <h5 className="fw-bold mt-4 mb-3">
                    ✅ Matched Skills
                  </h5>

                  <div className="d-flex flex-wrap gap-2">
                    {job.matchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge bg-success px-3 py-2 rounded-pill"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="col-lg-4"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0px)" : "translateY(40px)",
            transition: "all .8s ease",
          }}
        >
          <div
            className="p-4"
            style={{
              position: "sticky",
              top: "30px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,.08)",
            }}
          >
            <h5 className="fw-bold mb-3">
              Job Overview
            </h5>

            <p className="mb-2">
              🏢 <strong>{job.company}</strong>
            </p>

            <p className="mb-2">
              📍 {job.location}
            </p>

            <p className="mb-2">
              💼 {job.employment_type}
            </p>

            <p className="mb-2">
              🌍 {job.country}
            </p>

            <p className="mb-2">
              📰 {job.publisher}
            </p>

            <p className="mb-2">
              🎯 Match Score:
              <strong className="text-success">
                {" "}
                {job.matchScore || 0}%
              </strong>
            </p>

            <p className="mb-3">
              🕒 {job.posted_at}
            </p>

            <button
              className="btn w-100 mb-3"
              style={{
                background:
                  "linear-gradient(90deg,#4f46e5,#7c3aed)",
                color: "#fff",
                borderRadius: "25px",
                fontWeight: "600",
                padding: "10px",
              }}
              onClick={() =>
                window.open(job.apply_link, "_blank")
              }
            >
              🚀 Apply Now
            </button>

            {job.company_website && (
              <button
                className="btn btn-outline-dark w-100 rounded-pill"
                onClick={() =>
                  window.open(job.company_website, "_blank")
                }
              >
                🌐 Visit Company
              </button>
            )}

            <div className="mt-4 d-flex flex-wrap gap-2">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                {job.country}
              </span>

              {job.is_remote && (
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                  Remote
                </span>
              )}

              <span className="badge bg-warning bg-opacity-10 text-dark px-3 py-2 rounded-pill">
                {job.publisher}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}