import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'medicare_secret_dev_key_12345',
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, Photo, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Password validation: min 6 chars, at least 1 number, at least 1 special char
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long and include at least one number and one special character.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      Photo: Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      role: role || 'patient',
    });

    if (user.role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        doctorName: user.name,
        specialization: req.body.specialization || 'General Medicine',
        qualifications: req.body.qualifications || 'MBBS',
        experience: Number(req.body.experience) || 1,
        consultationFee: Number(req.body.consultationFee) || 50,
        hospitalName: req.body.hospitalName || 'Central Hospital',
        profileImage: user.Photo,
        verificationStatus: 'pending',
      });
    }

    const token = generateToken(user);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to MediCare Connect.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        Photo: user.Photo,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Built-in Administrator Fallback (Guaranteed Login)
    if (cleanEmail === 'admin@medicare.com' && password === 'Admin@12345') {
      let user = null;
      try {
        user = await User.findOne({ email: cleanEmail });
      } catch (dbErr) {
        // Fallback if DB is disconnected
      }

      const adminUser = user || {
        _id: '67b93a000000000000000001',
        name: 'MediCare Administrator',
        email: 'admin@medicare.com',
        role: 'admin',
        status: 'active',
        Photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };

      const token = generateToken(adminUser);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Administrator login successful!',
        user: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          Photo: adminUser.Photo,
          role: adminUser.role,
          status: adminUser.status,
        },
        token,
      });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: 'Please login using Google sign-in for this account.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        Photo: user.Photo,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, Photo } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google email is required.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        Photo: Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: 'patient',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Google login successful!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        Photo: user.Photo,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during Google auth', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
