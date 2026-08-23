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

### 3. Environment Variables Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/medicareDB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
```

### 4. Running the Server
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

### Platform Statistics (`/api/stats`)
- `GET /api/stats` — Fetch total doctors, patients, appointments, and reviews

### Testimonials & Reviews (`/api/reviews`)
- `GET /api/reviews/featured` — Fetch verified 5-star patient testimonials

---

## 🛡️ License
ISC License © MediCare Connect
