import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/Styles/Courseshome.css";

// 🧩 Reusable Section Component
const CourseSection = ({ title, courses, wishlist, toggleWishlist, navigate }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
    return () => carousel.removeEventListener("scroll", updateScrollButtons);
  }, []);

  return (
    <div className="course-category-section">
      <h3 className="category-section-title">{title}</h3>
      <div className="carousel-wrapper">
        {canScrollLeft && (
          <button className="carousel-btn left" onClick={scrollLeft}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        <div className="courses-carousel" ref={carouselRef}>
          {courses.length > 0 ? (
            courses.map((course) => {
              const isWishlisted = wishlist.includes(course._id.toString());
              return (
                <div className="courses-section-card" key={course._id}>
                  <div className="courses-section-image-wrapper">
                    <img
                      src={
                        course.featuredImage ||
                        "/src/assets/images/python.jpg"
                      }
                      alt={course.title}
                    />
                    {course.regularPrice && course.mainPrice < course.regularPrice && (
                      <span className="courses-section-badge">
                        🔥{" "}
                        {Math.round(
                          ((course.regularPrice - course.mainPrice) /
                            course.regularPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>

                  <div className="courses-section-content">
                    <h3>{course.title}</h3>
                    <p>{course.description?.slice(0, 80) || "No description."}</p>
                    <div className="courses-section-rating">{"⭐".repeat(4)}☆ (4.0)</div>
                    <div className="courses-section-price">
                      <span className="new">₹{course.mainPrice || 499}</span>
                      {course.regularPrice && course.mainPrice < course.regularPrice && (
                        <span className="old">₹{course.regularPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="courses-section-hover">
                    <div className="hover-content">
                      <h3>{course.title}</h3>
                      <p>{course.overview?.slice(0, 120) || "No overview provided."}</p>
                      <button
                        className="courses-section-enroll-btn"
                        onClick={() => navigate(`/course-details/${course._id}`)}
                      >
                        Enroll Now
                      </button>
                      <div
                        className="wishlist-icon"
                        onClick={() => toggleWishlist(course)}
                      >
                        {isWishlisted ? "❤️" : "🤍"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-courses">No courses found.</p>
          )}
        </div>

        {canScrollRight && (
          <button className="carousel-btn right" onClick={scrollRight}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

function Courseshome() {
  const [courses, setCourses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setLoggedIn(!!parsed && !!parsed.email);
      } catch {
        setLoggedIn(false);
      }
    }
  }, []);

  // ✅ Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // ✅ Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && Array.isArray(res.data.wishlist)) {
          setWishlist(res.data.wishlist.map((item) => item._id.toString()));
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    fetchWishlist();
  }, [token]);

  // ✅ Toggle wishlist with MongoDB
  const toggleWishlist = async (course) => {
    if (!loggedIn) {
      toast.warning("Please login to use Wishlist 💖");
      navigate("/login");
      return;
    }

    const courseId = course._id.toString();
    const isInWishlist = wishlist.includes(courseId);

    try {
      let res;
      if (isInWishlist) {
        res = await axios.delete(
          `http://localhost:5000/api/wishlist/remove/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.info("Removed from wishlist 💔");
      } else {
        res = await axios.post(
          `http://localhost:5000/api/wishlist/add/${courseId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Added to wishlist 💖");
      }

      if (res.data && Array.isArray(res.data.wishlist)) {
        setWishlist(res.data.wishlist.map((item) => item._id.toString()));
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Server error occurred.");
    }
  };

  const categories = ["All", ...Array.from(new Set(courses.map((c) => c.category || "Other")))];
  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => (c.category || "Other") === activeCategory);

  const sectionMap = {
    "🔥 Trending Courses": courses.slice(0, 8),
    "💻 Top Courses in Development": courses.filter((c) =>
      ["Development", "Web Development", "App Development"].includes(c.category)
    ),
    "🎨 Top Courses in Design": courses.filter((c) =>
      ["Design", "UI/UX", "Graphic Design"].includes(c.category)
    ),
    "💼 Top Courses in Business": courses.filter((c) =>
      ["Business", "Marketing", "Finance"].includes(c.category)
    ),
    "⚡ Short & Sweet Courses for You": courses.filter(
      (c) => c.duration && parseFloat(c.duration) <= 3
    ),
    "🧠 Newest Courses in GenAI": courses.filter((c) =>
      ["AI", "Artificial Intelligence", "GenAI"].includes(c.category)
    ),
    "💡 Top Courses in Programming Languages": courses.filter((c) =>
      ["Programming", "Languages", "Python", "JavaScript", "C++"].includes(c.category)
    ),
    "🧩 Top Courses in IT & Software": courses.filter((c) =>
      ["IT", "Software", "Networking"].includes(c.category)
    ),
    "🌟 New & Noteworthy in Programming": courses
      .filter((c) => ["Programming", "Coding"].includes(c.category))
      .slice(-6),
  };

  const texts = [
    "Empower Your Future with Knowledge",
    "Master Skills that Define Tomorrow",
    "Learn. Build. Achieve. Repeat.",
    "Transform Ambition into Achievement",
    "Discover Courses that Inspire Growth",
  ];
const emojies = ["📚", "📝", "🎓", "📖", "🧠"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState(texts[0]);
  const currentEmoji = emojies[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentText(texts[currentIndex]);
  }, [currentIndex]);

  return (
    <section className="courses-section-container">
      <h2 className="courses-section-title">
        {loggedIn ? (
          <span className="shining-text">
            <span className="emoji">{currentEmoji}</span>{" "}
            {currentText.split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </span>
        ) : (
          <span className="shining-text">Skills to transform your career</span>
        )}
      </h2>

      <p className="courses-section-subtitle">
        {loggedIn
          ? "Discover top-rated courses, trending topics, and personalized learning picks."
          : "Explore in-demand skills with our curated courses."}
      </p>

      {!loggedIn ? (
        <>
          <nav className="category-navbar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="carousel-wrapper before-login">
            <div className="courses-carousel before-login">
              {filteredCourses.slice(0, 6).map((course) => {
                const isWishlisted = wishlist.includes(course._id.toString());
                return (
                  <div className="courses-section-card" key={course._id}>
                    <div className="courses-section-image-wrapper">
                      <img
                        src={course.featuredImage || "/src/assets/images/python.jpg"}
                        alt={course.title}
                      />
                    </div>
                    <div className="courses-section-content">
                      <h3>{course.title}</h3>
                      <p>{course.description?.slice(0, 80) || "No description."}</p>
                    </div>
                    <div className="courses-section-hover">
                      <div className="hover-content">
                        <h3>{course.title}</h3>
                        <p>{course.overview?.slice(0, 120) || "No overview provided."}</p>
                        <button
                          className="courses-section-enroll-btn"
                          onClick={() => navigate(`/course-details/${course._id}`)}
                        >
                          Enroll Now
                        </button>
                        <div
                          className="wishlist-icon"
                          onClick={() => toggleWishlist(course)}
                        >
                          {isWishlisted ? "❤️" : "🤍"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {Object.entries(sectionMap).map(([title, list]) => (
            <CourseSection
              key={title}
              title={title}
              courses={list}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              navigate={navigate}
            />
          ))}
        </>
      )}
    </section>
  );
}

export default Courseshome;
