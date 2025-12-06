const Cart = require('../models/Cart');
const Course = require('../models/course'); // Assuming a Course model exists

/**
 * @desc    Get a user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    // Find the cart for the logged-in user
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.courseId', 'title price imageUrl');

    // If no cart exists, return an empty cart to the client
    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add a course to the cart
 * @route   POST /api/cart/add
 * @access  Private
 */
const addItemToCart = async (req, res) => {
  const { courseId } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if the item is already in the cart
    const itemExists = cart.items.some(item => item.courseId.toString() === courseId);

    if (itemExists) {
      return res.status(400).json({ message: 'Item is already in the cart' });
    }

    // Add the new item
    cart.items.push({ courseId: courseId, quantity: 1 });

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Remove an item from the cart
 * @route   DELETE /api/cart/remove/:courseId
 * @access  Private
 */
const removeItemFromCart = async (req, res) => {
  const { courseId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the item to be removed
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(item => item.courseId.toString() !== courseId);

    // If the item count didn't change, the item wasn't in the cart
    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Clear the entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Set the items array to empty
    cart.items = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
};
