
import axios from 'axios';
import { apiBaseUrl } from '../Helper';

// login encryption
import { Encryption } from '../authentication/Encryption';

// cookies
import Cookies from "js-cookie";

// headers
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${Cookies.get("accessToken")}`,
};


// header weekend xpress nav dropdown
export const getWeekendXpress = async () => {
  const res = await axios.get(apiBaseUrl('WeekendXpressTypes/GetDropdown'), {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  })
  return res?.data?.data
}

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

// Fetch announcement details 
export const fetchAnnouncementDetails = async (announcementId) => {
  const res = await axios.get(apiBaseUrl(`Announcements/GetVM/${announcementId}`), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  return res.data?.data;
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

// news details
export const getNewsDetails = async (newsId) => {
  const url = apiBaseUrl(`XpressNews/GetXpressNewsDetails/${newsId}`);

  const res = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });

  return res?.data?.data ?? null;
};

// Express listing page

export const expressDetails = async () => {
  const url = apiBaseUrl(`XpressNews/GetXpressNewsTDTY`);
console.log("📡 Full API Response:", url);  
  const res = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  console.log("📡 Full API Response:", res.data.data);   
   return res?.data?.data ?? null;
};

// get details page sidebar data
export const fetchTopNews = async (newsType, newsId) => {
  if (newsType === "XpressNews") {
    const res = await axios.post(
      apiBaseUrl("XpressNews/GetTopXpressNews"),
      { showIn: "W" },
      { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } }
    );

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
  } else {
    // Correct GET with query params
    const res = await axios.get(apiBaseUrl("WebPages/GetTopWebPages"), {
      headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      params: { showIn: "W" }, // query params
    });

    // Normalize data for SidebarCategorySwiper
    return (res?.data?.data || []).map((item) => ({
      category: item.name,
      categoryId: item.id,
      slides: (item.list || []).map((slide) => ({
        slideId: slide.id,
        title: slide.title,
        image: slide.imagePath,
      })),
    }));
  }
};

// get all comments
export const getAllComments = async (newsId) => {
  const res = await axios.get(
    apiBaseUrl(`XpressNews/GetXpressNewsComments/${newsId}`),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  return res?.data?.data ?? []; // <-- ALWAYS ARRAY
};

// Add a view
export const addView = async (newsId) => {
  const { data } = await axios.post(
    apiBaseUrl("XpressNews/AddView"),
    { xpressNewsId: newsId, ipAddress: "::1" },
    { headers }
  );
  return data;
};

// Add read time
export const addReadTime = async (newsId, readTime) => {
  const { data } = await axios.post(
    apiBaseUrl("XpressNews/AddReadTime"),
    { xpressNewsId: newsId, readTime, ipAddress: "::1" },
    { headers }
  );
  return data;
};

// Reaction API
export const likeDislike = async (newsId, reactionId) => {
  const { data } = await axios.post(
    apiBaseUrl("XpressNews/LikeDislike"),
    { xpressNewsId: newsId, likeTypeId: reactionId, ipAddress: "::1" },
    { headers }
  );
  return data;
};

// Download API
export const downloadNews = async (newsId) => {
  const res = await axios.get(apiBaseUrl(`XpressNews/Download/${newsId}`), {
    headers,
    responseType: "blob",
  });
  return res.data;
};

// Increment download count
export const addDownload = async (newsId) => {
  const { data } = await axios.post(
    apiBaseUrl("XpressNews/AddDownload"),
    { xpressNewsId: newsId, ipAddress: "::1" },
    { headers }
  );
  return data;
};

// news listing
export const getNewsListing = async (page, ITEMS_PER_PAGE, newsId, newsType) => {
  const start = (page - 1) * ITEMS_PER_PAGE;

  const xpress = newsType === "XpressNews";

  const endpoint = xpress
    ? "XpressNews/GetXpressNewsFL"
    : "WebPages/GetWebPagesFL";

  const paramNewsId = xpress ? "xpressNewsTypeId" : "webPageCategoryId";

  const res = await axios.post(
    apiBaseUrl(endpoint),
    {
      searchValue: "",
      sortColumn: "",
      sortDirection: "ASC",
      start,
      length: ITEMS_PER_PAGE,
      [paramNewsId]: Number(newsId),
      leadershipCategoryId: "",
      divisionId: "",
      fromDate: "",
      toDate: "",
      showIn: "W",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  // ✅ Return structured response
  return {
    data: res.data.data.data || [],
    totalRecords: res.data.data.recordsFiltered || 0,
  };
};

// listing page sidebar categories
export const getXpressCategories = async () => {
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
  return res.data.data.map((category) => ({
    id: category.id,
    category: category.name,
  }));
};

export const getWebPageCategories = async () => {
  const res = await axios.get(apiBaseUrl("WebPages/GetTopWebPages"), {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });

  return res.data.data.map((item) => ({
    id: item.id,
    category: item.name,
  }));
};

expressDetails();