import React, { useState, useEffect } from 'react';
import "../assets/Styles/SecondNavbar.css";
import { Link } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa";
import {
  FaHome, FaLaptopCode, FaPaintBrush, FaChartLine, FaMoneyBillWave,
  FaUsers, FaBrain, FaRobot, FaUserGraduate
} from "react-icons/fa";

const courses = [
  { name: "Home", icon: <FaHome />, route: "/", links: [] },
  {
    name: "Programming",
    icon: <FaLaptopCode />,
    links: ["JavaScript", "Python", "C++", "Java", "Kotlin", "Go", "Swift", "Ruby", "C", "Typescript", "PHP", "Dart", "Pascal", "Mongodb"]
  },
  {
    name: "Design",
    icon: <FaPaintBrush />,
    links: ["UI/UX", "Graphic Design", "Web & Product Design", "Print Media", "Motion & Animation Design", "3D & Visual Design", "Data & Infographics", "Branding & Marketing Design", "Tools & Software Courses", "Freelance & Career-Oriented Design"]
  },
  {
    name: "Marketing",
    icon: <FaChartLine />,
    links: ["Digital Marketing (Core)", "Search Engine Optimization (SEO)", "Content Marketing", "Social Media Marketing (SMM)", "Email Marketing", "Pay-Per-Click (PPC) / Ads", "Affiliate & Influencer Marketing", "E-commerce Marketing", "Marketing Analytics & Tools", "Branding & Strategy", "Mobile & App Marketing", "Video & Visual Marketing", "Marketing Automation", "Traditional Marketing", "Marketing Strategy & Management"]
  },
  {
    name: "Finance",
    icon: <FaMoneyBillWave />,
    links: ["E-Accounting", "Financial"]
  },
  {
    name: "Development",
    icon: <FaUsers />,
    route: "/leadership",
    links: ["App Developement", "Web development", "Mobile Development", "Game Development", "Website Testing"]
  },

  {
    name: "Data Science",
    icon: <FaBrain />,
    route: "/data-science",
    links: []
  },
  {
    name: "AI & ML",
    icon: <FaRobot />,
    route: "/ai-ml",
    links: []
  },
];

const SecondNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = (idx) => {
    if (isMobile) {
      setActiveIndex(activeIndex === idx ? null : idx);
    }
  };

 
  // ✅ Show navbar only if user is authenticated


  return (
    <nav className="second-navbar second-navbar-auth">
      <ul className="course-list">
        {courses.map((course, idx) => {
          const hasDropdown = course.links && course.links.length > 0;
          const isOpen = activeIndex === idx;
          const routePath = course.route || `/${course.name.toLowerCase().replace(/\s+/g, '-')}`;

          return (
            <li
              key={idx}
              className="course-item"
              onMouseEnter={!isMobile && hasDropdown ? () => setActiveIndex(idx) : undefined}
              onMouseLeave={!isMobile && hasDropdown ? () => setActiveIndex(null) : undefined}
              onClick={() => handleItemClick(idx)}
            >
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SecondNavbar;
