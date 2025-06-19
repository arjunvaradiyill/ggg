"use client";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import api, { Patient, Appointment, patientsAPI, authAPI } from '@/app/services/api';
import { appointmentsAPI } from '@/app/services/api';

const statusColors: { [key: string]: string } = {
  completed: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  'on hold': 'bg-gray-100 text-gray-700',
};

const statusOptions = [
  'completed',
  'processing',
  'pending',
  'cancelled',
  'on hold',
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [latestAppointments, setLatestAppointments] = useState<{ [patientId: string]: Appointment | null }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Add New Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Modal form state
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  // Get user information using authAPI
  const adminName = currentUser?.username || 'Admin';
  const adminEmail = currentUser?.email || '';
  const adminRole = currentUser?.role || 'Admin';
  const adminImage = currentUser?.image || 'https://randomuser.me/api/portraits/men/1.jpg';

  const resetForm = () => {
    setPatientName('');
    setEmail('');
    setPhone('');
    setGender('');
    setDateOfBirth('');
    setAddress('');
    setMedicalHistory('');
    setSubmitError(null);
  };

  const resetFilters = () => {
    setFilterName('');
    setFilterEmail('');
    setFilterGender('');
    setFilterPhone('');
    setSearchTerm('');
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Client-side validation
    if (!patientName.trim()) {
      setSubmitError('Patient name is required');
      setIsSubmitting(false);
      return;
    }

    if (!email.trim()) {
      setSubmitError('Email is required');
      setIsSubmitting(false);
      return;
    }

    if (!phone.trim()) {
      setSubmitError('Phone number is required');
      setIsSubmitting(false);
      return;
    }

    if (!gender) {
      setSubmitError('Gender is required');
      setIsSubmitting(false);
      return;
    }

    if (!dateOfBirth) {
      setSubmitError('Date of birth is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const newPatientData = {
        name: patientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        dateOfBirth,
        address: address.trim(),
        medicalHistory: medicalHistory.trim()
      };

      const response = await patientsAPI.createPatient(newPatientData as any);
      
      // Add the new patient to the frontend list
      setPatients(prevPatients => [...prevPatients, response.patient]);
      
      // Close modal and reset form
      setShowAddPatientModal(false);
      resetForm();
    } catch (err: any) {
      console.error('Error creating patient:', err);
      setSubmitError(err.response?.data?.error || err.response?.data?.message || 'Failed to create patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await api.getPatients();
        setPatients(patientsData);
        // Fetch latest appointment for each patient
        const appointmentsMap: { [patientId: string]: Appointment | null } = {};
        await Promise.all(
          patientsData.map(async (patient: Patient) => {
            try {
              const appts = await api.getAppointments();
              const patientAppts = appts.filter((appt: Appointment) => appt.patient._id === patient._id);
              appointmentsMap[patient._id] = patientAppts[0] || null;
            } catch {
              appointmentsMap[patient._id] = null;
            }
          })
        );
        setLatestAppointments(appointmentsMap);
      } catch (err) {
        setError('Failed to fetch patients or appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Get unique values for dropdowns
  const uniqueNames = Array.from(new Set(patients.map(p => p.name).filter(Boolean)));
  const uniqueEmails = Array.from(new Set(patients.map(p => p.email).filter(Boolean)));
  const uniqueGenders = Array.from(new Set(patients.map(p => p.gender).filter(Boolean)));
  const uniquePhones = Array.from(new Set(patients.map(p => p.phone).filter(Boolean)));

  // Filtering logic
  const filteredPatients = patients.filter(p => {
    // Search term filtering (case-insensitive partial match)
    const searchMatch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gender.toLowerCase().includes(searchTerm.toLowerCase());

    // Dropdown filters (exact matches)
    const nameMatch = !filterName || p.name === filterName;
    const emailMatch = !filterEmail || p.email === filterEmail;
    const genderMatch = !filterGender || p.gender === filterGender;
    const phoneMatch = !filterPhone || p.phone === filterPhone;
    
    return searchMatch && nameMatch && emailMatch && genderMatch && phoneMatch;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-6">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-black">CareBot</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]">
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                  </svg>
                </span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/doctors" className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]">
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 8L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18 8L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                Doctors
              </Link>
            </li>
            <li>
              <Link href="/dashboard/patients" className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-black font-bold shadow">
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Patient
              </Link>
            </li>
            <li>
              <Link href="/dashboard/appointments" className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]">
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Appointment
              </Link>
            </li>
            <li>
              <a
                href="http://localhost:3001/"
                className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]"
              >
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top bar */}
        <div className="w-full px-4 py-2 bg-[#f7f8fa] flex items-center justify-center">
          <div className="w-full max-w-7xl flex items-center bg-white rounded-2xl shadow-lg px-6 py-3 gap-4">
            {/* Sidebar Toggle */}
            <button
              className="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow"
              aria-label="Toggle sidebar"
            >
              <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
            {/* Search Bar */}
            <div className="flex-1 flex items-center">
              <div className="w-full max-w-xl flex items-center bg-[#f7f8fa] rounded-full px-4 py-2 shadow-inner">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-base text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
            {/* Right Side */}
            <div className="flex items-center gap-6">
              {/* Notification */}
              <div className="relative">
                <button
                  className="focus:outline-none"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="Show notifications"
                >
                  <svg className="w-7 h-7 text-[#377DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#377DFF" strokeWidth="2"/>
                    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" stroke="#377DFF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">6</span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                    <div className="p-4 font-semibold border-b border-gray-100">Notifications</div>
                    <ul>
                      <li className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">New appointment booked.</li>
                      <li className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Doctor profile updated.</li>
                      <li className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Payment received.</li>
                      <li className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">Patient feedback received.</li>
                      <li className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">System update available.</li>
                      <li className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">New message from admin.</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* Language Selector */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 focus:outline-none"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  aria-label="Select language"
                >
                  <img src="https://flagcdn.com/gb.svg" alt="Flag" className="w-7 h-5 rounded object-cover" />
                  <span className="text-gray-700 font-medium">English</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                    <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 font-bold">
                      <img src="https://flagcdn.com/gb.svg" alt="English" className="w-6 h-4 rounded object-cover" />
                      <span>English</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50">
                      <img src="https://flagcdn.com/fr.svg" alt="French" className="w-6 h-4 rounded object-cover" />
                      <span>French</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50">
                      <img src="https://flagcdn.com/es.svg" alt="Spanish" className="w-6 h-4 rounded object-cover" />
                      <span>Spanish</span>
                    </div>
                  </div>
                )}
              </div>
              {/* User Profile */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 focus:outline-none"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="Show profile menu"
                >
                  <img src={adminImage} alt={adminName} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex flex-col items-start">
                    <span className="text-gray-800 font-semibold">{adminName}</span>
                    <span className="text-gray-400 text-xs">{adminRole}</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</a>
                    <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Logout</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">Patient Management</h1>
              <p className="text-gray-600">Manage your patients and their information</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="bg-[#7b6ffb] text-white px-4 py-2 rounded-lg hover:bg-[#6a5de8] transition-colors"
              >
                Add New Patient
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Reset All Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className={`border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent ${filterName ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <option value="">All Names</option>
                {uniqueNames.map(name => (
                  <option key={`name-${name}`} value={name} className="text-gray-700">{name}</option>
                ))}
              </select>

              <select
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                className={`border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent ${filterEmail ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <option value="">All Emails</option>
                {uniqueEmails.map(email => (
                  <option key={`email-${email}`} value={email} className="text-gray-700">{email}</option>
                ))}
              </select>

              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className={`border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent ${filterGender ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <option value="">All Genders</option>
                {uniqueGenders.map(gender => (
                  <option key={`gender-${gender}`} value={gender} className="text-gray-700">{gender}</option>
                ))}
              </select>

              <select
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
                className={`border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent ${filterPhone ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <option value="">All Phones</option>
                {uniquePhones.map(phone => (
                  <option key={`phone-${phone}`} value={phone} className="text-gray-700">{phone}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Patients</h3>
              <div className="text-sm text-gray-600">
                Showing {filteredPatients.length} of {patients.length} patients
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg font-medium text-gray-900 mb-2">No patients found</p>
                          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                          <button
                            onClick={resetFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient, idx) => {
                      const appt = latestAppointments[patient._id];
                      return (
                        <tr key={patient._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{String(idx + 1).padStart(5, '0')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{patient.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {appt?.status ? (
                              <select
                                value={appt.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  try {
                                    await appointmentsAPI.updateAppointmentStatus(appt._id, newStatus);
                                    setLatestAppointments((prev) => ({
                                      ...prev,
                                      [patient._id]: {
                                        ...appt,
                                        status: newStatus,
                                      },
                                    }));
                                  } catch (err) {
                                    alert('Failed to update status');
                                  }
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold focus:ring-2 focus:ring-[#7b6ffb] transition-colors appearance-none cursor-pointer
                                  ${statusColors[appt.status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}
                                style={{ minWidth: 120 }}
                              >
                                {statusOptions.map((status) => (
                                  <option
                                    key={status}
                                    value={status}
                                    className={
                                      statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
                                    }
                                  >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">No Appointments/walk-in</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link href={`/dashboard/patients/${patient._id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full font-semibold">View Profile</Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patient Details Modal */}
          {showPatientDetails && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Patient Details</h2>
                  <button
                    onClick={() => setShowPatientDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Appointment Count</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.appointment_count || 0}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.address}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Medical History</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPatient.medicalHistory || 'No medical history available'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add New Patient Modal */}
          {showAddPatientModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
                  <button
                    onClick={() => {
                      setShowAddPatientModal(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {submitError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                        placeholder="Enter patient's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                        placeholder="Enter patient's email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male" className="text-gray-700">Male</option>
                        <option value="female" className="text-gray-700">Female</option>
                        <option value="other" className="text-gray-700">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      placeholder="Enter patient's address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical History
                    </label>
                    <textarea
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      placeholder="Enter any relevant medical history"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddPatientModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-[#7b6ffb] text-white rounded-lg hover:bg-[#6a5de8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Patient'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}