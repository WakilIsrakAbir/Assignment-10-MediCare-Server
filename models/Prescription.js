import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    doctorName: {
      type: String,
      default: '',
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      default: '',
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g. 500mg
        frequency: { type: String, required: true }, // e.g. 1-0-1 (after meal)
        duration: { type: String, required: true }, // e.g. 7 days
      },
    ],
    notes: {
      type: String,
      default: 'Take adequate rest and follow a balanced diet.',
    },
    advice: {
      type: String,
      default: 'Follow-up in 2 weeks if symptoms persist.',
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
