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

const newsHighlights = [
    {
        category: "In Focus",
        title:
            "Hon’ble President of India unveils trophies of IndianOil Durand Cup Tournament",
        image: "/images/in-focus.jpg", // replace with your actual image path
        link: "#",
    },
    {
        category: "Spotlight",
        title: "Warm bonds at M/s Sonam Angdus Memorial Filling Station, Kargil",
        image: "/images/spotlight.jpg", // replace with actual path
        link: "#",
    },
    {
        category: "News Buzz",
        title:
            "Director (Finance) inaugurates Tax Audit and Compliance Solution (TACS) Portal",
        image: "/images/news-buzz.jpg", // replace with actual path
        link: "#",
    },
];

const getNewsDetails = async (newsId) => {
    const url = apiBaseUrl(`XpressNews/GetXpressNewsDetails/${newsId}`);

    const res = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
    });

    // safest return
    return res?.data?.data ?? null;
};



export default function NewsDetails() {
    const { newsId } = useParams();
    const [readTime , setReadTime] = useState(0)
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
    }
    });

    const handleReaction = async (reactionId) => {
        try {
            const res = await axios.post(
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

    useEffect(() => {
        if (!newsId) return;
        axios.post(
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
            })
            .catch((err) => {
                console.log("AddView API failed:", err);
            });

    }, [newsId]);
    const handleReadTime = () => {
        axios.post(apiBaseUrl("XpressNews/AddReadTime"),
            {
                "xpressNewsId": newsId,
                "readTime": readTime,
                "ipAddress": "::1"
            }
        )
    }

    const handleDownload = async () => {
        try {
            const res = await axios.post(apiBaseUrl('XpressNews/AddDownload'),
                {
                    "xpressNewsId": newsId,
                    "ipAddress": "::1"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                }
            )
            refetch();
        }
        catch (error) {
            console.error("Reaction API failed:", error);
        }


    }

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
                                    <p
                                        style={{ cursor: "pointer" }}
                                        onClick={handleDownload}
                                    >
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
                <button
                  className="  px-3 py-2 details-page-button"
                  onClick={() => setShowComment(true)}
                >
                  Read Comments
                </button>

                {showComment && <CommentSection />}
              </div> */}
                        </div>
                    </div>
                    <div className="col-xl-3 mt-4 col-lg-3 col-md-12 col-12 details-page-right-section right-bar-side detail-page-left-section">
                        {newsHighlights.map((item, index) => (
                            <div className=" d-flex flex-column banner-2 " key={index}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="dark-blue-bg-color text-white details-right-category-heading">
                                        {item.category}
                                    </div>
                                    <Link
                                        className="arrow-btn text-start"
                                        to={`/news-listing/${item.id}`}
                                    >
                                        <img src={arrow} alt="arrow" />
                                    </Link>
                                </div>
                                <div className="details-right-category details-right-category-sidebar">
                                    <h4>{item.title}</h4>
                                    {/* <img
                                            src={mainImg}
                                            alt="Right Banner"
                                            className="right-bar-side-image mt-auto"
                                        /> */}
                                    <div className="image-wrapper image-wrapper-sidebar">
                                        <img
                                            src={mainImg}
                                            alt="Banner"
                                            className="banner-img-details "
                                        />
                                        <div className="blur-bg-details"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-between  flex-wrap">
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
                                <Link
                                    to={`/news-detail/${item.id}`}
                                >
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
