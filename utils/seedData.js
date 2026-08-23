import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const seedInitialData = async () => {
  try {
    // 1. Ensure Default Admin Account Exists with password admin123
    const adminEmail = 'admin@medicare.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    if (!existingAdmin) {
      console.log('Creating default MediCare administrator account in database...');
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
      console.log('✅ Default Admin created: admin@medicare.com / admin123');
    } else {
      existingAdmin.role = 'admin';
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('✅ Admin account updated with password admin123');
    }
  } catch (error) {
    console.error('Database Seed Note:', error.message);
  }
};
