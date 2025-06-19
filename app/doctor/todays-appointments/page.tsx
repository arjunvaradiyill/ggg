"use client";
import React, { useState } from "react";
import Link from "next/link";
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import 'react-calendar/dist/Calendar.css';
import DoctorLayout from "@/app/components/DoctorLayout";

const todaysAppointments = [
  { id: 1, name: "Floyd Miles", clinic: "Clinic Consulting", time: "12:30", duration: "30 min", status: "Ongoing", reason: "Regular checkup", notes: "Patient requested follow-up", contact: "+1 234 567 890" },
  { id: 2, name: "Floyd Miles", clinic: "Clinic Consulting", time: "14:00", duration: "45 min", status: "Waiting", reason: "Regular checkup", notes: "Patient requested follow-up", contact: "+1 234 567 890" },
  { id: 3, name: "Floyd Miles", clinic: "Clinic Consulting", time: "15:30", duration: "30 min", status: "Scheduled", reason: "Regular checkup", notes: "Patient requested follow-up", contact: "+1 234 567 890" },
];

const nextWeekAppointments = [
  { id: 4, name: "Sarah Wilson", clinic: "Clinic Consulting", date: "Mon, 15 Apr", time: "10:00", duration: "30 min", status: "Scheduled", reason: "Follow-up", notes: "Regular checkup", contact: "+1 234 567 891" },
  { id: 5, name: "John Davis", clinic: "Clinic Consulting", date: "Wed, 17 Apr", time: "14:30", duration: "45 min", status: "Scheduled", reason: "Consultation", notes: "New patient", contact: "+1 234 567 892" },
  { id: 6, name: "Emma Thompson", clinic: "Clinic Consulting", date: "Fri, 19 Apr", time: "11:00", duration: "30 min", status: "Scheduled", reason: "Check-up", notes: "Regular patient", contact: "+1 234 567 893" },
];

const recentPatientAppointments = [
  { id: 1, name: "Floyd Miles", date: "12.09.2019", status: "Out-Patient" },
  { id: 2, name: "Sarah Wilson", date: "13.09.2019", status: "Pending" },
  { id: 3, name: "John Davis", date: "14.09.2019", status: "In-Patient" },
];

export default function TodaysAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState(todaysAppointments);

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };

  const filteredAppointments = appointments.filter(appointment => {
    return appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           appointment.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
           appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-600';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-600';
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'Cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DoctorLayout 
      title="Today's Appointments"
      subtitle="View and manage your appointments for today"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <style jsx global>{`
              .react-calendar {
                width: 100%;
                border: none;
                background: transparent;
              }
              .react-calendar__navigation {
                margin-bottom: 1em;
              }
              .react-calendar__navigation button {
                min-width: 44px;
                background: none;
                font-size: 16px;
                margin-top: 8px;
                color: #374151;
              }
              .react-calendar__navigation button:enabled:hover,
              .react-calendar__navigation button:enabled:focus {
                background-color: #f3f4f6;
                border-radius: 6px;
              }
              .react-calendar__navigation button[disabled] {
                background-color: #f3f4f6;
                color: #9ca3af;
              }
              .react-calendar__month-view__weekdays {
                text-transform: none;
                font-size: 12px;
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
                padding: 8px 0;
                font-size: 14px;
                color: #1F2937;
              }
              .react-calendar__tile--now {
                background: #F3F4F6;
                border-radius: 6px;
                color: #1F2937;
              }
              .react-calendar__tile--active {
                background: #EEF2FF;
                color: #7B6FFB;
                border-radius: 6px;
                font-weight: 500;
              }
              .react-calendar__tile--active:enabled:hover,
              .react-calendar__tile--active:enabled:focus {
                background: #EEF2FF;
              }
              .react-calendar__tile:enabled:hover,
              .react-calendar__tile:enabled:focus {
                background: #F9FAFB;
                border-radius: 6px;
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
              value={selectedDate}
              className="border-none w-full"
              tileClassName="text-xs p-1"
              formatShortWeekday={(locale, date) => 
                date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2)
              }
              prevLabel={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>}
              nextLabel={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
              minDetail="month"
              maxDetail="month"
              showNeighboringMonth={false}
              tileContent={({ date: tileDate }) => {
                const hasAppointment = todaysAppointments.some(app => 
                  new Date(app.time).toDateString() === tileDate.toDateString()
                );
                return hasAppointment ? (
                  <div className="w-1 h-1 bg-[#7b6ffb] rounded-full mx-auto mt-1 opacity-75" />
                ) : null;
              }}
            />
          </div>
          {/* Next week black box */}
          <div className="mt-4">
            <div className="bg-black rounded-2xl p-6 flex flex-col gap-1 relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold text-white">Next week</div>
                  <div className="text-sm text-gray-400 mt-1">Upcoming Schedules</div>
                </div>
                <span className="bg-[#7b6ffb] text-white text-sm font-semibold px-4 py-1 rounded-lg">open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Appointments</h2>
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-blue-300 focus:border-blue-300 w-64"
              />
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://randomuser.me/api/portraits/men/${appointment.id + 30}.jpg`}
                      alt={appointment.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.name}</h3>
                      <p className="text-sm text-gray-500">{appointment.clinic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-sm text-gray-500">{appointment.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)} border-0 focus:ring-2 focus:ring-offset-2 focus:ring-[#7b6ffb]`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Week Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Week's Appointments</h2>
        <div className="bg-gray-900 rounded-2xl p-6">
          <div className="space-y-4">
            {nextWeekAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`https://randomuser.me/api/portraits/${appointment.id % 2 === 0 ? 'women' : 'men'}/${appointment.id + 30}.jpg`}
                    alt={appointment.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-white">{appointment.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-400">{appointment.clinic}</p>
                      <span className="text-gray-500">•</span>
                      <p className="text-sm text-gray-400">{appointment.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-white">{appointment.time}</p>
                    <p className="text-sm text-gray-400">{appointment.duration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-white border-0 focus:ring-2 focus:ring-offset-2 focus:ring-[#7b6ffb]"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Waiting">Waiting</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Patient Appointments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Patient Appointments</h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="divide-y divide-gray-200">
            {recentPatientAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://randomuser.me/api/portraits/men/${appointment.id + 30}.jpg`}
                    alt={appointment.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{appointment.name}</div>
                    <div className="text-sm text-gray-500">{appointment.date}</div>
                  </div>
                </div>
                <span className={
                  appointment.status === 'Out-Patient' ? 'bg-blue-100 text-blue-700' :
                  appointment.status === 'In-Patient' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                + ' px-3 py-1 rounded-full text-xs font-medium'}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={`https://randomuser.me/api/portraits/men/${selectedAppointment.id + 30}.jpg`}
                  alt={selectedAppointment.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedAppointment.name}</h3>
                  <p className="text-sm text-gray-500">{selectedAppointment.clinic}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Reason for Visit</p>
                <p className="text-gray-900">{selectedAppointment.reason}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-900">{selectedAppointment.notes}</p>
              </div>

              {selectedAppointment.status === "Scheduled" && (
                <button className="w-full bg-[#7b6ffb] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6a5de8]">
                  Start Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
} 