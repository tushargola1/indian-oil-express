
import axios from 'axios';
import { apiBaseUrl } from '../Helper';

// login encryption
import { Encryption } from '../authentication/Encryption';

// cookies
import Cookies from "js-cookie";

// login api 
export const loginApi = (email, password) => {
  const rawBody = JSON.stringify({
    username: Encryption(email),
    password: Encryption(password),
  });

  return axios
    .post(apiBaseUrl("Auth/SapLogin"), rawBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      console.log('✅ Login Response:', res.data);
      if (res.data.isSuccess) {
        return { success: true, data: res.data }; // Return success data
      } else {
        return { success: false, message: res.data.message }; // Return error message
      }
    })
    .catch((err) => {
      console.error('❌ Error:', err);
      return { success: false, message: err.response?.data?.message || 'Server error' }; // Return error message
    });
};
  
// home top banner api
 export const fetchBannerData = async () => {
  const response = await axios.post(
    apiBaseUrl("XpressNews/GetTopXpressNewsFHPS"),
    { showIn: "W" },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );
  return response.data.data;
};

// Fetch Announcements list
 export const fetchAnnouncements = async () => {
  const response = await axios.get(
    apiBaseUrl("Announcements/GetAnnouncements"),
    // { showIn: "W" },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );
  return response.data.data
};

// top xpress news
export const fetchTopXpressNews = async () => {
  const res = await axios.post(
    apiBaseUrl("XpressNews/GetTopXpressNews"),
    { showIn: "W" },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  const getCategoryColor = (name) => {
    switch (name) {
      case "Spotlight":
        return "#69a9b9";
      case "News Buzz":
        return "#61a884";
      case "Achievers":
        return "#f37127";
      case "Community Connect":
        return "#f28bb6";
      default:
        return "#0e4094";
    }
  };

  // Transform API response
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
    color: getCategoryColor(category.name),
  }));
};

// web news data
export const getWebPageData = async () => {
  const res = await axios.get(apiBaseUrl("WebPages/GetTopWebPages"), {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  return res.data.data;
};
