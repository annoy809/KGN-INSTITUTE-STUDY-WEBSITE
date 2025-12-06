import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course) => {
    const courseId = course._id?.$oid || course._id || course.id;

    if (cartItems.some(item => item.id === courseId)) {
      return { success: false, message: "Course already in cart" };
    }

    const courseToAdd = {
      ...course,
      id: courseId,
      price: course.mainPrice || course.price || 0,       // ✅ main price
      regularPrice: course.regularPrice || null,          // ✅ optional
      discount: course.regularPrice ? (course.regularPrice - course.mainPrice) : 0 // ✅ discount
    };

    setCartItems(prev => [...prev, courseToAdd]);
    return { success: true, message: "Course added to cart" };
  };


  const removeFromCart = (courseId) => {
    setCartItems(prev => prev.filter(item => item.id !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const buyCourses = (navigate = null) => {
    if (cartItems.length === 0) return;

    const stored = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    const existingIds = new Set(stored.map(c => c.courseId));

    const newCourses = cartItems
      .map(course => {
        const courseId = course._id?.$oid || course._id || course.id;
        return {
          courseId,
          status: "enrolled",
          enrolledAt: new Date().toISOString()
        };
      })
      .filter(course => !existingIds.has(course.courseId));

    const updated = [...stored, ...newCourses];
    localStorage.setItem("enrolledCourses", JSON.stringify(updated));

    setCartItems([]);
    localStorage.removeItem("cartItems");

    if (navigate) navigate("/dashboard");
  };


  const updateCourseStatus = (courseId, newStatus) => {
    const stored = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    const updated = stored.map(course => {
      const id = course._id?.$oid || course._id || course.id;
      if (id === courseId) {
        return { ...course, status: newStatus };
      }
      return course;
    });

    localStorage.setItem("enrolledCourses", JSON.stringify(updated));
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        buyCourses,
        updateCourseStatus
      }}
    >

      {children}
    </CartContext.Provider>
  );
};
