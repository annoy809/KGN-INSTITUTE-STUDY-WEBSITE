import React from "react";
import { Link } from "react-router-dom";
import "./Topbar.css";

const TopBar = () => {
  return (
    <div className="topbar">
      <Link to="/" className="new-course-btn">
        <span className="plus-icon">←</span> Back
      </Link>
    </div>
  );
};

export default TopBar;
