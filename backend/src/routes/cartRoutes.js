const express = require('express');
const { addToCart, updateCart, removeFromCart, getCartItems } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addToCart);
router.put('/update', authMiddleware, updateCart);
router.delete('/:itemId/remove', authMiddleware, removeFromCart);
router.get('/:userId/items', authMiddleware, getCartItems);

module.exports = router;