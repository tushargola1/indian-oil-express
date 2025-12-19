import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { expressDetails } from "../components/ApiFunctions"
import NewsItem from "./NewsListing";
import { Link } from "react-router-dom";



// ✅ News Item Component
// const NewsItem = ({ imagePath, title, shortDesc, newsDate, byLine }) => {
//   const [day, month, year] = newsDate.split(" ")[0].split("-");
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const formattedMonth = monthNames[parseInt(month) - 1];

//   return (
//     <div className="news-item row gy-xl-0 gy-lg-2 gy-md-3 gy-4 border-bottom  mb-3">
//       <div className="news-image col-xl-2 col-lg-12 col-md-12 col-12">
//         <img
//           src={
//             imagePath?.startsWith("https://ioclxpressapp.businesstowork.com")
//               ? imagePath
//               : fallback
//           }
//           alt={title || "News"}
//           className={`img-fluid ${!imagePath?.startsWith("https://ioclxpressapp.businesstowork.com")
//             ? "fallback-listing"
//             : ""
//             }`}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = fallback;
//             e.target.className = "img-fluid fallback-listing"; // ensure fallback styling
//           }}
//         />
//       </div>
//       <div className="news-content col-xl-8 col-lg-12 col-md-  12 col-12">
//         <div className="news-title fw-bold">{title}</div>
//         <div className="news-description small mb-2">{shortDesc || byLine}</div>
//       </div>
//       <div className="news-date-box col-xl-2 col-lg-12 col-md-12 col-12 text-end">
//         <div className="news-date-month fw-bold">{formattedMonth}</div>
//         <div className="news-date-day-year">
//           {day}, {year}
//         </div>
//       </div>
//     </div>
//   );
// };

