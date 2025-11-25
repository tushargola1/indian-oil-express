import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Controller } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import announcement from "../assets/image/banner/announcement.png";
import arrow from "../assets/image/arrow.png";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { apiBaseUrl } from "../Helper";
import axios from "axios";
import Cookies from "js-cookie";
import fallback from "../assets/image/banner/1.png"
// Fetch function for React Query
const fetchBannerData = async () => {
  const response = await axios.post(
    apiBaseUrl("XpressNews/GetTopXpressNewsFHPS"),
    { showIn: "W" },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );
  return response.data.data;
};

const HomeBanner = () => {
  const [imageSwiper, setImageSwiper] = useState(null);
  const [textSwiper, setTextSwiper] = useState(null);

  // TanStack Query for banner data
  const { data: bannerData, isLoading, isError } = useQuery({
    queryKey: ["bannerData"],
    queryFn: fetchBannerData,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  }); 0.

  return (
    <div className="container-fluid my-3 px-40 ">
      <div className="row g-3">

        {/* BIG LEFT AREA */}
        <div className="col-xl-9 col-lg-7 col-md-12 col-12 ">
          <div className="row gy-3 banner1 ">

            {/* LEFT IMAGE FADE CAROUSEL */}
            <div className="col-xl-8 col-lg-12 col-md-12 col-12 position-relative pe-2 ">
              {isLoading ? (
                <Skeleton height={400} width="100%" />
              ) : isError ? (
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
                        {/* <div className="image-wrapDSFDASper"> */}


                        <Link to={`/news-detail/${item.id}`}>
                          {/* <img
                            src={item.imagePath}
                            alt="Banner"
                            className="banner-imgdfad"
                          /> */}
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

            {/* RIGHT TEXT FADE CAROUSEL (SYNCED) */}
            <div className="col-xl-4 col-lg-12 col-md-12 col-12 banner-right-content">
              {isLoading ? (
                <Skeleton count={10} />
              ) : isError ? (
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

        {/* RIGHT SMALL STATIC BANNER */}
        <div className="col-xl-3 col-lg-5 col-md-12 col-12 right-bar-side d-flex flex-column">
          <img src={announcement} alt="" className="announcement-img" />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
