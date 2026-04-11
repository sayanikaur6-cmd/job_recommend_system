import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      headers: {
        "Content-Type": "application/json",
      },
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
    <div className="container mt-5 text-center">
      <h3>Reset Password</h3>
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="form-control my-2"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="form-control my-2"
          placeholder="Confirm password"
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button className="btn btn-danger w-100">Save Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
