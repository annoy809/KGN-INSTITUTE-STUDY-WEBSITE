import React from 'react';
import './EnrolledSection.css'; // Reuse the same styles for consistency

const QuizAttemptsSection = () => (
  <div className="enrolled-main">
    <h2 className="dashboard-title">My Quiz Attempts</h2>
    <div className="enrolled-content">
      <img
        src="https://www.svgrepo.com/show/489434/empty-mailbox.svg"
        alt="No Data"
        className="enrolled-empty-img"
      />
      <div className="enrolled-empty-text">No Quiz Attempts Found</div>
    </div>
  </div>
);

export default QuizAttemptsSection;