import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExploreCourse.css';
import { FaSearch, FaRupeeSign, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Preloader from '../../components/Preloader';
import TrandingCourse from './TrandingCourse';
import Footer from '../../components/Footer';

const ExploreCourse = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const navigate = useNavigate();

  const levels = ['All', 'Beginner', 'Intermediate', 'Expert'];
  const prices = ['All', 'Free', 'Below ₹500', '₹500 - ₹1000', 'Above ₹1000'];
  const categories = ['All', 'Web Dev', 'App Dev', 'AI', 'Design', 'Marketing', 'Data Science', 'Programming', 'Excel'];

  useEffect(() => {
    axios.get('/api/courses')
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filterCourses = () => {
    return courses
      .filter(course => course.title.toLowerCase().includes(search.toLowerCase()))
      .filter(course => levelFilter === 'All' || course.level === levelFilter)
      .filter(course => {
        if (priceFilter === 'All') return true;
        if (priceFilter === 'Free') return course.price === 0;
        if (priceFilter === 'Below ₹500') return course.price < 500;
        if (priceFilter === '₹500 - ₹1000') return course.price >= 500 && course.price <= 1000;
        if (priceFilter === 'Above ₹1000') return course.price > 1000;
        return true;
      })
      .filter(course => categoryFilter === 'All' || course.category === categoryFilter);
  };

  const filtered = filterCourses();

  return (
    <>
    <section className="explore-course-section">
      {/* Row 1: Heading + Search */}
      <div className="explore-course-header">
        <h2 className="explore-course-title">Explore Courses</h2>
        <div className="explore-course-search-box">
          <FaSearch />
          <input
            placeholder="Search by course name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Row 2: Filters + Courses */}
      <div className="explore-course-body">
        {/* Left Side Filters */}
        <aside className="explore-course-filters">
          <div className="explore-course-filter-group">
            <h4>Category</h4>
            {categories.slice(1).map(c => (
              <label key={c} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={categoryFilter === c}
                  onChange={() => setCategoryFilter(categoryFilter === c ? 'All' : c)}
                />
                {c}
              </label>
            ))}
          </div>

          <div className="explore-course-filter-group">
            <h4>Level</h4>
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="explore-course-filter-group">
            <h4>Price</h4>
            <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
              {prices.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </aside>

        {/* Right Side: Course Cards */}
        <div className="explore-course-grid">
          {loading ? (
            <Preloader />
          ) : filtered.length === 0 ? (
            <p className="explore-course-no-results">No courses found with the selected filters.</p>
          ) : (
            <div className="explore-course-cards">
              {filtered.map(course => (
                <div
                  key={course._id}
                  className="explore-course-card"
                  onClick={() => navigate(`/course-details/${course._id}`)}
                >
                  <img
                    src={course.featuredImage || '/assets/images/default.jpg'}
                    alt={course.title}
                    className="explore-course-img"
                  />

                  <div className="explore-course-content">
                    <h3>{course.title}</h3>
                    <p className="explore-course-desc">{course.description?.slice(0, 90)}...</p>
                    <div className="explore-course-meta">
                      <span className="price">
                        {course.pricingModel === "Free" || course.mainPrice === 0
                          ? 'Free'
                          : (<><FaRupeeSign />{course.mainPrice}</>)
                        }
                      </span>
                      <span className="rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < Math.round(course.rating || 4) ? '#f5c518' : '#ddd'}
                          />
                        ))}
                        ({(course.rating || 4).toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
    <TrandingCourse/>
    <Footer/>
    </>
  );
};

export default ExploreCourse;
