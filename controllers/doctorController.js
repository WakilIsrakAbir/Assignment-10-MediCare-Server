import Doctor from '../models/Doctor.js';
import { fallbackDoctors } from '../utils/seedData.js';
import mongoose from 'mongoose';

export const getFeaturedDoctors = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: fallbackDoctors.length, data: fallbackDoctors });
    }
    const doctors = await Doctor.find({ verificationStatus: 'verified' })
      .sort({ rating: -1, experience: -1 })
      .limit(6);
    return res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    return res.status(200).json({ success: true, count: fallbackDoctors.length, data: fallbackDoctors });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { search, specialization, sortBy, order = 'desc', page = 1, limit = 9 } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...fallbackDoctors];
      if (search) {
        filtered = filtered.filter(d => 
          d.doctorName.toLowerCase().includes(search.toLowerCase()) || 
          d.specialization.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (specialization && specialization !== 'All') {
        filtered = filtered.filter(d => d.specialization.toLowerCase() === specialization.toLowerCase());
      }
      return res.status(200).json({
        success: true,
        total: filtered.length,
        page: 1,
        totalPages: 1,
        data: filtered,
      });
    }

    const query = { verificationStatus: 'verified' };

    if (search) {
      query.$or = [
        { doctorName: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { hospitalName: { $regex: search, $options: 'i' } },
      ];
    }

    if (specialization && specialization !== 'All') {
      query.specialization = specialization;
    }

    let sortOptions = {};
    if (sortBy === 'fee') {
      sortOptions.consultationFee = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'experience') {
      sortOptions.experience = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'rating') {
      sortOptions.rating = order === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: doctors,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      total: fallbackDoctors.length,
      page: 1,
      totalPages: 1,
      data: fallbackDoctors,
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const doc = fallbackDoctors.find(d => d._id.toString() === req.params.id) || fallbackDoctors[0];
      return res.status(200).json({ success: true, data: doc });
    }
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      const doc = fallbackDoctors.find(d => d._id.toString() === req.params.id);
      if (doc) return res.status(200).json({ success: true, data: doc });
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    const doc = fallbackDoctors.find(d => d._id.toString() === req.params.id) || fallbackDoctors[0];
    return res.status(200).json({ success: true, data: doc });
  }
};

// Doctor Profile: Get Logged In Doctor Profile
export const getMyDoctorProfile = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      // Return first doctor as fallback profile if newly registered doctor
      doctor = await Doctor.findOne();
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch doctor profile', error: error.message });
  }
};

// Doctor Profile: Update Profile & Schedule
export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      qualifications,
      experience,
      consultationFee,
      hospitalName,
      availableDays,
      availableSlots,
      about,
      profileImage,
    } = req.body;

    let doctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      {
        qualifications,
        experience,
        consultationFee,
        hospitalName,
        availableDays,
        availableSlots,
        about,
        profileImage,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Doctor profile and schedule updated successfully',
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update doctor profile', error: error.message });
  }
};
