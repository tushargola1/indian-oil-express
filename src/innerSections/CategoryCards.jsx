// import categoryData from "../json/CategoryImgData";
import arrow from '../assets/image/home-img-card/arrow.png'
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../Helper";

export default function CategoryCard() {
  const [categoryData , setCategoryData] = useState([])
  useEffect(() =>{
    getWebPageData()
    getWebPageDatadd()
  } , [])
  const getWebPageData = () =>{
      axios.get(apiBaseUrl("WebPages/GetTopWebPages"), {
     headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
      })
      .then((res) =>{
  setCategoryData(res.data.data)
      })
      .catch((err) =>{
        console.log(err)
      })
    } 
    const getWebPageDatadd = () =>{
      axios.post(apiBaseUrl("XpressNews/GetXpressNewsFL"),
      {
          "searchValue": "",
  "sortColumn": "",
  "sortDirection": "ASC",
  "start": 0,
  "length": 10,
  "xpressNewsTypeId": 197,
  "leadershipCategoryId": "",
  "divisionId": "",
  "fromDate": "",
  "toDate": "",
  "showIn": "W"
      }
      ,
      {
     headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
      })
      .then((res) =>{
  console.log(res.data.data)
      })
      .catch((err) =>{
        console.log(err)
      })
    } 
  return (
    <div className="container-fluid mt-4 px-lg-5 px-md-3 px-3">
      <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 justify-content-center align-items-stretch gy-2">
        {categoryData.map((category, index) => (
          <div className="col news-card-col news-card-col-img" key={index}>
            {/* style={{
              background: `linear-gradient(241deg, ${category.color} 0%, rgba(255, 255, 255, 1) 100%)`
            }} */}
            <div className="card home-category-img-cards" >
              <div className="card-header card-img-heading d-flex align-items-center ">
                {/* <img
                  src={category.icon}
                  alt="icon"
                  style={{ width: "50px", height: '50px', objectFit: "cover" }}
                /> */}
                <p className="mb-0">
                  {category.name}
                </p>
                <Link to={"/news-detail"}>
                  <img
                    src={arrow}
                    alt="icon"
                    style={{ width: "50px", height: '50px', objectFit: "contain" }}
                  />
                </Link>

              </div>
              <ul className="list-group list-group-flush">
                {category.list.map((item, i) => (
                  <li className="list-group-item bg-transparent" key={i}>
                    <div className="row gy-3 home-img-card-section">
                      <div className="col-md-6 pe-0">
                        <img
                          src={item.imagePath}
                          alt=""
                          className="home-img-card-img"
                        />
                      </div>
                      <div className="col-md-6">
                        <p className="mb-0 home-img-card-content">{item.title}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* <div className="text-end">
                <Link>
                  <img src={arrow} alt="" style={{width:"60px" , height:'30px'}} className="mt-1"/>
                </Link>
              
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
