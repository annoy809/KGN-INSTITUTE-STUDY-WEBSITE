// WishListSection.jsx
import React, { useEffect, useState, useContext } from "react";
import "./Wishlist.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Cartcontext";
import axios from "axios";

const WishListSection = () => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist/", {
        withCredentials: true, // important if using sessions
      });
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      toast.error("Failed to fetch wishlist from server");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove course from wishlist
  const removeFromWishlist = async (courseId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/wishlist/remove/${courseId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        toast.info(res.data.message || "Course removed from wishlist ❌");
      }
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error("Failed to remove course");
    }
  };

  // Add to cart and remove from wishlist
  const handleBuyNow = async (course) => {
    const result = addToCart(course);
    if (result.success) {
      toast.success("Course added to cart 🛒");
      await removeFromWishlist(course._id);
      navigate("/cart");
    } else {
      toast.warning(result.message);
    }
  };

  return (
    <div className="wishlist-container">
      
      <h2 className="wishlist-title">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty-state">
          <img
            src="https://www.svgrepo.com/show/489434/empty-mailbox.svg"
            alt="Empty Wishlist"
            className="wishlist-empty-image"
          />
          <div className="wishlist-empty-text">No Courses in your Wishlist</div>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => {
            // Use populated course data if available
            const course = item.courseId || item;
            const hasDiscount =
              course.regularPrice &&
              course.mainPrice &&
              course.mainPrice < course.regularPrice;
            const discountPercent = hasDiscount
              ? Math.round(
                  ((course.regularPrice - course.mainPrice) / course.regularPrice) * 100
                )
              : 0;

            return (
              <div key={course._id} className="wishlist-card">
                {hasDiscount && (
                  <div className="wishlist-discount-badge">{discountPercent}% OFF 🔥</div>
                )}

                <img
                  src={course.featuredImage || "https://via.placeholder.com/150"}
                  alt={course.title || "Course Image"}
                  className="wishlist-card-image"
                />

                <div className="wishlist-card-content">
                  <h3 className="wishlist-card-title">{course.title}</h3>
                  <p className="wishlist-card-description">
                    {course.description?.slice(0, 80)}
                  </p>

                  <p className="wishlist-course-price">
                    Price: <span className="wishlist-main-price">₹{course.mainPrice || 499}</span>
                    {hasDiscount && (
                      <span className="wishlist-regular-price"> ₹{course.regularPrice}</span>
                    )}
                  </p>

                  <div className="wishlist-card-buttons">
                    <button
                      onClick={() => removeFromWishlist(course._id)}
                      className="wishlist-btn remove"
                    >
                      Remove ❌
                    </button>
                    <button
                      onClick={() => handleBuyNow(course)}
                      className="wishlist-btn buy"
                    >
                      Buy Now 💳
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishListSection;
