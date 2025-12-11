// ===================== React =====================
import { useEffect, useState } from "react";

// ===================== HTTP & Utilities =====================
import axios from "axios";
import Cookies from "js-cookie";
import { apiBaseUrl } from "../Helper";

// ===================== Routing =====================
import { useSearchParams } from "react-router-dom";

// ===================== Assets =====================
import searchImage from "../assets/image/search.png";

const DEBOUNCE_DELAY = 500;  // delay in ms

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramQ = searchParams.get("query") || "";

  const [keyword, setKeyword] = useState(paramQ);
  const [debouncedKeyword, setDebouncedKeyword] = useState(paramQ);

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Update debouncedKeyword after user stops typing for DEBOUNCE_DELAY ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  // Search API — runs when debouncedKeyword changes and is non-empty
  useEffect(() => {
    if (!debouncedKeyword.trim()) return;

    const doSearch = async (term) => {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const res = await axios.post(apiBaseUrl("Announcements/GetGlobalSearchResults"),
          { keyword: term, count: 12 },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        setResults(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
      setIsLoading(false);
    };

    doSearch(debouncedKeyword);
  }, [debouncedKeyword]);

  const onInputChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    setSearchParams({ query: val }, { replace: true });
  };

  const onClear = () => {
    setKeyword("");
    setResults([]);
    setHasSearched(false);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="container-fluid px-lg-5 px-md-3 px-3 py-4">
      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto d-flex search-bar">
          <div className={`search-wrapper ${keyword ? "has-text" : ""}`}>
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search news..."
              value={keyword}
              onChange={onInputChange}
            />
            {keyword && (
              <i className="fa-solid fa-xmark clear-icon" onClick={onClear}></i>
            )}
          </div>
        </div>
      </div>

      {/* Results / Placeholder */}
      {!hasSearched ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "48vh" }}
        >
          <img
            src={searchImage}
            alt="Search placeholder"
            style={{ maxWidth: "300px", width: "100%" }}
          />
        </div>
      ) : (
        <div className="row row-cols-xl-6 row-cols-lg-4 row-cols-md-3 row-cols-1 gy-4">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div className="col" key={i}>
                <SearchSkeleton />
              </div>
            ))}
          {!isLoading &&
            results.map((item) => (
              <div className="col" key={item.id}>
                <SearchCard item={item} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

// SearchCard & SearchSkeleton same as before
const SearchCard = ({ item }) => (
  <div className="search-card shadow-sm">
    <h6 className="fw-bold clamp-2 search-title">{item.title}</h6>
    <p
      className="clamp-4 search-desc"
      dangerouslySetInnerHTML={{ __html: item.description + "..." }}
    ></p>
    <a href={`/news-detail/${item.entityId}`} className="btn dark-blue-bg-color text-white mt-auto w-100">
      View Details
    </a>
  </div>
);

const SearchSkeleton = () => (
  <div className="search-card skeleton-card">
    <div className="placeholder-glow">
      <span className="placeholder col-10 mb-2"></span>
      <span className="placeholder col-8 mb-2"></span>
      <span className="placeholder col-9 mb-2"></span>
      <span className="placeholder col-11 mb-3"></span>
      <span className="placeholder btn disabled col-12"></span>
    </div>
  </div>
);
