import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const seedInitialData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);

    // 1. Ensure Default Admin Account Exists with password admin123
    const adminEmail = 'admin@medicare.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminPasswordHash = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'MediCare Administrator',
        email: adminEmail,
        password: adminPasswordHash,
        role: 'admin',
        status: 'active',
        Photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        phone: '+1 (800) 555-0199',
        gender: 'Other',
      });
      console.log('✅ Default Admin created: admin@medicare.com / admin123');
    }
  } catch (error) {
    console.error('Database Seed Note:', error.message);
  }
};
