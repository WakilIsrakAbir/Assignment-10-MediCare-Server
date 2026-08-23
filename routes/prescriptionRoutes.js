import express from 'express';
import {
  createPrescription,
  updatePrescription,
  getPrescriptionByAppointment,
  getMyPrescriptions,
} from '../controllers/prescriptionController.js';
import { verifyToken, verifyDoctor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, verifyDoctor, createPrescription);
router.put('/:id', verifyToken, verifyDoctor, updatePrescription);
router.get('/appointment/:appointmentId', verifyToken, getPrescriptionByAppointment);
router.get('/my-prescriptions', verifyToken, getMyPrescriptions);

export default router;
