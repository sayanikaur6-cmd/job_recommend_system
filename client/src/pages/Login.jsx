import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save token
        localStorage.setItem("token", data.token);

        // 🔥 LOGIN STATE TRUE
        setIsLoggedIn(true);

        alert("Login successful");

        // redirect to home
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

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
          <h3 className="mb-4 fw-bold">Mourisho</h3>

          <div className="mb-4">
            <div className="bg-white text-dark p-3 rounded mb-3 shadow-sm">
              🔔 46 Jobs applied
            </div>
            <div className="bg-white text-dark p-3 rounded mb-3 shadow-sm">
              📩 Job alert
            </div>
            <div className="bg-white text-dark p-3 rounded shadow-sm">
              👁️ 12 Reviewed
            </div>
          </div>

          <h4 className="fw-light mt-5">
            Reach the peak of <br />
            <span className="fw-bold">your career!</span>
          </h4>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <div
            className="card shadow border-0 p-4"
            style={{ width: "380px", borderRadius: "15px" }}
          >
            <h4 className="text-center mb-4 fw-bold">
              Candidate Sign In
            </h4>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Username or email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="form-label">Password</label>
                  <small
  className="text-primary"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/forgot-password")}  // 🔥 ADD THIS
>
  Forgot password?
</small>
                </div>

                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Button */}
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Sign In
              </button>

              {/* Go to Register */}
              <p className="text-center small">
                Don't have an account?{" "}
                <span
                  className="text-primary fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </span>
              </p>

              <hr />

              {/* Social Login */}
              <button type="button" className="btn btn-light border w-100 mb-2" onClick={() => {
                window.open("http://localhost:5000/api/auth/google", "_self");
              }}>
                🔵 Sign in with Google
              </button>

              <button type="button" className="btn btn-light border w-100">
                💼 Sign in with LinkedIn
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;