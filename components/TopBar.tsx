"use client";
import React, { useState } from "react";

export default function TopBar({ onSidebarToggle }: { onSidebarToggle?: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const notifications = [
    { id: 1, text: "New appointment booked." },
    { id: 2, text: "Doctor profile updated." },
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

  return (
    <div className="w-full px-4 py-2 bg-[#f7f8fa] flex items-center justify-center">
      <div className="w-full max-w-7xl flex items-center bg-white rounded-2xl shadow-lg px-6 py-3 gap-4">
        {/* Sidebar Toggle */}
        <button
          className="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow"
          onClick={onSidebarToggle}
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
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
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
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#377DFF" strokeWidth="2" />
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" stroke="#377DFF" strokeWidth="2" strokeLinecap="round" />
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
  );
} 