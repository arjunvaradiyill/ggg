// Mock data for development when no backend is available

export const mockPatients = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    address: '123 Main St, City, State 12345',
    medicalHistory: 'Hypertension, Diabetes Type 2',
    appointment_count: 5,
    last_appointment: '2024-01-15',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0124',
    dateOfBirth: '1990-07-22',
    gender: 'Female',
    address: '456 Oak Ave, City, State 12345',
    medicalHistory: 'Asthma, Allergies',
    appointment_count: 3,
    last_appointment: '2024-01-10',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1-555-0125',
    dateOfBirth: '1978-11-08',
    gender: 'Male',
    address: '789 Pine Rd, City, State 12345',
    medicalHistory: 'Heart condition, High cholesterol',
    appointment_count: 8,
    last_appointment: '2024-01-20',
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  }
];

export const mockDoctors = [
  {
    _id: '1',
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiology',
    experience: 15,
    rating: 4.8,
    image: '/doctor.png',
    email: 'sarah.wilson@hospital.com',
    phone: '+1-555-0101',
    patient_count: 150,
    avg_rating: 4.8,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    experience: 12,
    rating: 4.6,
    image: '/doctor2.png',
    email: 'michael.chen@hospital.com',
    phone: '+1-555-0102',
    patient_count: 120,
    avg_rating: 4.6,
    created_at: '2020-02-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Dr. Emily Davis',
    specialization: 'Pediatrics',
    experience: 8,
    rating: 4.9,
    image: '/doctor3.png',
    email: 'emily.davis@hospital.com',
    phone: '+1-555-0103',
    patient_count: 200,
    avg_rating: 4.9,
    created_at: '2020-03-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockAppointments = [
  {
    _id: '1',
    patient: {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      gender: 'Male'
    },
    doctor: {
      _id: '1',
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiology'
    },
    date: '2024-02-15',
    time: '10:00 AM',
    status: 'Scheduled',
    type: 'Consultation',
    notes: 'Follow-up appointment for heart condition',
    paymentStatus: 'Paid',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    _id: '2',
    patient: {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0124',
      gender: 'Female'
    },
    doctor: {
      _id: '3',
      name: 'Dr. Emily Davis',
      specialization: 'Pediatrics'
    },
    date: '2024-02-16',
    time: '2:30 PM',
    status: 'Completed',
    type: 'Check-up',
    notes: 'Annual physical examination',
    paymentStatus: 'Paid',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z'
  },
  {
    _id: '3',
    patient: {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1-555-0125',
      gender: 'Male'
    },
    doctor: {
      _id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Neurology'
    },
    date: '2024-02-17',
    time: '9:00 AM',
    status: 'Pending',
    type: 'Consultation',
    notes: 'Initial consultation for neurological symptoms',
    paymentStatus: 'Pending',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  }
];

export const mockDashboardStats = {
  total_patients: 150,
  total_doctors: 12,
  total_appointments: 45,
  completed_appointments: 28,
  pending_appointments: 12,
  scheduled_appointments: 5,
  today_appointments: 8,
  week_appointments: 25
};

export const mockUser = {
  _id: '1',
  username: 'admin',
  role: 'admin',
  email: 'admin@hospital.com'
};

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to simulate API error (disabled for development)
export const simulateApiError = () => {
  // Temporarily disabled to prevent dashboard loading issues
  // Uncomment the lines below to re-enable error simulation
  /*
  // Skip error simulation if DISABLE_MOCK_ERRORS is set
  if (process.env.NEXT_PUBLIC_DISABLE_MOCK_ERRORS === 'true') {
    return;
  }
  
  // Only simulate errors in development mode
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.01) {
    throw new Error('Simulated API error');
  }
  */
}; 