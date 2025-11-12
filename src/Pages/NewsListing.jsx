import React, { useEffect, useState } from "react";
import mainImg from "../assets/image/banner/1.png";
import Pagination from "../components/Pagination";
import CategoriesSidebar from "../innerPage/CategoriesSidebar";
import { apiBaseUrl } from "../Helper";
import Cookies from "js-cookie";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ✅ API function (fetch by page)
const getNewsListing = async (page, ITEMS_PER_PAGE) => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const res = await axios.post(
    apiBaseUrl("XpressNews/GetXpressNewsFL"),
    {
      searchValue: "",
      sortColumn: "",
      sortDirection: "ASC",
      start,
      length: ITEMS_PER_PAGE,
      xpressNewsTypeId: 197,
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
const NewsItem = ({ imagePath, title, shortDesc, newsDate }) => {
  const [day, month, year] = newsDate.split(" ")[0].split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const formattedMonth = monthNames[parseInt(month) - 1];

  return (
    <div className="news-item row gy-xl-0 gy-lg-2 gy-md-3 gy-4 border-bottom  mb-3">
      <div className="news-image col-xl-2 col-lg-12 col-md-12 col-12">
        <img
          src={imagePath}
          alt={title}
          className="img-fluid rounded"
        />
      </div>
      <div className="news-content col-xl-8 col-lg-12 col-md-12 col-12">
        <div className="news-title fw-bold">{title}</div>
        <div className="news-description text-muted small">{shortDesc}</div>
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
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(() => {
    // Load from localStorage if available
    return parseInt(localStorage.getItem("currentNewsPage") || "1", 10);
  });

  // ✅ Save current page to localStorage
  useEffect(() => {
    localStorage.setItem("currentNewsPage", currentPage);
  }, [currentPage]);

  // ✅ React Query (fetching based on current page)
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["news", currentPage],
    queryFn: () => getNewsListing(currentPage, ITEMS_PER_PAGE),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const news = data?.data || [];
  const totalRecords = data?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll to top
  };

  if (isError) {
    return <p className="text-center text-danger">❌ Failed to load news.</p>;
  }

  return (
    <div className="container-fluid px-lg-5 px-md-3 px-3 mt-5">
      <div className="row g-3 justify-content-between flex-lg-row flex-md-column-reverse flex-column-reverse">
        {/* MAIN CONTENT */}
        <div className="col-xl-9 col-lg-7 col-md-12 col-12">
          <h3 className="fw-bold fs-14 mb-3">In Focus</h3>

          {/* ✅ Loader */}
          {isLoading || isFetching ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mb-3">
                <div className="row gy-3">
                  <div className="col-xl-2 col-lg-12 col-md-12 col-12">
                    <Skeleton height={120} />
                  </div>
                  <div className="col-xl-8 col-lg-12 col-md-12 col-12">
                    <Skeleton height={20} width="70%" />
                    <Skeleton count={3} />
                  </div>
                  <div className="col-xl-2 col-lg-12 col-md-12 col-12 text-end">
                    <Skeleton width={80} height={20} />
                    <Skeleton width={60} height={20} />
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
            <CategoriesSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsListing;
