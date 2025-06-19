"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DoctorLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showWelcomeCard?: boolean;
}

export default function DoctorLayout({ children, title, subtitle, showWelcomeCard = true }: DoctorLayoutProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-6">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="font-bold text-xl text-black">CareBot</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/doctor/dashboard" 
                className={`flex items-center px-4 py-2 rounded-lg ${
                  pathname === '/doctor/dashboard' ? 'bg-gray-100 text-black font-bold shadow' : 'text-black font-normal hover:bg-[rgba(113,97,239,0.6)]'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/doctor/dashboard/patients" 
                className={`flex items-center px-4 py-2 rounded-lg ${
                  pathname === '/doctor/dashboard/patients' ? 'bg-gray-100 text-black font-bold shadow' : 'text-black font-normal hover:bg-[rgba(113,97,239,0.6)]'
                }`}
              >
                Patient
              </Link>
            </li>
            <li>
              <Link 
                href="/doctor/appointments" 
                className={`flex items-center px-4 py-2 rounded-lg ${
                  pathname === '/doctor/appointments' ? 'bg-gray-100 text-black font-bold shadow' : 'text-black font-normal hover:bg-[rgba(113,97,239,0.6)]'
                }`}
              >
                Appointment
              </Link>
            </li>
            <li>
              <Link 
                href="/doctor/payments" 
                className={`flex items-center px-4 py-2 rounded-lg ${
                  pathname === '/doctor/payments' ? 'bg-gray-100 text-black font-bold shadow' : 'text-black font-normal hover:bg-[rgba(113,97,239,0.6)]'
                }`}
              >
                Payments
              </Link>
            </li>
            <li>
              <Link 
                href="/doctor/notifications" 
                className={`flex items-center px-4 py-2 rounded-lg ${
                  pathname === '/doctor/notifications' ? 'bg-gray-100 text-black font-bold shadow' : 'text-black font-normal hover:bg-[rgba(113,97,239,0.6)]'
                }`}
              >
                Notification
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]"
              >
                Logout
              </Link>
            </li>
            <li>
              <Link 
                href="/doctor/suppliers" 
                className={`flex items-center px-4 py-2 rounded-lg ${
                  pathname === '/doctor/suppliers' ? 'bg-gray-100 text-black font-bold shadow' : 'text-black font-normal hover:bg-[rgba(113,97,239,0.6)]'
                }`}
              >
                Suppliers
              </Link>
            </li>
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
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Noob" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex flex-col items-start">
                    <span className="text-gray-800 font-semibold">Noob</span>
                    <span className="text-gray-400 text-xs">Admin</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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

        {/* Welcome and stats cards */}
        {showWelcomeCard && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-1">{title}</h1>
              <p className="text-base text-gray-600">{subtitle || "Measure your advertising ROI and report website traffic."}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-[#f3f4f6] text-[#7b6ffb] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e5e7eb]">Export data</button>
              <button className="bg-[#7b6ffb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#5a8dee]">Create report</button>
            </div>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
} 