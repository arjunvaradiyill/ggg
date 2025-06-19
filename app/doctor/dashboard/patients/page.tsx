"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { authAPI } from '@/app/services/api';

const statCards = [
  { label: "Total Patients", value: "12.3K" },
  { label: "New Patients", value: "1.2K" },
  { label: "Appointments", value: "3.4K" },
  { label: "Total Hours", value: "120 hr" },
];

const recentPatients = [
  { name: "Christine Brooks", id: "00001", doctor: "Dr. Rosie Pearson", date: "04 Sep 2019", department: "Medicine", status: "Completed" },
  { name: "Rosie Pearson", id: "00002", doctor: "Dr. Jasim", date: "28 May 2019", department: "Book", status: "Processing" },
  { name: "Darrell Caldwell", id: "00003", doctor: "Dr. Joseph", date: "23 Nov 2019", department: "Electric", status: "Rejected" },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
  "In Transit": "bg-blue-100 text-blue-700",
};

const notifications = [
  { id: 1, text: "New appointment booked." },
  { id: 2, text: "Patient profile updated." },
  { id: 3, text: "Payment received." },
  { id: 4, text: "Patient feedback received." },
  { id: 5, text: "System update available." },
  { id: 6, text: "New message from admin." },
];

const languages = [
  { code: "en", label: "English", flag: "https://flagcdn.com/gb.svg" },
  { code: "fr", label: "French", flag: "https://flagcdn.com/fr.svg" },
  { code: "es", label: "Spanish", flag: "https://flagcdn.com/es.svg" },
];

export default function DoctorPatientsDashboard() {
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    date: "",
    time: "",
    department: "",
    doctor: "",
    reason: "",
  });

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) setDate(value);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment submission logic here
    console.log("Appointment submitted:", appointmentForm);
    setShowAppointmentModal(false);
    // Reset form
    setAppointmentForm({
      patientName: "",
      date: "",
      time: "",
      department: "",
      doctor: "",
      reason: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-6">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="font-bold text-xl text-gray-900">CareBot</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li><Link href="/doctor/dashboard" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Dashboard</Link></li>
            <li><Link href="/doctor/dashboard/patients" className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-bold shadow">Patients</Link></li>
            <li><Link href="/doctor/dashboard/appointments" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Appointments</Link></li>
            <li><Link href="/doctor/dashboard/payments" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Payments</Link></li>
            <li><Link href="/doctor/dashboard/notification" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Notification</Link></li>
            <li><Link href="/" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Logout</Link></li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="w-full px-4 py-2 bg-[#f7f8fa] flex items-center justify-center mb-6">
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
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt={currentUser?.username || "Doctor"} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex flex-col items-start">
                    <span className="text-gray-800 font-semibold">{currentUser?.username || "Doctor"}</span>
                    <span className="text-gray-400 text-xs capitalize">{currentUser?.role || "Doctor"}</span>
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

        {/* Welcome and stats cards */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">Patients Dashboard</h1>
            <p className="text-base text-gray-700">Overview of all patients and recent activity.</p>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
              <span className="text-sm font-medium mb-2 opacity-90">{card.label}</span>
              <span className="text-3xl font-bold mb-1">{card.value}</span>
            </div>
          ))}
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Left: Recent Patients Table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-sm min-h-[210px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-800">Recent Patients</span>
                <Link href="/dashboard/patients" className="text-[#7b6ffb] font-medium text-xs hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                      <th className="py-2 px-1">ID</th>
                      <th className="py-2 px-1">Name</th>
                      <th className="py-2 px-1">Doctor</th>
                      <th className="py-2 px-1">Date</th>
                      <th className="py-2 px-1">Department</th>
                      <th className="py-2 px-1">Status</th>
                      <th className="py-2 px-1 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((p, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="py-2 px-1 font-mono text-gray-700">{p.id}</td>
                        <td className="py-2 px-1 text-gray-900">{p.name}</td>
                        <td className="py-2 px-1 text-gray-700">{p.doctor}</td>
                        <td className="py-2 px-1 text-gray-700">{p.date}</td>
                        <td className="py-2 px-1 text-gray-700">{p.department}</td>
                        <td className="py-2 px-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-200 text-gray-700'}`}>{p.status}</span>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <Link href={`/dashboard/patients/${p.id}`}>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                              View Profile
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Right: Calendar Widget */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-2 min-h-[120px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-semibold text-gray-800">BOOK & APPOINTMENT</span>
                
              </div>
              <div className="flex flex-col items-center">
                <style jsx global>{`
                  .react-calendar { width: 100%; border: none; background: transparent; }
                  .react-calendar__navigation { display: none; }
                  .react-calendar__month-view__weekdays { text-transform: none; font-size: 10px; color: #6B7280; margin-bottom: 4px; }
                  .react-calendar__month-view__weekdays__weekday { padding: 4px 0; }
                  .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
                  .react-calendar__tile { padding: 4px 0; font-size: 12px; color: #1F2937; }
                  .react-calendar__tile--now { background: #F3F4F6; border-radius: 4px; color: #1F2937; }
                  .react-calendar__tile--active { background: #EEF2FF; color: #7B6FFB; border-radius: 4px; font-weight: 500; }
                  .react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus { background: #EEF2FF; }
                  .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background: #F9FAFB; border-radius: 4px; }
                  .react-calendar__month-view__days__day--neighboringMonth { color: #D1D5DB; }
                  .react-calendar__tile--now:enabled:hover, .react-calendar__tile--now:enabled:focus { background: #E5E7EB; }
                `}</style>
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  className="border-none w-full"
                  tileClassName="text-xs p-1"
                  formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2)}
                  minDetail="month"
                  maxDetail="month"
                  showNeighboringMonth={false}
                />
                <div className="w-full mt-4">
                  <button 
                    onClick={() => setShowAppointmentModal(true)}
                    className="w-full bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
            {/* Modal Header */}
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleAppointmentSubmit} className="space-y-5">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
                  <input
                    type="text"
                    value={appointmentForm.patientName}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    placeholder="Enter patient name"
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                    <input
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
                    <input
                      type="time"
                      value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <select
                    value={appointmentForm.department}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor</label>
                  <select
                    value={appointmentForm.doctor}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    required
                  >
                    <option value="">Select Doctor</option>
                    <option value="Dr. Rosie Pearson">Dr. Rosie Pearson</option>
                    <option value="Dr. Jasim">Dr. Jasim</option>
                    <option value="Dr. Joseph">Dr. Joseph</option>
                    <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                    <option value="Dr. Michael Brown">Dr. Michael Brown</option>
                  </select>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Visit</label>
                  <textarea
                    value={appointmentForm.reason}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all resize-none"
                    rows={3}
                    placeholder="Please describe the reason for the visit"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 