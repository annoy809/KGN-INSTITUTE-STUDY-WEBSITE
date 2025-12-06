const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  method: { type: String, default: "razorpay" },
  status: { type: String, default: "pending" },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  billingInfo: {
    fullName: String,
    email: String,
    phone: String,
    country: String,
    state: String,
    city: String,
    address: String,
    pincode: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
