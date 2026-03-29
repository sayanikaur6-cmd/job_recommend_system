export default function JobCard({ job }) {
  const handleApplyClick = () => {
    if (job.applyLink && job.applyLink !== "#") {
      window.open(job.applyLink, "_blank"); // ✅ open in new tab
    } else {
      alert("No apply link available for this job.");
    }
  };

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p className="company">🏢 {job.company}</p>
      <p>📍 {job.location}</p>

      <button
        onClick={handleApplyClick}
        style={{
          marginTop: "15px",
          width: "100%",
          padding: "8px",
          background: "#f0f2f5",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          color: "#4f46e5",
          fontWeight: 600,
        }}
      >
        Apply Now
      </button>
    </div>
  );
}