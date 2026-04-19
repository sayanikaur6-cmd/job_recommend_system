import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import JobCard from "../components/JobCard";

export default function SearchResults() {
  const location = useLocation();

  const allJobs = location.state?.jobs || [];
  const query = location.state?.query || "";

  const [filteredJobs, setFilteredJobs] = useState(allJobs);

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    company: "",
    remote: "",
    posted: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    types: [],
    companies: [],
  });

  // 🔥 Dynamic filter options (INCLUDING LOCATION FROM API)
  useEffect(() => {
    const locations = [
      ...new Set(allJobs.map((j) => j.job_city).filter(Boolean)),
    ];
    const types = [
      ...new Set(allJobs.map((j) => j.job_employment_type).filter(Boolean)),
    ];
    const companies = [
      ...new Set(allJobs.map((j) => j.employer_name).filter(Boolean)),
    ];

    setFilterOptions({
      locations,
      types,
      companies,
    });

    setFilteredJobs(allJobs);
  }, [allJobs]);

  // 🔥 Apply filters
  useEffect(() => {
    let temp = allJobs;

    if (filters.location) {
      temp = temp.filter(
        (job) => job.job_city === filters.location
      );
    }

    if (filters.type) {
      temp = temp.filter(
        (job) => job.job_employment_type === filters.type
      );
    }

    if (filters.company) {
      temp = temp.filter(
        (job) => job.employer_name === filters.company
      );
    }

    if (filters.remote) {
      temp = temp.filter(
        (job) => job.job_is_remote === (filters.remote === "yes")
      );
    }

    if (filters.posted === "24h") {
      temp = temp.filter((job) =>
        job.job_posted_at?.includes("hour")
      );
    }

    if (filters.posted === "7d") {
      temp = temp.filter((job) =>
        job.job_posted_at?.includes("day")
      );
    }

    setFilteredJobs(temp);
  }, [filters, allJobs]);

  return (
    <div className="container-fluid mt-4">
      <div className="row">

        {/* 🔥 FILTER PANEL */}
        <div className="col-md-3">
          <div
            className="p-4 shadow-sm"
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              position: "sticky",
              top: "20px",
            }}
          >
            <h5 className="fw-bold mb-4">Filters</h5>

            {/* Location */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Location</label>
              <select
                className="form-select rounded-pill"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              >
                <option value="">All Locations</option>
                {filterOptions.locations.map((loc, i) => (
                  <option key={i}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Job Type</label>
              <select
                className="form-select rounded-pill"
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
              >
                <option value="">All</option>
                {filterOptions.types.map((type, i) => (
                  <option key={i}>{type}</option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Company</label>
              <select
                className="form-select rounded-pill"
                value={filters.company}
                onChange={(e) =>
                  setFilters({ ...filters, company: e.target.value })
                }
              >
                <option value="">All</option>
                {filterOptions.companies.map((c, i) => (
                  <option key={i}>{c}</option>
                ))}
              </select>
            </div>

            {/* Remote */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Work Mode</label>
              <select
                className="form-select rounded-pill"
                value={filters.remote}
                onChange={(e) =>
                  setFilters({ ...filters, remote: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="yes">Remote</option>
                <option value="no">Onsite</option>
              </select>
            </div>

            {/* Posted */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Posted</label>
              <select
                className="form-select rounded-pill"
                value={filters.posted}
                onChange={(e) =>
                  setFilters({ ...filters, posted: e.target.value })
                }
              >
                <option value="">Any time</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
              </select>
            </div>

            {/* Clear Button */}
            <button
              className="btn w-100 mt-2"
              style={{
                background: "#4f46e5",
                color: "#fff",
                borderRadius: "20px",
              }}
              onClick={() =>
                setFilters({
                  location: "",
                  type: "",
                  company: "",
                  remote: "",
                  posted: "",
                })
              }
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* 🔥 JOB LIST */}
        <div className="col-md-9">
          <div className="mb-4">
            <h2 className="fw-bold">
              Results for{" "}
              <span className="text-primary">"{query}"</span>
            </h2>
            <p className="text-muted">
              {filteredJobs.length} jobs found
            </p>
          </div>

          {filteredJobs.length === 0 ? (
            <h5>No jobs match filters 😔</h5>
          ) : (
            <div className="row g-4">
              {filteredJobs.map((job, index) => (
                <div
                  className="col-lg-4 col-md-6"
                  key={job.job_id || index}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}