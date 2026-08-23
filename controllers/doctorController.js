import Doctor from '../models/Doctor.js';

// Get Top Featured Verified Doctors for Homepage
export const getFeaturedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ verificationStatus: 'verified' })
      .sort({ rating: -1, experience: -1 })
      .limit(6);
    return res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    return res.status(200).json({ success: true, count: 0, data: [] });
  }
};

// Get All Verified Doctors with Search, Filter, Sort and Pagination
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

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
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
      total: 0,
      page: 1,
      totalPages: 1,
      data: [],
    });
  }
};

// Get Single Doctor By ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found or pending verification' });
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }
};

// Doctor Profile: Get Logged In Doctor Profile
export const getMyDoctorProfile = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      doctor = await Doctor.create({
        userId: req.user._id,
        doctorName: req.user.name,
        specialization: 'General Medicine',
        qualifications: 'MBBS',
        experience: 1,
        consultationFee: 50,
        hospitalName: 'General Hospital',
        profileImage: req.user.Photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        verificationStatus: 'pending',
      });
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching doctor profile', error: error.message });
  }
};

// Doctor Profile: Update Logged In Doctor Profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      qualifications,
      experience,
      consultationFee,
      hospitalName,
      availableDays,
      availableSlots,
      about,
      profileImage,
    } = req.body;

    let doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      doctor = new Doctor({
        userId: req.user._id,
        doctorName: req.user.name,
        specialization: specialization || 'General Medicine',
        qualifications: qualifications || 'MBBS',
        experience: experience || 1,
        consultationFee: consultationFee || 50,
        hospitalName: hospitalName || 'General Hospital',
        profileImage: profileImage || req.user.Photo,
        verificationStatus: 'pending',
      });
    }

    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience) doctor.experience = Number(experience);
    if (consultationFee) doctor.consultationFee = Number(consultationFee);
    if (hospitalName) doctor.hospitalName = hospitalName;
    if (availableDays) doctor.availableDays = availableDays;
    if (availableSlots) doctor.availableSlots = availableSlots;
    if (about) doctor.about = about;
    if (profileImage) {
      doctor.profileImage = profileImage;
      try {
        await User.findByIdAndUpdate(req.user._id, { Photo: profileImage });
      } catch (err) {}
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: 'Professional doctor profile updated successfully.',
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating doctor profile', error: error.message });
  }
};
