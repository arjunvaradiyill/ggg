"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { appointmentsAPI, Appointment, authAPI } from '@/app/services/api';

export default function DoctorDashboard() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    bookingId: '',
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    department: '',
    reason: '',
  });
  const [appointmentRequests, setAppointmentRequests] = useState<Appointment[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment submission logic here
    setShowAppointmentModal(false);
    setAppointmentForm({
      bookingId: '',
      patientId: '',
      patientName: '',
      doctorId: '',
      doctorName: '',
      date: '',
      time: '',
      department: '',
      reason: '',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get current user information
        const user = authAPI.getCurrentUser();
        setCurrentUser(user);
        
        // Fetch appointment requests (pending)
        const pendingRes = await appointmentsAPI.getAppointments({ status: 'pending' });
        setAppointmentRequests(pendingRes.appointments || pendingRes);
        // Fetch today's appointments
        const todayRes = await appointmentsAPI.getTodayAppointments();
        setTodaysAppointments(todayRes.appointments || todayRes);
        // Fetch recent appointments (limit 5)
        const recentRes = await appointmentsAPI.getAppointments({ limit: 5 });
        setRecentAppointments(recentRes.appointments || recentRes);
      } catch (err) {
        setError('Failed to fetch appointment data');
        console.error('Error fetching doctor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            <li><Link href="/doctor/dashboard" className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-bold shadow">Dashboard</Link></li>
            <li><Link href="/doctor/dashboard/patients" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Patients</Link></li>
            <li><Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Appointment</Link></li>
            {/* <li><Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Payments</Link></li> */}
            {/* <li><Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Notification</Link></li> */}
            <li><Link href="/" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Logout</Link></li>
            {/* <li><Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Suppliers</Link></li> */}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top bar */}
        <div className="w-full px-4 py-2 bg-[#f7f8fa] flex items-center justify-center mb-4">
          <div className="w-full max-w-7xl flex items-center bg-white rounded-2xl shadow-lg px-6 py-3 gap-4">
            {/* Search Bar */}
            <div className="flex-1 flex items-center">
              <div className="w-full max-w-xl flex items-center bg-[#f7f8fa] rounded-full px-4 py-2 shadow-inner">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/></svg>
                <input type="text" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 bg-transparent outline-none text-base text-gray-700 placeholder-gray-400" />
              </div>
            </div>
            {/* Right Side */}
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <div className="relative">
                <button className="flex items-center gap-2 focus:outline-none" onClick={() => setShowLanguageMenu(!showLanguageMenu)} aria-label="Select language">
                  <img src="https://flagcdn.com/gb.svg" alt="Flag" className="w-7 h-5 rounded object-cover" />
                  <span className="text-gray-700 font-medium">English</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                    <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 font-bold"><img src="https://flagcdn.com/gb.svg" alt="English" className="w-6 h-4 rounded object-cover" /><span>English</span></div>
                    <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50"><img src="https://flagcdn.com/fr.svg" alt="French" className="w-6 h-4 rounded object-cover" /><span>French</span></div>
                    <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50"><img src="https://flagcdn.com/es.svg" alt="Spanish" className="w-6 h-4 rounded object-cover" /><span>Spanish</span></div>
                  </div>
                )}
              </div>
              {/* User Profile */}
              <div className="relative">
                <button className="flex items-center gap-2 focus:outline-none" onClick={() => setShowProfileMenu(!showProfileMenu)} aria-label="Show profile menu">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt={currentUser?.username || "Doctor"} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex flex-col items-start">
                    <span className="text-gray-800 font-semibold">{currentUser?.username || "Doctor"}</span>
                    <span className="text-gray-400 text-xs capitalize">{currentUser?.role || "Doctor"}</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              Welcome back, {currentUser?.username || "Doctor"}
            </h1>
            <p className="text-base text-gray-700">Manage your patients and appointments efficiently.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#f3f4f6] text-[#7b6ffb] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e5e7eb]">Export data</button>
            <button
              className="bg-[#7b6ffb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#5a8dee]"
              onClick={() => setShowCreateReportModal(true)}
            >
              Create report
            </button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
            <span className="text-sm font-medium mb-2 opacity-90">Total Appointment</span>
            <span className="text-3xl font-bold mb-1">50.8K</span>
          </div>
          <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
            <span className="text-sm font-medium mb-2 opacity-90">Total Patient</span>
            <span className="text-3xl font-bold mb-1">123.6K</span>
          </div>
          <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
            <span className="text-sm font-medium mb-2 opacity-90">Clinic Consulting</span>
            <span className="text-3xl font-bold mb-1">75.6K</span>
          </div>
          <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
            <span className="text-sm font-medium mb-2 opacity-90">Total Hours</span>
            <span className="text-3xl font-bold mb-1">12 hr</span>
          </div>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Left: Appointment Request & Recent Patient Appointment */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Appointment Request */}
            <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col mb-2 min-h-[210px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-800">Appointment Request</span>
                <Link href="/doctor/appointment-requests" className="text-[#7b6ffb] font-medium text-xs hover:underline">View All</Link>
              </div>
              <ul className="divide-y divide-gray-100">
                {appointmentRequests.map((req, i) => (
                  <li key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <img src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt={req.patient?.name || 'Patient'} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{req.patient?.name || 'Unknown Patient'}</div>
                        <div className="text-xs text-gray-600">{req.patient?.gender || 'N/A'} | {req.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${req.status === "confirmed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{req.status}</span>
                      <button className="text-gray-300 hover:text-[#7b6ffb]">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Recent Patient Appointment Table */}
            <div className="bg-white rounded-2xl p-3 shadow-sm min-h-[210px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-800">Recent Patient Appointment</span>
                <Link href="/doctor/recent-appointments" className="text-[#7b6ffb] font-medium text-xs hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                      <th className="py-2 px-1">Patient</th>
                      <th className="py-2 px-1">Doctor</th>
                      <th className="py-2 px-1">Date</th>
                      <th className="py-2 px-1">Time</th>
                      <th className="py-2 px-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((a, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="py-2 px-1 flex items-center gap-2">
                          <img src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt={a.patient?.name || 'Patient'} className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-gray-900 font-medium text-xs">{a.patient?.name || 'Unknown Patient'}</span>
                        </td>
                        <td className="py-2 px-1 text-gray-600 text-xs">{a.doctor?.name || 'Unknown Doctor'}</td>
                        <td className="py-2 px-1 text-gray-600 text-xs">{new Date(a.date).toLocaleDateString()}</td>
                        <td className="py-2 px-1 text-gray-600 text-xs">{a.time}</td>
                        <td className="py-2 px-1 text-xs font-medium">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${a.status === "completed" ? "bg-green-100 text-green-600" : a.status === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Right: Widgets */}
          <div className="flex flex-col gap-4">
            {/* Patients Card */}
            <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-2 min-h-[120px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-semibold text-gray-800">BOOK & APPOINTMENT</span>
                <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5 text-xs focus:ring-blue-300 focus:border-blue-300">
                  <option>2023</option>
                  <option>2024</option>
                </select>
              </div>
              {/* Add Book Appointment Button */}
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="mt-2 w-full bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow"
              >
                Book Appointment
              </button>
            </div>
            {/* Today's Appointment Card */}
            <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-2 min-h-[120px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-semibold text-gray-800">Todays Appointment</span>
                <Link href="/doctor/todays-appointments" className="text-[#7b6ffb] font-medium text-xs hover:underline">View All</Link>
              </div>
              <ul className="flex flex-col gap-1">
                {todaysAppointments.map((a, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt={a.patient?.name || 'Patient'} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-gray-900 font-medium text-xs">{a.patient?.name || 'Unknown Patient'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-900 font-semibold text-xs">{a.time}</span>
                      {a.status && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{a.status}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Calendar Widget */}
            <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-2 min-h-[120px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-semibold text-gray-800">
                  {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <style jsx global>{`
                  .react-calendar {
                    width: 100%;
                    border: none;
                    background: transparent;
                  }
                  .react-calendar__navigation {
                    display: none;
                  }
                  .react-calendar__month-view__weekdays {
                    text-transform: none;
                    font-size: 10px;
                    color: #6B7280;
                    margin-bottom: 4px;
                  }
                  .react-calendar__month-view__weekdays__weekday {
                    padding: 4px 0;
                  }
                  .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none;
                  }
                  .react-calendar__tile {
                    padding: 4px 0;
                    font-size: 12px;
                    color: #1F2937;
                  }
                  .react-calendar__tile--now {
                    background: #F3F4F6;
                    border-radius: 4px;
                    color: #1F2937;
                  }
                  .react-calendar__tile--active {
                    background: #EEF2FF;
                    color: #7B6FFB;
                    border-radius: 4px;
                    font-weight: 500;
                  }
                  .react-calendar__tile--active:enabled:hover,
                  .react-calendar__tile--active:enabled:focus {
                    background: #EEF2FF;
                  }
                  .react-calendar__tile:enabled:hover,
                  .react-calendar__tile:enabled:focus {
                    background: #F9FAFB;
                    border-radius: 4px;
                  }
                  .react-calendar__month-view__days__day--neighboringMonth {
                    color: #D1D5DB;
                  }
                  .react-calendar__tile--now:enabled:hover,
                  .react-calendar__tile--now:enabled:focus {
                    background: #E5E7EB;
                  }
                `}</style>
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  className="border-none w-full"
                  tileClassName="text-xs p-1"
                  formatShortWeekday={(locale, date) => 
                    date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2)
                  }
                  formatDay={(locale, date) => date.getDate().toString()}
                  formatLongDate={(locale, date) => 
                    date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
                  }
                  prevLabel={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>}
                  nextLabel={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                  minDetail="month"
                  maxDetail="month"
                  showNeighboringMonth={false}
                  tileContent={({ date: tileDate }) => {
                    // Add custom content to specific dates (e.g., appointments)
                    const hasAppointment = todaysAppointments.some(app => 
                      new Date(app.time).toDateString() === tileDate.toDateString()
                    );
                    return hasAppointment ? (
                      <div className="w-1 h-1 bg-[#7b6ffb] rounded-full mx-auto mt-1 opacity-75" />
                    ) : null;
                  }}
                />
                <div className="mt-2 w-full flex justify-between items-center">
                  <span className="text-[10px] text-gray-400">Next week</span>
                  <button 
                    className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      const nextWeek = new Date(date);
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      setDate(nextWeek);
                    }}
                  >
                    open
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modal for Create New Report */}
      {showCreateReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-0 overflow-hidden flex flex-col" style={{ minHeight: 0 }}>
            {/* Tab Header */}
            <div className="flex items-center px-8 pt-8 pb-2 border-b border-gray-100">
              <span className="text-lg font-semibold text-gray-900 mr-8 pb-2 border-b-2 border-[#3B36F4]">Create New Report</span>
            </div>
            {/* Form */}
            <form className="px-8 pt-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Report Name</label>
                <input type="text" className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]" placeholder="charlenereed@gmail.com" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Doctor Name</label>
                <input type="text" className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]" placeholder="Charlene Reed" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Date</label>
                <input type="text" className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]" placeholder="DD/MM/YYY" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Department</label>
                <input type="text" className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]" placeholder="Charlene Reed" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Description</label>
                <textarea className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] min-h-[80px] resize-none" placeholder="charlenereed@gmail.com" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Report</label>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-[#FAFAFB] px-2 py-6 cursor-pointer hover:border-[#7b6ffb] transition min-h-[120px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-8 h-8 text-[#7b6ffb] mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 16V4M12 4l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="16" width="16" height="4" rx="2"/></svg>
                  <span className="text-[#3B36F4] font-medium text-sm mb-1">Click to Upload</span>
                  <span className="text-gray-600 text-xs">or drag and drop</span>
                  <span className="text-gray-500 text-xs mt-1">(Max. File size: 25 MB)</span>
                  <input ref={fileInputRef} type="file" className="hidden" />
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col md:flex-row justify-end mt-2 gap-2">
                <button type="button" className="bg-[#3B36F4] hover:bg-[#2e2bbd] text-white font-semibold w-full md:w-auto px-10 py-3 rounded-2xl text-lg shadow transition" onClick={() => setShowCreateReportModal(false)}>
                  Save
                </button>
              </div>
            </form>
            {/* Close on overlay click */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
              onClick={() => setShowCreateReportModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-10 animate-[modalIn_0.2s_ease]">
            {/* Modal Heading */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center tracking-tight">Create New Book Appointment</h2>
            {/* Floating Close Button */}
            <button
              onClick={() => setShowAppointmentModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <form onSubmit={handleAppointmentSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Booking ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Bookings id</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border-2 border-[#7b6ffb] rounded-full focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base pr-10"
                      placeholder="121212"
                      value={appointmentForm.bookingId || ''}
                      onChange={e => setAppointmentForm({ ...appointmentForm, bookingId: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b6ffb]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    </span>
                  </div>
                </div>
                {/* Patient ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Patient's id</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border-2 border-[#7b6ffb] rounded-full focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base pr-10"
                      placeholder="121212"
                      value={appointmentForm.patientId || ''}
                      onChange={e => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b6ffb]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>
                  </div>
                </div>
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Patient's Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border-2 border-[#7b6ffb] rounded-full focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base pr-10"
                      placeholder="Emmanuel Jose"
                      value={appointmentForm.patientName}
                      onChange={e => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b6ffb]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
                    </span>
                  </div>
                </div>
                {/* Doctor ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Doctor's id</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border-2 border-[#7b6ffb] rounded-full focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base pr-10"
                      placeholder="CARD-192"
                      value={appointmentForm.doctorId || ''}
                      onChange={e => setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b6ffb]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>
                  </div>
                </div>
                {/* Doctor Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Doctor's Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border-2 border-[#7b6ffb] rounded-full focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base pr-10"
                      placeholder="Dr. George Paul"
                      value={appointmentForm.doctorName || ''}
                      onChange={e => setAppointmentForm({ ...appointmentForm, doctorName: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b6ffb]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
                    </span>
                  </div>
                </div>
                {/* Department Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Department Name</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 border-2 border-[#7b6ffb] rounded-full focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base pr-10 appearance-none"
                      value={appointmentForm.department}
                      onChange={e => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Dr. George Paul">Dr. George Paul</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b6ffb] pointer-events-none">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                    </span>
                  </div>
                </div>
              </div>
              {/* Booking time and Date of Consultation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Booking time</label>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full px-4 py-2.5 border-2 border-[#7b6ffb] rounded-full focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base pr-10"
                      value={appointmentForm.time}
                      onChange={e => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b6ffb]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date of Consultation</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border-2 border-[#7b6ffb] rounded-full focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base pr-10"
                      value={appointmentForm.date}
                      onChange={e => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b6ffb]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="4"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    </span>
                  </div>
                </div>
              </div>
              {/* Reason for the consultation */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Reason for the consultation</label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-[#7b6ffb] rounded-2xl focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base placeholder-gray-400 resize-none min-h-[80px]"
                  value={appointmentForm.reason}
                  onChange={e => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                  placeholder="Patient complains of mild abdominal discomfort, mostly after meals. No signs of nausea or vomiting. Vitals are within normal range. Suggested dietary changes and prescribed a mild antacid. Will follow up in one week if symptoms persist."
                  required
                />
              </div>
              {/* Book Appointment Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#7b6ffb] text-white rounded-full font-semibold text-base shadow-md hover:bg-[#6a5be2] transition-all"
                >
                  BOOK APPOINTMENT
                </button>
              </div>
            </form>
            <style jsx>{`
              @keyframes modalIn {
                0% { opacity: 0; transform: scale(0.96); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}