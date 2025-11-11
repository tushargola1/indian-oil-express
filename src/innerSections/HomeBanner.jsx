import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Controller } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import slide1 from "../assets/image/banner/main-img.jpg";
import slide2 from "../assets/image/banner/main-img.jpg";

import announcement from "../assets/image/banner/announcement.png";
import arrow from "../assets/image/arrow.png";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { apiBaseUrl } from "../Helper";
import axios from "axios";


const HomeBanner = () => {
  const [bannerLoader, setBannerLoader] = useState(true);
  const [imageSwiper, setImageSwiper] = useState(null);
  const [textSwiper, setTextSwiper] = useState(null);
  const [bannerData , setBannerData] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setBannerLoader(false);
    }, 1500);
    getbannerData()
    return () => clearTimeout(timer);
  }, []);

const getbannerData = () =>{
  
  axios.post(
    apiBaseUrl("XpressNews/GetTopXpressNewsFHPS"),
    {
      showIn: "W",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  )
    .then((res) => {
      setBannerData(res.data.data)
    })
    .catch((err) => {
      console.error("❌ Error:", err);
    });

}
    
  return (
    <div className="container-fluid my-3 px-lg-5 px-md-3 px-0">
      <div className="row g-3">

        {/* BIG LEFT AREA */}
        <div className="col-xl-9 col-lg-7 col-md-12 col-12">
          <div className="row g-0 banner1">

            {/* LEFT IMAGE FADE CAROUSEL */}
            <div className="col-xl-8 col-lg-12 col-md-12 col-12 position-relative pe-2">
              {bannerLoader ? (
                <Skeleton height={400} width="100%" />
              ) : (
                <Swiper
                  modules={[Autoplay, EffectFade, Controller]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  speed={800}
                  onSwiper={setImageSwiper}
                  controller={{ control: textSwiper }}
                  loop={false}
                >
                  {bannerData.map((item, i) => (
                    <SwiperSlide key={i}> 
                      <div className="image-wrapDSFDASper">
                        <Link to={item.id}>
                          <img
                            src={item.imagePath}
                            alt="Banner"
                            className="banner-imgdfad"
                          />
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* RIGHT TEXT FADE CAROUSEL (SYNCED) */}
            <div className="col-xl-4 col-lg-12 col-md-12 col-12 banner-right-content">
              {bannerLoader ? (
                <Skeleton count={10} />
              ) : (
                <Swiper
                  modules={[Autoplay, EffectFade, Controller]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  speed={800}
                  onSwiper={setTextSwiper}
                  controller={{ control: imageSwiper }}
                  allowTouchMove={false}
                  loop={false}
                >
                  {bannerData.map((item, i) => (
                    <SwiperSlide key={item.id}>
                      <div>
                        <p>{item.shortDesc}</p>

                        <div className="d-flex align-items-center gap-3 mt-3">
                          <Link to={item.id} className="arrow-btn">
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
