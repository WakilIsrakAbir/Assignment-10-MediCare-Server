import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';

export const getPlatformStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments({ verificationStatus: 'verified' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    const totalReviews = await Review.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        totalDoctors: totalDoctors || 120,
        totalPatients: totalPatients || 8500,
        totalAppointments: totalAppointments || 14200,
        totalReviews: totalReviews || 3400,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
};
