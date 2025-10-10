import React, { useState } from "react";
import indianOilLogo from "../assets/image/logos/indianOil-Logo.png";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Encryption } from "./Encryption"; // your encryption logic
import { apiBaseUrl } from "../Helper";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Encrypt credentials
      const encryptedEmail = Encryption(email);
      const encryptedPassword = Encryption(password);

      const payload = {
        username: encryptedEmail,
        password: encryptedPassword,
      };

      console.log("🚀 API Endpoint:", apiBaseUrl("/Auth/Login"));
      console.log("📦 Payload:", payload);

      const response = await axios.post(apiBaseUrl("/Auth/Login"), payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ API Response:", response.data);

      if (response.data.success) {
        localStorage.setItem("auth", "true");

        Swal.fire({
          icon: "success",
          title: "Welcome 🎉",
          text: "You have successfully logged in!",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => navigate("/"), 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops ❌",
          text: response.data.message || "Invalid email or password",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error 🚨",
        text: error.response?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row auth-page">
        <form
          className="login-form mx-lg-0 mx-md-0 mx-5"
          onSubmit={handleLogin}
        >
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

          {/* Password */}
          <div className="login-flex-column">
            <label>Password</label>
          </div>
          <div className="login-inputForm">
            <i className="fa fa-lock"></i>
            <input
              placeholder="Enter your Password"
              className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fa ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } password-eye`}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer", marginRight: "10px" }}
            ></i>
          </div>

          <Link
            to={"/forgetPassword"}
            className="text-end text-dark fw-medium fs-13"
          >
            Forget Password?
          </Link>

          <button type="submit" className="login-button-submit mt-0">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
