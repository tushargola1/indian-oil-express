import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import searchImage from "../assets/image/search.png"; // make sure path is correct

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // track if user clicked search

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await axios.post(
        "https://ioclxpressapp.businesstowork.com/api/Announcements/GetGlobalSearchResults",
        { keyword, count: 12 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      setResults(res.data?.data || []);
    } catch (err) {
      console.log(err);
      setResults([]);
    }

    setIsLoading(false);
  };

  const clearSearch = () => {
    setKeyword("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="container-fluid px-lg-5 px-md-3 px-3 py-4">

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto d-flex search-bar">

          <div className={`search-wrapper ${keyword ? "has-text" : ""}`}>
            {/* Search Icon */}
            <i className="fa-solid fa-magnifying-glass search-icon"></i>

            <input
              type="text"
              className="form-control search-input"
              placeholder="Search news..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            {/* Clear Icon */}
            {keyword && (
              <i
                className="fa-solid fa-xmark clear-icon"
                onClick={clearSearch}
              ></i>
            )}
          </div>

          <button
            className="btn dark-blue-bg-color text-white ms-2"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Results or Placeholder */}
      {!hasSearched ? (
        // Centered placeholder image
        <div className="d-flex justify-content-center align-items-center" style={{ height: "48vh" }}>
          <img src={searchImage} alt="Search placeholder" style={{ maxWidth: "300px", width: "100%" }} />
        </div>
      ) : (
        // Results or Loader
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

/* ---------------------- Card ----------------------- */

const SearchCard = ({ item }) => {
  return (
    <div className="search-card shadow-sm">
      <h6 className="fw-bold clamp-2 search-title">{item.title}</h6>

      <p
        className="clamp-4 search-desc"
        dangerouslySetInnerHTML={{
          __html: item.description + "...",
        }}
      ></p>

      <a
        href={item.url}
        className="btn dark-blue-bg-color text-white mt-auto w-100"
      >
        View Details
      </a>
    </div>
  );
};

/* ------------------- Skeleton ---------------------- */

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
