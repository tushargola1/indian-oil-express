
import mainImg from "../assets/image/banner/1.png";
import secondImg from "../assets/image/detail2.png";
import arrow from "../assets/image/arrow.png";
import { Link } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { useState } from "react";

const newsHighlights = [
    {
        category: "In Focus",
        title: "Hon’ble President of India unveils trophies of IndianOil Durand Cup Tournament",
        image: "/images/in-focus.jpg", // replace with your actual image path
        link: "#"
    },
    {
        category: "Spotlight",
        title: "Warm bonds at M/s Sonam Angdus Memorial Filling Station, Kargil",
        image: "/images/spotlight.jpg", // replace with actual path
        link: "#"
    },
    {
        category: "News Buzz",
        title: "Director (Finance) inaugurates Tax Audit and Compliance Solution (TACS) Portal",
        image: "/images/news-buzz.jpg", // replace with actual path
        link: "#"
    }
];

export default function NewsDetails() {
    const [showComment, setShowComment] = useState(false);
    return (
        <>
            <div className="container-fluid px-lg-5 px-md-3 px-3 mt-5">
                <div className="row g-5 align-items-center justify-content-between">
                    <div className="col-xl-9 col-lg-8 col-md-12 col-12 mt-4">
                        <div className="detail-page-content">
                            <h3 className="italic-text">Celebrating service in the Himalayas: Chairman 's heartfelt connect in Kargil & Srinagar</h3>

                            <div className="reader-time-section d-flex align-items-center justify-content-between flex-wrap gap-1">
                                <p className="mb-0">
                                    Xpress News Network with inputs from Yashpal Kant, CGM (Ops), PSO & Shumeela Farooq, SM (Aviation), Srinagar AFS

                                </p>
                                <p className="mb-0 reading-time">
                                    29-07-2025 | 1 minutes read
                                </p>
                            </div>
                            <div className="icons-section ">
                                <p>
                                    <i className="fa-regular fa-thumbs-up me-2"></i>
                                    <span>15</span>
                                </p>
                                <p>
                                    <i className="fa-regular fa-eye me-2"></i>
                                    <span>250</span>

                                </p>
                                <p>
                                    <i className="fa-solid fa-download"></i>

                                </p>
                                <p>
                                    <i className="fa-brands fa-readme me-2"></i>
                                    <span>35</span>

                                </p>
                                <p>
                                    <i className="fa-solid fa-share-nodes"></i>

                                </p>
                            </div>
                            <div className="news-details-main-img">
                                <div className="image-wrapper">
                                    <img src={mainImg} alt="Banner" className="banner-img-details" />
                                    <div className="blur-bg-details"></div>
                                    <div className="bannerContent-details">
                                        <h3 className="italic-text ">
                                            Chairman tying Rakhi to A WS drivers and TT crew at Zoji La Pass
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="news-details-content-section mt-4">
                                <p>
                                    Mr A S Sahney, Chairman, recently undertook a meaningful visit to Kargil & Srinagar, where he engaged closely with people across high-altitude passes,
                                    frontline installations, and historic sites.
                                </p>
                                <p className="fw-bold">
                                    Chairman salutes AWS drivers & TT crew at Loji La Pass
                                </p>
                            </div>
                            <div className="news-details-main-img">
                                <div className="image-wrapper">
                                    <img src={secondImg} alt="Banner" className="banner-img-details" />
                                    {/* <div className="blur-bg-details"></div>
                                    <div className="bannerContent-details">
                                        <h3 className="italic-text">
                                            Chairman tying Rakhi to A WS drivers and TT crew at Zoji La Pass
                                        </h3>
                                    </div> */}
                                </div>
                            </div>
                            <div className="news-details-content-section mb-4">
                                {
                                    Array.from({ length: 1 }).map((_, index) => (
                                        <div key={index}>
                                            <p >
                                                On the auspicious eve of Rakshabandhan, Mr Sahney visited the strategically critical Zoji La Pass, renowned for its challenging terrain and extreme weather.
                                                There, he met IndianOil' s dedicated team of Advance Winter Stocking (AWS) drivers and TT crew who ensure uninterrupted fuel supply to the nation's
                                                farthest corners. In a symbolic tribute and deeply touching moment, Mr Sahney tied Rakhis on the wrists Of drivers, recognising them as true guardians of the
                                                nation's energy security, and distributed sweets, adding festive warmth to the high-altitude post.


                                            </p>
                                        </div>
                                    ))
                                }
                                <button className="  px-3 py-2 details-page-button" onClick={() => setShowComment(true)}>
                                    Read Comments
                                </button>

                                {showComment && <CommentSection />}
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-5 flex-wrap">
                            <h3 className="recommanded-story-heading">
                                Recommanded Stories
                            </h3>
                            <div className="d-flex align-items-center gap-3 flex-wrap
                    ">
                                <p className="mb-0 hashtag-text">
                                    #Chairman
                                </p>
                                <p className="mb-0 hashtag-text">
                                    #Marketing Division
                                </p>
                                <p className="mb-0 hashtag-text">
                                    #RHQ
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 mt-4 col-lg-3 col-md-12 col-12 details-page-right-section right-bar-side">
                        {
                            newsHighlights.map((item, index) => (
                                <div className=" d-flex flex-column banner-2 " key={index}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="dark-blue-bg-color text-white details-right-category-heading">
                                            {item.category}
                                        </div>
                                        <Link
                                            className="arrow-btn text-start"
                                        >
                                            <img src={arrow} alt="arrow" />
                                        </Link>
                                    </div>
                                    <div className="details-right-category">
                                        <h4>
                                            {item.title}
                                        </h4>
                                        {/* <img
                                            src={mainImg}
                                            alt="Right Banner"
                                            className="right-bar-side-image mt-auto"
                                        /> */}
                                         <div className="image-wrapper image-wrapper-sidebar">
                                    <img src={mainImg} alt="Banner" className="banner-img-details " />
                                    <div className="blur-bg-details"></div>
                                   
                                </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>


                <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 justify-content-center align-items-stretch gy-2">

                    {Array.from({ length: 5 }).map((_, index) => (
                        <div className="col recommanded-story-col" key={index}>
                            <div className="details-right-category">
                                <h4>
                                    Hon ' ble President of India
                                    unveils trophies of IndianOil
                                    urand Cup Tournament
                                </h4>
                                <img
                                    src={mainImg}
                                    alt="Right Banner"
                                    className="right-bar-side-image  mt-4 mb-3"
                                />
                                <Link
                                    className="arrow-btn text-start"
                                >
                                    <img src={arrow} alt="arrow" />
                                </Link>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    )
}