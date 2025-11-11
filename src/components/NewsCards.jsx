import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import arrow from '../assets/image/home-img-card/arrow.png';
import { apiBaseUrl } from "../Helper";
import axios from "axios";

// NewsCards component
const NewsCards = () => {
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewsLoading(false);
    }, 2000);
    getTopXpressNews();
    return () => clearTimeout(timer);
  }, []);

  const getTopXpressNews = () => {
    axios
      .post(
        apiBaseUrl("XpressNews/GetTopXpressNews"),
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
        const transformedData = res.data.data.map((category) => ({
          category: category.name,
          slides: category.list.map((item) => ({
            title: item.title,
            image: item.imagePath,
            date: item.newsDate,
            readingTime: item.readTime 
          })),
          color: getCategoryColor(category.name),
        }));
        setNewsData(transformedData);
      })
      .catch((err) => {
        console.log("Error fetching news:", err);
      });
  };

  const getCategoryColor = (categoryName) => {
    switch (categoryName) {
      case "Spotlight":
        return "#69a9b9";
      case "News Buzz":
        return "#61a884";
      case "Achievers":
        return "#f37127";
      case "Community Connect":
        return "#f28bb6";
      default:
        return "#0e4094"; // Default color
    }
  };

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

// NewsCard component
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
        <div className="d-flex justify-content-between align-items-center mb-2  position-relative">
          <h5 className="card-title news-heading italic-text mb-0">
            {loading ? <Skeleton width={150} /> : category}
          </h5>
          <Link to={"/news-detail"}>
            <img
              src={arrow}
              alt="icon"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>

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
                  <div className="d-flex align-items-center gap-3">
                    <Skeleton width={80} height={15} />
                    |
                    <Skeleton width={80} height={15} />
                  </div>
                </>
              ) : (
                <>
                  <p className="card-text news-details">{slide.title}</p>
                  <img
                    src={slide.image}
                    alt="News"
                    className="news-card-img"
                  />
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
