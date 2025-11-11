// src/pages/Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import indianOilLogo from "../assets/image/logos/indianOil-Logo.png";
import { loginApi } from "../components/ApiFunctions";
import { showAlert } from "../components/SweetAlert";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    loginApi(email, password)
      .then((res) => {
        if (res.success) {
          const accessToken = res.data?.data?.accessToken || null;
          const refreshToken = res.data?.data?.refreshToken || null;

          // ✅ Check for null/invalid tokens
          if (!accessToken || !refreshToken) {
            showAlert({
              type: "error",
              title: "Login Failed ❌",
              text: "Server returned invalid credentials. Please try again.",
            });
            return;
          }

          // ✅ Store tokens if valid
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("auth", "true");

          // ✅ Success message
          showAlert({
            type: "success",
            title: "Welcome 🎉",
            text: "Login successful",
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/");
        } else {
          // Invalid credentials
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
