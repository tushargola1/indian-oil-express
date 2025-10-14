import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import newsImg from "../assets/image/newsImg.png";
import newsImg1 from "../assets/image/category-news/1.png";
import newsImg2 from "../assets/image/category-news/2.png";
import newsImg3 from "../assets/image/category-news/3.png";

import arrow from '../assets/image/home-img-card/arrow.png'


// Sample News Data
const newsData = [
  {
    category: "In Focus",
    slides: [
      {
        title:
          "Hon’ble President of India unveils trophies of IndianOil Brand Cup Tournament",
        image: newsImg1,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
      {
        title:
          "Hon’ble President of India unveils trophies of IndianOil Brand Cup Tournament",
        image: newsImg1,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
    ],
    color: "#0e4094",
  },
  {
    category: "Spotlight",
    slides: [
      {
        title:
          "Warm bonds at M/s Sonam Angdus Memorial Filling Station, Kargil",
        image: newsImg2,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
      {
        title:
          "Warm bonds at M/s Sonam Angdus Memorial Filling Station, Kargil",
        image: newsImg2,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
    ],
    color: "#69a9b9",
  },
  {
    category: "News Buzz",
    slides: [
      {
        title:
          "Director (Finance) inaugurates Tax Audit and Compliance Solution (TACS) Portal",
        image: newsImg3,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
      {
        title:
          "Director (Finance) inaugurates Tax Audit and Compliance Solution (TACS) Portal",
        image: newsImg3,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
    ],
    color: "#61a884",
  },
  {
    category: "Achiever",
    slides: [
      {
        title:
          "IndianOil wins Clarivate Plc South Asia Innovation Award 2025 in PSU category",
        image: newsImg,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
      {
        title:
          "IndianOil wins Clarivate Plc South Asia Innovation Award 2025 in PSU category",
        image: newsImg,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
    ],
    color: "#f37127",
  },
  {
    category: "Fostering Values",
    slides: [
      {
        title:
          "Flood relief at Koila village: Mathura Refinery reaffirms Pehle Indian, Phir Oil commitment",
        image: newsImg,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
      {
        title:
          "Flood relief at Koila village: Mathura Refinery reaffirms Pehle Indian, Phir Oil commitment",
        image: newsImg,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
    ],
    color: "#69a9b9",
  },
  {
    category: "Community Connect",
    slides: [
      {
        title:
          "Director (Finance) inaugurates Tax Audit and Compliance Solution (TACS) Portal",
        image: newsImg3,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
      {
        title:
          "Director (Finance) inaugurates Tax Audit and Compliance Solution (TACS) Portal",
        image: newsImg3,
        date: "29-07-2025",
        readingTime: "1 minutes read",
      },
    ],
    color: "#f28bb6",
  },
];

const NewsCards = () => {
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container-fluid my-2 px-lg-5 px-md-3 px-3">
      <div className="row row-cols-xl-6 row-cols-lg-4 row-cols-md-3 row-cols-1 gy-2 justify-content-center align-items-center flex-wrap">
        {newsData.map((card, i) => (
          <div className="col news-card-col" key={i}>
            <NewsCard
              category={card.category}
              slides={card.slides}
              color={card.color}
              loading={newsLoading}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsCard = ({ category, slides, color, loading }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div
      className="card news-card"
      style={{
        background: `linear-gradient(180deg, ${color} -17%, rgba(255, 255, 255, 1) 26%)`,
      }}
    >
      <div className="card-body">
        <div className="text-center">
          <h5 className="card-title news-heading italic-text">
            {loading ? <Skeleton width={150} /> : category}
          </h5>
          
        </div>
  <img
    src={arrow}
    alt="icon"
    style={{
      width: "50px",
      height: "70px",
      objectFit: "contain",
      position: "absolute",
      right:' 4px',
      top: "7%",
      transform: "translateY(-50%)"
    }}
  />
        <div className="carousel-arrows text-center">
          <i
            ref={prevRef}
            className="fa fa-chevron-left me-3"
            style={{ cursor: "pointer" }}
          ></i>
          <i
            ref={nextRef}
            className="fa fa-chevron-right"
            style={{ cursor: "pointer" }}
          ></i>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="news-card-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              {loading ? (
                <>
                  <Skeleton count={3} height={20} />
                  <Skeleton height={170} className="my-2" />
                  <Skeleton width={80} height={15} />
                  <div className="d-flex align-items-center gap-3 ">
                        <Skeleton width={80} height={15} />
                        |
                        <Skeleton width={80} height={15} />

                  </div>

                </>
              ) : (
                <>
                  <p className="card-text news-details">{slide.title}</p>
                  <img src={slide.image} alt="News" className="news-card-img" />
                  <Link
                    to="/more-details"
                    className="card-link news-card-link italic-text d-block text-start"
                  >
                    More Details
                  </Link>
                  <p className="mb-0 date-read">
                    {slide.date} | {slide.readingTime}
                  </p>
                </>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NewsCards;