// ✅ Main Component
const Expresslisting = ({ imagePath, title, shortDesc, newsDate, byLine }) => {


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
const Expresslisting = () => {
  const { data: categoryData = [], isLoading: isBannerLoading, isError: isBannerError } = useQuery({
    queryKey: ["categoryData"],
    queryFn: () => expressDetails(),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { newsId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Toggle states
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);
  const newsType = location.state?.type;
  const newsParentId = location.state?.clickedId;

//   console.log(newsParentId);

//   const ITEMS_PER_PAGE = 5;
//   const [currentPage, setCurrentPage] = useState(() => {
//     return parseInt(localStorage.getItem("currentNewsPage") || "1", 10);
//   });

//   useEffect(() => {
//     localStorage.setItem("currentNewsPage", currentPage);
//   }, [currentPage]);

  // ✅ React Query (fetching based on current page + URL id)
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["news", currentPage, newsId],
   queryFn: expressDetails,
    // keepPreviousData: true,
    // staleTime: 5 * 60 * 1000,
    // refetchOnWindowFocus: false,
  });

  const news = data || [];
  // alert(news);
  const totalRecords = data?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
  const idMain = data?.newsMainId;
    queryFn: () =>
      getNewsListing(currentPage, ITEMS_PER_PAGE, newsId, newsType),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

//   const news = data?.data || [];
//   const totalRecords = data?.totalRecords || 0;
//   const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   if (isError) {
//     return <p className="text-center text-danger">❌ Failed to load news.</p>;
//   }

  return (
    <div className="container-fluid px-30 px-md-3 px-3 mt-5">
      <div className="row g-3 justify-content-between flex-lg-row flex-md-column-reverse flex-column-reverse">

        <div className="col-xl-9 col-lg-7 col-md-12 col-12">
          <div className="listing-page-section">
            {news.map((item, i) => {
              let day = "", month = "", year = "";
              if (item.newsDate) {
                [year, month, day] = item.newsDate.split(" ")[0].split("-");
              }
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
                    <Link to={`/news-detail/${item.id}`}>
                    {idMain}
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
    <div className="container-fluid px-lg-5 px-md-3 px-3 mt-5">
      <div className="row g-3 justify-content-between flex-lg-row flex-md-column-reverse flex-column-reverse">
        {/* MAIN CONTENT */}
        {/* <div className="col-xl-9 col-lg-7 col-md-12 col-12">
          {news.map((item, i) =>
            i === 0 ? (
              <h4 className="fw-bold">
                {item.xpressNewsType || item.webPageCategory}
              </h4>
            ) : null
          )}

                  </div>
                  <div className="news-content col-xl-8 col-lg-12 col-md-12 col-12">
                    <Link to={`/news-detail/${item.id}`}>
                      <div className="news-title fw-bold">{item.title}</div>
                    </Link>
                    <div className="news-description small mb-2">{item.shortDesc || byLine}</div>
                  </div>
                  <div className="news-date-box col-xl-2 col-lg-12 col-md-12 col-12 text-end">
                    <div className="news-date-month fw-bold">{formattedMonth}</div>
                    <div className="news-date-day-year">
                      {day}, {year}
                    </div>
                  </div>
                </div>
                // i === 0 ? (
                //   <h4 className="fw-bold">
                //     {item.xpressNewsType || item.webPageCategory}
                //   </h4>
                // ) : null

              );
            })
            }
            {/* 
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
          )  
         : (
            <div className="listing-page-section">
              {news.length > 0 ? (
                news.map((item) => <NewsItem key={item.id} {...item} />)
              ) : (
                <p>No news found.</p>
              )}
            </div>
          )
          } */}

            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
          )}

//           {!isLoading && totalPages > 1 && (
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           )}
//         </div> */}

//         {/* <div className="col-xl-9 col-lg-7 col-md-12 col-12">
//       <div className="row g-4">

       
//         <div className="col-md-4 col-12">
//           <div className="custom-card pt-3 pb-0 px-3">
//             <div className="d-flex justify-content-between align-items-center mb-2 custome_heading">
//               <h5 className="fw-bold m-0">Stamp The Map!</h5>

//             </div>

//             {open1 && (
//               <div>
//                 <p className="custome_para">Veteran actor Achyut Potdar - A tribute to former IOCian National Handloom Day - Weaving Freedom into Fabric</p>
//               </div>
//             )}

//             <div className="text-end mt-3">
//               <button
//                 className="read-more-btn"
//                 onClick={() => navigate("/announcement/1")}
//               >
//                 Read More
//               </button>
//             </div>
//           </div>
//         </div>

      </div>
    </div> */}

        {/* <div className="col-xl-9 col-lg-7 col-md-12 col-12"> */}
        {/* <div className="news-item row gy-xl-0 gy-lg-2 gy-md-3 gy-4 border-bottom  mb-3">
            <div className="news-image col-xl-2 col-lg-12 col-md-12 col-12">
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
                  e.target.className = "img-fluid fallback-listing"; 
                }}
              />
            </div>
            <div className="news-content col-xl-8 col-lg-12 col-md-12 col-12">
              <div className="news-title fw-bold">{title}</div>
            </div>
            <div className="news-date-box col-xl-2 col-lg-12 col-md-12 col-12 text-end">
              <div className="news-date-month fw-bold">{formattedMonth}</div>
              <div className="news-date-day-year">
                {day}, {year}
              </div>
            </div>
          </div> */}
        {/* <div className="row g-4">

            {categoryData.map((item, i) => (
              <div key={item.id || i} className="col-md-4 col-12">
                <div className="custom-card pt-3 pb-0 px-3">

//         <div className="col-xl-9 col-lg-7 col-md-12 col-12">
//           <div className="row g-4">

//             {categoryData.map((item, i) => (
//               <div key={item.id || i} className="col-md-4 col-12">
//                 <div className="custom-card pt-3 pb-0 px-3">

//                   <div className="d-flex justify-content-between align-items-center mb-2 custome_heading">
//                     <h5 className="fw-bold m-0">{item.title}</h5>
//                   </div>

                  {true && (     
                  {true && (        // you can replace with open1, open2, open3 if needed
                    <div>
                      <p className="custome_para">{item.shortDesc}</p>
                    </div>
                  )}

//                   <div className="text-end mt-3">
//                     <button
//                       className="read-more-btn"
//                       onClick={() => navigate(`/announcement/${item.id}`)}
//                     >
//                       Read More
//                     </button>
//                   </div>

//                 </div>
//               </div>
//             ))}

          </div> */}
        {/* </div> */}
          </div>
        </div>




//         {/* SIDEBAR */}
//         <div className="col-xl-3 col-lg-5 col-md-12 col-12 page-listing-side d-flex flex-column ps-0">
//           <div className="sticky-sidebar-listing w-100">
//             <CategoriesSidebar
//               newsType={newsType}
//               newsParentId={newsParentId}
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Expresslisting;
