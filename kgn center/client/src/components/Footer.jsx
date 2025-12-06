import React from 'react';
import { Link } from 'react-router-dom';  // Import Link for SPA navigation
import '../assets/Styles/Footer.css';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFax,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h2>Kgn Centre</h2>
          <p>
            KGN Centre offers career-building courses, events, and training programs that empower students with modern skills. Ideal for schools, colleges, and universities offering quality education with a digital edge.
          </p>
          <div className="footer-socials">
            <a href="https://facebook.com/kgn_institute01" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com/kgn_institute01" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com/kgn_institute01" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com/company/kgn_institute01" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Student Zone */}
        <div className="footer-section links">
          <h2>Student Zone</h2>
          <ul>
            <li><Link to="/enquiry">Enquiry</Link></li>
            <li><Link to="/registration">Registration</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/courses">Courses</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/become-tutor">Become a Tutor</Link></li>
            <li><Link to="/add-course">Add Course</Link></li>
            <li><Link to="/Home">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/terms-policy">Terms & Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact">
          <h2>Get In Touch</h2>
          <ul>
            <li><FaMapMarkerAlt /> D-1156, Ratiya Marg, Sangam Vihar, New Delhi 110080 (India)</li>
            <li><FaPhoneAlt /> +91-7905903955</li>
            <li><FaFax /> +91-8853864708</li>
            <li><FaEnvelope /> <a href="mailto:kgncomputertraininigcenter@gmail.com">kgncomputertraininigcenter@gmail.com</a></li>
            <li><FaClock /> 8 AM - 9 PM</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 KGN Centre. All rights reserved.</p>
        <p>Powered by <a href="/">KGN Centre</a> | Designed 2025–2026</p>
      </div>
    </footer>
  );
};

export default Footer;
