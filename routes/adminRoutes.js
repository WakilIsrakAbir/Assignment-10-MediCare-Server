import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAdminDoctors,
  updateDoctorVerification,
  getAllAdminAppointments,
  getAdminAnalytics,
} from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.patch('/users/:id/status', verifyToken, verifyAdmin, toggleUserStatus);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);
router.get('/doctors', verifyToken, verifyAdmin, getAdminDoctors);
router.patch('/doctors/:id/verify', verifyToken, verifyAdmin, updateDoctorVerification);
router.patch('/doctors/:id/verification', verifyToken, verifyAdmin, updateDoctorVerification);
router.get('/appointments', verifyToken, verifyAdmin, getAllAdminAppointments);
router.get('/analytics', verifyToken, verifyAdmin, getAdminAnalytics);

export default router;
