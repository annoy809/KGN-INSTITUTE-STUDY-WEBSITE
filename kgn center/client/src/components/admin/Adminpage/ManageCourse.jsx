import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Admincss/ManageCourse.css";
import { CourseContext } from "../../../Tutor/CourseAdd/CourseContext";

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [statusDropdownId, setStatusDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedBulkAction, setSelectedBulkAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const navigate = useNavigate();
  const { setCourseData, resetCourse } = useContext(CourseContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/courses");
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses based on search, status, category
  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(course =>
        statusFilter === "Draft" ? course.draft : !course.draft
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, statusFilter, categoryFilter, courses]);

  const handleEdit = async (courseId) => {
    try {
      const res = await axios.get(`/api/courses/${courseId}`);
      setCourseData(res.data);
      navigate(`/addcourse?id=${courseId}`);
    } catch (err) {
      console.error("Error loading course for edit", err);
      alert("Failed to load course.");
    }
  };

  const handleNewCourse = () => {
    resetCourse();
    navigate("/addcourse");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/api/courses/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      const course = res.data;
      const status = (course.status || "").toLowerCase();
      const url = status === "published" ? `/course-preview/${id}` : `/course-preview/${id}?allowDraft=true`;
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error opening course view", err);
      alert("Failed to load course.");
    }
  };

  const handleBulkAction = async () => {
    if (!selectedCourses.length) return alert("⚠️ No course selected.");
    if (!selectedBulkAction) return alert("⚠️ Choose a bulk action.");

    if (selectedBulkAction === "delete") {
      if (!window.confirm("Are you sure you want to delete selected courses?")) return;
      try {
        await Promise.all(selectedCourses.map(id => axios.delete(`/api/courses/${id}`)));
        setCourses(prev => prev.filter(c => !selectedCourses.includes(c._id)));
        setSelectedCourses([]);
      } catch (err) {
        console.error("Bulk delete failed", err);
      }
    } else {
      alert(`⚠️ Unknown bulk action: ${selectedBulkAction}`);
    }
  };

  const handleSelectCourse = (id) => {
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const toggleStatusDropdown = (id) => {
    setStatusDropdownId(statusDropdownId === id ? null : id);
  };

  const changeStatus = async (id, newStatus) => {
    const draftValue = newStatus.toLowerCase() === "draft";
    try {
      const res = await axios.put(`/api/courses/${id}`, { draft: draftValue });
      setCourses(prev => prev.map(c => c._id === id ? res.data : c));
      setStatusDropdownId(null);
    } catch (err) {
      console.error("Failed to update draft status", err);
    }
  };

  return (
    <div className="manage-courses">
      <div className="top-bar">
        <h2>Manage Courses</h2>
        <button className="btn-primary" onClick={handleNewCourse}>
          + New Course
        </button>
      </div>

      <div className="actions-bar">
        <select value={selectedBulkAction} onChange={(e) => setSelectedBulkAction(e.target.value)}>
          <option value="">Bulk Action</option>
          <option value="delete">Delete Selected</option>
        </select>
        <button className="btn-secondary" onClick={handleBulkAction}>Apply</button>

        <div className="right-actions">
          <div className="filters-container">
            <button className="btn-filters" onClick={() => setFiltersOpen(!filtersOpen)}>⚙ Filters ▼</button>
            {filtersOpen && (
              <div className="filters-menu">
                <div>
                  <label>Status:</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                <div>
                  <label>Category:</label>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">All</option>
                    {Array.from(new Set(courses.map(c => c.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-secondary" onClick={() => { setStatusFilter(""); setCategoryFilter(""); }}>Reset Filters</button>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div className="course-table">
          <div className="course-header">
            <span>Title</span>
            <span>Categories</span>
            <span>Price</span>
            <span>Author</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredCourses.map((course) => (
            <div className="course-row" key={course._id}>
              <div className="title-cell">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course._id)}
                  onChange={() => handleSelectCourse(course._id)}
                />
                <img
                  src={course.featuredImage || "https://via.placeholder.com/60"}
                  alt={`Thumbnail for ${course.title || "Course"}`}
                />
                <div className="title-block">
                  <strong>{course.title || "Untitled Course"}</strong>
                  <div className="meta">
                    📁 Topics: {course.topics?.length || 0} | 📘 Lessons: {course.totalLessons || 0}
                  </div>
                </div>
              </div>

              <span>{course.category || "N/A"}</span>
              <span>{course.pricingModel === "Free" ? "Free" : `₹${course.mainPrice || 0}`}</span>
              <span>{course.createdBy?.name || "Author"}</span>
              <span>{new Date(course.createdAt).toLocaleDateString()}</span>

              <button
                className={`status-btn ${course.draft ? "draft" : "published"}`}
                onClick={() => toggleStatusDropdown(course._id)}
              >
                {course.draft ? "Draft" : "Published"} ▼
              </button>

              <div className="actions-cell">
                <button className="view-btn" onClick={() => handleView(course._id)}>View</button>
                <button className="menu-btn" onClick={() => toggleMenu(course._id)}>⋮</button>
                {menuOpenId === course._id && (
                  <div className="menu-dropdown">
                    <div onClick={() => handleEdit(course._id)}>Edit</div>
                    <div onClick={() => handleDelete(course._id)}>Delete</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourse;
