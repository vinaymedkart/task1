import express from 'express';
import { addCartItem, getCartItems, updateCartItem, removeCartItem } from '../controllers/CartItem.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add', auth, addCartItem);
router.get('/items', auth, getCartItems);
router.put('/update', auth, updateCartItem);
router.delete('/remove/:productId', auth, removeCartItem);

export default router;