import React from "react";
import "../assets/Styles/Determined.css";
import { FaChalkboardTeacher, FaBook, FaCertificate, FaEnvelopeOpenText } from "react-icons/fa";
const Determined = () => {
  return (
    <section className="determined-section">
      <div className="determined-container">
        <div className="determined-top-content">
          <span className="determined-badge">How We Start Journey</span>
          <h2 className="determined-title">Start Your Learning Journey Today!</h2>
          <p className="determined-description">
            Discover a World of Knowledge and Skills at Your Fingertips – Unlock Your Potential and Achieve Your Dreams with Our Comprehensive Learning Resources!
          </p>
        </div>

        <div className="determined-grid">
          <div className="determined-item">
            <FaChalkboardTeacher className="determined-icon" />
            <h4>Learn with Experts</h4>
            <p>Elevate your learning. Trusted guidance, real results.</p>
          </div>
          <div className="determined-item">
            <FaBook className="determined-icon" />
            <h4>Learn Anything</h4>
            <p>Master Any Skill. Unleash Your Potential and join the best.</p>
          </div>
          <div className="determined-item">
            <FaCertificate className="determined-icon" />
            <h4>Get Online Certificate</h4>
            <p>Master in Demand Skills. Soon Get Certified Today.</p>
          </div>
          <div className="determined-item">
            <FaEnvelopeOpenText className="determined-icon" />
            <h4>E-mail Marketing</h4>
            <p>Grow Your Business. Reach New Customers.</p>
          </div>
        </div>

        <div className="determined-bottom-cards">
          <div className="determined-card">
            <div className="determined-card-content">
              <h3>Become a Instructor</h3>
              <p>Join our team to inspire students, share your knowledge, and shape the future.</p>
              <button className="determined-btn">Join Now </button>
            </div>
          </div>
          <div className="determined-card">
           
            <div className="determined-card-content">
              <h3>Become a Student</h3>
              <p>Unlock your potential by joining our vibrant learning community.</p>
              <button className="determined-btn">Join Now </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Determined;