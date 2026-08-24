import express from 'express';
import { register, login, googleAuth, getMe, logout, resetPassword, updateUserProfile } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateUserProfile);
router.post('/logout', logout);

export default router;
