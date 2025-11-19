import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import indianOilLogo from "../assets/image/logos/indianOil-Logo.png";
import sprintLogo from "../assets/image/logos/sprint-logo.png";
import indianOil from "../assets/image/logos/indianOil.png";
import { useEffect, useRef, useState } from "react";
import CalendarModal from "../modal/CalendarModal";
import Cookies from "js-cookie";
export default function Header() {
  const navigate = useNavigate();
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [issticky, setIsSticky] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const locationMenuRef = useRef(null);

  const toggleLocationMenu = () => {
    setShowLocationMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationMenuRef.current &&
        !locationMenuRef.current.contains(event.target)
      ) {
        setShowLocationMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
localStorage.clear()
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout",
      background: "#fffef5",
      color: "#000",
      customClass: {
        popup: "rounded-4 shadow",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        Cookies.remove("auth", { path: "/" });

        Swal.fire({
          icon: "success",
          title: "Logged out!",
          text: "You have been successfully logged out.",
          showConfirmButton: false,
          timer: 1500,
          background: "#f0fff4",
          color: "#155724",
          iconColor: "#28a745",
          customClass: {
            popup: "rounded-4 shadow-lg",
          },
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`border-bottom shadow-sm  `}>
      {/* Top Row */}
      <div className="container-fluid  ">
        {/* <div className="row align-items-center  py-2 px-lg-5 px-md-3 px-3"> */}
        <div className="row align-items-center  py-2 top-nav-header ">
          {/* Left Logo */}
          <div className={`col-md-2 col-lg-3 col-6 right-logo-area  ps-0`}>
            <div className={`hh`}>
              <Link to='/'>
                <img
                  src={indianOil}
                  alt="Indian Oil"
                  className="indianOil-logo d-xl-block d-md-block d-none"
                />
              </Link>
              <Link to='/'>
                <img
                  src={sprintLogo}
                  alt="Indian Oil"
                  className="sprint-logo   d-xl-none d-md-none d-block"
                />
              </Link>
            </div>
          </div>

          {/* Center Logo */}
          <div className="col-md-6">
            <div className={`center-logo  `}>
              <img src={indianOilLogo} alt="Indian Oil Logo" className="px-3" />
            </div>
          </div>

          {/* Right Links + Social */}
          <div className="col-md-4 col-lg-3 col-6">
            <div className="right-content d-none d-md-block d-lg-block right-nav">
              <div className="d-flex  align-items-center gap-3 justify-content-end">
                <div className=" top-content-navbar d-flex justify-content-start">
                  <Link
                    to="/"
                    className="text-dark text-decoration-none me-3  fw-600"
                  >
                    Home
                  </Link>
                  {/* | */}
                  <a
                    href=""
                    className="text-dark text-decoration-none mx-2  fw-600"
                  >
                    Sitemap
                  </a>
                  {/* | */}
                  <button
                    onClick={handleLogout}
                    className="text-dark text-decoration-none ms-3 fw-600 bg-transparent border-0"
                  >
                    Logout
                  </button>
                  {/* <a
                  href=""
                  className=" text-decoration-none ms-4  fw-600"
                >
                 <i className="fa fa-bars dark-blue-color"></i>
                </a> */}
                </div>
                <div className="location-wrapper " ref={locationMenuRef}  >
                  <div className="share-btn" onClick={toggleLocationMenu}>
                    <i
                      className={`fa ${showLocationMenu ? "fa-times" : "fa-bars"
                        } dark-blue-color fs-4`}
                    ></i>
                  </div>

                  <div
                    className={`wrapper ${showLocationMenu ? "visible" : ""}`}
                  >
                    <div className="button">
                      <div className="icon">
                        <i className="fa-brands fa-instagram"></i>
                      </div>
                    </div>

                    <div className="button">
                      <div className="icon">
                        <i className="fa-brands fa-facebook"></i>
                      </div>
                    </div>

                    <div className="button">
                      <div className="icon">
                        <i className="fa-brands fa-twitter"></i>
                      </div>
                    </div>
                    <div className="button">
                      <div className="icon">
                        <i className="fa-brands fa-youtube"></i>
                      </div>
                    </div>
                    <div className="button">
                      <div className="icon">
                        <i className="fa-brands fa-linkedin"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`sprint-logo-area mb-3 mt-2  `}>
                <img
                  src={sprintLogo}
                  alt="Sprint Logo"
                  className="sprint-logo"
                />
              </div>
            </div>
            <button
              className="navbar-toggler mobile-toggle-button"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Navbar with Offcanvas */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white  bottom-navbar py-0">
        <div className="container-fluid px-40">
          {/* Toggle Button for Offcanvas */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Offcanvas (Mobile Menu) */}
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            {/* px-xl-4 px-lg-4 px-md-4 px-4 */}
            <div className="offcanvas-body d-flex align-items-xl-center align-items-md-start align-items-start  flex-lg-column flex-md-column flex-column" >
              <div className="row align-items-center justify-content-between w-100">
                <ul className="navbar-nav  pe-3 fw-semibold col-md-8 py-0">
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Leader's Speak
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      WeekendXpress
                    </a>
                  </li>
                  <li className="nav-item dropdown">
                    {" "}
                    {/* ADDED */}
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="yourCompanyDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      SpecialXpress
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="yourCompanyDropdown"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          About Us
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Our Team
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Careers
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Campaign
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Collaterals
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Other
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Feedback
                    </a>
                  </li>
                </ul>

                {/* Search Box Inside Offcanvas */}
                <div className="col-md-2 px-0">
                  <form className="d-flex navbar-form">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search..."
                    />

                    <button className="btn btn-transparent" type="submit">
                      <i className="fas fa-search text-white"></i>
                    </button>
                  </form>
                </div>
                <div className="col-md-2 px-0">
                  <div className="orange-color-bg-color bulletin-section ">
                    <div className="d-flex justify-content-between align-items-center gap-4 bulletin-section-content px-2">
                      <div>
                        <i className="fa fa-download text-white"></i>
                      </div>
                      <div>
                        <p className="mb-0 text-white">Bulletin Archive</p>
                      </div>
                      <div onClick={() => setIsCalendarOpen(true)}>
                        <i className="fa fa-calendar-days text-white cursor-pointer"></i>
                      </div>
                      <CalendarModal
                        isOpen={isCalendarOpen}
                        onClose={() => setIsCalendarOpen(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
