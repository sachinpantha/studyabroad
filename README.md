# Study Abroad Consultancy - MERN Stack

A complete study abroad consultancy website built with MongoDB, Express.js, React, and Node.js.

## Features

### Student Features
- Student registration & login
- Student dashboard
- Application form with file uploads
- Document management
- Application status tracking
- Real-time status updates

### Admin Features
- Admin panel for application management
- Application status updates
- Student management
- Statistics dashboard
- Admin notes for applications

### Security Features
- JWT authentication
- Secure file uploads
- Input validation
- Protected routes

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Compass
- Git

### Backend Setup

1. Navigate to Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB Compass and connect to `mongodb://localhost:27017`

4. Create default admin user:
```bash
node seedAdmin.js
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Default Admin Credentials

- **Email:** admin@studyabroad.com
- **Password:** admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications/my` - Get user applications
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications/:id/documents` - Upload documents

### Admin
- `GET /api/admin/applications` - Get all applications
- `PATCH /api/admin/applications/:id/status` - Update application status
- `GET /api/admin/stats` - Get application statistics

## File Structure

```
Backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── uploads/         # File uploads directory
├── server.js        # Main server file
└── seedAdmin.js     # Admin seeder script

Frontend/
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── context/     # React context
│   └── utils/       # Utility functions
└── public/          # Static files
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- React Hook Form
- React Toastify for notifications

## Environment Variables

Create a `.env` file in the Backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/consultancy
JWT_SECRET=your_jwt_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Usage

1. Start both backend and frontend servers
2. Visit `http://localhost:3000`
3. Register as a new student or login as admin
4. Students can create applications and upload documents
5. Admins can manage applications and update statuses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request