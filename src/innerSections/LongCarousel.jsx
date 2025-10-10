import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import img1 from "../assets/image/category-news/4.png";
import orangeArrow from "../assets/image/orangeArrow.png";

const newsData = [
  {
    category: "Strengthening Synergy",
    slides: [
      {
        title:
          "MoP&NG delegates meet Hon’ble Minister for Food, Civil Supplies & Consumer Affairs, Government of Mizoram",
        image: img1,
      },
    ],
  },
  {
    category: "Learning Pathways",
    slides: [
      {
        title: "IIPM organises leadership development programme on mindfulness",
        image: img1,
      },
    ],
  },
  {
    category: "Meetings & Interactions",
    slides: [
      {
        title: "ED (Finance), MKHO, engages with IOAAD SO team",
        image: img1,
      },
    ],
  },
  {
    category: "Safety & Security",
    slides: [
      {
        title:
          "ED (Lubes), MKHO, engages with MPSO Lubes team on sales strategy and growth plans",
        image: img1,
      },
    ],
  },
  {
    category: "News at a Glance",
    slides: [
      {
        title:
          "IndianOil partners with Kolkata Police to unveil Durga Puja Guide Map",
        image: img1,
      },
    ],
  },
];

const LongCarousel = () => {
  const [loading, setLoading] = useState(true);

  // Simulate data loading delay (or remove to keep loader always true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container-fluid my-5 px-lg-5 px-md-3 px-3">
      <div className="row row-cols-xl-5 row-cols-lg-3 row-cols-md-2 row-cols-1 justify-content-center align-items-stretch gy-2">
        {(loading ? Array(5).fill({}) : newsData).map((item, index) => (
          <div className="col news-card-col d-flex" key={index}>
            <div className="card category-card h-100 w-100 d-flex flex-column">
              <div className="card-img-top">
                {loading ? (
                  <Skeleton height={180} />
                ) : (
                  <img
                    src={item.slides[0].image}
                    className="w-100"
                    alt="News Category"
                  />
                )}
              </div>

              <div className="card-title-carousel px-3 pt-2">
                <h5>{loading ? <Skeleton width={150} /> : item.category}</h5>
              </div>

              {(loading ? [1] : item.slides).map((data, i) => (
                <div
                  className="card-body d-flex flex-column justify-content-between flex-grow-1"
                  key={i}
                >
                  <h5 className="card-title italic-text">
                    {loading ? <Skeleton count={3} /> : data.title}
                  </h5>

                <Link className="arrow-img mt-auto">
                      <img src={orangeArrow} alt="More" />
                    </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LongCarousel;
