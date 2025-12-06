import React from "react";
import "../../assets/Styles/About.css";
import Footer from "../Footer";
import FoundersSection from "../Foundersection";
import founder from "../../assets/images/founder-hasnain.jpg";

const About = () => {
  return (
    <>
      <div className="about-wrapper">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-overlay">
            <div className="hero-text">
              <h1>About EduLearn</h1>
              <p>Empowering learners everywhere with quality education.</p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="about-section who-we-are">
          <h2>Who We Are</h2>
          <p>
            At <strong>EduLearn</strong>, we’re passionate about democratizing education.
            Since our inception in 2025, we’ve empowered over <strong>5,000+ students </strong>
            globally with accessible, skill-based learning.
          </p>
        </section>

        {/* Vision & Mission */}
        <section className="about-section vision-mission">
          <div className="vision-mission-box">
            <h3>🎯 Our Vision</h3>
            <p>To make top-tier education accessible to everyone, everywhere.</p>
          </div>
          <div className="vision-mission-box">
            <h3>🚀 Our Mission</h3>
            <p>
              To equip learners with practical skills via expert-led courses and
              an engaging LMS experience.
            </p>
          </div>
        </section>

        {/* Founders */}
        <FoundersSection />

        {/* Why Choose Us */}
        <section className="about-section why-choose-us">
          <h2>Why Choose EduLearn?</h2>
          <div className="features-grid">
            <div className="feature-card">✅ Certified Courses</div>
            <div className="feature-card">👨‍🏫 Expert Instructors</div>
            <div className="feature-card">💼 Placement Support</div>
            <div className="feature-card">📱 Mobile Learning</div>
          </div>
        </section>

        {/* Founder's Message */}
        <section className="about-section founder-message">
          <img src={founder} alt="Founder Mohd Hasnain" className="founder-img" />
          <div className="founder-text">
            <h2>Message from Our Founder</h2>
            <p>
              “I started EduLearn to break educational boundaries. Every learner deserves
              the best chance to grow and succeed. We're here to make that vision real.”
            </p>
            <strong>— Mohd Hasnain, Founder & Lead Director</strong>
          </div>
        </section>

        {/* CTA */}
        <section className="about-section cta">
          <h2>Ready to Start Learning?</h2>
          <p>Explore our wide range of certified, expert-led courses today.</p>
          <button className="explore-btn">Explore Courses</button>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
