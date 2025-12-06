import React, { useState } from "react";
import "./Schedulecard.css";

const ScheduleBox = () => {
  const [isScheduled, setIsScheduled] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());

  const handleToggle = () => {
    setIsScheduled(!isScheduled);
  };

  const handleDateChange = (e) => {
    setScheduledDate(new Date(e.target.value));
    setShowPicker(false);
  };

  const handleDelete = () => {
    setScheduledDate(null);
  };

  return (
    <div className="schedule-box">
      <div className="header">
        <h4>Schedule</h4>
        <label className="switch">
          <input type="checkbox" checked={isScheduled} onChange={handleToggle} />
          <span className="slider round"></span>
        </label>
      </div>

      {isScheduled && (
        <>
          <p className="scheduled-label">Scheduled for</p>
          <div className="icon-actions">
            <button onClick={handleDelete} title="Delete">
              🗑️
            </button>
            <button onClick={() => setShowPicker(!showPicker)} title="Edit">
              ✏️
            </button>
          </div>

          {scheduledDate && (
            <div className="date-display">
              {scheduledDate.toLocaleString()}
            </div>
          )}

          {showPicker && (
            <input
              type="datetime-local"
              className="datetime-picker"
              onChange={handleDateChange}
              defaultValue={scheduledDate.toISOString().slice(0, 16)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ScheduleBox;
