// src/components/FoundersSection.jsx
import React from 'react';
import './FoundersSection.css';

const founders = [
  {
    name: "Mohammad Hasnain",
    role: "Founder & Lead Director",
    message: "Driven by a passion to innovate, I started this company to transform education through accessible, tech-powered solutions. I believe in leading by example and building with purpose.",
    highlights: [
      "Strategic leadership",
      "Visionary product direction",
      "10+ years in ed-tech innovation",
    ],
  },
  {
    name: "Ankush Kundu",
    role: "Co-founder & Full Stack Developer",
    message: "From lines of code to real-world impact, I thrive on turning ideas into scalable solutions. My focus is crafting seamless digital experiences that empower learners and creators alike.",
    highlights: [
      "Expert in React, Node.js, MongoDB",
      "Product & platform scaling",
      "UI/UX perfectionist",
    ],
  },
];

const FoundersSection = () => {
  return (
    <section className="founders-section">
      <h2 className="section-title">Meet the Brains Behind the Brand</h2>
      <p className="section-subtitle">
        The visionaries leading our journey — passionate about innovation, technology, and educational impact.
      </p>
      <div className="founders-grid">
        {founders.map((founder, index) => (
          <div className="founder-card" key={index}>
            <h3 className="founder-name">{founder.name}</h3>
            <p className="founder-role">{founder.role}</p>
            <blockquote className="founder-message">“{founder.message}”</blockquote>
            <ul className="founder-highlights">
              {founder.highlights.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FoundersSection;
