import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP verified");
      navigate("/reset-password", { state: { email } });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h3>Verify OTP</h3>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          className="form-control my-3 text-center"
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="btn btn-success w-100">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtp;