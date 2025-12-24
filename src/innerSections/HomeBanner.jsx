// React & Router
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

// UI Components
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

// Assets
import fallback from "../assets/image/banner/1.png";
import pdfIcon from "../assets/image/pdf.png";
import arrow from "../assets/image/arrow.png";

// API Functions
import { fetchAnnouncements, fetchBannerData } from "../components/ApiFunctions";

const HomeBanner = () => {
  const [imageSwiper, setImageSwiper] = useState(null);
  const [textSwiper, setTextSwiper] = useState(null);
  const rightSideRef = useRef(null);
  const leftSideRef = useRef(null);
  const [rightHeight, setRightHeight] = useState("auto");

  // Banner Data
  const { data: bannerData, isLoading: isBannerLoading, isError: isBannerError } = useQuery({
    queryKey: ["bannerData"],
    queryFn: () => fetchBannerData(),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Announcement Data
  const { data: announcements, isLoading: isAnnouncementLoading, isError: isAnnouncementError } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => fetchAnnouncements(),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Match Right Side Height to Left Content
  useEffect(() => {
    if (leftSideRef.current) {
      setRightHeight(leftSideRef.current.clientHeight);
    }
    const handleResize = () => {
      if (leftSideRef.current) {
        setRightHeight(leftSideRef.current.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [bannerData]);

  return (
    <div className="container-fluid my-3 px-40">
      <div className="row g-3">
        {/* LEFT BIG BANNER AREA */}
        <div className="col-xl-9 col-lg-7 col-md-12 col-12" ref={leftSideRef}>
          <div className="row gy-3 banner1">
            {/* LEFT IMAGE FADE CAROUSEL */}
            <div className="col-xl-8 col-lg-12 col-md-12 col-12 position-relative p-0">
              {isBannerLoading ? (
                <Skeleton height={"100%"} width="100%" />
              ) : isBannerError ? (
                <p>❌ Failed to load banners</p>
              ) : (
                <Swiper
                  modules={[Autoplay, EffectFade, Controller]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  speed={800}
                  onSwiper={setImageSwiper}
                  controller={{ control: textSwiper }}
                  loop={false}
                >
                  {bannerData.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="image-wrapper">
                        <Link to={`/news-detail/${item.id}`}>
                          <img
                            src={
                              item.imagePath?.startsWith("https://ioclxpressapp.businesstowork.com")
                                ? item.imagePath
                                : fallback
                            }
                            alt="Banner"
                            className="banner-img"
                          />
                          <div
                            className="blur-bg"
                            style={{
                              backgroundImage: `url(${item.imagePath?.startsWith("https://ioclxpressapp.businesstowork.com")
                                ? item.imagePath
                                : fallback
                                })`,
                            }}
                          ></div>
                          <div className="bannerContent">
                            <h3 className="italic-text home-banner-clamp">
                              {item.shortDesc.split(" ").slice(0, 20).join(" ")}
                              {item.shortDesc.split(" ").length > 20 ? "..." : ""}
                            </h3>
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* RIGHT TEXT FADE CAROUSEL */}
            <div className="col-xl-4 col-lg-12 col-md-12 col-12 banner-right-content">
              {isBannerLoading ? (
                <Skeleton count={8} />
              ) : isBannerError ? (
                <p>❌ Failed to load banners</p>
              ) : (
                <Swiper
                  modules={[Autoplay, EffectFade, Controller]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  speed={800}
                  onSwiper={setTextSwiper}
                  controller={{ control: imageSwiper }}
                  allowTouchMove={false}
                  loop={false}
                >
                  {bannerData.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div>
                        <p>{item.shortDesc}</p>
                        <div className="d-flex align-items-center gap-3 mt-3">
                          <Link to={`/news-detail/${item.id}`} className="arrow-btn">
                            <img src={arrow} alt="arrow" />
                          </Link>
                          <p className="mb-0 date-read">{item.newsDate} | {item.readTime}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT ANNOUNCEMENTS */}
        <div
          className="col-xl-3 col-lg-5 col-md-12 col-12 right-bar-side d-flex flex-column"
          ref={rightSideRef}
        // style={{ height: rightHeight, overflowY: "auto", gap: "10px" }}
        >
          {/* <img src={announcement} alt="" className="announcement-img mb-2" /> */}

          {isAnnouncementLoading ? (
            <Skeleton count={8} height={20} />
          ) : isAnnouncementError ? (
            <p>❌ Failed to load announcements</p>
          ) : (
            <div className="announcement-list d-flex flex-column gap-2 w-100">
              {announcements.map((item) => (
                <Link
                  key={item.id}
                  to={`/announcement/${item.id}`}
                  className="announcement-item d-flex justify-content-between align-items-center p-2 border rounded"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    color: "#000",
                  }}
                >
                  <p
                    className="mb-0 announcement-title"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.title}
                  </p>
                  <img src={pdfIcon} alt="PDF" style={{ width: 20, height: 20 }} className="ms-4" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
