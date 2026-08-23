import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt, bearer } from 'better-auth/plugins';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let authInstance = null;

export const getAuth = () => {
  if (authInstance) return authInstance;

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database not connected. Initialize MongoDB connection before calling getAuth().');
  }

  authInstance = betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'medicare_better_auth_secret_dev_key_12345',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      autoSignIn: true,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          defaultValue: 'patient',
          required: false,
        },
        phone: {
          type: 'string',
          required: false,
        },
        gender: {
          type: 'string',
          required: false,
        },
        status: {
          type: 'string',
          defaultValue: 'active',
          required: false,
        },
        Photo: {
          type: 'string',
          required: false,
        },
      },
    },
    plugins: [
      jwt({
        jwt: {
          expirationTime: '7d',
        },
      }),
      bearer(),
    ],
    trustedOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL || 'http://localhost:3000',
    ],
  });

  return authInstance;
};
