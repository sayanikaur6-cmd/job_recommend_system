import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password updated successfully");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg,#6a5acd,#4e73df)" }}>
      <div className="card p-4 shadow" style={{ width: "420px", borderRadius: "18px" }}>
        <h3 className="fw-bold mb-3">Reset Password</h3>
        <form onSubmit={handleReset}>
          <input
            type="password"
            className="form-control my-3"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="form-control my-3"
            placeholder="Confirm Password"
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button className="btn btn-primary w-100">Save Password </button> 
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
