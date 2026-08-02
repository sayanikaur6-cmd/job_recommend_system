import { useEffect, useState } from "react";
import { getRecommendedJobs } from "../api/recommendationApi";
import { saveJob, applyJob } from "../api/jobActivityApi";
import { useNavigate } from "react-router-dom";
import Exactloc from "./Exactloc";

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadRecommendedJobs = async () => {
    try {
      setLoading(true);

      const data = await getRecommendedJobs();

      setJobs(data.jobs || []);
      setUserSkills(data.userSkills || []);
    } catch (error) {
      console.log("Recommended jobs error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = (job) => {
    navigate("/recom-job-details", { state: { job } });
  };

  const handleSave = async (job) => {
    try {
      await saveJob(job.job_id);
      alert("Job saved");
    } catch (error) {
      alert(error.response?.data?.message || "Save failed");
    }
  };

  const handleApply = async (job) => {
    try {
      await applyJob(job._id || job.job_id);

      if (job.apply_link || job.applyLink) {
        window.open(job.apply_link || job.applyLink, "_blank");
      }

      alert("Application added to tracking");
    } catch (error) {
      alert(error.response?.data?.message || "Apply tracking failed");
    }
  };

  useEffect(() => {
    loadRecommendedJobs();
  }, []);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm p-4 rounded-4">
        <h5 className="fw-bold mb-0">Loading recommended jobs...</h5>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
      <h4 className="fw-bold mb-1">Recommended Jobs For You</h4>

      <p className="text-muted">
        Based on your profile skills and your searched jobs.
      </p>

      {userSkills.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          {userSkills.map((skill, index) => (
            <span
              key={index}
              className="badge rounded-pill"
              style={{
                background: "#eef2ff",
                color: "#6366f1",
                padding: "8px 12px",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-4">
          <h6 className="fw-bold">No recommended jobs found</h6>
          <p className="text-muted mb-0">
            Add skills in profile and search some jobs first.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {jobs.map((job) => (
            <div className="col-md-6" key={job._id}>
              <div
                className="border p-3 h-100"
                style={{
                  borderRadius: "18px",
                  background: "#fff",
                }}
              >
                {/* Top Section */}
                <div className="d-flex gap-3">
                  <img
                    src={
                      job.company_logo ||
                      "https://via.placeholder.com/50"
                    }
                    alt="logo"
                    width="50"
                    height="50"
                    className="rounded-3"
                    style={{ objectFit: "cover" }}
                  />

                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">
                      {job.title || "Job Title"}
                    </h6>

                    <p className="text-muted small mb-1">
                      {job.company || "Company"}
                    </p>

                    <p className="text-muted small mb-2">
                      <i className="bi bi-geo-alt me-1"></i>
                      {job.location || "Location not specified"}
                    </p>

                    {/* View Location */}
                    <div className="mb-2">
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
                </div>

                {/* Match Score */}
                <div className="d-flex align-items-center gap-2 my-3">
                  <div
                    className="progress flex-grow-1"
                    style={{ height: "8px" }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width: `${job.matchScore}%`,
                        background: "#6366f1",
                      }}
                    ></div>
                  </div>

                  <small className="fw-bold">
                    {job.matchScore}% match
                  </small>
                </div>

                {/* Matched Skills */}
                {job.matchedSkills?.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {job.matchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge rounded-pill"
                        style={{
                          background: "#dcfce7",
                          color: "#166534",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <button
                  onClick={() => handleApply(job)}
                  className="btn btn-sm rounded-pill px-3 me-2"
                  style={{
                    background: "#4f46e5",
                    color: "#fff",
                  }}
                >
                  Apply
                </button>

                <button
                  onClick={() => handleDetailsClick(job)}
                  className="btn btn-outline-dark btn-sm rounded-pill px-3 me-2"
                  style={{ fontWeight: "600" }}
                >
                  Details
                </button>

                <button
                  onClick={() => handleSave(job)}
                  className="btn btn-sm rounded-pill px-3"
                  style={{
                    background: "#e0e7ff",
                    color: "#4f46e5",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedJobs;