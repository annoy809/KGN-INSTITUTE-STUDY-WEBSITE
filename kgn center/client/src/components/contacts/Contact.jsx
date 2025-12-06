import React, { useState, useEffect } from "react";
import '../../assets/Styles/Contact.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import contactimg from '../../assets/images/contactimg.png';
import Preloader from "../Preloader";
import Footer from "../Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const handlePageLoad = () => setLoading(false);
    const img = new Image();
    img.src = contactimg;
    img.onload = handlePageLoad;
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/contact", formData);
      if (res.data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return loading ? (
    <Preloader />
  ) : (
    <>
      <ToastContainer />
      <div className="contact-wrapper">
        {/* Banner */}
        <div className="contact-banner">
          <img src={contactimg} alt="Contact Banner" />
          <div className="banner-text">
            <h1>Contact Us</h1>
            <p>Contact KGN Centre for any queries</p>
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="contact-info-row">
          <h2>We’re Here to Help</h2>
          <div className="contact-columns">
            <div className="contact-box">
              <p><FaFacebookF className="contact-icon" /> <strong>Address:</strong><br />11/232 Near Dwarka Mor, New Delhi</p>
            </div>
            <div className="contact-box">
              <p><FaInstagram className="contact-icon" /> <strong>Email:</strong><br />course@edublink.in</p>
            </div>
            <div className="contact-box">
              <p><FaLinkedinIn className="contact-icon" /> <strong>WhatsApp:</strong><br />(+91) 7000038630</p>
            </div>
          </div>
        </div>

        {/* Map and Form */}
        <div className="contact-map-form">
          <div className="map-box">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=D%20Block%20Gali%20No%201%20Sangam%20Vihar%20New%20Delhi%20110080&output=embed"
              loading="lazy"
            ></iframe>
          </div>
          <div className="form-box">
            <h2>Drop Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              <button type="submit">Submit Now</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
