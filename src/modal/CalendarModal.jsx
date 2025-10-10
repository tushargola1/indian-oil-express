"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function CalendarModal({ isOpen, onClose }) {
  const [value, onChange] = useState(new Date());

  if (!isOpen) return null;

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div
        className="calendar-container"
        onClick={(e) => e.stopPropagation()} // prevent closing on inside click
      >
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <Calendar onChange={onChange} value={value} />

        <p className="selected-date">
          Selected:{" "}
          {Array.isArray(value)
            ? `${value[0]?.toDateString()} → ${value[1]?.toDateString()}`
            : value?.toDateString()}
        </p>
      </div>
    </div>
  );
}
