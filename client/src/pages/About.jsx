import React from "react";

const About = () => {
  const features = [
    {
      icon: "🎯",
      title: "Precision Job Matching",
      desc: "AI recommends the most relevant roles based on your skills and career goals.",
    },
    {
      icon: "📈",
      title: "Skill Gap Insights",
      desc: "Find missing skills and get recommendations to improve faster.",
    },
    {
      icon: "⚡",
      title: "Fast Career Growth",
      desc: "Save time with smarter applications and instant recommendations.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#f8fafc" }}>
      {/* Hero Section */}
      <section
        className="d-flex align-items-center text-center text-white"
        style={{
          minHeight: "75vh",
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.75), rgba(79,70,229,0.55)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <span className="badge bg-light text-dark px-3 py-2 rounded-pill mb-3 fs-6">
            About CareerSync
          </span>

          <h1 className="display-3 fw-bold">
            Your Smart Partner for{" "}
            <span className="text-info">Career Success</span>
          </h1>

          <p className="lead mt-3 mx-auto" style={{ maxWidth: "700px" }}>
            CareerSync helps job seekers discover the right opportunities with
            AI-powered job matching, skill analysis, and faster hiring support.
          </p>

          <button className="btn btn-primary btn-lg rounded-pill mt-3 px-4 shadow">
            Explore Opportunities
          </button>
        </div>
      </section>

      {/* Mission */}
      <section className="container py-5">
        <div className="row align-items-center g-4">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">Our Mission</h2>
            <p className="text-muted fs-5">
              We simplify career growth by connecting talented people with the
              best opportunities using intelligent recommendation systems.
            </p>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-lg rounded-4 p-4">
              <div className="row text-center g-3">
                <div className="col-6">
                  <h3 className="fw-bold text-primary">10K+</h3>
                  <p className="mb-0">Matches</p>
                </div>
                <div className="col-6">
                  <h3 className="fw-bold text-primary">95%</h3>
                  <p className="mb-0">Accuracy</p>
                </div>
                <div className="col-6">
                  <h3 className="fw-bold text-primary">5K+</h3>
                  <p className="mb-0">Users</p>
                </div>
                <div className="col-6">
                  <h3 className="fw-bold text-primary">24/7</h3>
                  <p className="mb-0">AI Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose CareerSync</h2>
          <p className="text-muted">Designed for modern job seekers</p>
        </div>

        <div className="row g-4">
          {features.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="card h-100 border-0 shadow rounded-4 p-4 text-center">
                <div style={{ fontSize: "42px" }}>{item.icon}</div>
                <h4 className="fw-bold mt-3">{item.title}</h4>
                <p className="text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;