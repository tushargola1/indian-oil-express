import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { apiBaseUrl } from "../Helper";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";

export default function CalendarModal({ isOpen, onClose }) {

const formatToDDMMYYYY = (dateStr) => {
  return format(new Date(dateStr), "dd-MM-yyyy");
};
const today = format(new Date(), "dd-MM-yyyy");


const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowFormatted = format(tomorrow, "dd-MM-yyyy"); // now in DD-MM-YYYY


  const [selectedDate, setSelectedDate] = useState(today);
  const [options, setOptions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState([]);

  const lastFetchedMonthRef = useRef("");

  /* -------------------------------------------------------
     🔹 Fetch bulletins for DATE
  ------------------------------------------------------- */
  const fetchByDate = async (date) => {
    try {
      const res = await axios.post(
        apiBaseUrl("Bulletins/GetByDate"),
        { bulletinDate: date },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOptions(res.data?.data || []);
      setDropdownVisible(true);
    } catch (err) {
      console.error("GetByDate error:", err);
      setOptions([]);
      setDropdownVisible(false);
    }
  };

  /* -------------------------------------------------------
     🔹 Fetch bulletins for MONTH (Highlight Dates)
  ------------------------------------------------------- */
  const fetchMonthBulletins = async (startDate, endDate, monthKey) => {
    try {
      const res = await axios.post(
        apiBaseUrl("Bulletins/GetBulletinsFL"),
        {
          searchValue: "",
          sortColumn: "",
          sortDirection: "DESC",
          start: 0,
          length: 100,
          bulletinTypeId: 1,
          fromDate: startDate,
          toDate: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const list = res.data?.data?.data || [];

      // Convert the dates to YYYY-MM-DD format
      const dates = list
        .map((item) => {
          const dateStr = item.bulletinDate.split(" ")[0]; // Get date part (DD-MM-YYYY)
          const [day, month, year] = dateStr.split("-");
     const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

          return formattedDate;
        })
        .filter(Boolean);

      setHighlightedDates(dates);
      lastFetchedMonthRef.current = monthKey;
    } catch (err) {
      console.error("Month fetch error:", err);
    }
  };

  /* -------------------------------------------------------
     🔹 Date Click
  ------------------------------------------------------- */
const handleDateClick = (info) => {
  const formattedDate = formatToMMDDYYYY(info.dateStr);
  setSelectedDate(formattedDate);
  fetchByDate(formattedDate);
};

  /* -------------------------------------------------------
     🔹 Month Change (SAFE)
  ------------------------------------------------------- */
  const handleMonthChange = (arg) => {
    const start = arg.view.currentStart;
    const year = start.getFullYear();
    const month = start.getMonth() + 1;

    const monthKey = `${year}-${month}`;

    // 🚫 Stop duplicate API calls
    if (lastFetchedMonthRef.current === monthKey) return;

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    fetchMonthBulletins(startDate, endDate, monthKey);
  };


   const handleDownload = async (item) => {
    try {
      const res = await axios.post(
        apiBaseUrl("Bulletins/Download"),
        {
          bulletinTypeId: Number(item.id),
          bulletinDate: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.text}-${selectedDate}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };


  /* -------------------------------------------------------
     🔹 Initial Load
  ------------------------------------------------------- */
useEffect(() => {
  if (!isOpen) return;

  const todayFormatted = format(new Date(), "MM-dd-yyyy");
  setSelectedDate(todayFormatted);
  fetchByDate(todayFormatted);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthKey = `${year}-${month}`;

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

  fetchMonthBulletins(startDate, endDate, monthKey);
}, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn cursor-pointer" onClick={onClose}>✕</button>

        <h4 className="modal-title">Select Bulletin Date</h4>

        {/* ------------------ CALENDAR ------------------ */}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          datesSet={handleMonthChange}
          selectable
          validRange={{
            end: tomorrowFormatted,
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          dayCellClassNames={(arg) =>
            arg.dateStr === selectedDate ? ["selected-date"] : []
          }
          events={highlightedDates.map((date) => ({
            start: date,
            display: "background",
            backgroundColor: "rgba(253, 13, 13, 1)", 
            cursor: "pointer",
          }))}
        />

        {/* ---------------- BULLETINS LIST ---------------- */}
        {dropdownVisible && (
          <div className="dropdown-card mt-3">
            <h5 className="dropdown-title">Bulletins for {selectedDate}</h5>

            {options.length === 0 ? (
              <p className="no-data mb-0">No bulletins found.</p>
            ) : (
              <ul className="dropdown-list">
             {options.map((item) => (
                   <li
                     key={item.id}
                     className="dropdown-item d-flex justify-content-between align-items-center dropdown-list-section"
                     onClick={() => handleDownload(item)}
                   >
                     <span>{item.text}</span>
                     <i className="fa fa-download"></i>
                   </li>
                 ))}

                
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}