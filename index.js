import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      process.env.CLIENT_URL || 'http://localhost:3000',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected Successfully');
    } else {
      console.log('MONGODB_URI not found in environment variables.');
    }
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
  }
};

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Medicare API Server is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Medicare Server running on port ${PORT}`);
  connectDB();
});
