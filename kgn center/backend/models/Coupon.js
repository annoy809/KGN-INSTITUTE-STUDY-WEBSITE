// models/Coupon.js
// This file defines the Mongoose schema and model for a Coupon.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    // The unique code for the coupon (e.g., 'SAVE10').
    // It is stored in uppercase to prevent case-sensitive issues.
    code: {
      type: String,
      required: [true, "Coupon code is required."],
      unique: true, // Ensures no duplicate coupon codes
      uppercase: true,
      trim: true,
    },
    // The discount value applied (e.g., 10 for 10% or $10 flat).
    discount: {
      type: Number,
      required: [true, "Discount amount is required."],
      min: [0, "Discount must be a non-negative number."],
    },
    // The type of discount ('percentage' or 'flat').
    type: {
      type: String,
      enum: ["percentage", "flat"],
      required: [true, "Coupon type is required (percentage or flat)."],
    },
    // The minimum purchase amount required to use the coupon.
    minAmount: {
      type: Number,
      required: [true, "Minimum amount is required."],
      min: [0, "Minimum amount cannot be negative."],
      default: 0,
    },
    // The expiration date for the coupon.
    expiry: {
      type: Date,
      required: [true, "Expiry date is required."],
      // A custom validator to ensure the expiry date is in the future.
      validate: {
        validator: function(v) {
          return v > new Date();
        },
        message: 'Expiry date must be in the future for a new coupon.',
      },
    },
    // The number of times this coupon has been used.
    usageCount: {
      type: Number,
      default: 0,
      min: [0, "Usage count cannot be negative."],
    },
    // The status of the coupon, which can be 'usable' or 'expired'.
    status: {
      type: String,
      enum: ["usable", "expired"],
      default: "usable",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// We'll also create an index on the 'code' field for faster queries
couponSchema.index({ code: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
