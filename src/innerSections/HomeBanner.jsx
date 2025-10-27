import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import slide1 from "../assets/image/banner/main-img.jpg";
import slide2 from "../assets/image/banner/main-img.jpg";

import announcement from '../assets/image/banner/announcement.png'

import arrow from "../assets/image/arrow.png";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const HomeBanner = () => {
  const [banner1Loader, setBanner1Loader] = useState(true);
  const [banner2Loader, setBanner2Loader] = useState(true);

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

  const images = [slide1, slide2];

  return (
    <div className="container-fluid my-3 px-lg-5 px-md-3 px-0">
      <div className="row g-3">
        {/* MAIN BANNER */}
        <div className="col-xl-9 col-lg-7 col-md-12 col-12">
          <div className="row g-0 banner1">
            {/* LEFT Image section with fade swiper */}
            <div className="col-xl-8 col-lg-12 col-md-12 col-12 position-relative pe-2">
          
                {banner1Loader ? (
                  <Skeleton height={400} width="100%" />
                ) : (
                  <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={false}
                    speed={800}
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={index}>
                            <div className="image-wrapDSFDASper">
                              <Link to={"/news-detail"}>
                        <img src={image} alt="Banner" className="banner-imgdfad" />

                              </Link>
                        {/* <div className="blur-bg"></div> */}
                        {/* <div className="bannerContent">
                          <h3 className="italic-text">
                            Celebrating service in the Himalayas: Chairman's heartfelt
                            connect in Kargil & Srinagar
                          </h3>
                        </div> */}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
            </div>

            {/* RIGHT static text section */}
            <div className="col-xl-4 col-lg-12 col-md-12 col-12 banner-right-content">
              {banner1Loader ? (
                <Skeleton count={10} />
              ) : (
                <>
                  <p>
                    Mr A S Sahney, Chairman, recently undertook a meaningful visit to
                    Kargil & Srinagar, where he engaged closely with people across
                    high-altitude passes, frontline installations, and historic sites.
                    On the auspicious eve of Rakshabandhan, Mr Sahney visited the
                    strategically critical Zoji La Pass, renowned for its challenging
                    terrain and extreme weather...
                  </p>

                  <div className="d-flex align-items-center gap-3 mt-3">
                    <Link to="/news-detail" className="arrow-btn">
                      <img src={arrow} alt="arrow" />
                    </Link>
                    <p className="mb-0 date-read"> 29-07-2025 | 1 minutes read</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE SMALL BANNER */}
        <div className="col-xl-3 col-lg-5 col-md-12 col-12 right-bar-side d-flex flex-column">
          {/* <Swiper
            className="banner2-swiper"
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            onSwiper={(swiper) => (swiper2Ref.current = swiper)}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
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
                        Director (Marketing) outlines strategic roadmap for
                        Institutional Business at All India State IB Heads Conference,
                        Mumbai
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
          </Swiper> */}
          <img src={announcement} alt="" className="announcement-img" />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
