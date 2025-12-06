import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import defaultAvatar from "../../assets/images/dafaulticon.jpg";
import "./ProfileCard.css";

const studentMenuItems = [
  { label: "Dashboard", icon: "🏠", path: "/dashboard" },
  { label: "Enrolled Courses", icon: "📚", path: "/dashboard/enrolled" },
  { label: "Wishlist", icon: "❤️", path: "/dashboard/wishlist" },
  { label: "Zoom Meetings", icon: "🧑‍💻", path: "/dashboard/student-meetings" },
];

const otherItems = [
  { label: "Settings", icon: "⚙️", path: "/dashboard/setting" },
  { label: "Logout", icon: "➡️", path: "/logout" },
];

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ⭐ NEW: Hamburger toggle
  const [isOpen, setIsOpen] = useState(false);

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [hasUpcomingMeeting, setHasUpcomingMeeting] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState(0);
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  const [formData, setFormData] = useState({
    name: user?.username || user?.name || "Guest User",
    email: user?.email || "guest@example.com",
    photo:
      user?.avatar ||
      user?.picture ||
      user?.photo ||
      "https://via.placeholder.com/150/007bff/ffffff?text=U",
    phone: user?.phone || "",
  });

  useEffect(() => {
    const handleStorage = () => {
      const newUser = getStoredUser();
      if (newUser) {
        setUser(newUser);
        setIsLoggedIn(true);
        setFormData({
          name: newUser.username || newUser.name || "Guest User",
          email: newUser.email || "guest@example.com",
          photo:
            newUser.avatar ||
            newUser.picture ||
            newUser.photo ||
            "https://via.placeholder.com/150/007bff/ffffff?text=U",
          phone: newUser.phone || "",
        });
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setFormData({
          name: "Guest User",
          email: "guest@example.com",
          photo: "https://via.placeholder.com/150/007bff/ffffff?text=U",
          phone: "",
        });
      }
    };

    handleStorage();
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user || !user._id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/enrollments/${user._id}`);
        const data = await res.json();
        setEnrolledCourses(data.length || 0);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setEnrolledCourses(0);
      }
    };
    fetchEnrolledCourses();
  }, [user]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/zoom/upcoming");
        const data = await res.json();
        setHasUpcomingMeeting(data.meetings && data.meetings.length > 0);
      } catch (err) {
        console.error("Meeting fetch error:", err);
      }
    };

    fetchMeetings();
    const interval = setInterval(fetchMeetings, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    const dpEvent = new CustomEvent("user-updated", { detail: null });
    window.dispatchEvent(dpEvent);
    navigate("/login");
  };

  const handleMenuClick = (path, isLocked = false) => {
    if (isLocked) return;
    if (path === "/logout") handleLogout();
    else if (location.pathname !== path) navigate(path);

    // ⭐ Close drawer after click (mobile)
    setIsOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/dashboard" && location.pathname.startsWith(path));

  const isMeetingLocked = !isAdmin && enrolledCourses === 0;

  return (
    <>
      {/* ⭐ Mobile Hamburger Button */}
      <div className="mobile-hamburger" onClick={() => setIsOpen(true)}>
        ☰
      </div>
      {/* ⭐ Overlay when sidebar opens */}
      {isOpen && 
      <div className="overlay" onClick={() => setIsOpen(false)}></div>}
      {/* ⭐ WRAPPER ADDED — keeps your original sidebar exactly same */}
      <div className={`sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="student-sidebar">
          
          {/* ---------- Profile Section ---------- */}
          <div className="profile-section">
            <div className="avatar">
              <img
                src={user?.profileImage || user?.picture || defaultAvatar}
                alt="Profile"
                className="navbar-profile-pic"
              />
            </div>
          </div>

          {/* ---------- Sidebar Menu ---------- */}
          <ul className="nav-main">
            {studentMenuItems.map((item) => {
              const isLocked =
                item.label === "Zoom Meetings" ? isMeetingLocked : false;

              return (
                <li
                  key={item.label}
                  className={`nav-item ${isActive(item.path) ? "active" : ""} ${
                    isLocked ? "locked" : ""
                  }`}
                  onClick={() => handleMenuClick(item.path, isLocked)}
                  title={
                    isLocked
                      ? "You must enroll in a course to access Zoom Meetings"
                      : ""
                  }
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                  {item.label === "Zoom Meetings" &&
                    hasUpcomingMeeting &&
                    !isLocked && <span className="red-dot"></span>}
                  {isLocked && <span className="lock-icon">👑</span>}
                </li>
              );
            })}

            <div className="section-divider"></div>

            {otherItems.map((item) => (
              <li
                key={item.label}
                className={`nav-item ${
                  isActive(item.path) ? "active" : ""
                } ${item.path === "/logout" ? "logout-item" : ""}`}
                onClick={() => handleMenuClick(item.path)}
              >
                <span className="icon">{item.icon}</span> {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;
