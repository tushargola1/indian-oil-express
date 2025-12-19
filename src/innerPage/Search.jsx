// ===================== React =====================
import { useEffect, useState } from "react";

// ===================== Routing =====================
import { useSearchParams, Link, useLocation } from "react-router-dom";

// ===================== HTTP =====================
import axios from "axios";
import Cookies from "js-cookie";
import { apiBaseUrl } from "../Helper";

// ===================== UI Components =====================
import Pagination from "../components/Pagination";
import CategoriesSidebar from "../innerPage/CategoriesSidebar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ===================== Assets =====================
import fallback from "../assets/image/fallback.png";
import { fetchAnnouncements } from "../components/ApiFunctions";
import pdfIcon from "../assets/image/pdf.png";
import { useQuery } from "@tanstack/react-query";

const DEBOUNCE_DELAY = 800;
const highlightText = (text = "", keyword = "") => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(
        regex,
        `<span class="search-highlight">$1</span>`
    );
};

// ===================== News Item =====================
const NewsItem = ({ id, imagePath, title, description, newsDate, searchKeyword , entityId}) => {
    const safeDate = newsDate || "";
    const datePart = safeDate.includes(" ")
        ? safeDate.split(" ")[0]
        : safeDate;

    const [day = "", month = "", year = ""] = datePart.split("-");

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    return (
        <div className="news-item row gy-xl-0 gy-lg-2 gy-md-3 gy-4 border-bottom mb-3">
            <div className="news-image col-xl-2 col-lg-12 col-md-12 col-12">
                <Link to={`/news-detail/${entityId}`}>
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

            <div className="news-content col-xl-8 col-12">
                <Link to={`/news-detail/${entityId}`}>
                    <div
                        className="news-title fw-bold clamp-1"
                        dangerouslySetInnerHTML={{
                            __html: highlightText(title, searchKeyword),
                        }}
                    />

                </Link>
                <div
                    className="news-description small"
                    dangerouslySetInnerHTML={{
                        __html: highlightText(description, searchKeyword),
                    }}
                />

            </div>

            <div className="news-date-box col-xl-2 col-12 text-end">
                <div className="fw-bold">
                    {month ? monthNames[parseInt(month) - 1] : ""}
                </div>
                <div>
                    {day && year ? `${day}, ${year}` : ""}
                </div>
            </div>
        </div>
    );
};


