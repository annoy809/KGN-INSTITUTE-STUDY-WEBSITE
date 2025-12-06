// src/pages/EditCoursePage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './EditCoursePage.css'; // separate CSS
import { toast } from "react-toastify";

const EditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${courseId}`);
        setCourseData(res.data);
      } catch (err) {
        console.error("Failed to load course", err);
        toast.error("Could not load course.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/courses/${courseId}`, courseData);
      toast.success("✅ Course updated successfully");
      navigate("/admin/manage-courses");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("❌ Update failed");
    }
  };

  if (loading) return <p className="loading">Loading course...</p>;
  if (!courseData) return <p className="error">Course not found.</p>;

  return (
    <div className="edit-course-page">
      <h2>Edit Course</h2>

      <div className="form-group">
        <label>Course Title</label>
        <input
          type="text"
          name="title"
          value={courseData.title}
          onChange={handleChange}
          placeholder="Enter course title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          rows={5}
          value={courseData.description}
          onChange={handleChange}
          placeholder="Course description"
        ></textarea>
      </div>

      <div className="form-group">
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={courseData.category}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Main Price</label>
        <input
          type="number"
          name="mainPrice"
          value={courseData.mainPrice}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Regular Price</label>
        <input
          type="number"
          name="regularPrice"
          value={courseData.regularPrice}
          onChange={handleChange}
        />
      </div>

      <div className="buttons">
        <button className="btn-cancel" onClick={() => navigate("/admin/manage-courses")}>Cancel</button>
        <button className="btn-update" onClick={handleUpdate}>Update Course</button>
      </div>
    </div>
  );
};

export default EditCoursePage;
