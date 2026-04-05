import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP sent to email");
      navigate("/verify-otp", { state: { email } });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h3>Forgot Password</h3>
      <form onSubmit={handleSendOtp}>
        <input
          type="email"
          className="form-control my-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary w-100">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;