// ===================== Main Component =====================
const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const keywordParam = (searchParams.get("query") || "").replace(/\+/g, " ");


    const location = useLocation();
    const newsType = location.state?.type;
    const newsParentId = location.state?.clickedId;

    const [keyword, setKeyword] = useState(keywordParam);
    const [debouncedKeyword, setDebouncedKeyword] = useState(keywordParam);

    const [allNews, setAllNews] = useState([]);
    const [news, setNews] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    // ===================== Debounce =====================
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [keyword]);

    // ===================== API CALL =====================
    useEffect(() => {
        if (!debouncedKeyword.trim()) {
            setNews([]);
            setTotalRecords(0);
            return;
        }

        const fetchSearchResults = async () => {
            setIsLoading(true);
            try {
                const res = await axios.post(
                    apiBaseUrl("Announcements/GetGlobalSearchResults"),
                    {
                        keyword: debouncedKeyword,
                        page: currentPage,
                        count: itemsPerPage,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${Cookies.get("accessToken")}`,
                        },
                    }
                );

                const list = res.data?.data || [];
                setAllNews(list);
                setTotalRecords(list.length);

            } catch (err) {
                setNews([]);
            }
            setIsLoading(false);
        };

        fetchSearchResults();
    }, [debouncedKeyword, currentPage, itemsPerPage]);


    // ===================== Handlers =====================
    const handleInputChange = (e) => {
        const val = e.target.value;
        setKeyword(val);
        setCurrentPage(1);
        setSearchParams({ query: val }, { replace: true });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const onClear = () => {
        setKeyword("");
        setDebouncedKeyword("");
        setNews([]);
        setTotalRecords(0);
        setCurrentPage(1);
        setSearchParams({}, { replace: true });
    };

    const handleVoiceSearch = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Voice search is not supported in this browser.");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;
        setIsListening(true);
        recognition.start();
        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setKeyword(spokenText);
            setCurrentPage(1);
            setSearchParams({ query: spokenText }, { replace: true });
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    };
    useEffect(() => {
        setKeyword(keywordParam);
        setDebouncedKeyword(keywordParam);
        setCurrentPage(1);
    }, [keywordParam]);

    useEffect(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setNews(allNews.slice(start, end));
    }, [allNews, currentPage, itemsPerPage]);

    
  // Announcement Data
  const { data: announcements, isLoading: isAnnouncementLoading, isError: isAnnouncementError } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => fetchAnnouncements(),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

    // ===================== JSX =====================
    return (
        <div className="container-fluid px-30 px-md-3 px-3 mt-4">
            <div className="d-flex justify-content-center align-items-center">
                <div className={`search-wrapper w-50 ${keyword ? "has-text" : ""}`}>
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search news..."
                        value={keyword}
                        onChange={handleInputChange}
                    />
                    {keyword && (
                        <i
                            className="fa-solid fa-xmark clear-icon"
                            onClick={onClear}
                        ></i>
                    )}
                    <i
                        className={`fa-solid fa-microphone voice-icon ${isListening ? "listening" : ""
                            }`}
                        onClick={handleVoiceSearch}
                        title="Voice Search"
                    ></i>
                </div>
            </div>
            <div className="row g-3 justify-content-between flex-lg-row flex-md-column-reverse flex-column-reverse mt-2">
                {/* MAIN CONTENT */}
                <div className="col-xl-9 col-lg-7 col-md-12 col-12">
                    {/* ✅ Loader */}
                    {isLoading ? (
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
                        <div className="listing-page-section border-0 pt-0">
                            {news.length > 0 ? (
                                news.map((item) => (
                                    <NewsItem
                                        key={item.id}
                                        {...item}
                                        searchKeyword={debouncedKeyword}
                                    />
                                ))


                            ) : (
                                <p>No news found.</p>
                            )}
                        </div>
                    )}

                    {/* ✅ Pagination from API */}
                    {!isLoading && totalPages > 1 && (
                        <>
                            <div className="d-flex align-items-center justify-content-between">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />

                                <div className="position-relative dropup">
                                    <button
                                        className="btn dark-blue-bg-color dropdown-toggle text-white listing-dropdown-btn"
                                        type="button"
                                        onClick={() => setShowDropdown(prev => !prev)}
                                    >
                                        {itemsPerPage}
                                    </button>

                                    {showDropdown && (
                                        <ul className="dropdown-menu show">
                                            {[20, 30, 50].map((value) => (
                                                <li key={value}>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setItemsPerPage(value);
                                                            setCurrentPage(1);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        {value}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </div>

                        </>
                    )}
                </div>

                {/* SIDEBAR */}
                <div className="col-xl-3 col-lg-5 col-md-12 col-12 page-listing-side d-flex flex-column ps-2">
                    {/* <div className="sticky-sidebar-listing w-100">
                        <CategoriesSidebar
                            newsType={newsType}
                            newsParentId={newsParentId}
                        />
                    </div> */}
                  <div className="sticky-sidebar-listing w-100">

                        {isAnnouncementLoading ? (
                                <Skeleton count={8} height={20} />
                              ) : isAnnouncementError ? (
                                <p>❌ Failed to load announcements</p>
                              ) : (
                                <div className="announcement-list d-flex flex-column gap-2 w-100">
                                  {announcements.map((item) => (
                                    <Link
                                      key={item.id}
                                      to={`/announcement/${item.id}`}
                                      className="announcement-item d-flex justify-content-between align-items-center p-2 border rounded"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        textDecoration: "none",
                                        color: "#000",
                                      }}
                                    >
                                      <p
                                        className="mb-0 announcement-title"
                                        style={{
                                          display: "-webkit-box",
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                        }}
                                      >
                                        {item.title}
                                      </p>
                                      <img src={pdfIcon} alt="PDF" style={{ width: 20, height: 20 }} className="ms-4" />
                                    </Link>
                                  ))}
                                </div>
                              )}
                               </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
