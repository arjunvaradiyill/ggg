# Healthcare Management System - Frontend

A modern healthcare management frontend application built with Next.js, designed to connect to external backend APIs.

## Features

### Frontend (Next.js)
- Modern, responsive UI with Tailwind CSS
- Voice recognition login
- Dashboard with real-time statistics
- Patient management
- Doctor management
- Appointment scheduling
- Role-based access control
- API integration with external backend
- **Mock data mode for development without backend**

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls
- **Material-UI** - UI components

## Prerequisites

- Node.js 18+ 
- npm or yarn
- External backend API (optional - mock data available for development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carebot-frontend-login-dashboardui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   Create a `.env.local` file in the root directory:
   ```env
   # Backend API URL (optional - defaults to mock mode)
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

## Running the Application

### Development Mode

```bash
# Start the frontend development server
npm run dev
```

The application will run on `http://localhost:3000`

### Production Mode

```bash
# Build the frontend
npm run build

# Start the frontend production server
npm run start
```

## Mock Data Mode

The application includes a built-in mock data system that allows you to run and test the frontend without a backend server. This is perfect for:

- **Development and testing**
- **UI/UX demonstrations**
- **Frontend-only development**
- **Prototyping**

### How Mock Mode Works

- **Automatic Detection**: Mock mode is automatically enabled when `NEXT_PUBLIC_API_URL` is not set or is set to the default placeholder URL
- **Realistic Data**: Includes sample patients, doctors, appointments, and dashboard statistics
- **Full Functionality**: All CRUD operations work with mock data
- **API Simulation**: Includes realistic delays and occasional errors to simulate real API behavior

### Mock Data Features

- **Sample Patients**: 3 patients with complete medical profiles
- **Sample Doctors**: 3 doctors with different specializations
- **Sample Appointments**: Various appointment types and statuses
- **Dashboard Statistics**: Realistic numbers for charts and metrics
- **Authentication**: Mock login that accepts any credentials

### Switching Between Mock and Real Backend

1. **Mock Mode (Default)**: No environment variable needed
2. **Real Backend**: Set `NEXT_PUBLIC_API_URL` to your actual backend URL

```env
# For real backend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# For mock mode (or leave unset)
# NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## API Integration

This frontend application is designed to work with a backend API that provides the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor
- `GET /api/doctors/:id/stats` - Get doctor statistics

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `PATCH /api/appointments/:id/status` - Update appointment status
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-appointments` - Get recent appointments
- `GET /api/dashboard/upcoming-appointments` - Get upcoming appointments
- `GET /api/dashboard/appointments-by-status` - Get appointments by status
- `GET /api/dashboard/appointments-by-month` - Get appointments by month
- `GET /api/dashboard/top-doctors` - Get top doctors
- `GET /api/dashboard/patient-demographics` - Get patient demographics
- `GET /api/dashboard/doctor-specializations` - Get doctor specializations
- `GET /api/dashboard/today-schedule` - Get today's schedule
- `GET /api/dashboard/weekly-appointments` - Get weekly appointments

## Configuration

To connect to your backend API, update the `NEXT_PUBLIC_API_URL` environment variable in your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

The application will automatically use this URL for all API calls through the configured Axios instance in `app/services/api.ts`.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── components/         # Reusable UI components
│   ├── dashboard/          # Dashboard pages
│   ├── doctor/             # Doctor-specific pages
│   ├── services/           # API service layer
│   │   ├── api.ts         # Main API service with mock support
│   │   └── mockData.ts    # Mock data for development
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── components/             # Additional components
└── package.json           # Frontend dependencies only
```

## Development

The frontend is built with modern React patterns and includes:

- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Material-UI** components
- **Axios** for API communication
- **JWT token management** for authentication
- **Responsive design** for mobile and desktop
- **Mock data system** for backend-free development

All API calls are centralized in the `app/services/api.ts` file, making it easy to modify or extend the backend integration. The mock data system allows for seamless development without requiring a backend server.
