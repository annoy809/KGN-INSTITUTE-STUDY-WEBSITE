import React, { useState } from 'react';
import './EnrolledSection.css'; // Reuse the same styles for consistency

const tabs = [
  { label: 'Publish', count: 0 },
  { label: 'Pending', count: 0 },
  { label: 'Draft', count: 0 },
  { label: 'Schedule', count: 0 },
];

const MyCourseSection = () => {
  const [activeTab, setActiveTab] = useState('Publish');

  return (
    <div className="enrolled-main">
      <h2 className="dashboard-title">My Courses</h2>
      <div className="enrolled-tabs">
        {tabs.map(tab => (
          <div
            key={tab.label}
            className={`enrolled-tab${activeTab === tab.label ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label} ({tab.count})
          </div>
        ))}
      </div>
      <div className="enrolled-content">
        <img
          src="https://www.svgrepo.com/show/489434/empty-mailbox.svg"
          alt="No Data"
          className="enrolled-empty-img"
        />
        <div className="enrolled-empty-text">No Data Available in this Section</div>
      </div>
    </div>
  );
};

export default MyCourseSection;