import express from 'express';
import { getAllDoctors, getFeaturedDoctors, getDoctorById } from '../controllers/doctorController.js';

const router = express.Router();

router.get('/featured', getFeaturedDoctors);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

export default router;
