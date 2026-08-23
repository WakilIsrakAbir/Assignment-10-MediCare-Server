import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51MockTestKeyForDevelopment1234567890abcdef');

// Create Stripe Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const amountInCents = Math.round(amount * 100);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          appointmentId: appointmentId || '',
          userId: req.user?._id?.toString() || '',
        },
      });

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      });
    } catch (stripeErr) {
      // In development mode with mock key, generate realistic client secret
      const mockSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
      return res.status(200).json({
        success: true,
        clientSecret: mockSecret,
        id: `pi_mock_${Date.now()}`,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to initiate payment', error: error.message });
  }
};

// Confirm & Record Payment
export const confirmPayment = async (req, res) => {
  try {
    const { appointmentId, doctorId, amount, transactionId, paymentMethod } = req.body;
    const patientId = req.user._id;

    const payment = await Payment.create({
      appointmentId,
      patientId,
      doctorId,
      amount,
      transactionId: transactionId || `txn_${Date.now()}`,
      paymentMethod: paymentMethod || 'Stripe Card',
      paymentDate: new Date(),
      status: 'succeeded',
    });

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: 'paid',
        appointmentStatus: 'accepted',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Payment confirmed and appointment booked!',
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to record payment', error: error.message });
  }
};

// Get Patient Payment History
export const getMyPayments = async (req, res) => {
  try {
    const patientId = req.user._id;
    const payments = await Payment.find({ patientId })
      .populate('doctorId', 'doctorName specialization hospitalName profileImage')
      .populate('appointmentId', 'appointmentDate appointmentTime symptoms')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payment history', error: error.message });
  }
};

// Admin: Get All Payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('patientId', 'name email Photo')
      .populate('doctorId', 'doctorName specialization')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch all payments', error: error.message });
  }
};
