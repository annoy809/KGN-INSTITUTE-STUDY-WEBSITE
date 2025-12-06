import React from 'react';

const ThemeToggle = ({ darkMode, toggle }) => (
  <button onClick={toggle} className="btn" style={{ marginBottom: '20px' }}>
    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
  </button>
);

export default ThemeToggle;
