import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import slide1 from "../assets/image/banner/1.png";
import arrow from "../assets/image/arrow.png";

// Skeleton loader
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomeBanner = () => {
  const [banner1Loader, setBanner1Loader] = useState(true);
  const [banner2Loader, setBanner2Loader] = useState(true);

  const swiper1Ref = useRef(null);
  const swiper2Ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBanner1Loader(false);
      setBanner2Loader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNextSlide = (swiperRef) => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
      swiperRef.current.autoplay.start();
    }
  };

  const renderBanner1 = () => (
    <div className="row g-0 banner1">
      {/* Image Section */}
      <div className="col-xl-8 col-lg-12 col-md-12 col-12 position-relative pe-2">
        <div className="image-wrapper">
          {banner1Loader ? (
            <Skeleton height={400} width="100%" />
          ) : ( 
            <>
              <img src={slide1} alt="Banner" className="banner-img" />
              <div className="blur-bg"></div>
              <div className="bannerContent">
                <h3 className="italic-text">
                  Celebrating service in the Himalayas: Chairman's heartfelt connect in
                  Kargil & Srinagar
                </h3>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Text Section */}
      <div className="col-xl-4 col-lg-12 col-md-12 col-12 banner-right-content">
        <div>
          {banner1Loader ? (
            <Skeleton count={10} />
          ) : (
            <p>
              Mr A S Sahney, Chairman, recently undertook a meaningful visit to
              Kargil & Srinagar, where he engaged closely with people across
              high-altitude passes, frontline installations, and historic sites. On
              the auspicious eve of Rakshabandhan, Mr Sahney visited the strategically
              critical Zoji La Pass, renowned for its challenging terrain and extreme
              weather...
            </p>
          )}
        </div>
        <div className="d-flex align-items-center gap-3 mt-5">
          <button
            onClick={() => handleNextSlide(swiper1Ref)}
            className="arrow-btn"
          >
            <img src={arrow} alt="arrow" />
          </button>
          {
            banner1Loader ? (
              <div className="d-flex align-items-center gap-3 ">
                <Skeleton width={80} height={20} />
                |
                <Skeleton width={80} height={20} />

              </div>
            ) : (
              <p className="mb-0 date-read">29-07-2025 1 minute read</p>

            )
          }
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid my-5 px-lg-5 px-md-3 px-0">
      <div className="row g-3">
        {/* Banner 1 Carousel */}
        <div className="col-xl-9 col-lg-7 col-md-12 col-12">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            onSwiper={(swiper) => {
              swiper1Ref.current = swiper;
            }}
            loop={true}
          >
            {[1, 2].map((_, index) => (
              <SwiperSlide key={index}>{renderBanner1()}</SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Banner 2 Carousel */}
        <div className="col-xl-3 col-lg-5 col-md-12 col-12 right-bar-side d-flex flex-column">
          <Swiper
            className="banner2-swiper"
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            onSwiper={(swiper) => {
              swiper2Ref.current = swiper;
            }}
            loop={true}
          >
            {[1, 2].map((_, index) => (
              <SwiperSlide key={index}>
                <div className="banner2 d-flex flex-column">
                  {banner2Loader ? (
                    <>
                      <Skeleton count={4} />

                      <Skeleton height={250} className="mt-auto" />
                    </>
                  ) : (
                    <>
                      <h4>
                        Director (Marketing) outlines strategic roadmap for Institutional
                        Business at All India State IB Heads Conference, Mumbai
                      </h4>
                      <img
                        src={slide1}
                        alt="Right Banner"
                        className="right-bar-side-image mt-auto"
                      />
                    </>
                  )}
                  <button
                    onClick={() => handleNextSlide(swiper2Ref)}
                    className="arrow-btn text-start mt-3"
                  >
                    <img src={arrow} alt="arrow" />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;




