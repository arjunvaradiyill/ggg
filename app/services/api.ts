import axios from 'axios';
import {
  mockPatients,
  mockDoctors,
  mockAppointments,
  mockDashboardStats,
  mockUser,
  simulateApiDelay,
  simulateApiError
} from './mockData';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com/api';

// Check if we're using the placeholder URL (mock mode)
const isMockMode = baseURL === 'https://your-backend-url.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalHistory: string;
  appointment_count: number;
  last_appointment: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  image?: string;
  email?: string;
  phone?: string;
  patient_count?: number;
  avg_rating?: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
  };
  doctor: {
    _id: string;
    name: string;
    specialization: string;
  };
  date: string;
  time: string;
  status: string;
  type: string;
  notes?: string;
  paymentStatus: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_patients: number;
  total_doctors: number;
  total_appointments: number;
  completed_appointments: number;
  pending_appointments: number;
  scheduled_appointments: number;
  today_appointments: number;
  week_appointments: number;
}

export interface CreateAppointmentData {
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status?: string;
  notes?: string;
}

export interface User {
  _id: string;
  username: string;
  role: string;
  email: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  role?: string;
}

// Authentication API
export const authAPI = {
  async login(data: LoginData) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      // Mock login - accept any credentials
      const mockToken = 'mock-jwt-token-' + Date.now();
      const user = { 
        ...mockUser, 
        username: data.username,
        role: data.username.toLowerCase().includes('doctor') ? 'doctor' : 'admin'
      };
      
      // Store both authToken and token for compatibility
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token: mockToken, user };
    }
    
    const response = await apiClient.post('/auth/login', data);
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  async register(data: RegisterData) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      const user = { 
        ...mockUser, 
        username: data.username, 
        email: data.email,
        role: data.role || 'admin'
      };
      
      // Store both authToken and token for compatibility
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token: mockToken, user };
    }
    
    const response = await apiClient.post('/auth/register', data);
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  async getProfile() {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return mockUser;
    }
    
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return { message: 'Password changed successfully' };
    }
    
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    const authToken = localStorage.getItem('authToken');
    const token = localStorage.getItem('token');
    return !!(authToken || token);
  },
};

// Patients API
export const patientsAPI = {
  async getPatients(params?: {
    search?: string;
    gender?: string;
    page?: number;
    limit?: number;
  }) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      let filteredPatients = [...mockPatients];
      
      if (params?.search) {
        filteredPatients = filteredPatients.filter(patient =>
          patient.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          patient.email.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      
      if (params?.gender) {
        filteredPatients = filteredPatients.filter(patient =>
          patient.gender.toLowerCase() === params.gender!.toLowerCase()
        );
      }
      
      return {
        patients: filteredPatients,
        total: filteredPatients.length,
        page: params?.page || 1,
        limit: params?.limit || 10
      };
    }
    
    const response = await apiClient.get('/patients', { params });
    return response.data;
  },

  async getPatientById(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const patient = mockPatients.find(p => p._id === id);
      if (!patient) {
        throw new Error('Patient not found');
      }
      return patient;
    }
    
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  async createPatient(data: Omit<Patient, '_id' | 'created_at' | 'updated_at'>) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const newPatient = {
        ...data,
        _id: (mockPatients.length + 1).toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        appointment_count: 0,
        last_appointment: ''
      };
      
      mockPatients.push(newPatient);
      return newPatient;
    }
    
    const response = await apiClient.post('/patients', data);
    return response.data;
  },

  async updatePatient(id: string, data: Partial<Patient>) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const index = mockPatients.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error('Patient not found');
      }
      
      mockPatients[index] = {
        ...mockPatients[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      return mockPatients[index];
    }
    
    const response = await apiClient.put(`/patients/${id}`, data);
    return response.data;
  },

  async deletePatient(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const index = mockPatients.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error('Patient not found');
      }
      
      mockPatients.splice(index, 1);
      return { message: 'Patient deleted successfully' };
    }
    
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  },

  async getPatientFindings(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return [];
    }
    
    const response = await apiClient.get(`/patients/${id}/findings`);
    return response.data;
  },

  async savePatientFinding(id: string, data: { cause: string; date: string; time: string; description: string }) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return { message: 'Finding saved successfully' };
    }
    
    const response = await apiClient.post(`/patients/${id}/findings`, data);
    return response.data;
  },

  async getPatientSuggestions(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return [];
    }
    
    const response = await apiClient.get(`/patients/${id}/suggestions`);
    return response.data;
  },

  async savePatientSuggestion(id: string, data: { title: string; recommendation: string; followUp?: string; notes?: string }) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return { message: 'Suggestion saved successfully' };
    }
    
    const response = await apiClient.post(`/patients/${id}/suggestions`, data);
    return response.data;
  },

  async getPatientDocuments(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return [];
    }
    
    const response = await apiClient.get(`/patients/${id}/documents`);
    return response.data;
  },

  async savePatientDocument(id: string, data: { name: string; description: string; doctorName: string; type: string }) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return { message: 'Document saved successfully' };
    }
    
    const response = await apiClient.post(`/patients/${id}/documents`, data);
    return response.data;
  },

  async deletePatientDocument(id: string, documentId: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return { message: 'Document deleted successfully' };
    }
    
    const response = await apiClient.delete(`/patients/${id}/documents/${documentId}`);
    return response.data;
  },
};

