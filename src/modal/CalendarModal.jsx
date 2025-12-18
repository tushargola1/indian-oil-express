// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { apiBaseUrl } from "../Helper";

// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

// export default function CalendarModal({ isOpen, onClose }) {
//   const today = new Date().toISOString().split("T")[0];

//   const [selectedDate, setSelectedDate] = useState(today);
//   const [options, setOptions] = useState([]);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [highlightedDates, setHighlightedDates] = useState([]);

//   const lastFetchedMonthRef = useRef("");

//   /* -------------------------------------------------------
//      🔹 Fetch bulletins for DATE
//   ------------------------------------------------------- */
//   const fetchByDate = async (date) => {
//     try {
//       const res = await axios.post(
//         apiBaseUrl("Bulletins/GetByDate"),
//         { bulletinDate: date },
//         {
//           headers: {
//             Authorization: `Bearer ${Cookies.get("accessToken")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setOptions(res.data?.data || []);
//       setDropdownVisible(true);
//     } catch (err) {
//       console.error("GetByDate error:", err);
//       setOptions([]);
//       setDropdownVisible(false);
//     }
//   };

//   /* -------------------------------------------------------
//      🔹 Fetch bulletins for MONTH (Highlight Dates)
//   ------------------------------------------------------- */
//   const fetchMonthBulletins = async (startDate, endDate, monthKey) => {
//     try {
//       const res = await axios.post(
//         apiBaseUrl("Bulletins/GetBulletinsFL"),
//         {
//           searchValue: "",
//           sortColumn: "",
//           sortDirection: "DESC",
//           start: 0,
//           length: 100,
//           bulletinTypeId: 1,
//           fromDate: startDate,
//           toDate: endDate,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${Cookies.get("accessToken")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const list = res.data?.data?.data || [];

//       const dates = list
//         .map((item) => {
//           const d = new Date(item.bulletinDate);
//           return isNaN(d) ? null : d.toISOString().split("T")[0];
//         })
//         .filter(Boolean);

//       setHighlightedDates(dates);
//       lastFetchedMonthRef.current = monthKey;
//     } catch (err) {
//       console.error("Month fetch error:", err);
//     }
//   };

//   /* -------------------------------------------------------
//      🔹 Date Click
//   ------------------------------------------------------- */
//   const handleDateClick = (info) => {
//     setSelectedDate(info.dateStr);
//     fetchByDate(info.dateStr);
//   };

//   /* -------------------------------------------------------
//      🔹 Month Change (SAFE)
//   ------------------------------------------------------- */
//   const handleMonthChange = (arg) => {
//     const start = arg.view.currentStart;
//     const year = start.getFullYear();
//     const month = start.getMonth() + 1;

//     const monthKey = `${year}-${month}`;

//     // 🚫 Stop duplicate API calls
//     if (lastFetchedMonthRef.current === monthKey) return;

//     const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
//     const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

//     fetchMonthBulletins(startDate, endDate, monthKey);
//   };

//   /* -------------------------------------------------------
//      🔹 Initial Load
//   ------------------------------------------------------- */
//   useEffect(() => {
//     if (!isOpen) return;

//     fetchByDate(today);

//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth() + 1;
//     const monthKey = `${year}-${month}`;

//     const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
//     const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

//     fetchMonthBulletins(startDate, endDate, monthKey);
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="calendar-overlay" onClick={onClose}>
//       <div className="calendar-container" onClick={(e) => e.stopPropagation()}>
//         <button className="close-btn" onClick={onClose}>✕</button>

//         <h4 className="modal-title">Select Bulletin Date</h4>

//         {/* ------------------ CALENDAR ------------------ */}
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           dateClick={handleDateClick}
//           datesSet={handleMonthChange}
//           selectable
//           validRange={{
//             start: "2025-01-01",
//             end: today,
//           }}
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "",
//           }}
//           dayCellClassNames={(arg) =>
//             arg.dateStr === selectedDate ? ["selected-date"] : []
//           }
//           events={highlightedDates.map((date) => ({
//             start: date,
//             display: "background",
//             backgroundColor: "rgba(13, 110, 253, 0.25)",
//           }))}

//         />

//         {/* ---------------- BULLETINS LIST ---------------- */}
//         {dropdownVisible && (
//           <div className="dropdown-card mt-3">
//             <h5 className="dropdown-title">Bulletins for {selectedDate}</h5>

//             {options.length === 0 ? (
//               <p className="no-data mb-0">No bulletins found.</p>
//             ) : (
//               <ul className="dropdown-list">
//                 {options.map((item) => (
//                   <li
//                     key={item.id}
//                     className="dropdown-item d-flex justify-content-between align-items-center"
//                     onClick={() => handleDownload(item)}
//                   >
//                     <span>{item.text}</span>
//                     <i className="fa fa-download"></i>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useRef } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import { format } from 'date-fns';

// export default function CalendarModal({ isOpen, onClose }) {
//   // Convert date format (DD-MM-YYYY to YYYY-MM-DD)
//   const formatDate = (dateStr) => {
//     const [day, month, year] = dateStr.split("-");
//     return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
//   };

//   // Array of dates to highlight
//   const highlightDates = ["7-11-2025", "30-03-2025"];
  
//   // Convert the date strings into a usable format (YYYY-MM-DD)
//   const highlightedDates = highlightDates.map(formatDate);

//   const calendarRef = useRef(null);

//   const handleDatesSet = (data) => {
//     const calendarApi = data.view.calendar;

//     // Loop over all the dates in the current view
//     const cells = document.querySelectorAll('.fc-daygrid-day');
//     cells.forEach((cell) => {
//       const date = cell.getAttribute('data-date'); // FullCalendar stores date in data-date attribute
//       if (highlightedDates.includes(date)) {
//         cell.classList.add('highlighted'); // Add your custom class to highlight
//       } else {
//         cell.classList.remove('highlighted'); // Remove the class if the date is not in the array
//       }
//     });
//   };

//   return (
//     <div>
//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin]}
//         initialView="dayGridMonth"
//         datesSet={handleDatesSet} // Hook for when the calendar view is set
//         headerToolbar={{
//           left: 'prev,next today',
//           center: 'title',
//           right: 'dayGridMonth',
//         }}
//         events={[]}  // You can add events if needed
//       />
//       <style>
//         {`
//           .highlighted {
//             background-color: #ff9800 !important; /* Highlight color */
//             color: white !important;
//             border-radius: 50%;
//           }
//         `}
//       </style>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { apiBaseUrl } from "../Helper";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, parse } from "date-fns";

export default function CalendarModal({ isOpen, onClose }) {
  const today = new Date().toISOString().split("T")[0];

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
    setSelectedDate(info.dateStr);
    fetchByDate(info.dateStr);
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

  /* -------------------------------------------------------
     🔹 Initial Load
  ------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    fetchByDate(today);

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
        <button className="close-btn" onClick={onClose}>✕</button>

        <h4 className="modal-title">Select Bulletin Date</h4>

        {/* ------------------ CALENDAR ------------------ */}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          datesSet={handleMonthChange}
          selectable
          validRange={{
            start: "2025-01-01",
            end: today,
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
            backgroundColor: "rgba(253, 13, 13, 1)", // Highlight color
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
                    className="dropdown-item d-flex justify-content-between align-items-center"
                    onClick={() => handleDownload(item)}
                  >
                    <span>{item.title}</span>
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
