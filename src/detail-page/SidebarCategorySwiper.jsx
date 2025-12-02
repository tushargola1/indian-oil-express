import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import mainImg from "../assets/image/banner/1.png";
import arrow from "../assets/image/arrow.png";

export default function SidebarCategorySwiper({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="sidebar-category-swiper">
      {items.map((item, index) => {
        return (
          <div className="d-flex flex-column banner-2" key={`category-${index}`}>
            {/* Header with category & arrow */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="dark-blue-bg-color text-white details-right-category-heading">
                {item.category}
              </div>
              <Link
                className="arrow-btn text-start"
                to={`/news-listing/${item.categoryId}`}
              >
                <img src={arrow} alt="arrow" />
              </Link>
            </div>

            {/* Swiper WITHOUT AUTOPLAY */}
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
                    className="sidebarCategorySwiper w-100"

            >
              {item.slides?.map((slide, slideIndex) => (
                <SwiperSlide key={`category-${index}-slide-${slideIndex}`}>
                  <div className="details-right-category details-right-category-sidebar">
                    <h4 className="clamp-2">{slide.title}</h4>
                    <div className="image-wrapper image-wrapper-sidebar">
                      <img
                        src={slide.image || mainImg}
                        alt={slide.title}
                        className="banner-img-details"
                      />
                      <div className="blur-bg-details"></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );
      })}
    </div>
  );
}
