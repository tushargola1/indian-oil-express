// ===================== React & Router Imports =====================
import { Link } from "react-router-dom";

// ===================== State & Data Fetching =====================
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

// ===================== UI & Loading Components =====================
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ===================== Assets =====================
import arrow from "../assets/image/home-img-card/arrow.png";
import fallback from "../assets/image/fallback.png";

// ===================== Helper Functions =====================
import { apiBaseUrl } from "../Helper";
import { getWebPageData } from "../components/ApiFunctions";

// ===================== Category Colors =====================
const colors = {
  "Strengthening Synergy": "#eed6c5",
  "Learning Pathways": "#eee5c5",
  "Meetings & Interactions": "#d0eec5",
  "Safety & Security": "#ddd2f2",
  "News at a Glance": "#b4f6f8",
};

// ===================== Category Icons =====================
import synergy from "../assets/image/category-card-img/image016.png";
import graduationCap from "../assets/image/home-img-card/cap.png";
import meeting from "../assets/image/category-card-img/Layer-10b.png";
import safety from "../assets/image/category-card-img/Layer-10c.png";
import news from "../assets/image/category-card-img/Layer-10d.png";

const categoryIcons = [
  synergy,
  graduationCap,
  meeting,
  safety,
  news,
  synergy,
  graduationCap,
  meeting,
];




export default function CategoryCard() {
  const {
    data: categoryData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categoryData"],
    queryFn: () =>getWebPageData(),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return (
      <p className="text-center text-danger">❌ Failed to load categories.</p>
    );
  }

  return (
    <div className="container-fluid my-3 px-40">
      <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 justify-content-center align-items-stretch gy-2">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div className="col news-card-col news-card-col-img" key={index}>
                <div
                  className="card home-category-img-cards p-3"
                  style={{
                    background:
                      "linear-gradient(241deg, #f0f0f0 0%, rgba(255, 255, 255, 1) 100%)",
                  }}
                >
                  <div className="card-header card-img-heading d-flex align-items-center my-1 justify-content-between">
                    <Skeleton width={140} height={20} />
                    <Skeleton circle width={30} height={30} />
                  </div>
                  <ul className="list-group list-group-flush">
                    {Array.from({ length: 2 }).map((__, i) => (
                      <li className="list-group-item bg-transparent" key={i}>
                        <div className="row gy-3 home-img-card-section">
                          <div className="col-md-6 pe-0">
                            <Skeleton height={100} />
                          </div>
                          <div className="col-md-6">
                            <Skeleton count={2} />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          : categoryData.map((category, index) => (
              <div className="col news-card-col news-card-col-img" key={index}>
                <div
                  className="card home-category-img-cards"
                  style={{
                    background: `linear-gradient(241deg, ${
                      colors[category.name] || "#b4f6f8"
                    } 0%, rgba(255, 255, 255, 1) 100%)`,
                  }}
                >
                  <div className="card-header card-img-heading d-flex align-items-center my-1 justify-content-between">
                    <img
                      src={categoryIcons[index]}
                      alt="icon"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                      }}
                    />
                    <p className="mb-0 fw-bold">{category.name}</p>
                    <Link
                      to={`/news-listing/${category.id}`}
                      state={{ type: "topWebPage", clickedId: category.id }}
                    >
                      <img
                        src={arrow}
                        alt="icon"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "contain",
                        }}
                      />
                    </Link>
                  </div>

                  <ul className="list-group list-group-flush">
                    {category.list.map((item, i) => (
                      <li className="list-group-item bg-transparent" key={i}>
                        <div className="row gy-3 home-img-card-section">
                          <div className="col-md-6 pe-0">
                            <Link to={`/news-detail/${item.id}`} state={{ type: "topWebPage", clickedId: category.id }}>
                              {item.imagePath?.startsWith(  
                                "https://ioclxpressapp.businesstowork.com"
                              ) ? (
                                <img
                                  src={item.imagePath}
                                  alt=""
                                  className="home-img-card-img"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = fallback;
                                    e.target.className = "fallback-img2"; // apply fallback class
                                  }}
                                />
                              ) : (
                                <img
                                  src={fallback}
                                  alt="Fallback News"
                                  className="fallback-img2"
                                />
                              )}
                            </Link>
                          </div>
                          <div className="col-md-6">
                            <Link to={`/news-detail/${item.id}`}>
                              <p className="mb-0 home-img-card-content">
                                {item.title}
                              </p>
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
