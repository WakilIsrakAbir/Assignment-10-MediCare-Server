# 🏥 MediCare Connect — Backend API Server

A robust, scalable RESTful API backend for **MediCare Connect**, an online hospital appointment booking and healthcare management platform.

---

## 🌟 Tech Stack & Features
- **Runtime Environment:** Node.js (ES Modules)
- **Framework:** Express.js 5.x
- **Database:** MongoDB & Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) & Cookie-parser
- **Security:** Bcryptjs password hashing, CORS configuration, Environment variable protection
- **Logging:** Morgan HTTP logger
- **Development Tooling:** Nodemon hot reloading

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Database (Local or MongoDB Atlas cluster)

### 2. Installation
```bash
git clone https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Server.git
cd Assignment-10-MediCare-Server
npm install
```

### 3. Running the Server
```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start
```

---

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new patient/doctor with strong password validation
- `POST /api/auth/login` — Sign in with email and password, receives JWT
- `POST /api/auth/google` — Sync & authenticate Google OAuth users
- `GET /api/auth/me` — Fetch currently authenticated user profile
- `POST /api/auth/logout` — Clear auth cookie

### Doctors & Specialists (`/api/doctors`)
- `GET /api/doctors/featured` — Fetch top-rated featured verified doctors
- `GET /api/doctors` — Search doctors by name, filter by department, sort, and paginate
- `GET /api/doctors/:id` — Fetch complete profile and available schedule slots of a doctor
- `PUT /api/doctors/profile` — Update logged-in doctor's professional profile & schedules

### Appointments (`/api/appointments`)
- `POST /api/appointments` — Book a doctor consultation slot
- `GET /api/appointments` — List appointments for current authenticated user (Patient/Doctor)
- `GET /api/appointments/:id` — Get single appointment details
- `PATCH /api/appointments/:id/status` — Update appointment status (Confirmed, Completed, Cancelled)
- `PATCH /api/appointments/:id/reschedule` — Reschedule appointment day/slot

### Stripe Payments (`/api/payments`)
- `POST /api/payments/create-intent` — Create Stripe PaymentIntent with consultation fee
- `POST /api/payments/confirm` — Save successful transaction receipt and update booking payment status
- `GET /api/payments/history` — Get patient transaction logs

### Prescriptions (`/api/prescriptions`)
- `POST /api/prescriptions` — Issue digital medical prescription (Diagnosis, medicines, dosage, instructions)
- `GET /api/prescriptions/patient/:patientId` — View patient medical prescriptions
- `GET /api/prescriptions/appointment/:appointmentId` — Fetch prescription by appointment ID

### Reviews & Feedback (`/api/reviews`)
- `POST /api/reviews` — Submit verified patient review and rating
- `GET /api/reviews/featured` — Fetch verified 5-star patient testimonials
- `GET /api/reviews/doctor/:doctorId` — Fetch reviews for a specific doctor

### Admin Oversight (`/api/admin`)
- `GET /api/admin/users` — List and manage all registered users & roles
- `PATCH /api/admin/users/:id/role` — Update user permissions & role
- `PATCH /api/admin/users/:id/status` — Ban / Activate user account
- `GET /api/admin/doctors` — Review doctor verification applications
- `PATCH /api/admin/doctors/:id/verify` — Approve or reject doctor verification
- `GET /api/admin/analytics` — Platform revenue, appointment volume & growth stats

### Platform Statistics (`/api/stats`)
- `GET /api/stats` — Fetch total doctors, patients, appointments, and reviews

---

## 🛡️ License
ISC License © MediCare Connect
