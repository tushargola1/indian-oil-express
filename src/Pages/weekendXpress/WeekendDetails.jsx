// ===================== React =====================
import { useEffect, useState } from "react";

// ===================== Routing =====================
import { Link, useLocation, useParams } from "react-router-dom";

// ===================== Data & API =====================
import { useQuery } from "@tanstack/react-query";
import {
  WeekendXpressaddReadTime,
  WeekendXpressaddView,
  WeekendXpressAddDownload,
  WeekendXpressdownloadNews,
  fetchTopNews,
  WeekendXpressgetAllComments,
  GetWeekendXpressDetails,
  WeekendlikeDislike,
} from "../../components/ApiFunctions";

// ===================== UI Components =====================
import ShareTooltip from "../../components/ShareTooltip";
import CommentSection from "../../components/CommentSection";
import SidebarCategorySwiper from "../../detail-page/SidebarCategorySwiper";

// ===================== Swiper (Carousel) =====================
import "swiper/css";
import "swiper/css/navigation";

// ===================== Assets =====================
import arrow from "../../assets/image/arrow.png";
import fallback from "../../assets/image/fallback.png";

export default function NewsDetails() {
  const location = useLocation();
  const [showComments, setShowComments] = useState(false);
  const { newsId } = useParams();
  const [readTime, setReadTime] = useState(0);
  const [showComment, setShowComment] = useState(false);

  const newsType = location?.state?.type || "XpressNews";
  const [showCommentBox, setShowCommentBox] = useState(false);

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
    queryFn: () => GetWeekendXpressDetails(newsId),
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

  // ======================
  // Fetch top/recommended news
  // ======================
  const { data: topNews = [] } = useQuery({
    queryKey: ["topNews", newsType, newsId],
    queryFn: () => fetchTopNews(newsType, newsId),
    // enabled: !!newsType,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // GET ALL COMMENTS
  const {
    data: allComments = [],
    isLoading: isLoadingComments,
    isError: isErrorComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["WeekendXpressgetAllComments", newsId],
    queryFn: () => WeekendXpressgetAllComments(newsId),
    enabled: !!newsId,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // ============================================
  // ⭐ WeekendXpressaddView — Call Only Once
  // ============================================
  useEffect(() => {
    if (!newsId) return;
    const viewKey = `view_sent_${newsId}`;
    if (localStorage.getItem(viewKey)) return;

    WeekendXpressaddView(newsId)
      .then(() => {
        localStorage.setItem(viewKey, "true");
        refetch();
      })
      .catch(console.error);
  }, [newsId, refetch]);

  // ============================================
  // ⭐ WeekendXpressaddReadTime — Call Only Once After Timer
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

  // Read time
  const handleReadTime = async () => {
    const readKey = `read_time_sent_${newsId}`;
    if (localStorage.getItem(readKey)) return;

    try {
      await WeekendXpressaddReadTime(newsId, readTime);
      localStorage.setItem(readKey, "true");
    } catch (error) {
      console.error(error);
    }
  };

  // Reaction
  const handleReactions = (reactionId) => {
    WeekendlikeDislike(newsId, reactionId).then(() => refetch());
  };

  // Download
const handleDownload = async () => {
  try {
    // 1️⃣ Download PDF file
    const fileBlob = await WeekendXpressdownloadNews(newsId);
    const url = window.URL.createObjectURL(fileBlob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${newsDetails?.title || "WeekendXpress"}.pdf`
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    // 2️⃣ Update download count
    await WeekendXpressAddDownload(newsId);

    // 3️⃣ Refresh news details (updates downloadsCount)
    refetch();
  } catch (error) {
    console.error("Download failed:", error);
  }
};

  const formatDateOnly = (dateTime) => {
    if (!dateTime) return "";
    return dateTime.split(" ")[0]; // takes only DD-MM-YYYY
  };

  return (
    <>
      <div className="container-fluid px-30 px-md-3 px-3 mt-5">
        <div className="row g-3 justify-content-between ">
          <div className="col-xl-9 col-lg-8 col-md-12 col-12  ">
            <div className="detail-page-content">
              <h5 className="italic-text fw-600 fs-1812">
                {" "}
                {newsDetails?.title}
              </h5>
              <div className="reader-time-section px-0">
                <p
                  className="mb-0"
                  dangerouslySetInnerHTML={{ __html: newsDetails?.shortDesc }}
                />
                <div className="text-end">
                  <p className="mb-0 reading-time">
                    Updated:
                    <i class="fa-solid fa-calendar-days mx-2 orange-color"></i>
                    {formatDateOnly(newsDetails?.newsDate)}
                  </p>
                </div>
              </div>
              <div className="icons-section ">
                <div className="d-flex justify-content-center align-items-center ">
                  <ShareTooltip
                    userReactions={newsDetails?.userReactions || []}
                    onReactionClick={(reactionId) =>
                      handleReactions(reactionId)
               
                    }
                  />

                  <span className="ms-2">{newsDetails?.likesCount}</span>
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
                  <p style={{ cursor: "pointer" }} onClick={handleDownload}>
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
                      className="news-card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallback;
                        e.target.className =
                          "news-card-img fallback-img fallback-details";
                      }}
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
                {/* <p>
                  {newsDetails?.description }
                </p> */}

                {/* ================= COMMENTS SECTION ================= */}
                <div className="comments-bar mt-4">
                  <div className="comments-left">
                    {allComments.length === 0 ? (
                      <p className="comments-text">
                        Be the first to share a thought and become the
                        <span className="first-voice-pill"> First Voice </span>
                        of this News Article
                      </p>
                    ) : (
                      <button
                        className="px-3 py-2 details-page-button mt-2"
                        onClick={() => setShowComments((prev) => !prev)}
                      >
                        {showComments
                          ? "Hide Comments"
                          : `Read ${allComments.length} Comments`}
                      </button>
                    )}
                  </div>

                  {/* SHARE OPINION BUTTON */}
                  {allComments.length === 0 && !showComments && (
                    <button
                      className="share-opinion-btn"
                      onClick={() => setShowComments(true)}
                    >
                      Share your Opinion
                    </button>
                  )}
                </div>

                {/* COMMENT SECTION */}
                {showComments && (
                  <CommentSection
                    comments={allComments}
                    newsId={newsId}
                    autoFocus
                    type = "weekendXpress"
                  />
                )}

                {/* <div className="comments-bar mt-4">
  <div className="comments-left">
    <h5 className="comments-heading">Comments</h5>

    {allComments.length === 0 ? (
      <p className="comments-text">
        Be the first to share a thought and become the
        <span className="first-voice-pill"> First Voice </span>
        of this News Article
      </p>
    ) : (
      <p
        className="read-comments-link"
        onClick={() => {
          setShowComments((prev) => !prev);
          setShowCommentBox(true);
        }}
      >
        {showComments
          ? "Hide Comments"
          : `Read ${allComments.length} Comments`}
      </p>
    )}
  </div>

  {allComments.length === 0 && !showCommentBox && (
    <button
      className="share-opinion-btn"
      onClick={() => setShowCommentBox(true)}
    >
      Share your Opinion
    </button>
  )}
</div>

{(showCommentBox || showComments) && (
  <CommentSection
    comments={showComments ? allComments : []}
    newsId={newsId}
    autoFocus
  />
)} */}
              </div>
            </div>
          </div>
          <div className="col-xl-3 mt-4 col-lg-3 col-md-12 col-12 details-page-right-section right-bar-side detail-page-left-section">
            {topNews.length > 0 && <SidebarCategorySwiper items={topNews} />}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between flex-wrap mt-3">
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
        <div className="row px-2 row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 justify-content-center align-items-stretch gy-2 mt-lg-0 mt-md-1 mt-0 ">
          {newsDetails?.recommendedWeekendXpress.map((item, index) => (
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallback;
                        e.target.className = "news-card-img fallback-img";
                      }}
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
