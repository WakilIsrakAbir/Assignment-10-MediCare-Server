import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine', 'Oncology', 'Gynecology'],
    },
    qualifications: {
      type: String,
      required: true,
    },
    experience: {
      type: Number, // Years of experience
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    availableSlots: {
      type: [String],
      default: ['09:00 AM - 10:00 AM', '10:30 AM - 11:30 AM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    about: {
      type: String,
      default: 'Dedicated healthcare specialist committed to providing compassionate patient-centered care and modern medical diagnostics.',
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;
