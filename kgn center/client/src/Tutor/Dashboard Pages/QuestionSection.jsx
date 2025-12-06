import React, { useState } from 'react';
import './QuestionSection.css';

const QuestionSection = () => {
  const [role, setRole] = useState('Instructor');
  const [sort, setSort] = useState('All(0)');

  return (
    <div className="enrolled-main">
      <div className="question-header">
        <h2 className="dashboard-title">Question & Answer</h2>
        <div className="question-role-toggle">
          <span className={role === 'Student' ? 'role-label active' : 'role-label'}>Student</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={role === 'Instructor'}
              onChange={() => setRole(role === 'Instructor' ? 'Student' : 'Instructor')}
            />
            <span className="slider"></span>
          </label>
          <span className={role === 'Instructor' ? 'role-label active' : 'role-label'}>Instructor</span>
        </div>
      </div>
      <div className="question-controls">
        <label className="question-sort-label">Sort By:</label>
        <select
          className="question-sort-select"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option>All(0)</option>
        </select>
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

export default QuestionSection;