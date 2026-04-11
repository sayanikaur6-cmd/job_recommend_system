import React from "react";
import { useLocation } from "react-router-dom";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

export default function SearchResults() {
  const location = useLocation();

  const jobs = location.state?.jobs || [];
  const query = location.state?.query || "";

  return (
    <>
      <div
        className="container mt-4"
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold">
            Search Results for <span className="text-primary">"{query}"</span>
          </h2>
          <p className="text-muted">{jobs.length} opportunities found</p>
        </div>

        {/* Empty State */}
        {jobs.length === 0 ? (
          <div className="text-center mt-5">
            <h4>No jobs found 😔</h4>
            <p className="text-muted">Try another keyword</p>
          </div>
        ) : (
          <div className="row g-4">
            {jobs.map((job, index) => (
              <div
                className="col-lg-4 col-md-6 col-sm-12"
                key={job.job_id || index}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
