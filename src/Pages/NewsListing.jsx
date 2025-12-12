// ===================== React =====================
import { useEffect, useState } from "react";

// ===================== Routing =====================
import { useParams, useLocation, Link } from "react-router-dom";

// ===================== API & Data =====================
import { useQuery } from "@tanstack/react-query";
import { getNewsListing } from "../components/ApiFunctions";

// ===================== UI Components =====================
import Pagination from "../components/Pagination";
import CategoriesSidebar from "../innerPage/CategoriesSidebar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ===================== Assets =====================
import fallback from "../assets/image/fallback.png";


// ✅ News Item Component
const NewsItem = ({id, imagePath, title, shortDesc, newsDate, byLine }) => {
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
        <Link to={`/news-detail/${id}`}>

        <img
          src={
            imagePath?.startsWith("https://ioclxpressapp.businesstowork.com")
              ? imagePath
              : fallback
          }
          alt={title || "News"}
          className={`img-fluid ${!imagePath?.startsWith("https://ioclxpressapp.businesstowork.com")
              ? "fallback-listing"
              : ""
            }`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallback;
            e.target.className = "img-fluid fallback-listing"; // ensure fallback styling
          }}
        />
        </Link>

      </div>
      <div className="news-content col-xl-8 col-lg-12 col-md-12 col-12">
        <Link to={`/news-detail/${id}`}>
        <div className="news-title fw-bold">{title}</div>
        </Link>
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
    queryFn: () =>getNewsListing(currentPage, ITEMS_PER_PAGE, newsId, newsType),
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
    <div className="container-fluid px-30 px-md-3 px-3 mt-5">
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
