import express from 'express';
import {
  getFeaturedReviews,
  addReview,
  getMyReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/featured', getFeaturedReviews);
router.get('/my-reviews', verifyToken, getMyReviews);
router.post('/', verifyToken, addReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;
