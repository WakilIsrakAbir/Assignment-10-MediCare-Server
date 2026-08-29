# 🏥 MediCare Connect — Backend REST API Server

A robust, scalable RESTful API server for **MediCare Connect**, powering online hospital appointments, certified doctor directory, digital prescriptions, Stripe consultation payments, and administrative healthcare oversight.

---

## 🔗 Project Links & Credentials

| Item | Details |
| :--- | :--- |
| **Server Live API URL** | [https://assignment-10-medi-care-server.vercel.app](https://assignment-10-medi-care-server.vercel.app) |
| **Client Live Web App** | [https://assignment-10-medi-care-client.vercel.app](https://assignment-10-medi-care-client.vercel.app) |
| **GitHub Repository (Server)** | [Assignment-10-MediCare-Server](https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Server) |
| **GitHub Repository (Client)** | [Assignment-10-MediCare-Client](https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Client) |

### 🔑 Test Accounts & Roles

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@medicare.com` | `admin123` | System oversight, doctor verification, payment records & analytics |
| **Doctor** | `sarah.johnson@medicare.com` | `Doctor@123` | Schedule CRUD, appointment requests & digital prescriptions |
| **Patient** | `patient@medicare.com` | `Patient@123` | Appointment booking, Stripe payment & doctor reviews |

---

## 🛠️ Technology Stack

- **Runtime & Language:** Node.js (ES Modules, modern `import/export`)
- **Web Framework:** Express.js 5.x
- **Database & ODM:** MongoDB Atlas & Mongoose ODM
- **Authentication & Security:** JWT (JSON Web Tokens), Bcryptjs, Cookie-Parser, Dynamic CORS
- **Payment Processing:** Stripe Node.js SDK
- **Logging & Utilities:** Morgan HTTP Logger, Dotenv
- **Deployment Platform:** Vercel Serverless Functions (`@vercel/node`)

---

## 🗄️ Database Collections & Schema Architecture

### 1. `Users`
- `name` (String, required)
- `email` (String, required, unique, indexed)
- `password` (String, hashed with bcrypt)
- `role` (String, enum: `patient`, `doctor`, `admin`, default: `patient`)
- `Photo` (String, avatar URL)
- `phone` (String)
- `gender` (String)
- `status` (String, enum: `active`, `suspended`, default: `active`)
- `createdAt` (Date)

### 2. `Doctors`
- `userId` (ObjectId ref User)
- `doctorName` (String, required)
- `specialization` (String, e.g. Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology)
- `qualifications` (String, e.g. MBBS, MD, FCPS)
- `experience` (Number, years of practice)
- `consultationFee` (Number, USD)
- `hospitalName` (String)
- `profileImage` (String)
- `availableDays` ([String], e.g. ['Monday', 'Wednesday'])
- `availableSlots` ([String], e.g. ['10:00 AM - 12:00 PM'])
- `verificationStatus` (String, enum: `pending`, `verified`, `rejected`, default: `pending`)

### 3. `Appointments`
- `patientId` (ObjectId ref User)
- `doctorId` (ObjectId ref Doctor)
- `appointmentDate` (String)
- `appointmentTime` (String)
- `appointmentStatus` (String, enum: `pending`, `accepted`, `rejected`, `completed`, `cancelled`)
- `symptoms` (String)
- `paymentStatus` (String, enum: `paid`, `unpaid`, default: `unpaid`)

### 4. `Reviews`
- `patientId` (ObjectId ref User)
- `doctorId` (ObjectId ref Doctor)
- `rating` (Number, 1 to 5 stars)
- `reviewText` (String)
- `createdAt` (Date)

### 5. `Payments`
- `appointmentId` (ObjectId ref Appointment)
- `patientId` (ObjectId ref User)
- `doctorId` (ObjectId ref Doctor)
- `amount` (Number)
- `transactionId` (String, Stripe PaymentIntent ID)
- `paymentDate` (Date)

### 6. `Prescriptions`
- `doctorId` (ObjectId ref Doctor)
- `patientId` (ObjectId ref User)
- `appointmentId` (ObjectId ref Appointment)
- `diagnosis` (String)
- `medications` ([{ name, dosage, frequency, duration }])
- `notes` (String)
- `createdAt` (Date)

---

## 📡 RESTful API Endpoints Specification

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new patient/doctor with password policy check | Public |
| `POST` | `/api/auth/login` | User login with JWT cookie & response token | Public |
| `POST` | `/api/auth/google` | Authenticate / sync Google OAuth profile & issue JWT | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session | User |
| `PUT` | `/api/auth/profile` | Update profile information | User |
| `POST` | `/api/auth/reset-password` | Self-service password reset | Public |
| `POST` | `/api/auth/logout` | Clear authentication cookie | User |

### 🩺 Doctors & Specialists (`/api/doctors`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors/featured` | Fetch top-rated featured verified doctors | Public |
| `GET` | `/api/doctors` | Search, filter by department, sort, and paginate doctors | Public |
| `GET` | `/api/doctors/:id` | Fetch single doctor profile & schedule details | Public |
| `GET` | `/api/doctors/me/profile` | Fetch logged-in doctor's professional profile | Doctor |
| `PUT` | `/api/doctors/profile` | Update doctor schedule slots & qualifications | Doctor |

### 📅 Appointments (`/api/appointments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Book a consultation appointment slot | Patient |
| `GET` | `/api/appointments/patient/my-appointments` | List patient's booked appointments | Patient |
| `GET` | `/api/appointments/doctor/my-appointments` | List doctor's consultation requests | Doctor |
| `PATCH` | `/api/appointments/:id/status` | Update status (`accepted`, `rejected`, `completed`) | Doctor |
| `PATCH` | `/api/appointments/:id/reschedule` | Reschedule appointment date and time | Patient |
| `PATCH` | `/api/appointments/:id/cancel` | Cancel scheduled appointment | Patient |

### 💳 Payments (`/api/payments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-intent` | Generate Stripe PaymentIntent for consultation fee | Patient |
| `POST` | `/api/payments/confirm` | Confirm payment and record transaction receipt | Patient |
| `GET` | `/api/payments/my-payments` | Get patient payment history | Patient |

### 💊 Prescriptions (`/api/prescriptions`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/prescriptions` | Issue / create digital prescription | Doctor |
| `PUT` | `/api/prescriptions/:id` | Update existing prescription | Doctor |
| `GET` | `/api/prescriptions/patient/my-prescriptions` | View patient's prescriptions | Patient |
| `GET` | `/api/prescriptions/appointment/:appointmentId` | Fetch prescription for an appointment | Patient/Doctor |

### ⭐ Reviews & Feedback (`/api/reviews`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | Submit patient review & rating | Patient |
| `GET` | `/api/reviews/featured` | Fetch top 5-star testimonials | Public |
| `GET` | `/api/reviews/doctor/:doctorId` | List reviews for a specific doctor | Public |
| `GET` | `/api/reviews/my-reviews` | Get logged-in patient's submitted reviews | Patient |
| `GET` | `/api/reviews/doctor-received` | Get doctor's received reviews | Doctor |
| `PUT` | `/api/reviews/:id` | Update patient review | Patient |
| `DELETE` | `/api/reviews/:id` | Delete patient review | Patient |

### 👑 Admin Management (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | List and search all registered users | Admin |
| `PATCH` | `/api/admin/users/:id/status` | Suspend or activate user account | Admin |
| `DELETE` | `/api/admin/users/:id` | Delete user from database | Admin |
| `GET` | `/api/admin/doctors` | Review doctor verification applications | Admin |
| `PATCH` | `/api/admin/doctors/:id/verify` | Verify or reject doctor credentials | Admin |
| `GET` | `/api/admin/appointments` | Monitor all platform appointments | Admin |
| `GET` | `/api/admin/payments` | View all platform Stripe transaction records | Admin |
| `GET` | `/api/admin/analytics` | Fetch analytics, charts data & KPIs | Admin |

### 📈 Platform Statistics (`/api/stats`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats` | Dynamic count of Doctors, Patients, Appointments, Reviews | Public |

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the server directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/medicareDB?retryWrites=true&w=majority
JWT_SECRET=medicare_secret_jwt_key_2026_secure
CLIENT_URL=https://assignment-10-medi-care-client.vercel.app
STRIPE_SECRET_KEY=sk_test_...
BETTER_AUTH_SECRET=medicare_better_auth_secret_key_2026_secure
BETTER_AUTH_URL=https://assignment-10-medi-care-server.vercel.app
```

---

## 🚀 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Server.git
   cd Assignment-10-MediCare-Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local server:**
   ```bash
   # Development with hot-reloading:
   npm run dev

   # Production mode:
   npm start
   ```

---

