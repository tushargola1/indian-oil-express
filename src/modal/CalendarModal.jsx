import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { apiBaseUrl } from "../Helper";

export default function CalendarModal({ isOpen, onClose }) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(today);
  const [options, setOptions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  if (!isOpen) return null;

  // -----------------------------------------------------
  // 📌 Fetch Bulletins by selected date
  // -----------------------------------------------------
  const handleDateSelect = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    try {
      const res = await axios.post(
        apiBaseUrl('Bulletins/GetByDate'),
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
      console.log("GetByDate failed:", err);
      setOptions([]);
      setDropdownVisible(false);
    }
  };

  // -----------------------------------------------------
  // 📌 Download Bulletin File
  // -----------------------------------------------------
const handleDownload = async (item) => {
  try {
    const payload = {
      bulletinTypeId: Number(item.id),      // ensure number
      bulletinDate: selectedDate.trim(),   // must be "YYYY-MM-DD"
    };

    console.log("📤 Sending payload:", payload);

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

    // --- download file ---
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.text}-${selectedDate}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error("❌ Download error:", err);
  }
};


  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <h4 className="modal-title">Select Bulletin Date</h4>

        {/* -------------------------------------------------- */}
        {/* 📅 HTML DATE PICKER */}
        {/* -------------------------------------------------- */}
        <input
          type="date"
          className="date-picker"
          max={today}          // ❌ disable future dates
          value={selectedDate}
          onChange={handleDateSelect}
        />

        {/* -------------------------------------------------- */}
        {/* 📌 DROPDOWN CARD LIST */}
        {/* -------------------------------------------------- */}
        {dropdownVisible && (
          <div className="dropdown-card mt-3">
            <h5 className="dropdown-title">Available Bulletins</h5>

            {options.length === 0 ? (
              <p className="no-data">No bulletins found for this date.</p>
            ) : (
              <ul className="dropdown-list">
                {options.map((item) => (
                  <li
                    key={item.id}
                    className="dropdown-item"
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
