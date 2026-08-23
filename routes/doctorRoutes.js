import express from 'express';
import {
  getAllDoctors,
  getFeaturedDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateDoctorProfile,
} from '../controllers/doctorController.js';
import { verifyToken, verifyDoctor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/featured', getFeaturedDoctors);
router.get('/me/profile', verifyToken, verifyDoctor, getMyDoctorProfile);
router.put('/me/profile', verifyToken, verifyDoctor, updateDoctorProfile);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

export default router;