// Doctors API
export const doctorsAPI = {
  async getDoctors(params?: {
    search?: string;
    specialization?: string;
    page?: number;
    limit?: number;
  }) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      let filteredDoctors = [...mockDoctors];
      
      if (params?.search) {
        filteredDoctors = filteredDoctors.filter(doctor =>
          doctor.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      
      if (params?.specialization) {
        filteredDoctors = filteredDoctors.filter(doctor =>
          doctor.specialization.toLowerCase() === params.specialization!.toLowerCase()
        );
      }
      
      return {
        doctors: filteredDoctors,
        total: filteredDoctors.length,
        page: params?.page || 1,
        limit: params?.limit || 10
      };
    }
    
    const response = await apiClient.get('/doctors', { params });
    return response.data;
  },

  async getDoctorById(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const doctor = mockDoctors.find(d => d._id === id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      return doctor;
    }
    
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data;
  },

  async createDoctor(data: Omit<Doctor, '_id' | 'created_at' | 'updated_at'>) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const newDoctor = {
        ...data,
        _id: (mockDoctors.length + 1).toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        patient_count: 0,
        avg_rating: 0
      };
      
      mockDoctors.push(newDoctor);
      return newDoctor;
    }
    
    const response = await apiClient.post('/doctors', data);
    return response.data;
  },

  async updateDoctor(id: string, data: Partial<Doctor>) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const index = mockDoctors.findIndex(d => d._id === id);
      if (index === -1) {
        throw new Error('Doctor not found');
      }
      
      mockDoctors[index] = {
        ...mockDoctors[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      return mockDoctors[index];
    }
    
    const response = await apiClient.put(`/doctors/${id}`, data);
    return response.data;
  },

  async deleteDoctor(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const index = mockDoctors.findIndex(d => d._id === id);
      if (index === -1) {
        throw new Error('Doctor not found');
      }
      
      mockDoctors.splice(index, 1);
      return { message: 'Doctor deleted successfully' };
    }
    
    const response = await apiClient.delete(`/doctors/${id}`);
    return response.data;
  },

  async getDoctorStats(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return {
        totalPatients: 150,
        totalAppointments: 45,
        completedAppointments: 28,
        pendingAppointments: 12,
        averageRating: 4.8
      };
    }
    
    const response = await apiClient.get(`/doctors/${id}/stats`);
    return response.data;
  },
};

// Appointments API
export const appointmentsAPI = {
  async getAppointments(params?: {
    search?: string;
    status?: string;
    date?: string;
    doctor_id?: string;
    patient_id?: string;
    page?: number;
    limit?: number;
  }) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      let filteredAppointments = [...mockAppointments];
      
      if (params?.search) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.patient.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          appointment.doctor.name.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      
      if (params?.status) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.status.toLowerCase() === params.status!.toLowerCase()
        );
      }
      
      if (params?.doctor_id) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.doctor._id === params.doctor_id
        );
      }
      
      if (params?.patient_id) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.patient._id === params.patient_id
        );
      }
      
      return {
        appointments: filteredAppointments,
        total: filteredAppointments.length,
        page: params?.page || 1,
        limit: params?.limit || 10
      };
    }
    
    const response = await apiClient.get('/appointments', { params });
    return response.data;
  },

  async getAppointmentById(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const appointment = mockAppointments.find(a => a._id === id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      return appointment;
    }
    
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  async createAppointment(data: CreateAppointmentData) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const patient = mockPatients.find(p => p._id === data.patient_id);
      const doctor = mockDoctors.find(d => d._id === data.doctor_id);
      
      if (!patient || !doctor) {
        throw new Error('Patient or doctor not found');
      }
      
      const newAppointment = {
        _id: (mockAppointments.length + 1).toString(),
        patient: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          gender: patient.gender
        },
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization
        },
        date: data.date,
        time: data.time,
        status: data.status || 'Scheduled',
        type: 'Consultation',
        notes: data.notes || '',
        paymentStatus: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockAppointments.push(newAppointment);
      return newAppointment;
    }
    
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  async updateAppointment(id: string, data: Partial<CreateAppointmentData>) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const index = mockAppointments.findIndex(a => a._id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      
      mockAppointments[index] = {
        ...mockAppointments[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      return mockAppointments[index];
    }
    
    const response = await apiClient.put(`/appointments/${id}`, data);
    return response.data;
  },

  async deleteAppointment(id: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const index = mockAppointments.findIndex(a => a._id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      
      mockAppointments.splice(index, 1);
      return { message: 'Appointment deleted successfully' };
    }
    
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },

  async updateAppointmentStatus(id: string, status: string) {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const index = mockAppointments.findIndex(a => a._id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      
      mockAppointments[index].status = status;
      mockAppointments[index].updated_at = new Date().toISOString();
      
      return mockAppointments[index];
    }
    
    const response = await apiClient.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },

  async getTodayAppointments() {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const today = new Date().toISOString().split('T')[0];
      return mockAppointments.filter(appointment => appointment.date === today);
    }
    
    const response = await apiClient.get('/appointments/today');
    return response.data;
  },

  async getUpcomingAppointments() {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const today = new Date().toISOString().split('T')[0];
      return mockAppointments.filter(appointment => appointment.date >= today);
    }
    
    const response = await apiClient.get('/appointments/upcoming');
    return response.data;
  },
};

