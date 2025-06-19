"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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

const statusColors = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
  "In Transit": "bg-blue-100 text-blue-700",
};

export default function DoctorPatientsDashboard() {
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const handleDateChange = (value: any) => {
    if (value instanceof Date) setDate(value);
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
                <span className="text-base font-semibold text-gray-800">
                  {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
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
              </div>
            </div>
          </div>
        </div>
        {/* Full Patients Table Section */}
        <div className="mt-8">
          {/* Patients Heading, Tabs, Filter Bar */}
          {/* ...copy from /dashboard/patients/page.tsx... */}

          {/* Patients Table */}
          {/* ...copy from /dashboard/patients/page.tsx... */}
        </div>
      </main>
    </div>
  );
} 