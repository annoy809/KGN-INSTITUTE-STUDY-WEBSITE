// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const protect = require('../middleware/authMiddleware'); // <<< Make sure this path is correct

// All cart routes will be protected
router.use(protect); // Applies the protect middleware to all routes in this router

router.get('/', cartController.getCart);
router.post('/add', cartController.addItemToCart);
router.delete('/remove/:courseId', cartController.removeItemFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;