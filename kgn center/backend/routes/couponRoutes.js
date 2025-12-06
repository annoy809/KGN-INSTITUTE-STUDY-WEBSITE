// routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Needed for ObjectId validation
const Coupon = require('../models/Coupon'); // Ensure this path is correct

// Import the validateCoupon and getAllCoupons controller functions
const { validateCoupon, getAllCoupons } = require('../controllers/couponController'); // Adjust path as needed
// Helper for common error response
const sendServerError = (res, message = 'Server error. Please try again later.', error = null) => {
    console.error('Server Error:', error); // Log the actual error for debugging
    res.status(500).json({ message });
};

// POST add new coupon
router.post('/add', async (req, res) => {
    try {
        const { code, discount, type, minAmount, expiry } = req.body;

        // --- Input Validation (Recommended on backend) ---
        if (!code || discount === undefined || !type || minAmount === undefined || !expiry) {
            return res.status(400).json({ message: 'All fields (code, discount, type, minAmount, expiry) are required.' });
        }
        if (typeof discount !== 'number' || discount <= 0) {
            return res.status(400).json({ message: 'Discount must be a positive number.' });
        }
        if (!['percentage', 'flat'].includes(type)) {
            return res.status(400).json({ message: 'Type must be "percentage" or "flat".' });
        }
        if (typeof minAmount !== 'number' || minAmount < 0) {
            return res.status(400).json({ message: 'Minimum amount must be a non-negative number.' });
        }
        if (isNaN(new Date(expiry).getTime())) { // Check if expiry is a valid date
            return res.status(400).json({ message: 'Invalid expiry date format.' });
        }
        if (new Date(expiry) < new Date()) { // Expiry date should be in the future for new coupons
             return res.status(400).json({ message: 'Expiry date must be in the future.' });
        }
        // --- End Input Validation ---

        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(409).json({ message: 'Coupon code already exists.' });
        }

        const newCoupon = new Coupon({
            code: code.toUpperCase(),
            discount,
            type,
            minAmount,
            expiry,
            status: new Date(expiry) < new Date() ? 'expired' : 'usable' // Set initial status
        });

        await newCoupon.save();
        res.status(201).json({ message: 'Coupon added successfully!', coupon: newCoupon }); // Return the new coupon
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        sendServerError(res, undefined, err);
    }
});

// GET all coupons (using the controller function)
router.get('/all', getAllCoupons);


// DELETE coupon
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid coupon ID.' });
        }

        const result = await Coupon.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Coupon not found.' });
        }
        res.json({ message: 'Coupon deleted successfully.' });
    } catch (err) {
        sendServerError(res, 'Error deleting coupon.', err);
    }
});

// PUT update coupon
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid coupon ID.' });
        }

        const { code, discount, type, minAmount, expiry, status } = req.body;

        if (code && typeof code !== 'string') return res.status(400).json({ message: 'Code must be a string.' });
        if (discount !== undefined && (typeof discount !== 'number' || discount <= 0)) return res.status(400).json({ message: 'Discount must be a positive number.' });
        if (type && !['percentage', 'flat'].includes(type)) return res.status(400).json({ message: 'Type must be "percentage" or "flat".' });
        if (minAmount !== undefined && (typeof minAmount !== 'number' || minAmount < 0)) return res.status(400).json({ message: 'Minimum amount must be a non-negative number.' });
        if (expiry && isNaN(new Date(expiry).getTime())) return res.status(400).json({ message: 'Invalid expiry date format.' });
        if (status && !['usable', 'expired'].includes(status)) return res.status(400).json({ message: 'Status must be "usable" or "expired".' });

        let updatedFields = { ...req.body };
        if (expiry) {
            updatedFields.status = new Date(expiry) < new Date() ? 'expired' : 'usable';
        }
        if (code) {
            updatedFields.code = code.toUpperCase();
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found.' });
        }
        res.json({ message: 'Coupon updated successfully!', coupon: updatedCoupon });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Coupon code already exists.' });
        }
        sendServerError(res, 'Error updating coupon.', err);
    }
});

// POST to validate a coupon
router.post('/validate', validateCoupon);

// POST to increment usage count (should be called *after* a successful transaction)
router.post('/apply-usage/:code', async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });

        coupon.usageCount = (coupon.usageCount || 0) + 1;
        await coupon.save();
        res.json({ message: 'Coupon usage count updated.', coupon });
    } catch (err) {
        sendServerError(res, 'Error updating coupon usage.', err);
    }
});

module.exports = router;