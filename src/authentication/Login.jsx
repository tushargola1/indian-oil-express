import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import indianOilLogo from '../assets/image/logos/indianOil-Logo.png';
import { loginApi } from '../components/ApiFunctions';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
localStorage.setItem("accessToken", "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiRW1wbG95ZWUwMDEiLCJ1aWQiOiI4NTIyYWFkZS1kN2E4LTQ5MjctYTJjOS03YzkxYjY3YjgwMzQiLCJlbWwiOiJkaGFybWttcjkwQGdtYWlsLmNvbSIsInBobiI6Ijk5OTAwMzAwMDQiLCJpbWciOiJkZWZhdWx0X3VzZXIxMDAucG5nIiwiY2huIjoiTiIsImp0aSI6IjE2YzQ4MGRkLTk2MGQtNDUzYy04NmE2LWEyYTU2ZTgyZDdjZCIsImlhdCI6MTc2MjIzNTQ5NywiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiRW1wbG95ZWUiLCJwZXIiOiJ7XCJDYW5WaWV3XCI6dHJ1ZSxcIkNhbkNyZWF0ZVwiOmZhbHNlLFwiQ2FuRWRpdFwiOmZhbHNlLFwiQ2FuRGVsZXRlXCI6ZmFsc2UsXCJDaGFuZ2VQYXNzd29yZE90cFwiOmZhbHNlfSIsIm5hbSI6IlRlc3RVc2VyIiwibmJmIjoxNzYyMjM1NDk2LCJleHAiOjE3NjIyMzcyOTYsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0MzA3L2FwaSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0MzA3L2FkbWluLGh0dHBzOi8vbG9jYWxob3N0OjQ0MzA3In0.PD825fDbF4g2oYv3olQGdNClomY9PRvJ668yjbe9f5YnX367_blyqir8DsIXcQrwEJV88kcq8ULERu-XNxLKdQ");
localStorage.setItem("refreshToken", "9d5008c1-29d6-43d6-8987-b8244397b9a8");
localStorage.setItem("auth", "true");

    loginApi(email, password) 
  .then((res) => {
    console.log('✅ Login Response:', res.data);

    if (res.data.isSuccess) {
      Swal.fire({
        icon: 'success',
        title: 'Welcome 🎉',
        text: 'Login successful',
        timer: 1500,
        showConfirmButton: false,
      });

      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
      localStorage.setItem("auth", "true");

      navigate('/');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Credentials ❌',
        text: res.data.message ?? 'Wrong email or password',
      });
    }
  })

      .catch((err) => {
        console.error('❌ Error:', err);

        Swal.fire({
          icon: 'error',
          title: 'Server Error 🚨',
          text:
            err.response?.data?.message ??
            'Could not contact the server. Try again.',
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
              style={{ maxHeight: '70px' }}
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
              type={showPassword ? 'text' : 'password'}
              className="login-input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              style={{ cursor: 'pointer', marginRight: '10px' }}
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
