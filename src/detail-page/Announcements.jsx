import axios from "axios";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { apiBaseUrl } from "../Helper";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Fetch announcement details from API
const fetchAnnouncementDetails = async (announcementId) => {
  const res = await axios.get(apiBaseUrl(`Announcements/GetVM/${announcementId}`), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  return res.data?.data;
};

const Announcements = () => {
    const {announcementId} = useParams();
    const { data: announcement, isLoading, isError } = useQuery({
    queryKey: ["announcement", announcementId],
    queryFn: () => fetchAnnouncementDetails(announcementId),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
});


  if (isLoading) {
    return <p className="text-center mt-5">Loading announcement...</p>;
  }

  if (isError || !announcement) {
    return <p className="text-center mt-5 text-danger">Failed to load announcement.</p>;
  }

  return (
    <div className="container-fluid px-lg-5 px-md-3 px-3 mt-5">
      {/* TITLE */}
      <h5 className="italic-text fw-bold">{announcement.title}</h5>

      {/* SUBTITLE */}
      <p className="text-muted">{announcement.subTitle}</p>

      {/* PDF VIEWER */}
      <div className="pdf-viewer border p-3 bg-light text-center">
        <Document
          file={announcement.fileName}
          onLoadError={(err) => console.error("Failed to load PDF", err)}
          // loading={<p>Loading PDF...</p>}
        >
          <Page pageNumber={1} width={600} />
        </Document>

        {/* DOWNLOAD BUTTON */}
        {/* <a
          href={announcement.fileName}
          className="btn btn-primary mt-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-solid fa-download me-2"></i>
          Download PDF
        </a> */}
      </div>
    </div>
  );
};

export default Announcements;
