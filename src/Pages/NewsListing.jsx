import { useEffect, useState } from "react";
import mainImg from "../assets/image/banner/1.png";
import Pagination from "../components/Pagination";
import CategoriesSidebar from "../innerPage/CategoriesSidebar";
import { apiBaseUrl } from "../Helper";
import Cookies from "js-cookie";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams, useLocation } from "react-router-dom";
import fallback from "../assets/image/fallback.png";
const getNewsListing = async (page, ITEMS_PER_PAGE, newsId, newsType) => {
  const start = (page - 1) * ITEMS_PER_PAGE;

  const xpress = newsType === "XpressNews";

  const endpoint = xpress
    ? "XpressNews/GetXpressNewsFL"
    : "WebPages/GetWebPagesFL";

  const paramNewsId = xpress ? "xpressNewsTypeId" : "webPageCategoryId";

  const res = await axios.post(
    apiBaseUrl(endpoint),
    {
      searchValue: "",
      sortColumn: "",
      sortDirection: "ASC",
      start,
      length: ITEMS_PER_PAGE,
      [paramNewsId]: Number(newsId),
      leadershipCategoryId: "",
      divisionId: "",
      fromDate: "",
      toDate: "",
      showIn: "W",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  // ✅ Return structured response
  return {
    data: res.data.data.data || [],
    totalRecords: res.data.data.recordsFiltered || 0,
  };
};

// ✅ News Item Component
const NewsItem = ({ imagePath, title, shortDesc, newsDate, byLine }) => {
  const [day, month, year] = newsDate.split(" ")[0].split("-");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedMonth = monthNames[parseInt(month) - 1];

  return (
    <div className="news-item row gy-xl-0 gy-lg-2 gy-md-3 gy-4 border-bottom  mb-3">
      <div className="news-image col-xl-2 col-lg-12 col-md-12 col-12">
        {imagePath?.startsWith("https://ioclxpressapp.businesstowork.com") ? (
          <img src={imagePath} alt={title} className="img-fluid " />
        ) : (
          <img
            src={fallback}
            alt="Fallback"
            className="img-fluid  fallback-listing"
          />
        )}
      </div>
      <div className="news-content col-xl-8 col-lg-12 col-md-12 col-12">
        <div className="news-title fw-bold">{title}</div>
        <div className="news-description small mb-2">{shortDesc || byLine}</div>
      </div>
      <div className="news-date-box col-xl-2 col-lg-12 col-md-12 col-12 text-end">
        <div className="news-date-month fw-bold">{formattedMonth}</div>
        <div className="news-date-day-year">
          {day}, {year}
        </div>
      </div>
    </div>
  );
};

// ✅ Main Component
const NewsListing = () => {
  const { newsId } = useParams();
  const location = useLocation();

  const newsType = location.state?.type;
  const newsParentId = location.state?.clickedId;

  console.log(newsParentId);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(localStorage.getItem("currentNewsPage") || "1", 10);
  });

  useEffect(() => {
    localStorage.setItem("currentNewsPage", currentPage);
  }, [currentPage]);

  // ✅ React Query (fetching based on current page + URL id)
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["news", currentPage, newsId],
    queryFn: () =>
      getNewsListing(currentPage, ITEMS_PER_PAGE, newsId, newsType),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const news = data?.data || [];
  const totalRecords = data?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isError) {
    return <p className="text-center text-danger">❌ Failed to load news.</p>;
  }

  return (
    <div className="container-fluid px-lg-5 px-md-3 px-3 mt-5">
      <div className="row g-3 justify-content-between flex-lg-row flex-md-column-reverse flex-column-reverse">
        {/* MAIN CONTENT */}
        <div className="col-xl-9 col-lg-7 col-md-12 col-12">
          {news.map((item, i) =>
            i === 0 ? (
              <h4 className="fw-bold">
                {item.xpressNewsType || item.webPageCategory}
              </h4>
            ) : null
          )}

          {/* ✅ Loader */}
          {isLoading || isFetching ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mb-3 ">
                <div className="row gy-3 news-item align-items-center justify-content-center mx-1">
                  <div className="col-xl-2 col-lg-12 col-md-12 col-12 mt-0 mb-1">
                    <Skeleton height={120} />
                  </div>
                  <div className="col-xl-8 col-lg-12 col-md-12 col-12 mt-0">
                    <Skeleton height={15} width="100%" />
                    <div className="mt-2">
                      <Skeleton count={2} />
                    </div>
                  </div>
                  <div className="col-xl-2 col-lg-12 col-md-12 col-12 text-center mt-0">
                    <Skeleton width={90} height={15} />
                    <Skeleton width={60} height={15} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="listing-page-section">
              {news.length > 0 ? (
                news.map((item) => <NewsItem key={item.id} {...item} />)
              ) : (
                <p>No news found.</p>
              )}
            </div>
          )}

          {/* ✅ Pagination from API */}
          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* SIDEBAR */}
        <div className="col-xl-3 col-lg-5 col-md-12 col-12 page-listing-side d-flex flex-column ps-0">
          <div className="sticky-sidebar-listing w-100">
            <CategoriesSidebar
              newsType={newsType}
              newsParentId={newsParentId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsListing;