// Dashboard API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (isMockMode) {
    await simulateApiDelay();
    try {
      simulateApiError();
      return mockDashboardStats;
    } catch (error) {
      console.warn('Mock API error, returning fallback data:', error);
      return mockDashboardStats; // Return fallback data even on error
    }
  }
  
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
};

export const getRecentAppointments = async (): Promise<Appointment[]> => {
  if (isMockMode) {
    await simulateApiDelay();
    try {
      simulateApiError();
      return mockAppointments.slice(0, 5); // Return last 5 appointments
    } catch (error) {
      console.warn('Mock API error, returning fallback data:', error);
      return mockAppointments.slice(0, 5); // Return fallback data even on error
    }
  }
  
  const response = await apiClient.get('/appointments/recent');
  return response.data;
};

// Legacy API functions (for backward compatibility)
export const api = {
  async getPatients(): Promise<Patient[]> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return mockPatients;
    }
    const response = await apiClient.get('/patients');
    return response.data;
  },

  async getPatientById(id: string): Promise<Patient> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      const patient = mockPatients.find(p => p._id === id);
      if (!patient) throw new Error('Patient not found');
      return patient;
    }
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  async getDoctors(): Promise<Doctor[]> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return mockDoctors;
    }
    const response = await apiClient.get('/doctors');
    return response.data;
  },

  async getDoctorById(id: string): Promise<Doctor> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      const doctor = mockDoctors.find(d => d._id === id);
      if (!doctor) throw new Error('Doctor not found');
      return doctor;
    }
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data;
  },

  async getAppointments(): Promise<Appointment[]> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return mockAppointments;
    }
    const response = await apiClient.get('/appointments');
    return response.data;
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      const appointment = mockAppointments.find(a => a._id === id);
      if (!appointment) throw new Error('Appointment not found');
      return appointment;
    }
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return mockDashboardStats;
    }
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  async getRecentAppointments(): Promise<Appointment[]> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return mockAppointments.slice(0, 5);
    }
    const response = await apiClient.get('/dashboard/recent-appointments');
    return response.data;
  },

  async getNextWeekAppointments(): Promise<Appointment[]> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekFromNowStr = weekFromNow.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];
      
      return mockAppointments.filter(appointment => 
        appointment.date >= todayStr && appointment.date <= weekFromNowStr
      );
    }
    const response = await apiClient.get('/dashboard/weekly-appointments');
    return response.data;
  },

  async getPatientSuggestions(query: string): Promise<Patient[]> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      return mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    const response = await apiClient.get(`/patients?search=${query}`);
    return response.data.patients || response.data;
  },

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const patient = mockPatients.find(p => p._id === data.patient_id);
      const doctor = mockDoctors.find(d => d._id === data.doctor_id);
      
      if (!patient || !doctor) {
        throw new Error('Patient or doctor not found');
      }
      
      const newAppointment = {
        _id: (mockAppointments.length + 1).toString(),
        patient: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          gender: patient.gender
        },
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization
        },
        date: data.date,
        time: data.time,
        status: data.status || 'Scheduled',
        type: 'Consultation',
        notes: data.notes || '',
        paymentStatus: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockAppointments.push(newAppointment);
      return newAppointment;
    }
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  async createDoctor(data: Omit<Doctor, '_id' | 'created_at' | 'updated_at'>): Promise<Doctor> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const newDoctor = {
        ...data,
        _id: (mockDoctors.length + 1).toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        patient_count: 0,
        avg_rating: 0
      };
      
      mockDoctors.push(newDoctor);
      return newDoctor;
    }
    const response = await apiClient.post('/doctors', data);
    return response.data;
  },

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    if (isMockMode) {
      await simulateApiDelay();
      simulateApiError();
      
      const index = mockAppointments.findIndex(a => a._id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      
      mockAppointments[index].status = status;
      mockAppointments[index].updated_at = new Date().toISOString();
      
      return mockAppointments[index];
    }
    const response = await apiClient.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },
};

export default api; 