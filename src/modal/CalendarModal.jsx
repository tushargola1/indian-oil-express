import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { apiBaseUrl } from "../Helper";
import FullCalendar from "@fullcalendar/react"; // FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // Month view plugin for FullCalendar

export default function CalendarModal({ isOpen, onClose }) {
  const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(today); // Date selected in the calendar or date picker
  const [highlightedDates, setHighlightedDates] = useState([]); // Dates to be highlighted in FullCalendar
  const [dropdownVisible, setDropdownVisible] = useState(false); // To toggle the dropdown for bulletins

  useEffect(() => {
    if (isOpen) {
      // Initially fetch bulletins for the selected (today's) date
      handleDateSelect({ target: { value: today } });
    }
  }, [isOpen]);

  // Fetch bulletins for the selected month
  const fetchBulletinsForMonth = async (startDate, endDate) => {
    try {
      const res = await axios.post(apiBaseUrl('Bulletins/GetBulletinsFL'), {
        searchValue: "",
        sortColumn: "",
        sortDirection: "DESC",
        start: 0,
        length: 10,
        bulletinTypeId: 1,
        fromDate: startDate,  // Start date for the month
        toDate: endDate,  // End date for the month
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        }
      });

      // Check if data exists and if it is an array
      if (res.data?.isSuccess && Array.isArray(res.data.data)) {
        const datesToHighlight = res.data.data.map(bulletin => {
          const date = new Date(bulletin.bulletinDate);
          return date.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
        });
        setHighlightedDates(datesToHighlight); // Set highlighted dates for FullCalendar
      } else {
        console.error("No bulletins found or invalid response structure", res.data);
      }
    } catch (err) {
      console.error("❌ Error fetching bulletins:", err);
    }
  };

  // Handle Date Selection from FullCalendar
  const handleDateSelect = async (e) => {
    const date = e.target.value || e.dateStr; // Handle both date picker and calendar click events
    setSelectedDate(date);

    // Get the selected month and year
    const selectedMonth = new Date(date).getMonth(); // Get the month index (0-11)
    const year = new Date(date).getFullYear();

    // Create the start and end date for the month
    const startDate = `${year}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`; // First day of the selected month
    const endDate = `${year}-${(selectedMonth + 1).toString().padStart(2, '0')}-31`; // Last day of the selected month

    // Fetch bulletins for the selected month
    await fetchBulletinsForMonth(startDate, endDate);
  };

  // Handle Download
  const handleDownload = async (item) => {
    try {
      const payload = {
        bulletinTypeId: Number(item.id), // Ensure number
        bulletinDate: selectedDate.trim(), // Must be "YYYY-MM-DD"
      };

      const res = await axios.post(apiBaseUrl('Bulletins/Download'),
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          responseType: "blob",
        }
      );

      // --- Download File ---
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title}-${selectedDate}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("❌ Download error:", err);
    }
  };

  // Handle Month Change (when user navigates months on FullCalendar)
  const handleMonthChange = async (arg) => {
    // Get the first day of the new month from the `view` object
    const startDate = arg.view.currentStart; // This is a Date object representing the first date in the view
    const year = startDate.getFullYear();
    const month = startDate.getMonth(); // Month is 0-based (0 = January, 11 = December)

    // Set the start and end dates for the month
    const startMonthDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
    const endMonthDate = `${year}-${(month + 1).toString().padStart(2, '0')}-31`;

    // Fetch bulletins for the selected month
    await fetchBulletinsForMonth(startMonthDate, endMonthDate);

    // Show an alert when the month is changed
    const monthName = startDate.toLocaleString('default', { month: 'long' });
    // alert(`You have selected the month of ${monthName} ${year}`);
  };

  if (!isOpen) return null;

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h4 className="modal-title">Select Bulletin Date</h4>

        {/* ---------------------------- */}
        {/* FullCalendar (Month View) */}
        {/* ---------------------------- */}

        <div className="calendar-view" style={{ marginTop: "20px" }}>
          <FullCalendar
            plugins={[dayGridPlugin]} // Month view plugin
            initialView="dayGridMonth"
            events={highlightedDates.map(date => ({
              title: 'Bulletin Date',
              date: date,
              backgroundColor: 'blue', // Color for the highlighted dates
              textColor: 'white',
            }))}
            dateClick={(info) => handleDateSelect({ target: { value: info.dateStr } })} 
            validRange={{
              start: '2025-01-01',
              end: today,
            }}
            eventColor="blue"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth',
            }}
            datesSet={handleMonthChange} // Triggered when month changes
            selectable={true}  // Enable date selection
            select={(info) => {
              setSelectedDate(info.startStr);  
              handleDateSelect({ target: { value: info.startStr } });
            }}
            selectedDates={[selectedDate]} 
          />
        </div>

        {/* ---------------------------- */}
        {/* Bulletin Dropdown */}
        {/* ---------------------------- */}
        {dropdownVisible && (
          <div className="dropdown-card mt-3">
            <h5 className="dropdown-title">Available Bulletins</h5>

            {options.length === 0 ? (
              <p className="no-data mb-0">No bulletins found for this date.</p>
            ) : (
              <ul className="dropdown-list">
                {options.map((item) => (
                  <li
                    key={item.id}
                    className="dropdown-item announcement-item-list d-flex justify-content-between align-items-center"
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
