// controllers/couponController.js
const Coupon = require('../models/Coupon');

// Helper for sending a consistent server error response
const sendServerError = (res, message, error) => {
    console.error(`Server Error: ${message}`, error);
    res.status(500).json({ message: message });
};

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Private (Admin)
 */
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    } catch (err) {
        sendServerError(res, 'Error fetching coupons.', err);
    }
};

/**
 * @desc    Add a new coupon
 * @route   POST /api/coupons/add
 * @access  Private (Admin)
 */
exports.addCoupon = async (req, res) => {
    try {
        const { code, discount, type, minAmount, expiry, maxUsage } = req.body;

        const newCoupon = new Coupon({
            code,
            discount,
            type,
            minAmount,
            expiry,
            maxUsage,
        });

        await newCoupon.save();
        res.status(201).json({ message: 'Coupon created successfully!', coupon: newCoupon });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Coupon code already exists.' });
        }
        sendServerError(res, 'Error creating coupon.', err);
    }
};

/**
 * @desc    Validate a coupon code
 * @route   POST /api/coupons/validate
 * @access  Public
 */
exports.validateCoupon = async (req, res) => {
    const { code, amount } = req.body;
    try {
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code.' });
        }
        if (coupon.expiry < new Date()) {
            return res.status(400).json({ message: 'Coupon has expired.' });
        }
        if (coupon.minAmount > amount) {
            return res.status(400).json({ message: `Minimum purchase amount is ₹${coupon.minAmount}.` });
        }
        if (coupon.usageCount >= coupon.maxUsage) {
            return res.status(400).json({ message: 'Coupon usage limit has been reached.' });
        }

        res.status(200).json({
            message: 'Coupon is valid!',
            coupon
        });
    } catch (err) {
        sendServerError(res, 'Error validating coupon.', err);
    }
};

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/coupons/delete/:id
 * @access  Private (Admin)
 */
exports.deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found.' });
        }
        res.status(200).json({ message: 'Coupon deleted successfully!' });
    } catch (err) {
        sendServerError(res, 'Error deleting coupon.', err);
    }
};

/**
 * @desc    Update an existing coupon
 * @route   PUT /api/coupons/update/:id
 * @access  Private (Admin)
 */
exports.updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        
        if (updatedFields.code) {
            updatedFields.code = updatedFields.code.toUpperCase();
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
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
};

/**
 * @desc    Increment usage count of a coupon
 * @route   POST /api/coupons/apply-usage/:code
 * @access  Private (after successful payment)
 */
exports.incrementUsage = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });

        coupon.usageCount = (coupon.usageCount || 0) + 1;
        await coupon.save();
        res.status(200).json({ message: 'Coupon usage count incremented.' });
    } catch (err) {
        sendServerError(res, 'Error applying coupon usage.', err);
    }
};
