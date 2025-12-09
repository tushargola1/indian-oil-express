import { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import fallback from "../assets/image/fallback.png"
import arrow from "../assets/image/home-img-card/arrow.png";
import { apiBaseUrl } from "../Helper";

// ✅ API function
const fetchTopXpressNews = async () => {
  const res = await axios.post(
    apiBaseUrl("XpressNews/GetTopXpressNews"),
    { showIn: "W" },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  const getCategoryColor = (name) => {
    switch (name) {
      case "Spotlight":
        return "#69a9b9";
      case "News Buzz":
        return "#61a884";
      case "Achievers":
        return "#f37127";
      case "Community Connect":
        return "#f28bb6";
      default:
        return "#0e4094";
    }
  };

  // Transform API response
  return res.data.data.map((category) => ({
    category: category.name,
    categoryId: category.id,
    slides: category.list.map((item) => ({
      slideId: item.id,
      title: item.title,
      image: item.imagePath,
      date: item.newsDate,
      readingTime: item.readTime,
    })),
    color: getCategoryColor(category.name),
  }));
};

const NewsCards = () => {
  // ✅ Use React Query for caching and fetching
  const { data: newsData = [], isLoading, error } = useQuery({
    queryKey: ["topXpressNews"],
    queryFn: fetchTopXpressNews,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (error) {
    return <p className="text-center text-danger">Failed to load news 😞</p>;
  }

  return (
    <div className="container-fluid my-2 px-lg-5 px-md-3 px-3">
      <div className="row row-cols-xl-6 row-cols-lg-4 row-cols-md-3 row-cols-1 gy-2  align-items-center flex-wrap">
        {isLoading
          ?
          Array.from({ length: 6 }).map((_, i) => (
            <div className="col news-card-col" key={i}>
              <NewsCard loading={true} />
            </div>
          ))
          :
          newsData.map((card, i) => (
            <div className="col news-card-col" key={i}>
              <NewsCard
                category={card.category}
                slides={card.slides}
                color={card.color}
                loading={false}
                categoryId={card.categoryId}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

// ✅ NewsCard component
const NewsCard = ({ category, slides = [], color = "#0e4094", loading, categoryId }) => {
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
        <div className="d-flex justify-content-between align-items-center mb-2 position-relative news-card-heading">
          <h5 className="card-title news-heading italic-text pb-0 mb-0">
            {loading ? <Skeleton width={150} /> : category}
          </h5>
          <Link to={`/news-listing/${categoryId}`} state={{ type: "XpressNews", clickedId: categoryId }} className="news-card-arrow-link">
            <img
              src={arrow}
              alt="icon"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
          </Link>
        </div>

        <div className="carousel-arrows text-center">
          <i ref={prevRef} className="fa fa-chevron-left me-1" style={{ cursor: "pointer" }}></i>
          <i ref={nextRef} className="fa fa-chevron-right" style={{ cursor: "pointer" }}></i>
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
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
              <SwiperSlide key={i}>
                <Skeleton count={3} height={20} />
                <Skeleton height={170} className="my-2" />
                <Skeleton width={80} height={15} />
                <div className="d-flex align-items-center gap-3">
                  <Skeleton width={80} height={15} />
                  |
                  <Skeleton width={80} height={15} />
                </div>
              </SwiperSlide>
            ))
            : slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <Link to={`/news-detail/${slide.slideId}`} state={{ type: "XpressNews", clickedId: categoryId }}>

                  <p className="card-text news-details mb-0">
                    {slide.title.split(" ").slice(0, 8).join(" ")}
                    {slide.title.split(" ").length > 8 ? "..." : ""}
                  </p>

                  {/* <div className="news-card-image-div my-2">
                    {slide.image?.startsWith("https://ioclxpressapp.businesstowork.com") ? (
                      <img
                        src={slide.image}
                        alt="News"
                        className="news-card-img"
                      />
                    ) : (
                      <img
                        src={fallback}
                        alt="Fallback News"
                        className="news-card-img fallback-img"

                      />
                    )}
                  </div> */}
                  <div className="news-card-image-div my-2">
  <img
    src={
      slide.image?.startsWith("https://ioclxpressapp.businesstowork.com")
        ? slide.image
        : fallback
    }
    alt="News"
    className={
      slide.image?.startsWith("https://ioclxpressapp.businesstowork.com")
        ? "news-card-img"
        : "news-card-img fallback-img"
    }
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = fallback;
      e.target.className = "news-card-img fallback-img"; // switch to fallback class
    }}
  />
</div>

                </Link>
                {/* <Link
                  to="/news-detail"
                  className="card-link news-card-link italic-text d-block text-start"
                >
                  More Details
                </Link> */}
                <p className="mb-0 date-read">
                  {slide.date}
                  {slide.date && slide.readingTime && " | "}
                  {slide.readingTime}
                </p>

              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NewsCards;
