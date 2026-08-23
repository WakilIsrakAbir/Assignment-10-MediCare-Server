import Doctor from '../models/Doctor.js';

export const getFeaturedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ verificationStatus: 'verified' })
      .sort({ rating: -1, experience: -1 })
      .limit(6);
    return res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching featured doctors', error: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { search, specialization, sortBy, order = 'desc', page = 1, limit = 9 } = req.query;

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
    return res.status(500).json({ success: false, message: 'Error fetching doctors', error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching doctor details', error: error.message });
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
