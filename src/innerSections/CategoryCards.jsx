import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import arrow from "../assets/image/home-img-card/arrow.png";
import { apiBaseUrl } from "../Helper";

// 🎨 Color map for categories
const colors = {
  "Strengthening Synergy": "#eed6c5",
  "Learning Pathways": "#eee5c5",
  "Meetings & Interactions": "#d0eec5",
  "Safety & Security": "#ddd2f2",
  "News at a Glance": "#b4f6f8",
};

// ✅ API function (MUST return the promise)
const getWebPageData = async () => {
  const res = await axios.get(apiBaseUrl("WebPages/GetTopWebPages"), {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  return res.data.data;
};

export default function CategoryCard() {
  const {
    data: categoryData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categoryData"],
    queryFn: getWebPageData,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return <p className="text-center text-danger">❌ Failed to load categories.</p>;
  }

  return (
    <div className="container-fluid mt-4 px-lg-5 px-md-3 px-3">
      <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 justify-content-center align-items-stretch gy-2">

        {/* 🔄 Show skeletons while loading */}
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
                      <li
                        className="list-group-item bg-transparent"
                        key={i}
                      >
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
          : // ✅ Render real data once loaded
            categoryData.map((category, index) => (
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
                    <p className="mb-0 fw-bold">{category.name}</p>
                    <Link to={"/news-detail"}>
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
                            <img
                              src={item.imagePath}
                              alt=""
                              className="home-img-card-img"
                            />
                          </div>
                          <div className="col-md-6">
                            <p className="mb-0 home-img-card-content">
                              {item.title}
                            </p>
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
