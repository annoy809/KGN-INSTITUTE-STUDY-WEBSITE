import React from "react";

const Suggestions = () => {
  return (
    <div className="suggestions">
      <h3>You might also like</h3>
      <div className="suggestion-list">
        {/* Dummy items here */}
        <div className="suggestion-card">
          <img src="/images/item1.png" alt="Course" />
          <p className="sug-title">The Web Developer Bootcamp</p>
          <p className="sug-price">₹3,289</p>
        </div>
        <div className="suggestion-card">
          <img src="/images/item2.png" alt="Course" />
          <p className="sug-title">JS Interview Prep</p>
          <p className="sug-price">₹839</p>
        </div>
        {/* Add more as needed */}
      </div>
    </div>
  );
};

export default Suggestions;
