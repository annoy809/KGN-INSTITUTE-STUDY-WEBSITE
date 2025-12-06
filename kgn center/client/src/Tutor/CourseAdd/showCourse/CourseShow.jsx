import React, { useEffect, useState } from "react";
import "./CourseShow.css"; // Make sure this file exists

const CourseShow = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="course-show-container">
      <h2>All Courses</h2>
      <div className="courses-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div className="course-card" key={course._id}>
              <img
                src={
                  course.featuredImage
                    ? `http://localhost:5000/uploads/${course.featuredImage}`
                    : "https://via.placeholder.com/200"
                }
                alt={course.title}
                className="course-image"
              />
              <h3>{course.title}</h3>
              <p>{course.description?.slice(0, 100) || "No description"}...</p>
              <p><strong>Category:</strong> {course.category || "N/A"}</p>
              <p><strong>Difficulty:</strong> {course.difficultyLevel || "N/A"}</p>
              <p><strong>Price:</strong> {course.pricingModel === "Free" ? "Free" : `₹${course.mainPrice || 0}`}</p>
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default CourseShow;
