import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const ContactUs = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setSending(true);
      setSent(false);

      const response = await axios.post(`${API}/api/contact/send`, {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      if (response.data.success) {
        setSent(true);

        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        setTimeout(() => {
          setSent(false);
        }, 5000);
      }
    } catch (error) {
      console.error(
        "CONTACT FORM ERROR:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Unable to send your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <style>{`

        * {
          box-sizing: border-box;
        }

        .contact-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 55px 20px 80px;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(99,102,241,0.22),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(14,165,233,0.20),
              transparent 28%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(124,58,237,0.16),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #eef4ff,
              #f8fbff 45%,
              #eef2ff
            );

          font-family: "Inter", sans-serif;
        }

        /* ======================================
           BACKGROUND GRID
        ====================================== */

        .contact-page::before {
          content: "";
          position: absolute;
          inset: 0;

          background-image:
            linear-gradient(
              rgba(99,102,241,0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(99,102,241,0.035) 1px,
              transparent 1px
            );

          background-size: 45px 45px;

          mask-image: linear-gradient(
            to bottom,
            black,
            transparent
          );

          pointer-events: none;
        }

        /* ======================================
           FLOATING BLOBS
        ====================================== */

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(3px);
          pointer-events: none;
        }

        .orb-one {
          width: 240px;
          height: 240px;
          top: 80px;
          left: -90px;

          background:
            radial-gradient(
              circle,
              rgba(99,102,241,0.32),
              rgba(99,102,241,0)
            );

          animation: floatOne 8s ease-in-out infinite;
        }

        .orb-two {
          width: 300px;
          height: 300px;
          right: -120px;
          top: 330px;

          background:
            radial-gradient(
              circle,
              rgba(14,165,233,0.28),
              rgba(14,165,233,0)
            );

          animation: floatTwo 10s ease-in-out infinite;
        }

        .orb-three {
          width: 190px;
          height: 190px;
          left: 42%;
          bottom: -80px;

          background:
            radial-gradient(
              circle,
              rgba(124,58,237,0.25),
              rgba(124,58,237,0)
            );

          animation: floatThree 7s ease-in-out infinite;
        }

        @keyframes floatOne {
          0%,100% {
            transform: translate(0,0) scale(1);
          }

          50% {
            transform: translate(80px,40px) scale(1.15);
          }
        }

        @keyframes floatTwo {
          0%,100% {
            transform: translate(0,0);
          }

          50% {
            transform: translate(-60px,-45px);
          }
        }

        @keyframes floatThree {
          0%,100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-60px);
          }
        }

        /* ======================================
           MAIN CONTAINER
        ====================================== */

        .contact-container {
          max-width: 1200px;
          margin: auto;
          position: relative;
          z-index: 2;
        }

        /* ======================================
           HERO
        ====================================== */

        .contact-hero {
          text-align: center;
          margin-bottom: 50px;

          animation:
            heroEnter 1s cubic-bezier(.17,.67,.25,1.2)
            both;
        }

        @keyframes heroEnter {
          from {
            opacity: 0;
            transform:
              translateY(-50px)
              scale(.94);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .contact-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 9px 18px;

          border-radius: 999px;

          background: rgba(255,255,255,0.7);

          border: 1px solid rgba(99,102,241,0.15);

          color: #4f46e5;

          font-size: 13px;
          font-weight: 800;

          box-shadow:
            0 8px 30px rgba(79,70,229,0.08);

          backdrop-filter: blur(12px);

          margin-bottom: 18px;

          animation: pillPulse 3s ease-in-out infinite;
        }

        @keyframes pillPulse {
          0%,100% {
            box-shadow:
              0 8px 30px rgba(79,70,229,0.08);
          }

          50% {
            box-shadow:
              0 8px 40px rgba(79,70,229,0.22);
          }
        }

        .contact-title {
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1;
          font-weight: 950;

          margin-bottom: 20px;

          letter-spacing: -3px;

          background:
            linear-gradient(
              90deg,
              #312e81,
              #4f46e5,
              #7c3aed,
              #0284c7,
              #312e81
            );

          background-size: 300% auto;

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          animation:
            gradientMove 5s linear infinite;
        }

        @keyframes gradientMove {
          to {
            background-position: 300% center;
          }
        }

        .contact-subtitle {
          max-width: 650px;
          margin: auto;

          color: #64748b;

          font-size: 17px;
          line-height: 1.8;
        }

        /* ======================================
           MAIN GRID
        ====================================== */

        .contact-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.4fr;
          gap: 28px;
          align-items: stretch;
        }

        /* ======================================
           GLASS CARD
        ====================================== */

        .contact-card {
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.90),
              rgba(255,255,255,0.68)
            );

          border: 1px solid rgba(255,255,255,0.85);

          border-radius: 30px;

          backdrop-filter: blur(20px);

          box-shadow:
            0 25px 70px rgba(15,23,42,0.08),
            inset 0 1px 0 rgba(255,255,255,0.9);

          overflow: hidden;

          animation:
            cardEnter .9s cubic-bezier(.17,.67,.25,1.2)
            both;
        }

        .info-card {
          animation-delay: .15s;
        }

        .form-card {
          animation-delay: .3s;
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform:
              translateY(50px)
              scale(.95);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        /* ======================================
           INFO SIDE
        ====================================== */

        .info-inner {
          padding: 34px;
        }

        .info-title {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .info-description {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 30px;
        }

        .info-item {
          display: flex;
          gap: 15px;
          align-items: center;

          padding: 15px;

          margin-bottom: 14px;

          border-radius: 19px;

          background:
            rgba(248,250,252,0.75);

          border: 1px solid #edf1f7;

          transition:
            transform .3s ease,
            box-shadow .3s ease,
            background .3s ease;
        }

        .info-item:hover {
          transform:
            translateX(8px)
            scale(1.02);

          background: white;

          box-shadow:
            0 14px 35px rgba(79,70,229,0.10);
        }

        .info-icon {
          width: 50px;
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 16px;

          color: white;

          font-size: 20px;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          box-shadow:
            0 10px 25px rgba(79,70,229,0.22);

          flex-shrink: 0;

          transition: transform .3s ease;
        }

        .info-item:hover .info-icon {
          transform:
            rotate(-8deg)
            scale(1.08);
        }

        .info-label {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .8px;
          color: #94a3b8;
          margin-bottom: 3px;
        }

        .info-value {
          font-weight: 700;
          color: #1e293b;
          word-break: break-word;
        }

        /* ======================================
           SOCIAL
        ====================================== */

        .social-row {
          display: flex;
          gap: 10px;
          margin-top: 28px;
        }

        .social-btn {
          width: 45px;
          height: 45px;

          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: white;

          border: 1px solid #e2e8f0;

          color: #475569;

          cursor: pointer;

          transition:
            transform .3s ease,
            background .3s ease,
            color .3s ease,
            box-shadow .3s ease;
        }

        .social-btn:hover {
          transform:
            translateY(-7px)
            rotate(-5deg);

          color: white;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          box-shadow:
            0 12px 25px rgba(79,70,229,0.25);
        }

        /* ======================================
           FORM
        ====================================== */

        .form-inner {
          padding: 38px;
        }

        .form-title {
          font-size: 28px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 7px;
        }

        .form-subtitle {
          color: #64748b;
          margin-bottom: 28px;
        }

        .field {
          margin-bottom: 19px;
        }

        .field label {
          display: block;
          font-size: 13px;
          font-weight: 800;
          color: #334155;
          margin-bottom: 8px;
        }

        .field input,
        .field textarea {
          width: 100%;

          border: 1px solid #e2e8f0;

          background: rgba(248,250,252,0.8);

          border-radius: 16px;

          padding: 14px 16px;

          outline: none;

          color: #0f172a;

          transition:
            border .25s ease,
            box-shadow .25s ease,
            background .25s ease,
            transform .25s ease;
        }

        .field input {
          height: 52px;
        }

        .field textarea {
          min-height: 145px;
          resize: vertical;
        }

        .field input:focus,
        .field textarea:focus {
          background: white;

          border-color: #6366f1;

          transform: translateY(-2px);

          box-shadow:
            0 0 0 4px rgba(99,102,241,0.10),
            0 12px 30px rgba(79,70,229,0.08);
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        /* ======================================
           SEND BUTTON
        ====================================== */

        .send-btn {
          width: 100%;
          height: 56px;

          border: none;

          border-radius: 17px;

          color: white;

          font-weight: 900;

          font-size: 15px;

          background:
            linear-gradient(
              90deg,
              #4f46e5,
              #7c3aed,
              #0ea5e9
            );

          background-size: 200% auto;

          cursor: pointer;

          box-shadow:
            0 15px 35px rgba(79,70,229,0.25);

          transition:
            transform .3s ease,
            box-shadow .3s ease;

          animation: buttonGradient 4s linear infinite;
        }

        @keyframes buttonGradient {
          to {
            background-position: 200% center;
          }
        }

        .send-btn:hover {
          transform:
            translateY(-4px)
            scale(1.01);

          box-shadow:
            0 20px 45px rgba(79,70,229,0.35);
        }

        .send-btn:active {
          transform: scale(.98);
        }

        .send-btn:disabled {
          opacity: .65;
          cursor: not-allowed;
          transform: none;
        }

        /* ======================================
           SUCCESS
        ====================================== */

        .success-box {
          margin-top: 18px;

          padding: 15px;

          border-radius: 16px;

          background: #ecfdf5;

          border: 1px solid #a7f3d0;

          color: #047857;

          font-weight: 700;

          animation:
            successPop .5s cubic-bezier(.17,.67,.25,1.4)
            both;
        }

        @keyframes successPop {
          from {
            opacity: 0;
            transform: scale(.8);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ======================================
           BOTTOM CTA
        ====================================== */

        .bottom-cta {
          margin-top: 30px;

          text-align: center;

          padding: 25px;

          border-radius: 24px;

          background:
            rgba(255,255,255,0.65);

          border: 1px solid rgba(255,255,255,0.8);

          backdrop-filter: blur(15px);

          animation:
            cardEnter 1s .45s
            both;
        }

        .back-btn {
          border: none;
          background: transparent;

          color: #4f46e5;

          font-weight: 800;

          cursor: pointer;

          transition: .25s ease;
        }

        .back-btn:hover {
          transform: translateX(-5px);
        }

        /* ======================================
           RESPONSIVE
        ====================================== */

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-title {
            letter-spacing: -2px;
          }
        }

        @media (max-width: 600px) {
          .contact-page {
            padding: 35px 14px 60px;
          }

          .hero-card {
            padding: 25px;
          }

          .contact-title {
            font-size: 44px;
          }

          .contact-subtitle {
            font-size: 15px;
          }

          .info-inner,
          .form-inner {
            padding: 24px;
          }

          .field-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

      `}</style>

      {/* Floating Background */}
      <div className="floating-orb orb-one"></div>
      <div className="floating-orb orb-two"></div>
      <div className="floating-orb orb-three"></div>

      <div className="contact-container">
        {/* HERO */}
        <section className="contact-hero">
          <div className="contact-pill">
            <i className="bi bi-stars"></i>
            WE'D LOVE TO HEAR FROM YOU
          </div>

          <h1 className="contact-title">Let's Talk.</h1>

          <p className="contact-subtitle">
            Have a question, suggestion, partnership idea, or need help with
            CareerSync? Drop us a message and our team will get back to you as
            soon as possible.
          </p>
        </section>

        {/* MAIN */}
        <div className="contact-grid">
          {/* LEFT */}
          <div className="contact-card info-card">
            <div className="info-inner">
              <h2 className="info-title">Get in touch</h2>

              <p className="info-description">
                We're here to help you build your career, discover opportunities
                and get the most out of CareerSync.
              </p>

              {/* EMAIL */}
              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-envelope-fill"></i>
                </div>

                <div>
                  <div className="info-label">Email</div>

                  <div className="info-value">support@careersync.com</div>
                </div>
              </div>

              {/* PHONE */}
              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-telephone-fill"></i>
                </div>

                <div>
                  <div className="info-label">Phone</div>

                  <div className="info-value">+91 98765 43210</div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>

                <div>
                  <div className="info-label">Location</div>

                  <div className="info-value">Kolkata, West Bengal</div>
                </div>
              </div>

              {/* HOURS */}
              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-clock-fill"></i>
                </div>

                <div>
                  <div className="info-label">Support Hours</div>

                  <div className="info-value">Mon – Fri · 10 AM – 6 PM</div>
                </div>
              </div>

              {/* SOCIAL */}
              <div className="social-row">
                <button className="social-btn">
                  <i className="bi bi-linkedin"></i>
                </button>

                <button className="social-btn">
                  <i className="bi bi-github"></i>
                </button>

                <button className="social-btn">
                  <i className="bi bi-instagram"></i>
                </button>

                <button className="social-btn">
                  <i className="bi bi-twitter-x"></i>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="contact-card form-card">
            <div className="form-inner">
              <h2 className="form-title">Send us a message</h2>

              <p className="form-subtitle">
                Fill in the details below and we'll get back to you.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="field-row">
                  <div className="field">
                    <label>Your Name</label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="field">
                    <label>Email Address</label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Subject</label>

                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                  />
                </div>

                <div className="field">
                  <label>Message</label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're thinking..."
                  />
                </div>

                <button type="submit" className="send-btn" disabled={sending}>
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <i className="bi bi-arrow-up-right ms-2"></i>
                    </>
                  )}
                </button>

                {sent && (
                  <div className="success-box">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom-cta">
          <p className="text-muted mb-2">Need to go back?</p>

          <button className="back-btn" onClick={() => navigate("/")}>
            <i className="bi bi-arrow-left me-2"></i>
            Back to CareerSync
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
