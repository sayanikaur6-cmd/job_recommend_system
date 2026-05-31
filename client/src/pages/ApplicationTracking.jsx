import { useEffect, useState } from "react";
import { getApplications } from "../api/jobActivityApi";

const ApplicationTracking = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const data = await getApplications();

      const appliedOnly = (data || []).filter(
        (app) => app.status === "applied"
      );

      setApplications(appliedOnly);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Applications load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getLogo = (job) => {
    return (
      job?.company_logo ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        job?.company || "Job"
      )}&background=eef2ff&color=4f46e5`
    );
  };

  return (
    <div className="application-page">
      <style>{`
        .application-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 30%),
            radial-gradient(circle at top right, rgba(14,165,233,0.20), transparent 28%),
            linear-gradient(135deg, #eef4ff, #f8fbff);
          padding: 45px 20px;
        }

        .app-container {
          max-width: 1120px;
          margin: auto;
        }

        .hero-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 30px;
          padding: 35px;
          box-shadow: 0 25px 70px rgba(79,70,229,0.12);
          margin-bottom: 35px;
          position: relative;
          overflow: hidden;
        }

        .hero-card::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          background: rgba(79,70,229,0.13);
          filter: blur(70px);
          right: -80px;
          top: -80px;
        }

        .title-gradient {
          font-size: 40px;
          font-weight: 900;
          background: linear-gradient(90deg, #4f46e5, #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .stat-pill {
          background: linear-gradient(90deg, #4f46e5, #2563eb);
          color: white;
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 800;
          box-shadow: 0 10px 25px rgba(37,99,235,0.25);
        }

        .app-card {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 28px;
          padding: 26px;
          margin-bottom: 22px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.08);
          transition: 0.28s ease;
          position: relative;
          overflow: hidden;
        }

        .app-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 28px 70px rgba(79,70,229,0.18);
        }

        .top-line {
          position: absolute;
          top: 0;
          left: 0;
          height: 5px;
          width: 100%;
          background: linear-gradient(90deg, #4f46e5, #7c3aed, #0ea5e9);
        }

        .company-logo {
          width: 76px;
          height: 76px;
          border-radius: 22px;
          object-fit: cover;
          background: white;
          padding: 8px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.12);
        }

        .job-title {
          font-size: 23px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 7px;
        }

        .meta {
          color: #64748b;
          font-size: 15px;
          margin-bottom: 6px;
        }

        .applied-badge {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .date-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px 15px;
          color: #475569;
          font-weight: 600;
        }

        .open-btn {
          background: linear-gradient(90deg, #4f46e5, #2563eb);
          color: white;
          border: none;
          padding: 11px 22px;
          border-radius: 999px;
          font-weight: 800;
          transition: 0.25s;
          text-decoration: none;
          display: inline-block;
        }

        .open-btn:hover {
          transform: scale(1.04);
          color: white;
        }

        .empty-card {
          background: rgba(255,255,255,0.9);
          border-radius: 30px;
          padding: 80px 30px;
          text-align: center;
          box-shadow: 0 20px 55px rgba(15,23,42,0.08);
        }

        .empty-icon {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #eef2ff, #dbeafe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin: 0 auto 20px;
        }
      `}</style>

      <div className="app-container">
        <div className="hero-card">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 position-relative">
            <div>
              <h1 className="title-gradient">Application Tracking</h1>
              <p className="text-muted mb-0">
                Track every job where you clicked Apply from CareerSync.
              </p>
            </div>

            <div className="stat-pill">
              {applications.length} Applied
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary"></div>
            <p className="text-muted mt-3">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">📌</div>
            <h3 className="fw-bold">No applied jobs yet</h3>
            <p className="text-muted mb-0">
              Click Apply on any job card and it will appear here instantly.
            </p>
          </div>
        ) : (
          applications.map((app) => {
            const job = app.job;

            return (
              <div className="app-card" key={app._id}>
                <div className="top-line"></div>

                <div className="row align-items-center g-4">
                  <div className="col-md-1 text-center">
                    <img
                      src={getLogo(job)}
                      alt=""
                      className="company-logo"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://ui-avatars.com/api/?name=Job&background=eef2ff&color=4f46e5";
                      }}
                    />
                  </div>

                  <div className="col-md-7">
                    <h4 className="job-title">
                      {job?.title || "Job title not found"}
                    </h4>

                    <div className="meta">
                      🏢 {job?.company || "Company not added"}
                    </div>

                    <div className="meta">
                      📍 {job?.location || job?.city || "Location not added"}
                    </div>

                    <div className="mt-3">
                      <span className="applied-badge">
                        ✅ Applied
                      </span>
                    </div>
                  </div>

                  <div className="col-md-4 text-md-end">
                    <div className="date-box mb-3">
                      Applied On <br />
                      {new Date(app.appliedAt).toLocaleString()}
                    </div>

                    {job?.apply_link && (
                      <a
                        href={job.apply_link}
                        target="_blank"
                        rel="noreferrer"
                        className="open-btn"
                      >
                        Open Job Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApplicationTracking;