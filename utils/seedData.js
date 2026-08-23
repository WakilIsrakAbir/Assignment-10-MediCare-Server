import Doctor from '../models/Doctor.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

export const fallbackDoctors = [
  {
    _id: '67b93a010000000000000001',
    doctorName: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD (Cardiology), FACC',
    experience: 12,
    consultationFee: 120,
    hospitalName: 'Apollo Heart Center',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM - 11:00 AM', '03:00 PM - 05:00 PM'],
    rating: 4.9,
    totalReviews: 128,
    verificationStatus: 'verified',
    about: 'Senior Consultant Cardiologist specializing in interventional cardiology and preventive cardiovascular health with over a decade of excellence.',
  },
  {
    _id: '67b93a010000000000000002',
    doctorName: 'Dr. Marcus Vance',
    specialization: 'Neurology',
    qualifications: 'MBBS, DM (Neurology), MRCP (UK)',
    experience: 15,
    consultationFee: 150,
    hospitalName: 'Novant Neuro Institute',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: ['10:00 AM - 01:00 PM', '04:00 PM - 06:00 PM'],
    rating: 4.8,
    totalReviews: 95,
    verificationStatus: 'verified',
    about: 'Specialized in treating complex neurological disorders, stroke rehabilitation, and advanced neuro-diagnostics.',
  },
  {
    _id: '67b93a010000000000000003',
    doctorName: 'Dr. Elena Rostova',
    specialization: 'Pediatrics',
    qualifications: 'MBBS, DCH, MD (Pediatrics)',
    experience: 8,
    consultationFee: 90,
    hospitalName: 'Childrens Care Hospital',
    profileImage: 'https://images.unsplash.com/photo-1594824813633-89871a339943?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableSlots: ['08:30 AM - 12:00 PM', '02:00 PM - 04:30 PM'],
    rating: 5.0,
    totalReviews: 210,
    verificationStatus: 'verified',
    about: 'Warm, compassionate pediatrician dedicated to infant care, child nutrition, and pediatric development wellness.',
  },
  {
    _id: '67b93a010000000000000004',
    doctorName: 'Dr. Robert Chen',
    specialization: 'Orthopedics',
    qualifications: 'MBBS, MS (Orthopedics), MCh (Ortho)',
    experience: 14,
    consultationFee: 130,
    hospitalName: 'Metropolitan Bone & Joint Clinic',
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    availableSlots: ['09:00 AM - 12:30 PM', '03:30 PM - 06:00 PM'],
    rating: 4.7,
    totalReviews: 84,
    verificationStatus: 'verified',
    about: 'Expert orthopedic surgeon specializing in arthroscopy, sports injury recovery, and joint replacement therapy.',
  },
  {
    _id: '67b93a010000000000000005',
    doctorName: 'Dr. Aisha Al-Mansoor',
    specialization: 'Dermatology',
    qualifications: 'MBBS, DVD, MD (Dermatology)',
    experience: 9,
    consultationFee: 110,
    hospitalName: 'Glow Skin & Laser Medical',
    profileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    availableSlots: ['11:00 AM - 02:00 PM', '05:00 PM - 07:00 PM'],
    rating: 4.9,
    totalReviews: 142,
    verificationStatus: 'verified',
    about: 'Certified clinical dermatologist specializing in advanced laser therapeutics, acne treatment, and clinical skincare.',
  },
  {
    _id: '67b93a010000000000000006',
    doctorName: 'Dr. David Kim',
    specialization: 'General Medicine',
    qualifications: 'MBBS, MD (Internal Medicine)',
    experience: 11,
    consultationFee: 85,
    hospitalName: 'City General Medical Center',
    profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['08:00 AM - 11:30 AM', '01:00 PM - 04:00 PM'],
    rating: 4.8,
    totalReviews: 176,
    verificationStatus: 'verified',
    about: 'Providing comprehensive primary care, chronic disease management, and holistic preventive health consultations.',
  },
];

export const fallbackReviews = [
  {
    _id: '67b93b010000000000000001',
    patientName: 'Emma Watson',
    patientRole: 'Patient (Heart Checkup)',
    patientPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    doctorId: fallbackDoctors[0],
    rating: 5,
    reviewText: 'Dr. Sarah Jenkins made me feel completely relaxed during my consultation. Her diagnosis was spot on and the treatment plan improved my stamina tremendously!',
  },
  {
    _id: '67b93b010000000000000002',
    patientName: 'Liam Hemsworth',
    patientRole: 'Patient (Neurology Consultation)',
    patientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    doctorId: fallbackDoctors[1],
    rating: 5,
    reviewText: 'The online booking was flawless, and Dr. Marcus Vance took the time to answer all my questions about migraine management. Outstanding service!',
  },
  {
    _id: '67b93b010000000000000003',
    patientName: 'Sophia Miller',
    patientRole: 'Mother of 4-year-old patient',
    patientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    doctorId: fallbackDoctors[2],
    rating: 5,
    reviewText: 'Dr. Elena Rostova is the gentlest pediatrician we have ever met. My son was calm and happy throughout the visit. Highly recommended!',
  },
  {
    _id: '67b93b010000000000000004',
    patientName: 'Daniel Craig',
    patientRole: 'Patient (Knee Rehabilitation)',
    patientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    doctorId: fallbackDoctors[3],
    rating: 5,
    reviewText: 'Thanks to Dr. Robert Chen, I went from acute knee pain to walking comfortably in just 3 weeks of prescribed physical therapy and care.',
  },
];

export const seedInitialData = async () => {
  try {
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      console.log('Seeding initial verified doctors...');
      const cleanDocs = fallbackDoctors.map(({ _id, ...rest }) => rest);
      const insertedDoctors = await Doctor.insertMany(cleanDocs);

      const reviewCount = await Review.countDocuments();
      if (reviewCount === 0 && insertedDoctors.length > 0) {
        console.log('Seeding initial testimonials & reviews...');
        const cleanReviews = fallbackReviews.map((r, idx) => ({
          patientName: r.patientName,
          patientRole: r.patientRole,
          patientPhoto: r.patientPhoto,
          doctorId: insertedDoctors[idx % insertedDoctors.length]._id,
          rating: r.rating,
          reviewText: r.reviewText,
        }));
        await Review.insertMany(cleanReviews);
      }
    }
  } catch (error) {
    console.error('Seed Data Note:', error.message);
  }
};
