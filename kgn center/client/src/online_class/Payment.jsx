import React from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./payment.css";
import { FaCheckCircle, FaShieldAlt, FaRupeeSign, FaLock } from "react-icons/fa";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  const planPrices = {
    Beginner: 99,
    Advance: 149,
    Pro: 199,
  };

  const planAmount = planPrices[selectedPlan] || 99;

const handlePayment = async () => {
  try {
    // Get Public Key
    const keyData = await axios.get("http://localhost:5000/api/payment/get-key");

    // Create order
    const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
      amount: planAmount,
    });

    const options = {
      key: keyData.data.key,
      currency: "INR",
      amount: data.amount,
      name: "Premium Online Classes",
      description: `${selectedPlan} Plan Subscription`,
      order_id: data.id,
      theme: { color: "#4F46E5" },

      handler: function (response) {
        alert("🎉 Payment Successful!");
      },

      modal: {
        ondismiss: function () {
          alert("Payment Cancelled ❌");
        },
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    alert("Server Error! Payment Failed ❌");
  }
};


  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <h2>Complete Your Subscription</h2>
        <p className="subtitle">Access premium classes, notes, live sessions & much more.</p>

        <div className="plan-box">
          <h3>{selectedPlan} Plan</h3>

          <div className="amount-line">
            <FaRupeeSign size={22} />
            <span className="big-amount">{planAmount}</span>
            <span className="per-month">/ month</span>
          </div>

          <div className="features-list">
            <p><FaCheckCircle /> Unlimited access to all classes</p>
            <p><FaCheckCircle /> Premium study materials</p>
            <p><FaCheckCircle /> Live doubt sessions</p>
            <p><FaCheckCircle /> Certificates & assignments</p>
            <p><FaCheckCircle /> Daily practice problems</p>
            <p><FaCheckCircle /> Student community access</p>
          </div>
        </div>

        <div className="billing-summary">
          <h4>Billing Summary</h4>

          <div className="bill-row">
            <span>Subscription</span>
            <span>₹{planAmount}</span>
          </div>

          <div className="bill-row">
            <span>GST (18%)</span>
            <span>₹{(planAmount * 0.18).toFixed(2)}</span>
          </div>

          <hr />

          <div className="bill-row total">
            <strong>Total to Pay</strong>
            <strong>₹{(planAmount * 1.18).toFixed(2)}</strong>
          </div>
        </div>

        <button className="pay-button" onClick={handlePayment}>
          Pay ₹{(planAmount * 1.18).toFixed(2)} Securely
        </button>

        <div className="secure-note">
          <FaShieldAlt size={18} /> 100% Secure Payment powered by Razorpay
        </div>

        <div className="secure-mini">
          <FaLock size={12} /> Your card details are encrypted
        </div>
      </div>
    </div>
  );
};

export default Payment;
