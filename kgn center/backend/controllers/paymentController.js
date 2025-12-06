require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan Pricing Table (Centralized)
const PLAN_PRICES = {
  Beginner: 99,
  Advance: 149,
  Pro: 199,
};

/* ============================================
   📌 CREATE ORDER (Frontend calls this)
============================================ */
exports.createOrder = async (req, res) => {
  try {
    let { plan } = req.body;

    if (!plan || !PLAN_PRICES[plan]) {
      return res.status(400).json({ error: "Invalid or missing plan" });
    }

    const amount = PLAN_PRICES[plan] * 100; // Convert INR → paise

    const options = {
      amount,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      amount: PLAN_PRICES[plan],
      plan,
    });
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ error: "Unable to create order" });
  }
};

/* ============================================
   📌 VERIFY PAYMENT (Razorpay → Backend)
============================================ */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      userId,
      email,
      contact,
      billingInfo,
    } = req.body;

    if (!plan || !PLAN_PRICES[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    // Signature Validation
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: "failed", message: "Invalid signature" });
    }

    const amount = PLAN_PRICES[plan] * 100;

    // Save to DB
    const paymentSave = new Payment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency: "INR",
      status: "success",
      method: "online",
      email,
      contact,
      plan,
      userId,
      billingInfo,
    });

    await paymentSave.save();

    res.json({ status: "success", message: "Payment verified & saved" });
  } catch (err) {
    console.error("❌ Verify Error:", err.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

/* ============================================
   📌 GET ALL PAYMENTS (Admin Panel)
============================================ */
exports.getAllPayments = async (req, res) => {
  try {
    const {
      search = "",
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const query = {
      $or: [
        { email: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { plan: { $regex: search, $options: "i" } },
      ],
    };

    const options = {
      sort: { [sortBy]: order === "asc" ? 1 : -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit),
    };

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate("userId", "username email")
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit),
      Payment.countDocuments(query),
    ]);

    res.json({
      data: payments,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Fetch Payments Error:", err.message);
    res.status(500).json({ error: "Failed to fetch payment records" });
  }
};

/* ============================================
   📊 PAYMENT STATS (Dashboard)
============================================ */
exports.getPaymentStats = async (req, res) => {
  try {
    const payments = await Payment.find();

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0) / 100;
    const totalOrders = payments.length;

    const uniqueUsers = new Set(
      payments.filter(p => p.userId).map(p => p.userId.toString())
    ).size;

    const monthlyStats = {};
    payments.forEach((p) => {
      if (!p.createdAt) return;

      const date = new Date(p.createdAt);
      const monthYear = date.toLocaleString("default", { month: "short", year: "numeric" });

      monthlyStats[monthYear] = (monthlyStats[monthYear] || 0) + p.amount / 100;
    });

    res.json({
      totalRevenue,
      totalOrders,
      uniqueUsers,
      monthlyStats,
      recentPayments: payments.slice(-10).reverse(),
    });
  } catch (err) {
    console.error("❌ Stats Error:", err.message);
    res.status(500).json({ error: "Failed to fetch payment stats" });
  }
};
