import React, { useRef, useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import "../assets/Styles/Encourages.css";

function Encourages() {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📌 Fetch Real Data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories"); // your real API
        setCategories(res.data);
      } catch (err) {
        console.error("Category fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 📌 Smooth Scroll Buttons
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="carousel-section">
      <div className="carousel-badge">Top Categories</div>
      <h2 className="carousel-title">Explore Skill-Building Topics</h2>
      <p className="carousel-subtext">
        Discover categories that fuel creativity, business, and personal growth.
      </p>

      <div className="carousel-container">

        {/* LEFT BUTTON */}
        <button className="carousel-button left" onClick={() => scroll("left")}>
          <FaArrowLeft />
        </button>

        {/* MAIN TRACK */}
        <div className="carousel-track" ref={scrollRef}>
          {loading ? (
            <>
              <div className="carousel-skeleton"></div>
              <div className="carousel-skeleton"></div>
              <div className="carousel-skeleton"></div>
            </>
          ) : (
            categories.map((cat, index) => (
              <div className="carousel-item" key={index}>
                
                {/* 🔥 DYNAMIC ICON FROM DATABASE */}
                <div className="carousel-icon">
                  <i className={`fa-solid ${cat.icon}`}></i>
                </div>

                <p className="carousel-label">{cat.title}</p>
                <p className="carousel-count">{cat.count}</p>
              </div>
            ))
          )}
        </div>

        {/* RIGHT BUTTON */}
        <button className="carousel-button right" onClick={() => scroll("right")}>
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
}

export default Encourages;
