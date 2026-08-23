import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { memoryUsers } from '../controllers/authController.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.cookies && req.cookies['better-auth.session_token']) {
      token = req.cookies['better-auth.session_token'];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
    }

    const secret = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'medicare_better_auth_secret_dev_key_12345';
    let decoded = null;

    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      // Fallback secret check if separate JWT_SECRET was configured
      if (process.env.JWT_SECRET && process.env.JWT_SECRET !== secret) {
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          // Token verification failed
        }
      }
    }

    let user = null;
    if (decoded && (decoded.id || decoded.sub || decoded.userId)) {
      const userId = decoded.id || decoded.sub || decoded.userId;
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await User.findById(userId).select('-password');
      } else {
        user = await User.findOne({ email: decoded.email }).select('-password');
      }
    } else if (decoded && decoded.email) {
      user = await User.findOne({ email: decoded.email }).select('-password');
    }

    // If still not found, check Better Auth session collection if db connected
    if (!user && mongoose.connection.db) {
      const sessionDoc = await mongoose.connection.db.collection('session').findOne({ token });
      if (sessionDoc && sessionDoc.userId) {
        user = await User.findById(sessionDoc.userId).select('-password');
      }
    }

    if (!user && decoded && decoded.email) {
      user = memoryUsers.get(decoded.email.toLowerCase().trim()) || {
        _id: decoded.id || decoded.userId || 'usr_session',
        name: decoded.name || decoded.email.split('@')[0],
        email: decoded.email,
        role: decoded.role || 'patient',
        Photo: decoded.Photo || '',
        status: 'active',
      };
    }

    if (!user && decoded && decoded.email === 'admin@medicare.com') {
      user = {
        _id: '67b93a000000000000000001',
        name: 'MediCare Administrator',
        email: 'admin@medicare.com',
        role: 'admin',
        status: 'active',
      };
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token or user account not found.' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed', error: error.message });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden. Administrator access required.' });
  }
};

export const verifyDoctor = (req, res, next) => {
  if (req.user && (req.user.role === 'doctor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden. Doctor credentials required.' });
  }
};

