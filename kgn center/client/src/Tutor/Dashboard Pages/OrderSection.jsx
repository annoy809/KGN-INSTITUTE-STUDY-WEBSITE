import React, { useState } from 'react';
import './OrderSection.css'; // Assuming you have a CSS file for styling

const filters = ['Today', 'Monthly', 'Yearly'];

const OrderSection = () => {
  const [activeFilter, setActiveFilter] = useState('Today');
  return (
    <div className="enrolled-main">
      <h2 className="dashboard-title">Order History</h2>
      <div className="order-controls">
        <div className="order-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`order-filter-btn${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="order-date-range">
          <input
            type="text"
            placeholder="Y-M-d -- Y-M-d"
            readOnly
          />
          <span className="order-date-icon">&#128197;</span>
        </div>
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

export default OrderSection;