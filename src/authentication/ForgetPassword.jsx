import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import indianOilLogo from "../assets/image/logos/indianOil-Logo.png";
import Swal from "sweetalert2";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // Handle timer countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setTimer(30); // start 30 seconds countdown
    // API call for resend OTP
    console.log("OTP resent to:", email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔑 Dummy OTP check (replace with API)
    const validOtp = "1234"; 

    if (otp === validOtp) {
      Swal.fire({
        icon: "success",
        title: "OTP Verified 🎉",
        text: "Redirecting to Home...",
        showConfirmButton: false,
        timer: 2000,
        background: "#f0fff4",
        color: "#155724",
        iconColor: "#28a745",
      });

      // save user login state (optional)
      localStorage.setItem("auth", true);

      // redirect after delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP ❌",
        text: "Please try again",
        showConfirmButton: false,
        timer: 2000,
        background: "#fff5f5",
        color: "#721c24",
        iconColor: "#dc3545",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row auth-page">
        <form className="login-form mx-lg-0 mx-md-0 mx-5" onSubmit={handleSubmit}>
          {/* Logo */}
          <div className="text-center mb-3">
            <img
              src={indianOilLogo}
              alt="Indian Oil Logo"
              className="px-3"
              style={{ maxHeight: "70px" }}
            />
          </div>

          {/* Email */}
          <div className="login-flex-column">
            <label>Email</label>
          </div>
          <div className="login-inputForm">
            <i className="fa fa-envelope"></i>
            <input
              placeholder="Enter your Email"
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* OTP */}
          <div className="login-flex-column">
            <label>OTP</label>
          </div>
          <div className="login-inputForm d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center w-100">
              <i className="fa fa-key"></i>
              <input
                placeholder="Enter OTP"
                className="login-input"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            {/* Resend as span */}
          
          </div>
  <span
              onClick={handleResend}
              className="text-end text-dark fw-medium fs-13 ms-2"
              style={{ cursor: timer > 0 ? "not-allowed" : "pointer", opacity: timer > 0 ? 0.5 : 1 }}
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </span>
          {/* Login button */}
          <button type="submit" className="login-button-submit my-0">
            Login
          </button>

          {/* Back to Login Link */}
          <div className="text-center ">
            <Link to="/login" className="text-dark fw-medium fs-13">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
