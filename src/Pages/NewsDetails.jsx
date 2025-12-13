// ===================== React =====================
import { useEffect, useState } from "react";

// ===================== Routing =====================
import { Link, useLocation, useParams } from "react-router-dom";

// ===================== Data & API =====================
import { useQuery } from "@tanstack/react-query";
import { 
  addReadTime, 
  addView, 
  downloadNews, 
  fetchTopNews, 
  getAllComments, 
  getNewsDetails, 
  likeDislike 
} from "../components/ApiFunctions";

// ===================== UI Components =====================
import ShareTooltip from "../components/ShareTooltip";
import CommentSection from "../components/CommentSection";
import SidebarCategorySwiper from "../detail-page/SidebarCategorySwiper";

// ===================== Swiper (Carousel) =====================
import "swiper/css";
import "swiper/css/navigation";

// ===================== Assets =====================
import arrow from "../assets/image/arrow.png";
import fallback from "../assets/image/fallback.png";


export default function NewsDetails() {
  const location = useLocation();

  const { newsId } = useParams();
  const [readTime, setReadTime] = useState(0);
  const [showComment, setShowComment] = useState(false);

  const newsType = location?.state?.type || "XpressNews";

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
    if (localStorage.getItem(viewKey)) return;

    addView(newsId)
      .then(() => {
        localStorage.setItem(viewKey, "true");
        refetch();
      })
      .catch(console.error);
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

  // Read time
  const handleReadTime = async () => {
    const readKey = `read_time_sent_${newsId}`;
    if (localStorage.getItem(readKey)) return;

    try {
      await addReadTime(newsId, readTime);
      localStorage.setItem(readKey, "true");
    } catch (error) {
      console.error(error);
    }
  };


  // Reaction
  const handleReaction = (reactionId) => {
    likeDislike(newsId, reactionId).then(() => refetch());
  };

  // Download
  const handleDownload = async () => {
    try {
      const fileBlob = await downloadNews(newsId);
      const url = window.URL.createObjectURL(new Blob([fileBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${newsDetails?.title || "file"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      await addDownload(newsId);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container-fluid px-30 px-md-3 px-3 mt-5">
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
                  <p >
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
                  {newsDetails?.imagePath?.startsWith("https://ioclxpressapp.businesstowork.com") ? (
                    <img
                      src={newsDetails?.imagePath}
                      alt="News"
                      className="news-card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallback;
                        e.target.className = "news-card-img fallback-img fallback-details";
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
                <button
                  className="px-3 py-2 details-page-button mt-4 "
                  onClick={() => setShowComment((prev) => !prev)}
                >
                  {showComment ? "Hide Comments" : "Read Comments"}
                </button>

                {showComment && (
                  <CommentSection comments={allComments} newsId={newsId} />
                )}
              </div>
             
            </div>
          </div>
          <div className="col-xl-3 mt-4 col-lg-3 col-md-12 col-12 details-page-right-section right-bar-side detail-page-left-section">
            {topNews.length > 0 && <SidebarCategorySwiper items={topNews} />}
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
        <div className="row px-2 row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 justify-content-center align-items-stretch gy-2 mt-lg-0 mt-md-1 mt-0 ">
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
                  {item.imagePath?.startsWith("https://ioclxpressapp.businesstowork.com") ? (
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
