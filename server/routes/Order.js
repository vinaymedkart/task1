import express from 'express';
import {  getAllPendingOrders,  placeOrder ,getOrderHistory,updateOrderStatus} from '../controllers/Order.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/place', auth, placeOrder);
router.get('/history', auth, getOrderHistory);
router.put('/status', auth, updateOrderStatus);
router.get('/getAll', auth, getAllPendingOrders);


export default router;