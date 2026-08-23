import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { verifyToken, verifyDoctor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createAppointment);
router.get('/patient/my-appointments', verifyToken, getPatientAppointments);
router.get('/doctor/my-appointments', verifyToken, verifyDoctor, getDoctorAppointments);
router.patch('/:id/status', verifyToken, updateAppointmentStatus);
router.patch('/:id/reschedule', verifyToken, rescheduleAppointment);
router.patch('/:id/cancel', verifyToken, cancelAppointment);

export default router;
