import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

// Create Prescription (Doctor)
export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, diagnosis, medications, notes, advice } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate('doctorId patientId');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const prescription = await Prescription.create({
      doctorId: appointment.doctorId._id,
      doctorName: appointment.doctorId.doctorName,
      patientId: patientId || appointment.patientId._id,
      patientName: appointment.patientId.name,
      appointmentId,
      diagnosis,
      medications: medications || [],
      notes: notes || 'Take adequate rest and drink plenty of water.',
      advice: advice || 'Follow-up in 2 weeks.',
    });

    // Mark appointment as completed
    await Appointment.findByIdAndUpdate(appointmentId, { appointmentStatus: 'completed' });

    return res.status(201).json({
      success: true,
      message: 'Prescription created successfully!',
      data: prescription,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create prescription', error: error.message });
  }
};

// Update Prescription (Doctor)
export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    return res.status(200).json({ success: true, message: 'Prescription updated', data: prescription });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update prescription', error: error.message });
  }
};

// Get Prescription by Appointment ID
export const getPrescriptionByAppointment = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
      .populate('doctorId', 'doctorName specialization hospitalName profileImage qualifications')
      .populate('patientId', 'name email phone gender');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'No prescription found for this appointment' });
    }

    return res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch prescription', error: error.message });
  }
};

// Get Patient Prescriptions
export const getMyPrescriptions = async (req, res) => {
  try {
    const patientId = req.user._id;
    const prescriptions = await Prescription.find({ patientId })
      .populate('doctorId', 'doctorName specialization hospitalName profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch prescriptions', error: error.message });
  }
};
