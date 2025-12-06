import React from 'react';
import './AnnoucementSection.css'; // Assuming you have a CSS file for styling

const AnnoucementSection = () => (
  <div className="enrolled-main">
    {/* Announcement Banner */}
    <div className="announcement-banner">
      <div className="announcement-banner-icon">
        <span role="img" aria-label="announcement" style={{ fontSize: 36, color: '#3f63e0' }}>📢</span>
      </div>
      <div className="announcement-banner-text">
        <div className="announcement-banner-title">Create Announcement</div>
        <div className="announcement-banner-desc">Notify all students of your course</div>
      </div>
      <button className="announcement-banner-btn">Add New Announcement</button>
    </div>

    {/* Filters */}
    <div className="announcement-filters">
      <div>
        <div className="announcement-filter-label">Courses</div>
        <select className="announcement-filter-select">
          <option>All</option>
        </select>
      </div>
      <div>
        <div className="announcement-filter-label">Sort By</div>
        <select className="announcement-filter-select">
          <option>DESC</option>
          <option>ASC</option>
        </select>
      </div>
      <div>
        <div className="announcement-filter-label">Date</div>
        <div className="announcement-date-input-wrap">
          <input className="announcement-date-input" type="text" placeholder="Y-M-d" readOnly />
          <span className="announcement-date-icon">&#128197;</span>
        </div>
      </div>
    </div>

    {/* Table */}
    <div className="announcement-table">
      <div className="announcement-table-header">
        <div className="announcement-table-date">Date</div>
        <div className="announcement-table-title">Announcements</div>
      </div>
      <div className="enrolled-content" style={{ minHeight: 220 }}>
        <img
          src="https://www.svgrepo.com/show/489434/empty-mailbox.svg"
          alt="No Data"
          className="enrolled-empty-img"
        />
        <div className="enrolled-empty-text">No Data Available in this Section</div>
      </div>
    </div>
  </div>
);

export default AnnoucementSection;