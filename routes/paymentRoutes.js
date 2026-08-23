import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getAllPayments,
} from '../controllers/paymentController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-intent', verifyToken, createPaymentIntent);
router.post('/confirm', verifyToken, confirmPayment);
router.get('/my-payments', verifyToken, getMyPayments);
router.get('/all', verifyToken, verifyAdmin, getAllPayments);

export default router;
