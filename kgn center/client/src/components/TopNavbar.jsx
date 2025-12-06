// --------------------------------------------
// 📌 IMPORTS
// --------------------------------------------
import React, { useState, useEffect } from "react";
import {
  UserCircle,
  ShoppingCart,
  X,
  Boxes,
  Bell 
} from "lucide-react";
import {
  FaBars, FaChevronDown,
  FaHome, FaPaintBrush, FaChartLine, FaMoneyBillWave, FaUsers,
  FaBrain, FaRobot, FaLaptopCode,
  FaTachometerAlt, FaVideo, FaChalkboardTeacher,
  FaCog, FaSignOutAlt
} from "react-icons/fa";

import "../assets/Styles/TopNavbar.css";
import logo from "../../src/assets/images/logo-removed.png";
import defaultAvatar from "../../src/assets/images/dafaulticon.jpg";
import { Link, useNavigate } from "react-router-dom";
import Notification from "./Notification";

// --------------------------------------------
// 📌 SIDEBAR CATEGORIES (STATIC DATA)
// --------------------------------------------
const categories = [
  { name: "Home", icon: <FaHome color="#ff4757" />, route: "/", links: [] },

  {
    name: "Programming",
    icon: <FaLaptopCode color="#1e90ff" />,
    links: [
      "JavaScript", "Python", "C++", "Java", "Kotlin", "Go", "Swift",
      "Ruby", "C", "Typescript", "PHP", "Dart", "Pascal", "Mongodb"
    ]
  },

  {
    name: "Design",
    icon: <FaPaintBrush color="#e67e22" />,
    links: [
      "UI/UX", "Graphic Design", "Web & Product Design",
      "Print Media", "Motion & Animation Design",
      "3D & Visual Design", "Data & Infographics",
      "Branding & Marketing Design", "Tools & Software Courses",
      "Freelance & Career-Oriented Design"
    ]
  },

  {
    name: "Marketing",
    icon: <FaChartLine color="#27ae60" />,
    links: [
      "Digital Marketing (Core)", "SEO", "Content Marketing",
      "Social Media Marketing", "Email Marketing",
      "PPC / Ads", "Affiliate & Influencer Marketing",
      "Marketing Analytics", "Branding & Strategy"
    ]
  },

  { name: "Finance", icon: <FaMoneyBillWave color="#16a085" />, links: ["E-Accounting", "Financial"] },

  {
    name: "Development",
    icon: <FaUsers color="#9b59b6" />,
    links: [
      "App Development", "Web Development", "Mobile Development",
      "Game Development", "Website Testing"
    ]
  },

  { name: "Data Science", icon: <FaBrain color="#f39c12" />, links: [] },
  { name: "AI & ML", icon: <FaRobot color="#5eaaf5ff" />, links: [] },
];


