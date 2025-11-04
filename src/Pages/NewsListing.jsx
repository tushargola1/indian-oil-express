import React, { useState } from "react";
import mainImg from "../assets/image/banner/1.png";
import Pagination from "../components/Pagination";
import CategoriesSidebar from "../innerPage/CategoriesSidebar";



const newsData = [
  {
    img: "../assets/image/category-news/1.png",
    title: "Veteran actor Achyut Potdar - A tribute to former IOCian",
    description:
      "A veteran actor and former IOCian Achyut Potdar (1934-2025), who has been a part of several successful Bollywood films and TV shows,",
    dateMonth: "October",
    dateDayYear: "1, 2025",
  },
  {
    img: "../assets/image/category-news/1.png",
    title: "National Handloom Day - Weaving Freedom into Fabric",
    description:
      "India celebrates National Handloom Day annually (August 7) to honour the role of handloom weavers in the country’s freedom struggle and to promote the spirit of Swadeshi.",
    dateMonth: "September",
    dateDayYear: "5, 2025",
  },
  {
    img: "../assets/image/category-news/1.png",
    title: "National Handloom Day - Weaving Freedom into Fabric",
    description:
      "India celebrates National Handloom Day annually (August 7) to honour the role of handloom weavers in the country’s freedom struggle and to promote the spirit of Swadeshi.",
    dateMonth: "September",
    dateDayYear: "5, 2025",
  },{
    img: "../assets/image/category-news/1.png",
    title: "National Handloom Day - Weaving Freedom into Fabric",
    description:
      "India celebrates National Handloom Day annually (August 7) to honour the role of handloom weavers in the country’s freedom struggle and to promote the spirit of Swadeshi.",
    dateMonth: "September",
    dateDayYear: "5, 2025",
  },{
    img: "../assets/image/category-news/1.png",
    title: "National Handloom Day - Weaving Freedom into Fabric",
    description:
      "India celebrates National Handloom Day annually (August 7) to honour the role of handloom weavers in the country’s freedom struggle and to promote the spirit of Swadeshi.",
    dateMonth: "September",
    dateDayYear: "5, 2025",
  },{
    img: "../assets/image/category-news/1.png",
    title: "National Handloom Day - Weaving Freedom into Fabric",
    description:
      "India celebrates National Handloom Day annually (August 7) to honour the role of handloom weavers in the country’s freedom struggle and to promote the spirit of Swadeshi.",
    dateMonth: "September",
    dateDayYear: "5, 2025",
  },
];

const NewsItem = ({ img, title, description, dateMonth, dateDayYear }) => (
  <div className="news-item row gy-xl-0 gy-lg-2 gy-md-3 gy-4    ">
    <div className="news-image col-xl-2 col-lg-12 col-md-12 col-12 ">
      <img src={mainImg} alt={title} />
    </div>
    <div className="news-content col-xl-8 col-lg-12 col-md-12 col-12 ">
      <div className="news-title">{title}</div>
      <div className="news-description">{description}</div>
    </div>
    <div className="news-date-box col-xl-2 col-lg-12 col-md-12 col-12 ">
      <div className="news-date-month">{dateMonth}</div>
      <div className="news-date-day-year">{dateDayYear}</div>
    </div>
  </div>
);

const NewsListing = () => {
      const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = newsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="container-fluid px-lg-5 px-md-3 px-3 mt-5">
        <div className="row g-3  justify-content-between flex-lg-row flex-md-column-reverse flex-column-reverse  ">
          {/* MAIN BANNER */}
          <div className="col-xl-9 col-lg-7 col-md-12 col-12">
            <h3 className="fw-bold">In Focus</h3>
            <div className="listing-page-section d-flex align-items-center justify-content-between flex-wrap gap-1 border-bottom-0">
             <div className="news-container ">
              {newsData.map((item, index) => (
                <NewsItem key={index} {...item} />
              ))}
            </div>  
            </div>
             <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
          </div>

          <div className="col-xl-3 col-lg-5 col-md-12 col-12 page-listing-side d-flex flex-column ps-0 ">
                <div className="sticky-sidebar-listing w-100">
    <CategoriesSidebar />
  </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsListing;
