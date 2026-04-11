export default function JobCard({ job }) {
  const handleApplyClick = () => {
    const applyLink =
      job.job_apply_link ||
      job.apply_options?.[0]?.apply_link;

    if (applyLink) {
      window.open(applyLink, "_blank");
    } else {
      alert("No apply link available for this job.");
    }
  };

  return (
    <div
      className="card border-0 rounded-4 shadow-sm h-100"
      style={{
        transition: "all 0.35s ease",
        cursor: "pointer",
        overflow: "hidden",
        background: "#ffffff",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          "0 18px 35px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      {/* Top Gradient Line */}
      <div
        style={{
          height: "5px",
          background:
            "linear-gradient(90deg, #4f46e5, #7c3aed)",
        }}
      ></div>

      <div className="card-body p-4">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <img
            src={
              job.employer_logo ||
              "https://via.placeholder.com/50"
            }
            alt="company-logo"
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "12px",
              objectFit: "cover",
              marginRight: "12px",
            }}
          />

          <div>
            <h5 className="fw-bold mb-1">
              {job.job_title}
            </h5>
            <p
              className="mb-0"
              style={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              🏢 {job.employer_name}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mb-3">
          <p className="mb-2 text-muted">
            📍 {job.job_location}
          </p>

          <p className="mb-2 text-muted">
            💼 {job.job_employment_type}
          </p>

          <p className="mb-2 text-muted">
            🕒 {job.job_posted_at}
          </p>
        </div>

        {/* Short Description */}
        <p
          className="text-secondary"
          style={{
            fontSize: "14px",
            minHeight: "70px",
          }}
        >
          {job.job_description
            ? job.job_description.slice(0, 100) + "..."
            : "Exciting opportunity available."}
        </p>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span
            className="badge rounded-pill px-3 py-2"
            style={{
              background: "#eef2ff",
              color: "#4f46e5",
              fontWeight: "600",
            }}
          >
            {job.job_publisher}
          </span>

          <button
            onClick={handleApplyClick}
            className="btn rounded-pill px-4"
            style={{
              background:
                "linear-gradient(90deg, #4f46e5, #7c3aed)",
              color: "white",
              fontWeight: "600",
              border: "none",
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}