import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import "../index.css"; // ensure CSS import

export default function Home() {

  const [jobs, setJobs] = useState([]);
const [locationData, setLocationData] = useState(null);
useEffect(() => {
  getLocation();
}, []);
  // Demo job data (later backend theke ashbe)
 useEffect(() => {
  if (locationData?.state) {
    fetchJobs(locationData.state);
  }
}, [locationData]);
const fetchJobs = async (state) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/jobs/location?state=${state}`
    );

    const data = await response.json();

    // mapping (API data → UI format)
    const formattedJobs = data.map((job, index) => ({
      id: index,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country,
      applyLink: job.apply_options?.[0]?.apply_link || "#"
    }));

    setJobs(formattedJobs);

  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

  const [error, setError] = useState("");

 

  const getLocation = () => {
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
            console.log('state is :' +data.state)

          } catch (err) {
            setError("Failed to fetch location data");
          }

        },
        () => {
          setError("Location permission denied");
        }
      );

    } else {
      setError("Geolocation not supported");
    }
  };
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h2>Find your dream career</h2>
          <p>Our AI based system will help you find the right job.</p>
          <button className="btn-about">About Us</button>
        </div>
      </header>

      {/* Job Section */}
      <section className="job-container">
        <h2 className="section-title">Get Jobs</h2>
        <div className="job-grid">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </>
  );
}