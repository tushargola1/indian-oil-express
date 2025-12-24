import Swal from "sweetalert2";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import indianOilLogo from "../assets/image/logos/indianOil-Logo.png";
import sprintLogo from "../assets/image/logos/sprint-logo.png";
import indianOil from "../assets/image/logos/indianOil.png";
import { useEffect, useRef, useState } from "react";
import CalendarModal from "../modal/CalendarModal";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { getWeekendXpress } from "./ApiFunctions";
import {WeekendDropdownData} from "./ApiFunctions";


export default function Header() {
  const navigate = useNavigate();
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [issticky, setIsSticky] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const locationMenuRef = useRef(null);
  const location = useLocation()
  const accessTokenDecodedData = location?.state;
  const toggleLocationMenu = () => {
    setShowLocationMenu((prev) => !prev);
  };

  useEffect(() => {
    const expiryCheckFn = () => {
      let timestamp = accessTokenDecodedData?.exp;
      let expiryTime = new Date(timestamp * 1000);
      console.log("Access Token Expiry Date:", expiryTime);
      const currentTime = new Date();
      console.log("Current Date:", currentTime);
      if (currentTime >= expiryTime) {
        // const event = { preventDefault: () => { } };
        handleLogout("timeout");
      }
    }
    expiryCheckFn()
    const logoutInterval = setTimeout(() => {
      expiryCheckFn()
    }, 1000)

    return () => clearTimeout(logoutInterval);


  }, [accessTokenDecodedData])


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

  const handleLogout = (timeout) => {

   
    if (timeout === "timeout") {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("auth", { path: "/" });
    localStorage.clear();

    Swal.fire({
      icon: "warning",
      title: "Session Expired",
      text: "Server timed out. Please login again.",
      showConfirmButton: false,
      timer: 2000,
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: "#fffef5",
      color: "#000",
      customClass: {
        popup: "rounded-4 shadow",
      },
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);

    return; // ⛔ stop here
  }

  // MANUAL LOGOUT
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
      localStorage.clear();

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

  const { data: weekendXpress = [], isLoading, error } = useQuery({
    queryKey: ["weekendXpress"],
    queryFn: () => getWeekendXpress(),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    // convert spaces to +
    const formattedQuery = query.trim().replace(/\s+/g, "+");

    navigate(`/search?query=${formattedQuery}`);
  };
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setQuery("");
  }, [searchParams]);
console.log(accessTokenDecodedData);
  return (
    <header className={`border-bottom shadow-sm custome_mobile_header`}>
      {/* Top Row */}
      <div className="container-fluid order-1 custome_top_header">
        {/* <div className="row align-items-center  py-2 px-lg-5 px-md-3 px-3"> */}
        <div className="row align-items-center  py-2 top-nav-header">
          {/* Left Logo */}
          <div className={`col-md-2 col-lg-3 col-6 right-logo-area  ps-0 d-md-block d-sm-none`}>
            <div className={`hh`}>
              <Link to="/">
                <img
                  src={indianOil}
                  alt="Indian Oil"
                  className="indianOil-logo d-xl-block d-md-block d-none"
                />
              </Link>
              <Link to="/">
                <img
                  src={sprintLogo}
                  alt="Indian Oil"
                  className="sprint-logo d-xl-none d-md-none d-none d-sm-none"
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
          <div className="col-md-4 col-lg-3 col-6 pe-0 custome_right">
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
                    className="text-dark text-decoration-none me-2  fw-600"
                  >
                    Sitemap
                  </a>
                  <div
                    className="user-dropdown ms-2"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                  >
                    <span className="user-name">Welcome {accessTokenDecodedData?.nam} <i className="fa fa-chevron-down fs-12"></i></span>

      <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        <button href="#" className="dropdown-item"  onClick={handleLogout}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
        <i class="fa-solid fa-arrow-right-from-bracket "></i> 

                          </div>
                          <div>
                            Logout
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* | */}
                  {/* <button
                    onClick={handleLogout}
                    className="text-dark text-decoration-none ms-3 fw-600 bg-transparent border-0"
                  >
                    Logout
                  </button> */}

                  {/* <a
                  href=""
                  className=" text-decoration-none ms-4  fw-600"
                >
                 <i className="fa fa-bars dark-blue-color"></i>
                </a> */}
                </div>
                {/* <div className="location-wrapper " ref={locationMenuRef}>
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
                </div> */}
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
      <nav className="navbar navbar-expand-lg navbar-light bg-white  bottom-navbar py-0 header_bottom_border">
        <div className="container-fluid px-30 py-md-1 py-sm-1 py-xl-0">

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
            <div className="offcanvas-body d-flex align-items-xl-center align-items-md-start align-items-start  flex-lg-column flex-md-column flex-column">
              <div className="row align-items-center justify-content-between w-100">
                <ul className="navbar-nav  pe-3 fw-semibold col-md-8 py-0">
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Leader's Speak
                    </a>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="yourCompanyDropdown"
                      role="button"
                      aria-expanded="false"
                    >
                      WeekendXpress
                    </a>

                    <ul className="dropdown-menu header-submenu" aria-labelledby="yourCompanyDropdown">
                      {weekendXpress.map((item) => (
                        <li key={item.id} >
                          <Link className="dropdown-item" to={`/WeekendXpress/news-listing/${item.id}`}>
                            {item.text}
                          </Link>
                        </li>
                      ))}                  
                    </ul>
                  </li>

                  <li className="nav-item ">
                    {" "}
                    {/* ADDED */}
                    <a
                      className="nav-link "
                      href="#"

                    >
                      SpecialXpress
                    </a>



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
                <div className="col-lg-2 px-0 mt-sm-2 mt-lg-0 mt-md-2 mt-xl-0">
                  <form className="d-flex navbar-form custome_form" onSubmit={handleSubmit}>
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-transparent" type="submit">
                      <i className="fas fa-search text-white"></i>
                    </button>
                  </form>
                </div>
                <div className="col-lg-2 px-0">
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
