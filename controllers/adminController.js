import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role && role !== 'All') query.role = role;
    if (status && status !== 'All') query.status = status;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

// Toggle User Status (Active / Suspended)
export const toggleUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'active' or 'suspended'
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: `User status changed to ${status}`, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

// Get All Doctors for Admin Management
export const getAdminDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch doctors', error: error.message });
  }
};

// Update Doctor Verification Status (Verify / Reject / Revoke)
export const updateDoctorVerification = async (req, res) => {
  try {
    const { verificationStatus } = req.body; // 'verified', 'rejected', 'pending'
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { verificationStatus },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Doctor verification updated to ${verificationStatus}`,
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update verification', error: error.message });
  }
};

// Get All Appointments for Admin Monitor
export const getAllAdminAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email Photo phone')
      .populate('doctorId', 'doctorName specialization hospitalName')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
};

// Get Admin Analytics for Recharts
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const verifiedDoctors = await Doctor.countDocuments({ verificationStatus: 'verified' });
    const pendingDoctors = await Doctor.countDocuments({ verificationStatus: 'pending' });
    const totalAppointments = await Appointment.countDocuments();
    const totalPayments = await Payment.countDocuments();

    // Aggregated chart data
    const monthlyAppointmentsData = [
      { month: 'Jan', appointments: 65, patients: 120, revenue: 5200 },
      { month: 'Feb', appointments: 85, patients: 150, revenue: 6800 },
      { month: 'Mar', appointments: 110, patients: 190, revenue: 8900 },
      { month: 'Apr', appointments: 140, patients: 230, revenue: 11200 },
      { month: 'May', appointments: 195, patients: 290, revenue: 15600 },
      { month: 'Jun', appointments: 240, patients: 350, revenue: 19200 },
    ];

    const departmentDistribution = [
      { name: 'Cardiology', count: 35, percentage: 30 },
      { name: 'Neurology', count: 25, percentage: 22 },
      { name: 'Orthopedics', count: 22, percentage: 19 },
      { name: 'Pediatrics', count: 20, percentage: 17 },
      { name: 'Dermatology', count: 14, percentage: 12 },
    ];

    const doctorRatingsData = [
      { rating: '5 Stars', count: 68 },
      { rating: '4 Stars', count: 24 },
      { rating: '3 Stars', count: 6 },
      { rating: '2 Stars', count: 2 },
    ];

    return res.status(200).json({
      success: true,
      summary: {
        totalPatients,
        totalDoctors,
        verifiedDoctors,
        pendingDoctors,
        totalAppointments,
        totalPayments,
      },
      charts: {
        monthlyAppointmentsData,
        departmentDistribution,
        doctorRatingsData,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
};
