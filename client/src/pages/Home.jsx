import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import "../index.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // initially true
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");

  // Get user location
  useEffect(() => {
    getLocation();
  }, []);

  // Fetch jobs after location is ready
  useEffect(() => {
    if (locationData?.state) {
      fetchJobs(locationData.state);
    }
  }, [locationData]);

  const fetchJobs = async (state) => {
    try {
      setLoading(true); // start loader
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/location?state=${state}`
      );
      const data = await response.json();

      const formattedJobs = data.map((job, index) => ({
        id: index,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city || job.job_country,
        applyLink: job.apply_options?.[0]?.apply_link || "#",
      }));

      setJobs(formattedJobs);
      setLoading(false); // stop loader
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs");
      setLoading(false);
    }
  };

  const getLocation = () => {
    setLoading(true); // start loader during location fetch
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
          } catch (err) {
            setError("Failed to fetch location data");
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
    <>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h2>Find your dream career</h2>
          <p>Our AI based system will help you find the right job.</p>
          <div className="nav-empty">
            <Link to="/about">
              <button className="btn-about">About Us</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Job Section */}
      <section className="job-container">
        <h2 className="section-title">Get Jobs</h2>

        {/* Loader */}
        {loading && (
          <div className="loader">
            <p>Loading jobs...</p>
          </div>
        )}

        {/* Error message */}
        {error && <p className="error">{error}</p>}

        {/* Job cards */}
        {!loading && !error && (
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}