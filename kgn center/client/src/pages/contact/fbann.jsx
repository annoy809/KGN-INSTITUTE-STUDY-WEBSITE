import React from 'react';
import './banner.css';
import bannerImg from "../../../assets/Contact.jpg";

const Banner = () => {
  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="banner">
      <img src={bannerImg} alt="Contact Banner" className="banner-image" />
      <div className="banner-content">
        <h1>Contact us if any query</h1>
        <div className="banner-buttons">
          <button>Home</button>
          <button onClick={handleScrollToContact}>Contact</button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
