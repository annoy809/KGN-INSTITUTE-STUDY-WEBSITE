import React, { useContext, useState } from "react";
import { CartContext } from "../../../Cartcontext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./checkout.css";
import Logo from "../../../assets/images/Kgnlogo.jpg";

const CheckoutPage = () => {
  const { cartItems, buyCourses } = useContext(CartContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [billingSaved, setBillingSaved] = useState(false);

  // ✅ Price Calculation
  const originalPrice = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.regularPrice || item.mainPrice || item.price || 0),
    0
  );

  const discount = cartItems.reduce(
    (total, item) =>
      total +
      (Number(item.regularPrice || 0) -
        Number(item.mainPrice || item.price || 0)),
    0
  );

  const finalTotal = originalPrice - discount;

  // ✅ Form Handling
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const isFormComplete = Object.values(formData).every((v) => v.trim() !== "");

  // ✅ Step 1: Save Billing Info
  const handleBillingSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Billing Info...", formData);

    if (cartItems.length === 0) {
      toast.error("🛒 Please add at least one course to cart.");
      return;
    }

    if (!isFormComplete) {
      toast.error("⚠️ Please fill all billing fields.");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Current User:", user);

      if (!user?._id) {
        toast.error("Please login to continue.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/payments/save-billing",
        {
          userId: user._id,
          billingInfo: formData,
        }
      );

      console.log("Billing Save Response:", res.data);

      if (res.data.success) {
        toast.success("✅ Billing information saved!");
        setBillingSaved(true);
      } else {
        toast.error(res.data.message || "❌ Failed to save billing info.");
      }
    } catch (err) {
      console.error("Billing error:", err);
      toast.error("❌ Failed to save billing info. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Payment Flow
  const handleFinalPay = async () => {
    if (!billingSaved || !isFormComplete) {
      toast.error("⚠️ Please complete billing information first.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("🛒 Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const orderRes = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        {
          amount: finalTotal,
        }
      );

      const { id: order_id, amount, currency } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Kgn Centre",
        description: "Course Purchase",
        image: Logo,
        order_id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                currency,
                method: "razorpay",
                status: "captured",
                email: formData.email,
                contact: formData.phone,
                userId: JSON.parse(localStorage.getItem("user"))?._id || null,
                courseIds: cartItems.map((item) => item._id),
                billingInfo: { ...formData },
              }
            );

            if (verifyRes.data.status === "success") {
              toast.success("🎉 Payment Successful! Courses Unlocked.");
              buyCourses();

              // Reset form
              setFormData({
                fullName: "",
                email: "",
                phone: "",
                country: "India",
                state: "",
                city: "",
                address: "",
                pincode: "",
              });
              setBillingSaved(false);
            } else {
              toast.error("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("⚠️ Error verifying payment.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: { address: formData.address },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay init error:", err);
      toast.error("❌ Payment initiation failed.");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-content">
        {/* 🧾 Left Section — Billing Form */}
        <div className="left-section">
          <h3>Billing Information</h3>

          <form className="billing-form" onSubmit={handleBillingSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select id="country" value={formData.country} onChange={handleChange}>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pincode">PIN Code</label>
                <input
                  type="text"
                  id="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || billingSaved}
            >
              {loading
                ? "Saving..."
                : billingSaved
                ? "Billing Saved ✅"
                : "Save Billing Info"}
            </button>
          </form>
        </div>

        {/* 💰 Right Section — Order Summary */}
        <div className="right-section">
          <div className="order-summary">
            <h3>Order Summary</h3>

            {cartItems.length === 0 ? (
              <p>No courses in cart.</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cartItems.map((item) => (
                    <li key={item._id} className="cart-item">
                      <div className="cart-img">
                        <img
                          src={item.featuredImage || "https://via.placeholder.com/80"}
                          alt={item.title}
                        />
                      </div>
                      <div className="cart-details">
                        <h4>{item.title}</h4>
                        <p>₹{item.mainPrice}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <hr />
                <p>Original Price: ₹{originalPrice}</p>
                <p>Discount: ₹{discount}</p>
                <p className="total">
                  <strong>Total: ₹{finalTotal}</strong>
                </p>

                <button
                  className="pay-btn"
                  disabled={!billingSaved || loading}
                  onClick={handleFinalPay}
                >
                  {loading ? "Processing..." : `Pay ₹${finalTotal}`}
                </button>

                <p className="refund-policy">
                  🔒 <strong>7-Day Money-Back Guarantee:</strong> Not satisfied?
                  Get a full refund within 7 days.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
