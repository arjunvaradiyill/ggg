"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import api, { Appointment } from '@/app/services/api';

const statusColors: { [key: string]: string } = {
  completed: 'bg-green-100 text-green-700',
  confirmed: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
  processing: 'bg-blue-100 text-blue-700',
  'in transit': 'bg-purple-100 text-purple-700',
  'on hold': 'bg-yellow-100 text-yellow-700',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Get unique values for dropdowns
  const uniqueDates = Array.from(new Set(appointments.map(a => new Date(a.date).toLocaleDateString())));
  const uniquePatients = Array.from(new Set(appointments.map(a => a.patient?.name)));
  const uniqueDoctors = Array.from(new Set(appointments.map(a => a.doctor?.name)));
  const uniqueDepartments = Array.from(new Set(appointments.map(a => a.doctor?.specialization)));
  const uniqueStatuses = Array.from(new Set(appointments.map(a => a.status)));

  // Filtering logic
  const filteredAppointments = appointments.filter(a => {
    const dateMatch = !filterDate || new Date(a.date).toLocaleDateString() === filterDate;
    const patientMatch = !filterPatient || a.patient?.name === filterPatient;
    const doctorMatch = !filterDoctor || a.doctor?.name === filterDoctor;
    const departmentMatch = !filterDepartment || a.doctor?.specialization === filterDepartment;
    const statusMatch = !filterStatus || a.status === filterStatus;
    return dateMatch && patientMatch && doctorMatch && departmentMatch && statusMatch;
  });

  const resetFilters = () => {
    setFilterDate('');
    setFilterPatient('');
    setFilterDoctor('');
    setFilterDepartment('');
    setFilterStatus('');
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Failed to fetch appointments data');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
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
              <Link href="/dashboard/patients" className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]">
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
              <Link href="/dashboard/appointments" className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-black font-bold shadow">
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
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Noob" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex flex-col items-start">
                      <span className="text-gray-800 font-semibold">Noob</span>
                      <span className="text-gray-400 text-xs">Admin</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</a>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</a>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Logout</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Page Content */}
        <div className="p-6">
          {/* Modern Filter Section */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M12 8v4l3 3" strokeWidth="2"/></svg>
                    Date
                  </label>
                  <select
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full text-gray-700 focus:ring-2 focus:ring-[#7b6ffb]"
                  >
                    <option value="">All Dates</option>
                    {uniqueDates.map(date => (
                      <option key={`date-${date}`} value={date} className="text-gray-700">{date}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M6.343 17.657A8 8 0 1112 20a8 8 0 01-5.657-2.343z"/></svg>
                    Patient
                  </label>
                  <select
                    value={filterPatient}
                    onChange={e => setFilterPatient(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full text-gray-700 focus:ring-2 focus:ring-[#7b6ffb]"
                  >
                    <option value="">All Patients</option>
                    {uniquePatients.map(name => (
                      <option key={`patient-${name}`} value={name} className="text-gray-700">{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M6.343 17.657A8 8 0 1112 20a8 8 0 01-5.657-2.343z"/></svg>
                    Doctor
                  </label>
                  <select
                    value={filterDoctor}
                    onChange={e => setFilterDoctor(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full text-gray-700 focus:ring-2 focus:ring-[#7b6ffb]"
                  >
                    <option value="">All Doctors</option>
                    {uniqueDoctors.map(name => (
                      <option key={`doctor-${name}`} value={name} className="text-gray-700">{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/></svg>
                    Department
                  </label>
                  <select
                    value={filterDepartment}
                    onChange={e => setFilterDepartment(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full text-gray-700 focus:ring-2 focus:ring-[#7b6ffb]"
                  >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map(dept => (
                      <option key={`dept-${dept}`} value={dept} className="text-gray-700">{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M12 8v4l3 3" strokeWidth="2"/></svg>
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full text-gray-700 focus:ring-2 focus:ring-[#7b6ffb]"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map(status => (
                      <option key={`status-${status}`} value={status} className="text-gray-700">{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end mt-2 sm:mt-0">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 min-w-[140px] h-12 px-4 py-2 bg-[#f3f4f6] hover:bg-[#e0e7ff] text-[#7b6ffb] font-semibold rounded-lg shadow-sm border border-[#e0e7ff] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5 19A9 9 0 1119 5" /></svg>
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment, idx) => (
                    <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{String(idx + 1).padStart(5, '0')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patient?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.doctor?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(appointment.date).toLocaleDateString()} {appointment.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.doctor?.specialization || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[appointment.status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{appointment.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full font-semibold"
                          onClick={() => { setSelectedAppointment(appointment); setShowDetails(true); }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Appointment Details Modal */}
          {showDetails && selectedAppointment && (
            <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Appointment Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAppointment.patient?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAppointment.patient?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAppointment.doctor?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAppointment.doctor?.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAppointment.time}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedAppointment.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedAppointment.type}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAppointment.notes || 'No notes available'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}