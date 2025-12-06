import React, { useEffect, useState } from 'react';
import '../assets/Styles/preloader.css';
import logo from '../assets/images/logo-removed.png';

const Preloader = () => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`custom-preloader ${fade ? 'fade-out' : ''}`}>
      <div className="spinner-container">
        <div className="rotating-ring"></div>
        <img src={logo} alt="Loading..." className="preloader-logo" />
      </div>
    </div>
  );
};

export default Preloader;
