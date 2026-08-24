import express from 'express';
import {
  getFeaturedReviews,
  addReview,
  getMyReviews,
  updateReview,
  deleteReview,
  getReviewsByDoctor,
  getMyDoctorReceivedReviews,
} from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/featured', getFeaturedReviews);
router.get('/my-reviews', verifyToken, getMyReviews);
router.get('/doctor-received', verifyToken, getMyDoctorReceivedReviews);
router.get('/doctor/:doctorId', getReviewsByDoctor);
router.post('/', verifyToken, addReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;
