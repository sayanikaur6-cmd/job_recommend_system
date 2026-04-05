import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 login page theke email auto-fill
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return alert("Please enter your email");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP sent successfully");
        navigate("/verify-otp", {
          state: { email },
        });
      } else {
        alert(data.message || "Email not found");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #6c63ff, #4e73df)",
      }}
    >
      <div
        className="bg-white shadow p-4"
        style={{
          width: "420px",
          borderRadius: "20px",
        }}
      >
        {/* Back */}
        <p
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </p>

        <h1 className="fw-bold mb-3">Forgot Password?</h1>
        <p className="text-muted mb-4">
          Enter your email to reset password
        </p>

        <form onSubmit={handleNext}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              height: "48px",
              borderRadius: "10px",
            }}
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            style={{
              height: "48px",
              borderRadius: "10px",
            }}
          >
            {loading ? "Sending..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;