"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authAPI } from '@/app/services/api';

export default function Appointment() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentStatusFilter, setRecentStatusFilter] = useState('All');
  const [nextWeekStatusFilter, setNextWeekStatusFilter] = useState('All');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Add sample data for demonstration
  const recentAppointments = [
    { name: "Floyd Miles", visitId: "OPD-1", date: "12.09.2019", gender: "Male", disease: "Diabetes", status: "Out-Patient" },
    { name: "Floyd Miles", visitId: "OPD-32", date: "12.09.2019", gender: "Male", disease: "Diabetes", status: "Pending" },
    { name: "Floyd Miles", visitId: "OPD-123", date: "12.09.2019", gender: "Male", disease: "Diabetes", status: "In-Patient" },
  ];
  const nextWeekAppointments = [
    { name: "Jane Doe", visitId: "OPD-200", date: "19.09.2019", gender: "Female", disease: "Hypertension", status: "Scheduled" },
    { name: "John Smith", visitId: "OPD-201", date: "20.09.2019", gender: "Male", disease: "Asthma", status: "Scheduled" },
  ];

  const statusOptionsRecent = ['All', 'Out-Patient', 'Pending', 'In-Patient'];
  const statusOptionsNextWeek = ['All', 'Scheduled'];

  const [recentAppointmentsState, setRecentAppointmentsState] = useState(recentAppointments);
  const [nextWeekAppointmentsState, setNextWeekAppointmentsState] = useState(nextWeekAppointments);

  // Sample doctor info
  const doctorProfile = {
    name: 'Dr. Noob',
    email: 'noob@carebot.com',
    role: 'Admin',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  const handleStatusChange = (type: 'recent' | 'next', visitId: string, newStatus: string) => {
    if (type === 'recent') {
      setRecentAppointmentsState(prev => prev.map(a => a.visitId === visitId ? { ...a, status: newStatus } : a));
    } else {
      setNextWeekAppointmentsState(prev => prev.map(a => a.visitId === visitId ? { ...a, status: newStatus } : a));
    }
  };

  const handleAction = (type: 'recent' | 'next', visitId: string, action: string) => {
    if (action === 'Approve') {
      handleStatusChange(type, visitId, type === 'recent' ? 'In-Patient' : 'Scheduled');
    } else if (action === 'Decline') {
      handleStatusChange(type, visitId, 'Declined');
    } else if (action === 'View') {
      // Find the patient in the correct state array
      const arr = type === 'recent' ? recentAppointmentsState : nextWeekAppointmentsState;
      const patient = arr.find(a => a.visitId === visitId);
      setSelectedPatient(patient);
      setShowPatientModal(true);
    }
  };

  const filteredRecentAppointments = recentStatusFilter === 'All'
    ? recentAppointmentsState
    : recentAppointmentsState.filter(a => a.status === recentStatusFilter);
  const filteredNextWeekAppointments = nextWeekStatusFilter === 'All'
    ? nextWeekAppointmentsState
    : nextWeekAppointmentsState.filter(a => a.status === nextWeekStatusFilter);

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
            <li><Link href="/doctor/dashboard/appointments" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Appointment</Link></li>
            <li><Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Payments</Link></li>
            <li><Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Notification</Link></li>
            <li><Link href="/" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Logout</Link></li>
            <li><Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Suppliers</Link></li>
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
                    <button onClick={() => { setShowProfileModal(true); setShowProfileMenu(false); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</button>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</a>
                    <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Logout</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Welcome Card */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              Welcome back, {currentUser?.username || "Doctor"}
            </h1>
            <p className="text-base text-gray-700">Manage your appointments and patient schedules efficiently.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#f3f4f6] text-[#7b6ffb] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e5e7eb]">Export data</button>
            <button className="bg-[#7b6ffb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#5a8dee]">Create report</button>
          </div>
        </div>
        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 shadow min-h-[300px]">
          {/* Recent Appointments */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
              <select
                className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb]"
                value={recentStatusFilter}
                onChange={e => setRecentStatusFilter(e.target.value)}
              >
                {statusOptionsRecent.map(opt => (
                  <option key={`recent-${opt}`} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                    <th className="py-2 px-1">Patient</th>
                    <th className="py-2 px-1">Visit Id</th>
                    <th className="py-2 px-1">Date</th>
                    <th className="py-2 px-1">Gender</th>
                    <th className="py-2 px-1">Diseases</th>
                    <th className="py-2 px-1">Status</th>
                    <th className="py-2 px-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecentAppointments.map((a, i) => (
                    <tr key={`recent-${a.visitId}`} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-1 flex items-center gap-2">
                        <img src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt={a.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-gray-900 font-medium text-xs">{a.name}</span>
                      </td>
                      <td className="py-2 px-1 text-gray-600 text-xs">{a.visitId}</td>
                      <td className="py-2 px-1 text-gray-600 text-xs">{a.date}</td>
                      <td className="py-2 px-1 text-gray-600 text-xs">{a.gender}</td>
                      <td className="py-2 px-1 text-gray-600 text-xs">{a.disease}</td>
                      <td className="py-2 px-1 text-xs font-medium">
                        <select
                          className={`px-2 py-0.5 rounded-full text-xs border focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] ${a.status === "Out-Patient" ? "bg-blue-100 text-blue-600" : a.status === "Pending" ? "bg-yellow-100 text-yellow-600" : a.status === "In-Patient" ? "bg-green-100 text-green-600" : a.status === "Scheduled" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"}`}
                          value={a.status}
                          onChange={e => handleStatusChange('recent', a.visitId, e.target.value)}
                        >
                          {statusOptionsRecent.map(opt => (
                            <option key={`recent-${opt}`} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-1">
                        <select
                          className="px-2 py-1 rounded text-xs border focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] text-gray-700"
                          onChange={e => handleAction('recent', a.visitId, e.target.value)}
                          value=""
                        >
                          <option value="" disabled className="text-gray-400">Select Action</option>
                          {a.status === 'Pending' && <option value="Approve">Approve</option>}
                          {a.status === 'Pending' && <option value="Decline">Decline</option>}
                          <option value="View">View</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Next Week Appointments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Next Week Appointments</h2>
              <select
                className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb]"
                value={nextWeekStatusFilter}
                onChange={e => setNextWeekStatusFilter(e.target.value)}
              >
                {statusOptionsNextWeek.map(opt => (
                  <option key={`nextweek-${opt}`} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                    <th className="py-2 px-1">Patient</th>
                    <th className="py-2 px-1">Visit Id</th>
                    <th className="py-2 px-1">Date</th>
                    <th className="py-2 px-1">Gender</th>
                    <th className="py-2 px-1">Diseases</th>
                    <th className="py-2 px-1">Status</th>
                    <th className="py-2 px-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNextWeekAppointments.map((a, i) => (
                    <tr key={`nextweek-${a.visitId}`} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-1 flex items-center gap-2">
                        <img src={`https://randomuser.me/api/portraits/men/${i+40}.jpg`} alt={a.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-gray-900 font-medium text-xs">{a.name}</span>
                      </td>
                      <td className="py-2 px-1 text-gray-600 text-xs">{a.visitId}</td>
                      <td className="py-2 px-1 text-gray-600 text-xs">{a.date}</td>
                      <td className="py-2 px-1 text-gray-600 text-xs">{a.gender}</td>
                      <td className="py-2 px-1 text-gray-600 text-xs">{a.disease}</td>
                      <td className="py-2 px-1 text-xs font-medium">
                        <select
                          className={`px-2 py-0.5 rounded-full text-xs border focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] ${a.status === "Out-Patient" ? "bg-blue-100 text-blue-600" : a.status === "Pending" ? "bg-yellow-100 text-yellow-600" : a.status === "In-Patient" ? "bg-green-100 text-green-600" : a.status === "Scheduled" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"}`}
                          value={a.status}
                          onChange={e => handleStatusChange('next', a.visitId, e.target.value)}
                        >
                          {statusOptionsNextWeek.map(opt => (
                            <option key={`nextweek-${opt}`} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-1">
                        <select
                          className="px-2 py-1 rounded text-xs border focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] text-gray-700"
                          onChange={e => handleAction('next', a.visitId, e.target.value)}
                          value=""
                        >
                          <option value="" disabled className="text-gray-400">Select Action</option>
                          {a.status === 'Scheduled' && <option value="Approve">Approve</option>}
                          {a.status === 'Scheduled' && <option value="Decline">Decline</option>}
                          <option value="View">View</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-[modalIn_0.2s_ease]">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-4">
              <img src={doctorProfile.avatar} alt={doctorProfile.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#7b6ffb] shadow" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{doctorProfile.name}</h2>
                <p className="text-gray-500 text-sm mb-1">{doctorProfile.email}</p>
                <span className="inline-block bg-[#f3f4f6] text-[#7b6ffb] px-3 py-1 rounded-full text-xs font-semibold">{doctorProfile.role}</span>
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes modalIn {
              0% { opacity: 0; transform: scale(0.96); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-[modalIn_0.2s_ease]">
            <button
              onClick={() => setShowPatientModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-4">
              <img src={`https://randomuser.me/api/portraits/men/31.jpg`} alt={selectedPatient.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#7b6ffb] shadow" />
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedPatient.name}</h2>
                <div className="text-gray-500 text-sm mb-1">Visit ID: {selectedPatient.visitId}</div>
                <div className="text-gray-500 text-sm mb-1">Date: {selectedPatient.date}</div>
                <div className="text-gray-500 text-sm mb-1">Gender: {selectedPatient.gender}</div>
                <div className="text-gray-500 text-sm mb-1">Disease: {selectedPatient.disease}</div>
                <div className="text-gray-500 text-sm mb-1">Status: <span className="font-semibold text-[#7b6ffb]">{selectedPatient.status}</span></div>
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes modalIn {
              0% { opacity: 0; transform: scale(0.96); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}