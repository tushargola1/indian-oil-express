import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import indianOilLogo from "../assets/image/logos/indianOil-Logo.png";
import { apiBaseUrl } from "../Helper";
import { Encryption } from "./Encryption";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ RAW STRING BODY (not normal JSON)
    const rawBody = JSON.stringify({
      username: Encryption(email),
      password: Encryption(password),
    });

    axios
      .post(apiBaseUrl("Auth/SapLogin"), rawBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("✅ Login Response:", res.data);

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Welcome 🎉",
            text: "Login successful",
            timer: 1500,
            showConfirmButton: false,
          });

          localStorage.setItem("auth", "true");
          navigate("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid Credentials ❌",
            text: res.data.message ?? "Wrong email or password",
          });
        }
      })
      .catch((err) => {
        console.error("❌ Error:", err);

        Swal.fire({
          icon: "error",
          title: "Server Error 🚨",
          text:
            err.response?.data?.message ??
            "Could not contact the server. Try again.",
        });
      });
  };

  return (
    <div className="container-fluid">
      <div className="row auth-page">
        <form className="login-form mx-lg-0 mx-md-0 mx-5" onSubmit={handleLogin}>
          
          {/* ✅ Logo */}
          <div className="text-center mb-3">
            <img
              src={indianOilLogo}
              alt="Indian Oil Logo"
              className="px-3"
              style={{ maxHeight: "70px" }}
            />
          </div>

          {/* ✅ Email */}
          <label>Email</label>
          <div className="login-inputForm">
            <i className="fa fa-envelope"></i>
            <input
              type="email"
              className="login-input"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* ✅ Password */}
          <label>Password</label>
          <div className="login-inputForm">
            <i className="fa fa-lock"></i>
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* ✅ Show/Hide Password */}
            <i
              className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              style={{ cursor: "pointer", marginRight: "10px" }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* ✅ Forget Password */}
          <Link
            to="/forgetPassword"
            className="text-end text-dark fw-medium fs-13"
          >
            Forget Password?
          </Link>

          {/* ✅ Submit */}
          <button type="submit" className="login-button-submit mt-0">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
