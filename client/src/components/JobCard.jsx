export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p className="company">🏢 {job.company}</p>
      <p>📍 {job.location}</p>
      <button
        style={{
          marginTop: "15px",
          width: "100%",
          padding: "8px",
          background: "#f0f2f5",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          color: "#4f46e5",
          fontWeight: 600
        }}
      >
        Apply Now
      </button>
    </div>
  );
}