import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import "../index.css"; // ensure CSS import
import { Link } from "react-router-dom";

export default function Home() {
  const [jobs, setJobs] = useState([]);

  // Demo job data (later backend theke ashbe)
  useEffect(() => {
    const demoJobs = [
      {
        id: 1,
        title: "Software Engineer",
        company: "Google",
        location: "Remote",
      },
      {
        id: 2,
        title: "Product Designer",
        company: "Apple",
        location: "Dhaka, BD",
      },
      { id: 3, title: "Frontend Developer", company: "Meta", location: "USA" },
      {
        id: 4,
        title: "Data Scientist",
        company: "Amazon",
        location: "Bangalore, IN",
      },
      { id: 5, title: "UI/UX Specialist", company: "Netflix", location: "UK" },
      {
        id: 6,
        title: "Mobile App Dev",
        company: "Samsung",
        location: "Remote",
      },
      {
        id: 7,
        title: "Cybersecurity Analyst",
        company: "Microsoft",
        location: "USA",
      },
      {
        id: 8,
        title: "Marketing Manager",
        company: "Coca-Cola",
        location: "Dhaka, BD",
      },
      {
        id: 9,
        title: "Cloud Architect",
        company: "Oracle",
        location: "Remote",
      },
      {
        id: 10,
        title: "Project Manager",
        company: "Adobe",
        location: "California",
      },
    ];

    setJobs(demoJobs);
    getLocation();
  }, []);
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/get-state?lat=${lat}&lng=${lng}`,
            );

            const data = await response.json();
            setLocationData(data);
            console.log("state is :" + data.state);
          } catch (err) {
            setError("Failed to fetch location data");
          }
        },
        () => {
          setError("Location permission denied");
        },
      );
    } else {
      setError("Geolocation not supported");
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
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </>
  );
}
