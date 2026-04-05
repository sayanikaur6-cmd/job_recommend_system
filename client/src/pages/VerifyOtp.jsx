import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);

    // auto move to next box
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // move to previous box on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp: finalOtp,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      navigate("/reset-password", {
        state: { email, otp: finalOtp },
      });
    } else {
      alert(data.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    setTimer(60);
    setOtp(["", "", "", "", "", ""]);

    // focus first box after resend
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    alert("OTP resent");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg,#6a5acd,#4e73df)",
      }}
    >
      <div
        className="card p-4 shadow"
        style={{
          width: "450px",
          borderRadius: "18px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="m-0">Verify OTP</h3>
          <small className="text-danger">{timer}s</small>
        </div>

        <div className="d-flex justify-content-between my-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="form-control text-center"
              style={{
                width: "55px",
                height: "55px",
                fontSize: "24px",
              }}
            />
          ))}
        </div>

        <button className="btn btn-primary w-100" onClick={handleVerify}>
          Verify
        </button>

        {timer === 0 && (
          <button className="btn btn-link mt-3" onClick={handleResend}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;