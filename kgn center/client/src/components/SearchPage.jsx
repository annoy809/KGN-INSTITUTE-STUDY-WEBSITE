import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchPage.css"; 

function SearchPage() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/search?query=${query}`
        );
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-page-container">

      <h2 className="search-title">
        Search Results for: <span>{query}</span>
      </h2>

      <p className="search-sub">
        Showing courses related to "<b>{query}</b>"
      </p>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : courses.length === 0 ? (
        <div className="no-search-result">
          No courses found for "<b>{query}</b>"
        </div>
      ) : (
        <div className="search-grid">
          {courses.map((course) => (
            <div
              key={course._id}
              className="search-card"
              onClick={() => navigate(`/course-details/${course._id}`)}
            >
              <img
                src={course.featuredImage || "/src/assets/images/python.jpg"}
                alt={course.title}
                className="search-card-img"
              />

              <div className="search-card-content">
                <h3>{course.title}</h3>
                <p>
                  {course.description?.slice(0, 90) || "No description available."}
                </p>

                <div className="search-price">
                  <span className="new">₹{course.mainPrice || 499}</span>

                  {course.regularPrice &&
                    course.mainPrice < course.regularPrice && (
                      <span className="old">₹{course.regularPrice}</span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default SearchPage;
