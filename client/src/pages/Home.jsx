import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import "../index.css";
import { Link } from "react-router-dom";
import { handleGoogleRedirect } from "../utils/auth";
import ChatbotWidget from "../components/ChatbotWidget";
import RecommendedJobs from "../components/RecommendedJobs";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const isLoggedIn = handleGoogleRedirect();

    if (isLoggedIn) {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/get-state?lat=${lat}&lng=${lng}`
            );

            const data = await response.json();
            setLocationData(data);
            setLoading(false);
          } catch (err) {
            setError("Failed to fetch location data " + err);
            setLoading(false);
          }
        },
        () => {
          setError("Location permission denied");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  };

  return (
    <div className="premium-home">
      <style>{`
        .premium-home {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 35%),
            radial-gradient(circle at top right, rgba(14,165,233,0.18), transparent 35%),
            linear-gradient(180deg, #f8fbff 0%, #eef4ff 45%, #ffffff 100%);
          overflow-x: hidden;
        }

        .premium-hero {
          position: relative;
          min-height: 640px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background:
            linear-gradient(120deg, rgba(2,6,23,0.86), rgba(15,23,42,0.72)),
            url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80");
          background-size: cover;
          background-position: center;
          color: #fff;
        }

        .premium-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(99,102,241,0.45), transparent 28%),
            radial-gradient(circle at 80% 30%, rgba(14,165,233,0.35), transparent 28%);
          z-index: 1;
        }

        .premium-hero::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 140px;
          background: linear-gradient(to top, #f8fbff, transparent);
          z-index: 2;
        }

        .premium-hero-inner {
          position: relative;
          z-index: 3;
          max-width: 1180px;
          width: 100%;
          margin: auto;
          padding: 80px 24px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 50px;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.22);
          backdrop-filter: blur(16px);
          color: #dbeafe;
          font-weight: 700;
          margin-bottom: 22px;
          box-shadow: 0 15px 45px rgba(0,0,0,0.18);
        }

        .premium-hero h1 {
          font-size: clamp(44px, 6vw, 78px);
          line-height: 1.02;
          letter-spacing: -2.5px;
          font-weight: 900;
          margin-bottom: 22px;
        }

        .premium-gradient-text {
          background: linear-gradient(90deg, #ffffff, #93c5fd, #c4b5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .premium-hero p {
          font-size: 18px;
          line-height: 1.8;
          color: #dbeafe;
          max-width: 650px;
          margin-bottom: 34px;
        }

        .premium-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
        }

        .premium-btn-primary {
          border: none;
          padding: 15px 28px;
          border-radius: 999px;
          color: #fff;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          box-shadow: 0 18px 45px rgba(14,165,233,0.35);
          transition: 0.25s ease;
        }

        .premium-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 60px rgba(14,165,233,0.48);
        }

        .premium-btn-secondary {
          border: 1px solid rgba(255,255,255,0.25);
          padding: 14px 26px;
          border-radius: 999px;
          color: #fff;
          font-weight: 800;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(16px);
          transition: 0.25s ease;
        }

        .premium-btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-3px);
        }

        .hero-orbit {
          position: relative;
          min-height: 440px;
        }

        .glass-dashboard {
          position: relative;
          z-index: 5;
          padding: 24px;
          border-radius: 34px;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.24);
          backdrop-filter: blur(24px);
          box-shadow: 0 35px 90px rgba(0,0,0,0.35);
          transform: rotate(1.5deg);
        }

        .dash-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .dash-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 8px rgba(34,197,94,0.16);
        }

        .dash-card {
          background: rgba(255,255,255,0.92);
          color: #0f172a;
          border-radius: 24px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.16);
        }

        .match-line {
          height: 10px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
          margin-top: 12px;
        }

        .match-fill {
          height: 100%;
          width: 86%;
          border-radius: 999px;
          background: linear-gradient(90deg, #6366f1, #0ea5e9);
        }

        .floating-card {
          position: absolute;
          z-index: 6;
          border-radius: 24px;
          padding: 18px;
          background: rgba(255,255,255,0.92);
          color: #0f172a;
          box-shadow: 0 24px 60px rgba(0,0,0,0.24);
          animation: float 4s ease-in-out infinite;
        }

        .float-one {
          top: 0;
          right: 0;
        }

        .float-two {
          bottom: 15px;
          left: -10px;
          animation-delay: 1.2s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        .premium-stats {
          position: relative;
          z-index: 5;
          max-width: 1120px;
          margin: -72px auto 0;
          padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .stat-card {
          border-radius: 26px;
          padding: 24px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226,232,240,0.75);
          box-shadow: 0 22px 60px rgba(15,23,42,0.09);
        }

        .stat-card h3 {
          font-size: 34px;
          font-weight: 900;
          margin: 0;
          background: linear-gradient(135deg, #0f172a, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-card p {
          color: #64748b;
          margin: 6px 0 0;
          font-weight: 600;
        }

        .premium-section {
          padding: 80px 20px 35px;
        }

        .premium-container {
          max-width: 1120px;
          margin: auto;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: end;
          margin-bottom: 28px;
        }

        .section-heading h2 {
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -1px;
          color: #0f172a;
          margin: 0;
        }

        .section-heading p {
          color: #64748b;
          margin: 8px 0 0;
        }

        .premium-recommend-box {
          border-radius: 34px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 28px 80px rgba(15,23,42,0.08);
          overflow: hidden;
        }

        .feature-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 34px;
        }

        .feature-card {
          padding: 24px;
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,250,252,0.92));
          border: 1px solid rgba(226,232,240,0.85);
          box-shadow: 0 18px 50px rgba(15,23,42,0.07);
          transition: 0.25s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 70px rgba(15,23,42,0.12);
        }

        .feature-icon {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 23px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          box-shadow: 0 18px 40px rgba(99,102,241,0.28);
        }

        .feature-card h5 {
          font-weight: 900;
          margin-bottom: 8px;
          color: #0f172a;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        .job-premium-section {
          padding: 65px 20px 90px;
        }

        .job-premium-container {
          max-width: 1120px;
          margin: auto;
          border-radius: 34px;
          padding: 34px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.92));
          border: 1px solid rgba(226,232,240,0.85);
          box-shadow: 0 28px 80px rgba(15,23,42,0.08);
        }

        .job-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 22px;
        }

        .loader-premium,
        .error-premium,
        .empty-premium {
          padding: 38px;
          text-align: center;
          border-radius: 24px;
          background: #f8fafc;
          color: #64748b;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .premium-hero-inner {
            grid-template-columns: 1fr;
          }

          .hero-orbit {
            display: none;
          }

          .premium-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .feature-strip {
            grid-template-columns: 1fr;
          }

          .section-heading {
            display: block;
          }
        }

        @media (max-width: 560px) {
          .premium-hero {
            min-height: 560px;
          }

          .premium-stats {
            grid-template-columns: 1fr;
          }

          .premium-hero h1 {
            font-size: 42px;
          }
        }
      `}</style>

      <header className="premium-hero">
        <div className="premium-hero-inner">
          <div>
            <div className="hero-badge">
              <i className="bi bi-stars"></i>
              AI Powered Career Intelligence
            </div>

            <h1>
              Find your dream career with{" "}
              <span className="premium-gradient-text">CareerSync</span>
            </h1>

            <p>
              Discover jobs matched with your skills, profile strength, search
              history and career goals. A smarter way to move from profile to
              opportunity.
            </p>

            <div className="premium-actions">
              <Link to="/feed">
                <button className="premium-btn-primary">
                  Explore Opportunities
                </button>
              </Link>

              <Link to="/about">
                <button className="premium-btn-secondary">
                  About Us
                </button>
              </Link>
            </div>
          </div>

          <div className="hero-orbit">
            <div className="floating-card float-one">
              <strong>92% Match</strong>
              <div className="text-muted small">MERN Stack Developer</div>
            </div>

            <div className="floating-card float-two">
              <strong>Live Recommendations</strong>
              <div className="text-muted small">Based on your profile skills</div>
            </div>

            <div className="glass-dashboard">
              <div className="dash-top">
                <strong>CareerSync AI Dashboard</strong>
                <span className="dash-dot"></span>
              </div>

              <div className="dash-card">
                <small className="text-muted">Recommended Role</small>
                <h5 className="fw-bold mb-1">Full Stack Developer</h5>
                <div className="match-line">
                  <div className="match-fill"></div>
                </div>
              </div>

              <div className="dash-card">
                <small className="text-muted">Matched Skills</small>
                <div className="d-flex gap-2 flex-wrap mt-2">
                  <span className="badge bg-primary">React</span>
                  <span className="badge bg-info">Node.js</span>
                  <span className="badge bg-success">MongoDB</span>
                </div>
              </div>

              <div className="dash-card">
                <small className="text-muted">Career Insight</small>
                <h6 className="fw-bold mb-0">
                  Your profile is ready for 18 new roles.
                </h6>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="premium-stats">
        <div className="stat-card">
          <h3>20K+</h3>
          <p>Jobs analyzed</p>
        </div>
        <div className="stat-card">
          <h3>95%</h3>
          <p>Skill matching logic</p>
        </div>
        <div className="stat-card">
          <h3>24/7</h3>
          <p>Smart discovery</p>
        </div>
        <div className="stat-card">
          <h3>AI</h3>
          <p>Profile based ranking</p>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container">
          <div className="section-heading">
            <div>
              <h2>Recommended jobs, made personal</h2>
              <p>
                Jobs are ranked using your profile skills and your searched job
                dataset.
              </p>
            </div>
          </div>

          <div className="premium-recommend-box">
            <RecommendedJobs />
          </div>

          <div className="feature-strip">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-bullseye"></i>
              </div>
              <h5>Skill-based matching</h5>
              <p>
                Your saved profile skills are compared with job title,
                description, company and job metadata.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <h5>Ranking score</h5>
              <p>
                Each job gets a match percentage so users can quickly identify
                better opportunities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-lightning-charge"></i>
              </div>
              <h5>Search-powered data</h5>
              <p>
                Jobs searched by users are saved as a dataset and reused for
                better recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="job-premium-section">
        <div className="job-premium-container">
          <div className="section-heading">
            <div>
              <h2>Explore jobs near you</h2>
              <p>
                Location-aware opportunities and curated job cards for quick
                apply.
              </p>
            </div>

            {locationData?.state && (
              <span className="badge rounded-pill bg-primary px-3 py-2">
                <i className="bi bi-geo-alt me-1"></i>
                {locationData.state}
              </span>
            )}
          </div>

          {loading && (
            <div className="loader-premium">
              Loading jobs and location data...
            </div>
          )}

          {error && <div className="error-premium">{error}</div>}

          {!loading && !error && jobs.length === 0 && (
            <div className="empty-premium">
              No local jobs loaded yet. Search jobs to build your recommendation
              dataset.
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="job-grid-premium">
              {jobs.map((job) => (
                <JobCard key={job.id || job._id || job.job_id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
      <ChatbotWidget />
    </div>
  );
}