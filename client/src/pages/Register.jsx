import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* LEFT SIDE */}
        <div
          className="col-md-6 d-none d-md-flex flex-column justify-content-center text-white p-5"
          style={{
            background: "linear-gradient(135deg, #4e73df, #224abe)",
          }}
        >
          <h2 className="fw-bold mb-4">Mourisho</h2>

          <div className="mb-4">
            <div className="bg-white bg-opacity-25 p-3 rounded mb-3 backdrop-blur shadow">
              🚀 Build your career profile
            </div>
            <div className="bg-white bg-opacity-25 p-3 rounded mb-3 backdrop-blur shadow">
              🔔 Get personalized job alerts
            </div>
            <div className="bg-white bg-opacity-25 p-3 rounded shadow">
              📊 Track your applications easily
            </div>
          </div>

          <h4 className="fw-light mt-5">
            Start something amazing <br />
            <span className="fw-bold">today 🚀</span>
          </h4>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">

          <div
            className="p-4 shadow-lg"
            style={{
              width: "400px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <h3 className="text-center mb-4 fw-bold">
              Create Account ✨
            </h3>

            <form>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control rounded-pill"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control rounded-start-pill"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-end-pill"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  placeholder="Confirm password"
                />
              </div>

              {/* Button */}
              <button
                className="btn w-100 mb-3"
                style={{
                  background: "linear-gradient(135deg, #4e73df, #224abe)",
                  color: "#fff",
                  borderRadius: "30px",
                  fontWeight: "600",
                }}
              >
                Sign Up
              </button>

              <p className="text-center small">
                Already have an account?{" "}
                <span
                  className="text-primary fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}  // 🔥 back to login
                >
                  Sign In
                </span>
              </p>

              <hr />

              {/* Social */}
              <button className="btn btn-light border w-100 mb-2 rounded-pill">
                🔵 Sign up with Google
              </button>

              <button className="btn btn-light border w-100 rounded-pill">
                💼 Sign up with LinkedIn
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;