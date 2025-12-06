import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TrandingCourse.css';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRupeeSign } from 'react-icons/fa';
import Preloader from '../../components/Preloader';

const TrandingCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTrendingCourses = async () => {
    try {
      const res = await axios.get('/api/courses/trending'); 
      setCourses(res.data.courses || res.data); // safe fetch
    } catch (error) {
      console.error('Error fetching trending courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingCourses();
  }, []);

  return (
    <section className="trending-section">
      <div className="trending-header">
        <h2>🔥 Trending Courses</h2>
        <p>Explore the most popular courses loved by our learners</p>
      </div>

      {loading ? (
        <Preloader />
      ) : courses.length === 0 ? (
        <p className="no-courses">No trending courses available right now.</p>
      ) : (
        <div className="trending-grid">
          {courses.map((course) => (
            <div
              className="trending-card"
              key={course._id}
              onClick={() => navigate(`/course-details/${course._id}`)}
            >
              {/* Image */}
              <div className="card-image">
                <img
                  src={course.thumbnail || '/assets/images/default.jpg'}
                  alt={course.title}
                  loading="lazy"
                />

                {course.price === 0 && (
                  <span className="badge free-badge">Free</span>
                )}
              </div>

              {/* Text Area */}
              <div className="trending-info">
                <h3 className="course-title">{course.title}</h3>

                <p className="course-desc">
                  {course.description?.substring(0, 80)}...
                </p>

                <div className="course-meta">
                  
                  {/* Price */}
                  <span className="price">
                    {course.price !== 0 && (
                      <>
                        <FaRupeeSign /> {course.price}
                      </>
                    )}
                  </span>

                  {/* Rating */}
                  <span className="rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < Math.round(course.rating) ? '#ffc107' : '#ccc'}
                      />
                    ))}{' '}
                    ({course.rating?.toFixed(1) || '0.0'})
                  </span>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrandingCourse;
