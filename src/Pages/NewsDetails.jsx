import mainImg from "../assets/image/banner/1.png";
import arrow from "../assets/image/arrow.png";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../Helper";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import fallback from "../assets/image/fallback.png";
import ShareTooltip from "../components/ShareTooltip";
import CommentSection from "../components/CommentSection";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import SidebarCategorySwiper from "../detail-page/SidebarCategorySwiper";

const getNewsDetails = async (newsId) => {
  const url = apiBaseUrl(`XpressNews/GetXpressNewsDetails/${newsId}`);

  const res = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });

  return res?.data?.data ?? null;
};

const fetchTopXpressNews = async () => {
  const res = await axios.post(
    apiBaseUrl("XpressNews/GetTopXpressNews"),
    { showIn: "W" }, // or your filter
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  // Transform API response to match your frontend structure
  return res.data.data.map((category) => ({
    category: category.name,
    categoryId: category.id,
    slides: category.list.map((item) => ({
      slideId: item.id,
      title: item.title,
      image: item.imagePath,
      date: item.newsDate,
      readingTime: item.readTime,
    })),
  }));
};

const getAllComments = async (newsId) => {
  const res = await axios.get(
    apiBaseUrl(`XpressNews/GetXpressNewsComments/20`),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  return res?.data?.data ?? []; // <-- ALWAYS ARRAY
};

export default function NewsDetails() {
  const { newsId } = useParams();
  const [readTime, setReadTime] = useState(0);
  const [showComment, setShowComment] = useState(false);

  // ============================================
  // ⭐ Fetch News Details
  // ============================================
  const {
    data: newsDetails,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["newsDetails", newsId],
    queryFn: () => getNewsDetails(newsId),
    enabled: !!newsId,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    onSuccess: (data) => {
      if (data?.totalReadTime) {
        setReadTime(data.totalReadTime);
      }
    },
  });

  // top xpress news
  const {
    data: topXpressNews = [], // this will be your newsHighlights
    isLoading: isLoadingHighlights,
    isError: isErrorHighlights,
    refetch: refetchHighlights,
  } = useQuery({
    queryKey: ["topXpressNews"], // unique key
    queryFn: fetchTopXpressNews,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

// GET ALL COMMENTS
const {
  data: allComments = [],
  isLoading: isLoadingComments,
  isError: isErrorComments,
  refetch: refetchComments,
} = useQuery({
  queryKey: ["getAllComments", newsId],
  queryFn: () => getAllComments(newsId),
  enabled: !!newsId,
  refetchOnWindowFocus: false,
  staleTime: Infinity,
  cacheTime: Infinity,
});

  // ============================================
  // ⭐ AddView — Call Only Once
  // ============================================
  useEffect(() => {
    if (!newsId) return;

    const viewKey = `view_sent_${newsId}`;

    // already sent?
    if (localStorage.getItem(viewKey)) {
      console.log("AddView already sent → skipping");
      return;
    }

    axios
      .post(
        apiBaseUrl("XpressNews/AddView"),
        {
          xpressNewsId: newsId,
          ipAddress: "::1",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log("AddView Success:", res.data.data);

        // prevent it from firing again
        localStorage.setItem(viewKey, "true");

        // 🔥 refetch news details immediately
        refetch();
      })
      .catch((err) => {
        console.log("AddView API failed:", err);
      });
  }, [newsId, refetch]);

  // ============================================
  // ⭐ AddReadTime — Call Only Once After Timer
  // ============================================

  useEffect(() => {
    if (!readTime || !newsId) return;

    const readKey = `read_time_sent_${newsId}`;

    // already sent?
    if (localStorage.getItem(readKey)) {
      console.log("ReadTime already sent → skipping");
      return;
    }

    console.log("Starting readTime countdown:", readTime, "seconds");

    const timer = setTimeout(() => {
      handleReadTime();
    }, readTime * 1000);

    return () => clearTimeout(timer);
  }, [readTime, newsId]);

  const handleReadTime = async () => {
    const readKey = `read_time_sent_${newsId}`;

    try {
      const res = await axios.post(
        apiBaseUrl("XpressNews/AddReadTime"),
        {
          xpressNewsId: newsId,
          readTime: readTime,
          ipAddress: "::1",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      console.log("ReadTime sent:", res.data);
      localStorage.setItem(readKey, "true"); // prevent repeats
    } catch (error) {
      console.error("AddReadTime API failed:", error);
    }
  };

  // ============================================
  // ⭐ Reaction API
  // ============================================
  const handleReaction = async (reactionId) => {
    try {
      await axios.post(
        apiBaseUrl("XpressNews/LikeDislike"),
        {
          xpressNewsId: newsId,
          likeTypeId: reactionId,
          ipAddress: "::1",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      refetch();
    } catch (error) {
      console.error("Reaction API failed:", error);
    }
  };

  // ============================================
  // ⭐ Download (kept same)
  // ============================================
  const handleDownload = async () => {
    try {
      await axios.post(
        apiBaseUrl("XpressNews/AddDownload"),
        {
          xpressNewsId: newsId,
          ipAddress: "::1",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      refetch();
    } catch (error) {
      console.error("Download API failed:", error);
    }
  };

  return (
    <>
      <div className="container-fluid px-lg-5 px-md-3 px-3 mt-5">
        <div className="row g-3 justify-content-between ">
          <div className="col-xl-9 col-lg-8 col-md-12 col-12  ">
            <div className="detail-page-content">
              <h5 className="italic-text fw-bold"> {newsDetails?.title}</h5>

              <div className="reader-time-section d-flex align-items-center justify-content-between flex-wrap gap-1 px-0">
                <p className="mb-0">{newsDetails?.shortDesc}</p>
                <p className="mb-0 reading-time">{newsDetails?.newsDate}</p>
              </div>
              <div className="icons-section ">
                <div>
                  <ShareTooltip
                    userReactions={newsDetails?.userReactions || []}
                    onReactionClick={(reactionId) => handleReaction(reactionId)}
                  />

                  <span>{newsDetails?.likesCount}</span>
                </div>
                <p>
                  <i className="fa-regular fa-eye me-2"></i>
                  <span>{newsDetails?.viewsCount}</span>
                </p>
                {newsDetails?.downloadable ? (
                  <p style={{ cursor: "pointer" }} onClick={handleDownload}>
                    <i className="fa-solid fa-download"></i>
                    <span className="ms-1">{newsDetails?.downloadsCount}</span>
                  </p>
                ) : (
                  <p>
                    <i className="fa-solid fa-download"></i>
                    <span className="ms-2">{newsDetails?.downloadsCount}</span>
                  </p>
                )}

                <p>
                  <i className="fa-brands fa-readme me-2"></i>
                  <span>{newsDetails?.totalReadTime}</span>
                </p>
                {newsDetails?.shareable && (
                  <p>
                    <i className="fa-solid fa-share-nodes"></i>
                  </p>
                )}
              </div>
              <div className="news-details-main-img">
                <div className="image-wrapper">
                  {/* <img
                    src={newsDetails?.imagePath}
                    alt="Banner"
                    className="banner-img-details"
                  /> */}
                  {newsDetails?.imagePath?.startsWith(
                    "https://ioclxpressapp.businesstowork.com"
                  ) ? (
                    <img
                      src={newsDetails?.imagePath}
                      alt="News"
                      className="news-card-img "
                    />
                  ) : (
                    <img
                      src={fallback}
                      alt="Fallback News"
                      className="news-card-img fallback-img fallback-details"
                    />
                  )}
                  <div className="blur-bg-details"></div>
                  {newsDetails?.byLine && (
                    <div className="bannerContent-details">
                      <h3 className="italic-text ">{newsDetails?.byLine}</h3>
                    </div>
                  )}
                </div>
              </div>
              <div className="news-details-content-section mt-4">
                {/* <p>{newsDetails?.description}</p> */}
                <div
                  dangerouslySetInnerHTML={{ __html: newsDetails?.description }}
                />
                <button
                  className="  px-3 py-2 details-page-button"
                  onClick={() => setShowComment(true)}
                >
                  Read Comments
                </button>

                {showComment && <CommentSection comments={allComments} />}
              </div>
              {/* <div className="news-details-main-img">
                <div className="image-wrapper">
                  <img
                    src={secondImg}
                    alt="Banner"
                    className="banner-img-details"
                  />
                
                </div>
              </div>
              <div className="news-details-content-section mb-4">
                {Array.from({ length: 1 }).map((_, index) => (
                  <div key={index}>
                    <p>
                      On the auspicious eve of Rakshabandhan, Mr Sahney visited
                      the strategically critical Zoji La Pass, renowned for its
                      challenging terrain and extreme weather. There, he met
                      IndianOil' s dedicated team of Advance Winter Stocking
                      (AWS) drivers and TT crew who ensure uninterrupted fuel
                      supply to the nation's farthest corners. In a symbolic
                      tribute and deeply touching moment, Mr Sahney tied Rakhis
                      on the wrists Of drivers, recognising them as true
                      guardians of the nation's energy security, and distributed
                      sweets, adding festive warmth to the high-altitude post.
                    </p>
                  </div>
                ))}
              
              </div> */}
            </div>
          </div>
          <div className="col-xl-3 mt-4 col-lg-3 col-md-12 col-12 details-page-right-section right-bar-side detail-page-left-section">
            {topXpressNews.length > 0 && (
              <SidebarCategorySwiper items={topXpressNews} />
            )}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between  flex-wrap mt-3">
          <h4 className="recommanded-story-heading">Recommanded Stories</h4>
          <div
            className="d-flex align-items-center gap-3 flex-wrap
                    "
          >
            <p className="mb-0 hashtag-text">#Chairman</p>
            <p className="mb-0 hashtag-text">#Marketing Division</p>
            <p className="mb-0 hashtag-text">#RHQ</p>
          </div>
        </div>
        <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 justify-content-center align-items-stretch gy-2 mt-lg-0 mt-md-1 mt-0">
          {newsDetails?.recommendedXpressNews.map((item, index) => (
            <div className="col recommanded-story-col" key={index}>
              <div className="details-right-category">
                <div className="height-50">
                  <h4 className="clamp-2 ">{item.title}</h4>
                </div>
                {/* <img
                  src={item.imagePath}
                  alt="Right Banner"
                  className="right-bar-side-image  mt-4 mb-3"
                /> */}
                <Link to={`/news-detail/${item.id}`}>
                  {item.imagePath?.startsWith(
                    "https://ioclxpressapp.businesstowork.com"
                  ) ? (
                    <img
                      src={item.imagePath}
                      alt="News"
                      className="recommended-details-img"
                    />
                  ) : (
                    <img
                      src={fallback}
                      alt="Fallback News"
                      className="news-card-img fallback-img"
                    />
                  )}
                </Link>
                <Link
                  className="arrow-btn text-start"
                  to={`/news-detail/${item.id}`}
                >
                  <img src={arrow} alt="arrow" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
