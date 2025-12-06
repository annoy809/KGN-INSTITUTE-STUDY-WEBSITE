import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  PlusIcon,
  WrenchIcon,
  UsersIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChartPieIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  ClipboardIcon,
  IdentificationIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
  Bars3Icon,
  XMarkIcon,
  VideoCameraIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import "../Admincss/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [location.pathname]);

  const handleSectionToggle = (title) => {
    setActiveSection(activeSection === title ? null : title);
  };

  const sections = [
    {
      title: "Courses",
      icon: <BookOpenIcon className="icon" />,
      links: [
        { to: "/Addcourse", text: "Add Course", icon: <PlusIcon className="icon" /> },
        { to: "/admin/manage-course", text: "Manage Courses", icon: <WrenchIcon className="icon" /> },
      ],
    },
    {
      title: "Admissions",
      icon: <UserGroupIcon className="icon" />,
      links: [
        { to: "/admin/AllRegistrations", text: "Enrolled Students", icon: <UsersIcon className="icon" /> },
        { to: "/admin/Allusers", text: "All Users", icon: <UsersIcon className="icon" /> },
      ],
    },
    {
      title: "Payments",
      icon: <CurrencyDollarIcon className="icon" />,
      links: [
        { to: "/admin/PaymentRecords", text: "Payment Records", icon: <DocumentTextIcon className="icon" /> },
        { to: "/admin/RecievedPayments", text: "Receive Payment", icon: <BanknotesIcon className="icon" /> },
        { to: "#", text: "Payment Reports", icon: <ChartPieIcon className="icon" /> },
      ],
    },
    {
      title: "Coupons",
      icon: <ChartPieIcon className="icon" />,
      links: [
        { to: "/admin/Couponadd", text: "Add Coupon", icon: <PlusIcon className="icon" /> },
        { to: "/admin/AllCoupons", text: "All Coupons", icon: <ClipboardDocumentCheckIcon className="icon" /> },
      ],
    },
    {
      title: "Assessments",
      icon: <ClipboardDocumentCheckIcon className="icon" />,
      links: [
        { to: "#", text: "Quizzes", icon: <QuestionMarkCircleIcon className="icon" /> },
        { to: "#", text: "Assignments", icon: <ClipboardIcon className="icon" /> },
        { to: "#", text: "Exams", icon: <AcademicCapIcon className="icon" /> },
        { to: "#", text: "Results", icon: <ChartBarIcon className="icon" /> },
      ],
    },
    {
      title: "Zoom Meetings",
      icon: <VideoCameraIcon className="icon" />,
      links: [
        { to: "/admin/zoom/schedule", text: "Schedule Meeting", icon: <CalendarDaysIcon className="icon" /> },
        { to: "/admin/zoom/join", text: "Join Meeting", icon: <UserPlusIcon className="icon" /> },
        { to: "/admin/zoom/history", text: "Meeting History", icon: <ClockIcon className="icon" /> },
      ],
    },
  ];

  const staticLinks = [
    { to: "/admin/certificates", text: "Certificates", icon: <IdentificationIcon className="icon" /> },
    { to: "/admin/messaging", text: "Messaging", icon: <ChatBubbleLeftRightIcon className="icon" /> },
    { to: "/admin/analytics", text: "Analytics", icon: <ChartPieIcon className="icon" /> },
    { to: "/admin/activity-logs", text: "Activity Logs", icon: <BoltIcon className="icon" /> },
  ];

  return (
    <>
      {/* ===== Mobile Toggle Button ===== */}
      <div className="sidebar-toggle-button" onClick={toggleSidebar} aria-label="Toggle sidebar">
        {isOpen ? <XMarkIcon className="icon" /> : <Bars3Icon className="icon" />}
      </div>

      {/* ===== Overlay for Mobile ===== */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* ===== Sidebar ===== */}
      <div className={`sidebar admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>LMS Admin</h2>
        </div>

        {/* Dashboard Link */}
        <Link
          to="/admin"
          className={`sidebar-link ${location.pathname === "/admin" ? "active" : ""}`}
          onClick={toggleSidebar}
        >
          <HomeIcon className="icon" /> Dashboard
        </Link>

        {/* Dynamic Sections */}
        {sections.map((section, idx) => (
          <div className={`side-flyout ${activeSection === section.title ? "active" : ""}`} key={idx}>
            <div className="main-link" onClick={() => handleSectionToggle(section.title)}>
              {section.icon}
              <span>{section.title}</span>
              <ChevronRightIcon className={`icon arrow ${activeSection === section.title ? "rotate" : ""}`} />
            </div>
            <div className="submenu">
              {section.links.map((link, i) => (
                <Link
                  to={link.to}
                  key={i}
                  className={`submenu-link ${location.pathname === link.to ? "active" : ""}`}
                  onClick={toggleSidebar}
                >
                  {link.icon} {link.text}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Static Quick Access */}
        <div className="side-flyout active">
          <div className="main-link" style={{ cursor: "default", opacity: 0.8 }}>
            <BoltIcon className="icon" />
            <span>Quick Access</span>
          </div>
          <div className="submenu" style={{ maxHeight: "400px" }}>
            {staticLinks.map((link, i) => (
              <Link
                to={link.to}
                key={i}
                className={`submenu-link ${location.pathname === link.to ? "active" : ""}`}
                onClick={toggleSidebar}
              >
                {link.icon} {link.text}
              </Link>
            ))}
          </div>
        </div>

        {/* Logout */}
        <Link
          to="#"
          className="sidebar-link logout-link"
          onClick={() => {
            console.log("Logging out...");
            toggleSidebar();
          }}
        >
          <ArrowLeftOnRectangleIcon className="icon" /> Logout
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
