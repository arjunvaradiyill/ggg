"use client";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import api, { DashboardStats, Appointment, authAPI, getDashboardStats, getRecentAppointments } from '@/app/services/api';
import PatientSatisfaction from '../components/PatientSatisfaction';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import AuthCheck from '../components/AuthCheck';

const statusColors = {
  completed: "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, appointments] = await Promise.all([
          getDashboardStats(),
          getRecentAppointments()
        ]);
        setDashboardStats(stats);
        setRecentAppointments(appointments);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <AuthCheck requiredRole="admin">
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
                <Link href="/dashboard" className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-black font-bold shadow">
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
                  Patients
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
                  Appointments
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <TopBar />
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Welcome, {currentUser?.username || "Admin"}!
            </h1>
            <p className="text-base text-gray-600">Here are your most recent appointments.</p>
          </div>
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="12" r="3.5" stroke="#fff" strokeWidth="2"/></svg>
                  Total Patients
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold">{dashboardStats?.total_patients || 0}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Total Doctors
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold">{dashboardStats?.total_doctors || 0}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Total Appointments
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold">{dashboardStats?.total_appointments || 0}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Completed
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold">{dashboardStats?.completed_appointments || 0}</span>
              </div>
            </div>
          </div>
          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
              <Link href="/dashboard/appointments" className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {appointment.patient.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.patient.name}</h3>
                        <p className="text-sm text-gray-600">{appointment.doctor.name} • {appointment.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{appointment.date}</p>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[appointment.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent appointments found.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  );
}
