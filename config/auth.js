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
    baseURL:
      process.env.BETTER_AUTH_URL ||
      (process.env.VERCEL || process.env.NODE_ENV === 'production'
        ? 'https://assignment-10-medi-care-server.vercel.app'
        : 'http://localhost:5000'),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      autoSignIn: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
      },
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
      'https://assignment-10-medi-care-client.vercel.app',
      process.env.CLIENT_URL,
    ].filter(Boolean),
  });

  return authInstance;
};
