// src/pages/Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import indianOilLogo from "../assets/image/logos/indianOil-Logo.png";
import { loginApi } from "../components/ApiFunctions";
import { showAlert } from "../components/SweetAlert";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();

  // ✅ Single state object for form fields
  const [form, setForm] = useState({
    email: "Employee001",
    password: "HK8_th6-",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ✅ Handle input change dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleLogin = (e) => {
  e.preventDefault();

  loginApi(form.email, form.password)
    .then((res) => {
      if (res.success) {
        const data = res.data?.data || {};
        const accessToken = data.accessToken || null;
        const refreshToken = data.refreshToken || null;
        const refreshTokenExpiry = data.refreshTokenExpiry || null;
        const decodedToken = jwtDecode(accessToken);
      
        if (!accessToken || !refreshToken) {
          showAlert({
            type: "error",
            title: "Login Failed ❌",
            text: "Server returned invalid credentials. Please try again.",
          });
          return;
        }

        // ✅ Convert expiry date string (UTC) to JS Date
        let refreshExpiryDate = null;
        if (refreshTokenExpiry) {
          refreshExpiryDate = new Date(refreshTokenExpiry); // e.g. "2025-11-12T17:23:46.4307038Z"
        }

        // ✅ Save access token cookie (short expiry — 1 day)
        Cookies.set("accessToken", accessToken, {
          expires: 1, // 1 day
          secure: true,
          sameSite: "Strict",
        });

        // ✅ Save refresh token cookie with real expiry from API
        if (refreshExpiryDate) {
          Cookies.set("refreshToken", refreshToken, {
            expires: refreshExpiryDate, // exact date from backend
            secure: true,
            sameSite: "Strict",
          });
        } else {
          // fallback if no expiry provided
          Cookies.set("refreshToken", refreshToken, {
            expires: 7, // 7 days default
            secure: true,
            sameSite: "Strict",
          });
        }

        // ✅ Optional: store simple flag
        Cookies.set("auth", "true", {
          expires: 1,
          sameSite: "Strict",
        });

        showAlert({
          type: "success",
          title: "Welcome 🎉",
          text: "Login successful",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/" , {state : decodedToken});
      } else {
        showAlert({
          type: "error",
          title: "Invalid Credentials ❌",
          text: res.message ?? "Wrong email or password",
        });
      }
    })
    .catch((err) => {
      console.error("❌ Error:", err);
      showAlert({
        type: "error",
        title: "Server Error 🚨",
        text: err.message ?? "Could not contact the server. Try again.",
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
              type="text"
              className="login-input"
              placeholder="Enter your Email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <i
              className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              style={{ cursor: "pointer", marginRight: "10px" }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* ✅ Forget Password */}
          <Link to="/forgetPassword" className="text-end text-dark fw-medium fs-13">
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
