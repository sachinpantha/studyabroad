# Study Abroad Consultancy - Enhanced MERN Stack Platform

A comprehensive study abroad consultancy website with advanced features including profile management, university browsing, scholarship calculator, blog system, and individual application tracking.

## Enhanced Features

### Student Features
- **Complete Profile Management**: Detailed profile creation with academic information, GPA tracking, and document upload
- **Document Status Tracking**: Clear "pending documents" status with upload progress
- **University Browsing**: Comprehensive university listing with filtering by country, course, and search functionality
- **Individual University Applications**: Apply to multiple universities separately with dedicated tracking
- **Smart College Selection**: Dynamic searchable university list with manual entry option
- **Scholarship Calculator**: GPA-based scholarship eligibility checker showing potential savings
- **Personal Dashboard**: Enhanced dashboard showing all applications with detailed status tracking
- **Application Status Tracking**: Real-time updates with statuses: Applied, Under Review, Offer Received, Enrolled, Reported to College, Rejected

### Admin Features
- **Enhanced Admin Panel**: Comprehensive application management with status updates
- **Blog/News Management**: Create and manage study-abroad related content
- **University Management**: Manage university database and course information
- **Application Analytics**: Detailed statistics and reporting
- **Individual Application Tracking**: Monitor each student's applications separately

### New System Features
- **Blog/News Section**: Admin-managed content with categories (News, Tips, Success Stories, Updates)
- **Scholarship Database**: Pre-loaded with 15+ universities and their scholarship criteria
- **University Database**: Comprehensive university information with courses, requirements, and deadlines
- **Advanced Filtering**: Filter universities by location, course, GPA requirements
- **Document Management**: Organized document upload with type categorization
- **Profile Completion Tracking**: Visual progress indicators for profile completion

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
npm run seed-admin
```

5. Seed university data (for scholarship calculator and university browsing):
```bash
npm run seed-universities
```

6. Start the backend server:
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

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/documents` - Upload documents
- `GET /api/profile/pending-documents` - Get pending documents

### Universities
- `GET /api/universities` - Get universities with filters
- `GET /api/universities/:id` - Get university details
- `GET /api/universities/scholarships/calculate` - Calculate scholarship eligibility
- `GET /api/universities/search/autocomplete` - Search universities

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications/my` - Get user applications
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications/:id/documents` - Upload documents

### Blog/News
- `GET /api/blog` - Get published blogs
- `GET /api/blog/:id` - Get blog by ID
- `POST /api/blog` - Create blog (admin)
- `GET /api/blog/admin/all` - Get all blogs (admin)

### Admin
- `GET /api/admin/applications` - Get all applications
- `PATCH /api/admin/applications/:id/status` - Update application status
- `GET /api/admin/stats` - Get application statistics

## File Structure

```
Backend/
├── src/
│   ├── models/          # Database models
│   │   ├── User.js      # Enhanced user model with profile
│   │   ├── Application.js # Enhanced application model
│   │   ├── University.js # University model
│   │   └── Blog.js      # Blog model
│   ├── routes/          # API routes
│   │   ├── auth.js      # Authentication routes
│   │   ├── applications.js # Application routes
│   │   ├── profile.js   # Profile management
│   │   ├── universities.js # University routes
│   │   ├── blog.js      # Blog routes
│   │   ├── admin.js     # Admin routes
│   │   └── documents.js # Document routes
│   └── middleware/      # Custom middleware
├── uploads/             # File uploads directory
├── server.js           # Main server file
├── seedAdmin.js        # Admin seeder script
└── seedUniversities.js # University seeder script

Frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   │   ├── Dashboard.js # Enhanced dashboard
│   │   ├── Profile.js  # Profile management
│   │   ├── Universities.js # University browsing
│   │   ├── UniversityDetail.js # University details
│   │   ├── ScholarshipCalculator.js # Scholarship calculator
│   │   ├── Blog.js     # Blog/news section
│   │   ├── ApplyToUniversity.js # Enhanced application
│   │   └── EnhancedAdminPanel.js # Admin panel
│   ├── context/        # React context
│   └── utils/          # Utility functions
└── public/             # Static files
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

## New Pages and Features

### Student Features
1. **Enhanced Dashboard** (`/dashboard`)
   - Profile completion status with progress bar
   - Pending documents tracking
   - All university applications with individual status
   - Quick action links

2. **Profile Management** (`/profile`)
   - Complete academic and personal information
   - Document upload with status tracking
   - Profile completion validation

3. **University Browsing** (`/universities`)
   - Filter by country, course, search
   - Pagination support
   - Individual university detail pages

4. **Scholarship Calculator** (`/scholarship-calculator`)
   - GPA-based eligibility checking
   - Shows potential savings
   - Direct apply links

5. **Blog/News Section** (`/blog`)
   - Category-based filtering
   - Individual blog post pages
   - View tracking

6. **Smart University Application** (`/apply/:universityId`)
   - Dynamic university search with autocomplete
   - Manual university entry option
   - Individual application tracking

### Admin Features
1. **Enhanced Admin Panel** (`/admin`)
   - Application management with status updates
   - Blog content management
   - University management
   - Comprehensive statistics

## Usage Instructions

1. **Setup**: Follow backend and frontend setup instructions
2. **Seed Data**: Run university seeder for full functionality
3. **Student Flow**:
   - Register/Login → Complete Profile → Browse Universities → Apply → Track Applications
4. **Admin Flow**:
   - Login with admin credentials → Manage applications → Create blog content
5. **Scholarship Calculator**: Students enter GPA to see eligible universities
6. **University Applications**: Students can apply to multiple universities individually

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request