"use client";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { usePathname, useParams } from 'next/navigation';
import api, { Doctor, authAPI } from '../../services/api';

const summaryCards = [
  { label: "Total Earning", value: "", change: "" },
  { label: "Total Customers", value: "", change: "" },
  { label: "Available Doctors", value: "", change: "" },
  { label: "Total Services", value: "", change: "" },
];

const statusColors = {
  Completed: "bg-green-500",
  Pending: "bg-yellow-400",
  Rejected: "bg-red-500",
};

export default function DashboardPage() {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Doctor | null>(null);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Doctor data state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  // Modal form state
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState('4.5');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Available specializations for dropdown
  const specializationOptions = [
    'Cardiology',
    'Neurology', 
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Oncology',
    'Psychiatry',
    'Emergency Medicine',
    'Family Medicine',
    'Internal Medicine',
    'Surgery',
    'Radiology'
  ];

  const notifications = [
    { id: 1, text: 'New appointment booked.' },
    { id: 2, text: 'Doctor profile updated.' },
    { id: 3, text: 'Payment received.' },
    { id: 4, text: 'Patient feedback received.' },
    { id: 5, text: 'System update available.' },
    { id: 6, text: 'New message from admin.' },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/gb.svg' },
    { code: 'fr', label: 'French', flag: 'https://flagcdn.com/fr.svg' },
    { code: 'es', label: 'Spanish', flag: 'https://flagcdn.com/es.svg' },
  ];

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await api.getDoctors();
        // Handle both array and object response formats
        const doctorsData = Array.isArray(response) ? response : (response as any).doctors || [];
        setDoctors(doctorsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Get unique specializations
  const specializations = Array.from(new Set(doctors.map(d => d.specialization)));

  // Filtered doctors
  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialization = selectedSpecialization ? d.specialization === selectedSpecialization : true;
    return matchesSearch && matchesSpecialization;
  });

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validation
    if (!doctorName.trim() || !specialization.trim() || !email.trim() || !phone.trim()) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!email.includes('@')) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      const doctorData = {
        name: doctorName.trim(),
        specialization: specialization.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: parseInt(experience) || 0,
        rating: parseFloat(rating) || 4.5,
        image: image.trim() || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`
      };

      await api.createDoctor(doctorData);
      
      setSubmitSuccess(true);
      
      // Reset form
      setDoctorName('');
      setSpecialization('');
      setEmail('');
      setPhone('');
      setExperience('');
      setRating('4.5');
      setImage('');
      
      // Refresh doctors list
      const response = await api.getDoctors();
      const doctorsData = Array.isArray(response) ? response : (response as any).doctors || [];
      setDoctors(doctorsData);
      
      // Close modal after success
      setTimeout(() => {
        setShowCreateModal(false);
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating doctor:', error);
      setSubmitError(error.response?.data?.message || 'Failed to create doctor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleShowDoctorDetails = (doctor: Doctor) => {
    setSelectedDoctorDetails(doctor);
    setShowDoctorDetails(true);
  };

  const params = useParams();
  const patientId = params.id;

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
              <Link
                href="/dashboard"
                className={`flex items-center px-4 py-2 rounded-lg font-bold shadow ${pathname === '/dashboard' ? 'hover:bg-[rgba(113,97,239,0.6)] text-white' : 'bg-gray-100 text-black'}`}
              >
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
              <Link
                href="/dashboard/doctors"
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${pathname === '/dashboard/doctors' ? 'bg-[rgba(113,97,239,0.6)] text-white font-bold' : 'text-black'}`}
              >
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
              <Link
                href="/dashboard/patients"
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${pathname === '/dashboard/patients' ? 'bg-[rgba(113,97,239,0.6)] text-white font-bold' : 'text-black'}`}
              >
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
              <Link
                href="/dashboard/appointments"
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${pathname === '/dashboard/appointments' ? 'bg-[rgba(113,97,239,0.6)] text-white font-bold' : 'text-black'}`}
              >
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
      <main className="flex-1 pl-0 pr-6 md:pr-8 pt-6 md:pt-8 max-w-screen-xl mx-auto container ml-0 md:ml-8">
        {/* Navigation bar - Consider adding breadcrumbs or title here */}
        <div className="w-full px-4 py-2 bg-[#f7f8fa] flex items-center justify-center">
          <div className="w-full max-w-7xl flex items-center bg-white rounded-2xl shadow-lg px-6 py-3 gap-4">
            {/* Sidebar Toggle */}
            <button
              className="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow"
              onClick={() => setSidebarOpen(!sidebarOpen)}
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">{notifications.length}</span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                    <div className="p-4 font-semibold border-b border-gray-100">Notifications</div>
                    <ul>
                      {notifications.map(n => (
                        <li key={n.id} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">{n.text}</li>
                      ))}
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
                  <img src={languages.find(l => l.label === selectedLanguage)?.flag} alt="Flag" className="w-7 h-5 rounded object-cover" />
                  <span className="text-gray-700 font-medium">{selectedLanguage}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                    {languages.map(lang => (
                      <div
                        key={lang.code}
                        className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 ${selectedLanguage === lang.label ? 'font-bold' : ''}`}
                        onClick={() => { setSelectedLanguage(lang.label); setShowLanguageMenu(false); }}
                      >
                        <img src={lang.flag} alt={lang.label} className="w-6 h-4 rounded object-cover" />
                        <span>{lang.label}</span>
                      </div>
                    ))}
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
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt={currentUser?.username || "Admin"} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex flex-col items-start">
                    <span className="text-gray-800 font-semibold">{currentUser?.username || "Admin"}</span>
                    <span className="text-gray-400 text-xs capitalize">{currentUser?.role || "Admin"}</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAdminProfile(true);
                        setShowProfileMenu(false);
                      }}
                    >
                      Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</a>
                    <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Logout</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Welcome and cards */}
        <div className="main-content px-2 sm:px-4 md:px-8 py-4 sm:py-8 w-full">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Welcome back, {currentUser?.username || "Admin"}
            </h1>
            <p className="text-base text-gray-600">
              Manage your doctors and their information efficiently.
            </p>
          </div>
          {/* Doctors Heading and Create Button Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-black">Doctors</h2>
              <span className="text-base text-gray-500">(129)</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-[#377DFF] hover:bg-[#2563eb] text-white font-semibold px-6 py-2 rounded-md shadow transition-all text-base"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5"/></svg>
              Create New Doctor
            </button>
          </div>
          {/* Filter Bar - Alignment/Spacing Fixes */}
          <div className="w-full h-[70px] flex items-center rounded-xl shadow bg-[#f7f8fa] gap-4 mb-4">
            {/* Filter Icon and Label */}
            <div className="flex items-center gap-2">
              <Image src="/filter.svg" alt="Filter" width={28} height={28} style={{ height: 'auto' }} />
              <span className="font-semibold text-gray-500">Filter By</span>
            </div>
            {/* Search Input */}
            <div className="flex-1 mx-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search doctor name"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-11 rounded-full border border-gray-200 pl-10 pr-4 text-lg bg-[#fafbfc] text-black focus:outline-none"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {/* Doctor Name Dropdown */}
            <select
              value={selectedSpecialization}
              onChange={e => setSelectedSpecialization(e.target.value)}
              className="h-11 rounded-full border border-gray-200 px-4 text-lg bg-[#fafbfc] text-black focus:outline-none"
            >
              <option value="">All Specializations</option>
              {specializations.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
          {/* Main Flex Row: Grid + Right Panel */}
          <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1200px] items-start overflow-x-auto min-w-0">
            {/* Left: Doctor Cards Grid */}
            <div className="flex-1 min-w-0 flex justify-center">
              {/* Doctor Cards Grid */}
              <div className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading doctors...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Doctors</div>
                      <div className="text-gray-600 mb-4">{error}</div>
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="text-gray-500 text-lg font-semibold mb-2">No Doctors Found</div>
                      <div className="text-gray-400">Try adjusting your search criteria</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor, idx) => (
                      <div key={doctor.id || idx} className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden flex flex-col items-center min-h-[400px] transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
                        <img
                          src={doctor.image || "https://randomuser.me/api/portraits/men/32.jpg"}
                          alt={doctor.name}
                          className="w-full h-60 object-cover cursor-pointer"
                          onClick={() => handleShowDoctorDetails(doctor)}
                        />
                        <div className="w-full flex flex-col items-center py-6 border-b border-gray-200">
                          <span className="text-2xl font-bold text-black drop-shadow-sm">{doctor.name}</span>
                          <span className="text-lg text-gray-400 mt-1">{doctor.specialization}</span>
                        </div>
                        <div className="w-full flex justify-between items-center px-8 py-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-900 ml-1">{doctor.rating || 4.5}</span>
                            </div>
                            <span className="text-sm text-gray-500">{doctor.patient_count || 0} Patients</span>
                          </div>
                        </div>
                        <div className="w-full flex justify-center py-6 bg-[#f3f8ff] mt-auto">
                          <button 
                            className="w-[90%] py-3 rounded-md bg-[#eaf3ff] text-[#007aff] text-lg font-semibold hover:bg-[#d6eaff] transition"
                            onClick={() => handleShowDoctorDetails(doctor)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Right: Doctor Info Panel (Alignment Fixed) */}
            <div className="hidden lg:flex flex-col w-[370px] min-w-[370px] sticky top-8 items-center">
              <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center border border-gray-100 w-full max-w-sm mx-auto">
                {/* Profile Image */}
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Dr. Dilip Anmangandla"
                  className="w-24 h-24 rounded-xl object-cover mb-6"
                />
                {/* Doctor Name */}
                <div className="text-2xl font-bold text-center mb-6 text-black">
                  Dr. Dilip Anmangandla, MD
                </div>
                {/* Stats Row */}
                <div className="grid grid-cols-3 w-full text-center mb-8 divide-x divide-gray-200">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Appointment</div>
                    <div className="text-black text-2xl font-bold">4250</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Total Patients</div>
                    <div className="text-black text-2xl font-bold">32.1k</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Rate</div>
                    <div className="text-black text-2xl font-bold">4.8</div>
                  </div>
                </div>
                {/* Divider */}
                <hr className="w-full my-4 border-gray-200" />
                {/* Upcoming Appointments */}
                <div className="w-full mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-black">Upcoming Appointment</div>
                    <button className="text-gray-400 text-2xl">•••</button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#377DFF] font-semibold">July 30, 2022</span>
                      <div className="flex-1 border-b border-[#377DFF]"></div>
                    </div>
                    {/* Appointment 1 */}
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                          08:30 am - 10:30 am
                        </div>
                        <div className="font-bold text-black">Nurse Visit 20</div>
                        <div className="text-gray-400 text-sm">Dr. Carol D. Pollack-rundle</div>
                      </div>
                      <span className="text-gray-400 text-xl">&gt;</span>
                    </div>
                    {/* Appointment 2 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                          08:30 am - 10:30 am
                        </div>
                        <div className="font-bold text-black">Annual Visit 15</div>
                        <div className="text-gray-400 text-sm">Dr. Donald F. Watren</div>
                      </div>
                      <span className="text-gray-400 text-xl">&gt;</span>
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <hr className="w-full my-4 border-gray-200" />
                {/* Patient Satisfaction */}
                <div className="w-full">
                  <div className="text-lg font-bold text-black mb-4">Patient Satisfaction</div>
                  <div className="flex items-center justify-between">
                    {/* Donut Chart */}
                    <div className="relative">
                      <svg width="120" height="120" viewBox="0 0 36 36">
                        {/* Background circle */}
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                        {/* Excellent - Blue */}
                        <path 
                          d="M18 2 a 16 16 0 0 1 13 25" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="4.5" 
                          strokeLinecap="round" 
                        />
                        {/* Good - Green */}
                        <path 
                          d="M31 27 a 16 16 0 0 1 -22 0" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="4.5" 
                          strokeLinecap="round" 
                        />
                        {/* Poor - Orange */}
                        <path 
                          d="M5 27 a 16 16 0 0 1 13-25" 
                          fill="none" 
                          stroke="#f59e0b" 
                          strokeWidth="4.5" 
                          strokeLinecap="round" 
                        />
                        {/* Center text */}
                        <text x="18" y="22" textAnchor="middle" fontSize="8" fill="#1f2937" fontWeight="bold">45,251</text>
                        <text x="18" y="14" textAnchor="middle" fontSize="4" fill="#6b7280">Total</text>
                      </svg>
                      {/* Center percentage */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">85%</div>
                          <div className="text-xs text-gray-500">Satisfaction</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex flex-col gap-4 ml-8">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#3b82f6] shadow-sm"></div>
                          <span className="text-gray-700 text-sm font-medium">Excellent</span>
                        </div>
                        <span className="text-gray-500 text-sm">(65%)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#10b981] shadow-sm"></div>
                          <span className="text-gray-700 text-sm font-medium">Good</span>
                        </div>
                        <span className="text-gray-500 text-sm">(25%)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#f59e0b] shadow-sm"></div>
                          <span className="text-gray-700 text-sm font-medium">Poor</span>
                        </div>
                        <span className="text-gray-500 text-sm">(10%)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Satisfaction Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.8</div>
                      <div className="text-xs text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">2,847</div>
                      <div className="text-xs text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">98%</div>
                      <div className="text-xs text-gray-600">Would Recommend</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Responsive right panel for mobile */}
            <div className="flex lg:hidden w-full mt-8">
              <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center border border-gray-100 w-full">
                {/* (You can duplicate the info panel content here for mobile if desired) */}
              </div>
            </div>
          </div>
        </div>
      </main>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[rgba(247,248,250,0.85)]">
          <div
            className="bg-white rounded-2xl p-4 sm:p-8 shadow-xl border border-gray-200 absolute flex flex-col"
            style={{ width: '1000px', height: '700px', top: '90px', left: '280px' }}
          >
            {/* Modal Heading - Single Line with Underline */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1966FF] mb-1" style={{lineHeight: '1.1'}}>Create Doctor</h2>
              <div className="h-1 bg-[#4BA3FA] w-1/2 rounded" />
            </div>
            {/* Close button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            {/* Modal Content: Place your form here */}
            <div className="flex-1 overflow-y-auto">
              {/* Success/Error Messages */}
              {submitSuccess && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✅ Doctor created successfully! The modal will close automatically.
                </div>
              )}
              
              {submitError && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  ❌ {submitError}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Profile Image */}
                <div className="flex flex-col items-center mb-4 md:mb-0">
                  <div className="relative">
                    <img 
                      src={image || "https://randomuser.me/api/portraits/women/44.jpg"} 
                      alt="Profile" 
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200" 
                    />
                    <button className="absolute bottom-2 right-2 bg-[#377DFF] p-2 rounded-full border-2 border-white">
                      <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">Profile image will be auto-generated if no URL provided</p>
                </div>
                
                {/* Right: Form Fields */}
                <form id="create-doctor-form" className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" onSubmit={handleSave}>
                  {/* Doctor Name */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Doctor Name *</label>
                    <input 
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      placeholder="Enter doctor name" 
                      value={doctorName} 
                      onChange={e => setDoctorName(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Specialization */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Specialization *</label>
                    <select 
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      value={specialization} 
                      onChange={e => setSpecialization(e.target.value)}
                      required
                    >
                      <option value="">Select specialization</option>
                      {specializationOptions.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Email *</label>
                    <input 
                      type="email"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      placeholder="Enter email address" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Phone *</label>
                    <input 
                      type="tel"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      placeholder="Enter phone number" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Experience */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Experience (Years)</label>
                    <input 
                      type="number"
                      min="0"
                      max="50"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      placeholder="Enter experience in years" 
                      value={experience} 
                      onChange={e => setExperience(e.target.value)}
                    />
                  </div>
                  
                  {/* Rating */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Rating</label>
                    <input 
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      placeholder="Enter rating (0-5)" 
                      value={rating} 
                      onChange={e => setRating(e.target.value)}
                    />
                  </div>
                  
                  {/* Image URL */}
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 mb-1 font-semibold">Image URL (Optional)</label>
                    <input 
                      type="url"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      placeholder="Enter image URL or leave blank for auto-generated" 
                      value={image} 
                      onChange={e => setImage(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            {/* Sticky Save Button Footer */}
            <div className="pt-4 bg-white border-t border-gray-200 flex justify-end sticky bottom-0 left-0 right-0 z-10">
              <button 
                type="submit" 
                form="create-doctor-form" 
                disabled={isSubmitting}
                className={`rounded-lg px-10 py-3 text-lg font-semibold transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-[#1A2CFE] text-white hover:bg-[#0f1fcc]'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Doctor Details Modal */}
      {showDoctorDetails && selectedDoctorDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Doctor Details</h2>
              <button
                onClick={() => {
                  setShowDoctorDetails(false);
                  setSelectedDoctorDetails(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="flex flex-col items-center">
                <img
                  src={selectedDoctorDetails.image || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt={selectedDoctorDetails.name}
                  className="w-48 h-48 rounded-full object-cover mb-6"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedDoctorDetails.name}</h3>
                <p className="text-xl text-gray-600 mb-6">{selectedDoctorDetails.specialization}</p>
                
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#377DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{selectedDoctorDetails.email || "doctor@example.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#377DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{selectedDoctorDetails.phone || "+1 234 567 890"}</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="text-gray-900 font-medium">{selectedDoctorDetails.experience || 10}+ Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Education</span>
                      <span className="text-gray-900 font-medium">MD, PhD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialization</span>
                      <span className="text-gray-900 font-medium">{selectedDoctorDetails.specialization}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Availability</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Working Hours</span>
                      <span className="text-gray-900 font-medium">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Working Days</span>
                      <span className="text-gray-900 font-medium">Monday - Friday</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-600 text-sm">Total Patients</div>
                      <div className="text-2xl font-bold text-gray-900">{selectedDoctorDetails.patient_count || 0}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-600 text-sm">Success Rate</div>
                      <div className="text-2xl font-bold text-gray-900">98%</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-600 text-sm">Experience</div>
                      <div className="text-2xl font-bold text-gray-900">{selectedDoctorDetails.experience || 10}+</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-600 text-sm">Rating</div>
                      <div className="text-2xl font-bold text-gray-900">{selectedDoctorDetails.rating || 4.5}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  setShowDoctorDetails(false);
                  setSelectedDoctorDetails(null);
                }}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Admin Profile Modal */}
      {showAdminProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Admin Profile</h2>
              <button
                onClick={() => setShowAdminProfile(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative mb-6">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Admin Profile"
                    className="w-48 h-48 rounded-full object-cover"
                  />
                  <button className="absolute bottom-2 right-2 bg-[#377DFF] p-2 rounded-full border-2 border-white">
                    <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/>
                    </svg>
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentUser?.username || "Admin"}</h3>
                <p className="text-xl text-gray-600 mb-6 capitalize">{currentUser?.role || "Administrator"}</p>
                
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#377DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">admin@carebot.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#377DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">+1 234 567 890</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={currentUser?.username || "Admin"}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-[#FAFBFC] text-gray-900"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Role</label>
                      <input
                        type="text"
                        value="Administrator"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-[#FAFBFC] text-gray-900"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        value="admin@carebot.com"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-[#FAFBFC] text-gray-900"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        value="+1 234 567 890"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-[#FAFBFC] text-gray-900"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Activity Overview</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-600 text-sm">Total Logins</div>
                      <div className="text-2xl font-bold text-gray-900">1,234</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-600 text-sm">Last Login</div>
                      <div className="text-2xl font-bold text-gray-900">2h ago</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-600 text-sm">Actions Today</div>
                      <div className="text-2xl font-bold text-gray-900">42</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-600 text-sm">Account Age</div>
                      <div className="text-2xl font-bold text-gray-900">2y 3m</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#377DFF]"></div>
                      <span className="text-gray-700">Updated doctor information</span>
                      <span className="text-gray-500 text-sm ml-auto">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#377DFF]"></div>
                      <span className="text-gray-700">Added new department</span>
                      <span className="text-gray-500 text-sm ml-auto">4h ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#377DFF]"></div>
                      <span className="text-gray-700">Updated system settings</span>
                      <span className="text-gray-500 text-sm ml-auto">1d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowAdminProfile(false)}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
