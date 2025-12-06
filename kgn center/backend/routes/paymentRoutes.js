import express from "express";
const router = express.Router();

import {
  createOrder,
  verifyPayment,
  getAllPayments,
  getPaymentStats
} from "../controllers/paymentController.js";

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/", getAllPayments);
router.get("/stats", getPaymentStats);

export default router;
