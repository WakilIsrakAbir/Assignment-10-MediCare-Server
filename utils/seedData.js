import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const seedInitialData = async () => {
  try {
    // 1. Ensure Default Admin Account Exists
    const adminEmail = 'admin@medicare.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('Creating default MediCare administrator account in database...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@12345', salt);

      await User.create({
        name: 'MediCare Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        Photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        phone: '+1 (800) 555-0199',
        gender: 'Other',
      });
      console.log('✅ Default Admin created: admin@medicare.com / Admin@12345');
    } else if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
    }
  } catch (error) {
    console.error('Database Seed Note:', error.message);
  }
};
