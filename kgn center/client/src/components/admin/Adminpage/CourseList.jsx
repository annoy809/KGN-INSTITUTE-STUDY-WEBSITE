import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Admincss/CourseList.css'; // Your custom CSS

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses'); // adjust API as per your backend
        setCourses(res.data || []);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="main">
      <h1>Courses</h1>
      <button className="btn">+ Add New Course</button>

      {loading ? (
        <p className="info">Loading courses...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : courses.length === 0 ? (
        <p className="info">No courses available.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id || c.id}>
                <td>{c.title}</td>
                <td>
                  <button className="btn">Edit</button>{' '}
                  <button className="btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CourseList;