// -----------------------------------------------------
// 📌 NAVBAR COMPONENT STARTS
// -----------------------------------------------------
const TopNavbar = () => {
  const API_URL = "http://localhost:5000";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
const [notificationCount, setNotificationCount] = useState(""); 
// 🔔 Fetch Notification Count
const fetchNotificationCount = async () => {
  if (!user) return; // user not logged in

  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/api/notifications/count`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      setNotificationCount(data.count || 0);
    }
  } catch (err) {
    console.log("NOTIFICATION ERROR:", err);
  }
};
// LOAD notification count when user is present
useEffect(() => {
  if (user) {
    fetchNotificationCount();
  }
}, [user]);

// Auto-update notifications every 20 seconds
useEffect(() => {
  if (!user) return;

  const interval = setInterval(() => {
    fetchNotificationCount();
  }, 20000);

  return () => clearInterval(interval);
}, [user]);

  const navigate = useNavigate();

  // ------------------------------
  // 🛒 CART COUNT FROM LOCALSTORAGE
  // ------------------------------
  useEffect(() => {
    const updateCartNumbers = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItemCount(savedCart.length);
    };

    updateCartNumbers();
    window.addEventListener("storage", updateCartNumbers);
    return () => window.removeEventListener("storage", updateCartNumbers);
  }, []);

  // ------------------------------------------------------
  // 🔥 FETCH USER FROM BACKEND + MERGE LOCAL STORAGE
  // ------------------------------------------------------
  const fetchUserFromBackend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) return;

      const backendUser = data.user || data;
      const oldUser = JSON.parse(localStorage.getItem("user")) || {};
      const mergedUser = { ...oldUser, ...backendUser };

      localStorage.setItem("user", JSON.stringify(mergedUser));
      setUser(mergedUser);
    } catch (error) {
      console.log("USER FETCH ERROR:", error);
    }
  };

  // ------------------------------------------------------
  // 🌟 LOAD LOCAL USER FIRST FOR INSTANT UI
  // ------------------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    fetchUserFromBackend();
  }, []);

  // ------------------------------
  // 🔍 SEARCH ON ENTER
  // ------------------------------
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search/${searchTerm.toLowerCase()}`);
      setSearchTerm("");
    }
  };

  // ------------------------------
  // 🚪 LOGOUT
  // ------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // -------------------------------------------
  // ❌ CLOSE ON OUTSIDE CLICK
  // -------------------------------------------
  useEffect(() => {
    const closeAll = (e) => {
      if (!e.target.closest(".profile-dropdown-custom")) {
        setProfileOpen(false);
      }
      if (!e.target.closest(".course-item")) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);

  // ------------------------------------------------------
  // 📌 JSX
  // ------------------------------------------------------
  return (
    <>
      {/* ------------------------------------------------
          MAIN TOP NAVBAR (DESKTOP)
      ------------------------------------------------ */}
      <nav className="navbar white glassy-navbar">
        <div className="navbar-container">

          {/* LEFTSIDE — LOGO + SEARCH */}
          <div className="navbar-left-section">

            <Link to="/" className="navbar-logo">
              <img src={logo} alt="Logo" />
            </Link>

            {/* FIXED: Mobile search alignment */}
            <div className="navbar-search-wrapper mobile-fix">
              <input
                type="text"
                placeholder="Search for courses..."
                className="navbar-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* RIGHTSIDE */}
          <div className="navbar-right-items">

            <Link to="/onlineclass" className="navbar-link">
              Online Classes
            </Link>

            {user && (
              <Link to="/jobprofile" className="navbar-link">
                Job Profile
              </Link>
            )}
{/* NOTIFICATION */}
<div
  className={`navbar-notification-wrapper ${!user ? "hide-on-mobile" : ""}`}
  onClick={() => navigate("/Notification")}
>
  <Bell className="navbar-notification-icon" size={22} />

  {notificationCount > 0 && (
    <span className="notification-badge">{notificationCount}</span>
  )}
</div>


            {/* CART */}
            <Link to="/cart" className="navbar-cart-wrapper">
              <ShoppingCart className="navbar-cart-icon" size={22} />
              {cartItemCount > 0 && (
                <span className="cart-count-badge">{cartItemCount}</span>
              )}
            </Link>

            {/* PROFILE */}
            {user ? (
              <div
                className="navbar-profile-wrapper"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((prev) => !prev);
                }}
              >
                <img
                  src={user.profileImage || user.picture || defaultAvatar}
                  alt="Profile"
                  className="navbar-profile-pic"
                />

                {profileOpen && (
                  <div className="profile-dropdown-custom show">
                    <p className="profile-name-custom">
                      👋 <b>{user.name}</b>
                    </p>

                    <Link to="/dashboard" className="profile-link-custom">
                      <FaTachometerAlt /> Dashboard
                    </Link>
                    <Link to="/jobprofile" className="profile-link-custom mobile-only">
                      <FaTachometerAlt /> Job Profile
                    </Link>


                    <Link to="/onlineclass" className="profile-link-custom">
                      <FaVideo /> Live Classes
                    </Link>

                    <Link to="/become-instructor" className="profile-link-custom">
                      <FaChalkboardTeacher /> Become Instructor
                    </Link>

                    <Link to="/settings" className="profile-link-custom">
                      <FaCog /> Account Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="profile-link-custom logout-custom"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <UserCircle
                size={28}
                className="navbar-user-icon"
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              />
            )}

            {/* MOBILE SIDEBAR BUTTON */}
            {user && (
<button
  className={`grid-menu-btn ${mobileMenuOpen ? "active" : ""}`}
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <Boxes    size={22} />
</button>
            )}
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------
          MOBILE SIDEBAR
      ------------------------------------------------ */}
      {user && (
        <>
          <div
            className={`mobile-sidebar-overlay ${mobileMenuOpen ? "show" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className={`mobile-sidebar glassy ${mobileMenuOpen ? "open" : ""}`}>
            <div className="sidebar-header">
              <button
                className="close-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            <ul className="sidebar-categories">
              {categories.map((cat, idx) => {
                const hasDropdown = cat.links.length > 0;
                const isOpen = activeIndex === idx;

                return (
                  <li key={idx} className={`sidebar-item ${isOpen ? "open" : ""}`}>

                    <div
                      className="sidebar-link"
                      onClick={() => hasDropdown && setActiveIndex(isOpen ? null : idx)}
                    >
                      <span className="icon">{cat.icon}</span>
                      <span className="name">{cat.name}</span>

                      {hasDropdown && (
                        <FaChevronDown className={`arrow ${isOpen ? "rotate" : ""}`} />
                      )}
                    </div>

                    {hasDropdown && (
                      <ul className={`sidebar-dropdown ${isOpen ? "show" : ""}`}>
                        {cat.links.map((link, i) => (
                          <li key={i}>
                            <Link
                              to={`/category/${link.toLowerCase().replace(/\s+/g, "-")}`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default TopNavbar;
