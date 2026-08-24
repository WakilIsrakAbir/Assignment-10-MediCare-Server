import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    // Strictly allow only patients to book doctor appointments
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: `Booking restricted. Only patient accounts are permitted to book doctor appointments (your role: ${req.user.role}).`,
      });
    }

    const { doctorId, appointmentDate, appointmentTime, symptoms, fee } = req.body;
    const patientId = req.user._id;

    if (!doctorId || !appointmentDate || !appointmentTime || !symptoms) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      symptoms,
      fee: fee || doctor.consultationFee,
      paymentStatus: 'unpaid',
      appointmentStatus: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully. Please complete payment.',
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create appointment', error: error.message });
  }
};

// Get Patient Appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;
    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'doctorName specialization hospitalName profileImage consultationFee')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
};

// Get Doctor Appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    // Find doctor record for logged in user
    let doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      // If doctor profile is directly referenced or demo fallback
      doctor = await Doctor.findOne();
    }

    const query = doctor ? { doctorId: doctor._id } : {};
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email Photo phone gender')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch doctor appointments', error: error.message });
  }
};

// Update Appointment Status (Accept / Reject / Complete)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { appointmentStatus: status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}`,
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

// Reschedule Appointment (Patient)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { appointmentDate, appointmentTime, appointmentStatus: 'pending' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reschedule appointment', error: error.message });
  }
};

// Cancel Appointment (Patient)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { appointmentStatus: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to cancel appointment', error: error.message });
  }
};
