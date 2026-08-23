import express from 'express';
import { getFeaturedReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/featured', getFeaturedReviews);

export default router;
