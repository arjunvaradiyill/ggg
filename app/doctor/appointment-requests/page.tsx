"use client";
import React, { useState } from "react";
import Link from "next/link";
import DoctorLayout from "@/app/components/DoctorLayout";

interface AppointmentRequest {
  id: number;
  name: string;
  gender: string;
  age: number;
  time: string;
  date: string;
  status: string;
  reason: string;
  contact: string;
  notes?: string;
  previousVisits?: number;
  preferredTime?: string;
}

const initialAppointmentRequests: AppointmentRequest[] = [
  { 
    id: 1, 
    name: "Floyd Miles", 
    gender: "Male", 
    age: 46, 
    time: "14:00 PM", 
    date: "12.09.2019", 
    status: "Pending", 
    reason: "Regular checkup", 
    contact: "+1 234 567 890",
    notes: "Patient requested morning appointment if possible",
    previousVisits: 3,
    preferredTime: "Morning"
  },
  { 
    id: 2, 
    name: "Floyd Miles", 
    gender: "Male", 
    age: 46, 
    time: "14:00 PM", 
    date: "12.09.2019", 
    status: "Confirmed", 
    reason: "Regular checkup", 
    contact: "+1 234 567 890",
    notes: "Follow-up from last visit",
    previousVisits: 5,
    preferredTime: "Afternoon"
  },
  { 
    id: 3, 
    name: "Floyd Miles", 
    gender: "Male", 
    age: 46, 
    time: "14:00 PM", 
    date: "12.09.2019", 
    status: "Confirmed", 
    reason: "Regular checkup", 
    contact: "+1 234 567 890",
    notes: "Patient requested rescheduling",
    previousVisits: 2,
    preferredTime: "Evening"
  },
  { 
    id: 4, 
    name: "Floyd Miles", 
    gender: "Male", 
    age: 46, 
    time: "14:00 PM", 
    date: "12.09.2019", 
    status: "Pending", 
    reason: "Regular checkup", 
    contact: "+1 234 567 890",
    notes: "New patient",
    previousVisits: 0,
    preferredTime: "Morning"
  },
  { 
    id: 5, 
    name: "Floyd Miles", 
    gender: "Male", 
    age: 46, 
    time: "14:00 PM", 
    date: "12.09.2019", 
    status: "Pending", 
    reason: "Regular checkup", 
    contact: "+1 234 567 890",
    notes: "Urgent consultation needed",
    previousVisits: 1,
    preferredTime: "Afternoon"
  },
];

export default function AppointmentRequestsPage() {
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>(initialAppointmentRequests);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleConfirmAppointment = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setShowConfirmModal(true);
  };

  const handleViewDetails = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleReschedule = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setNewDate(request.date);
    setNewTime(request.time);
    setShowRescheduleModal(true);
  };

  const confirmAppointment = () => {
    if (selectedRequest) {
      setAppointmentRequests(prev => 
        prev.map(request => 
          request.id === selectedRequest.id 
            ? { ...request, status: "Confirmed" }
            : request
        )
      );
      setShowConfirmModal(false);
      setSelectedRequest(null);
    }
  };

  const rescheduleAppointment = () => {
    if (selectedRequest && newDate && newTime) {
      setAppointmentRequests(prev => 
        prev.map(request => 
          request.id === selectedRequest.id 
            ? { ...request, date: newDate, time: newTime }
            : request
        )
      );
      setShowRescheduleModal(false);
      setSelectedRequest(null);
      setNewDate("");
      setNewTime("");
    }
  };

  const filteredAppointments = appointmentRequests.filter(appointment => {
    const matchesStatus = statusFilter === "All" || appointment.status === statusFilter;
    const matchesDate = dateFilter === "All" || appointment.date === dateFilter;
    const matchesGender = genderFilter === "All" || appointment.gender === genderFilter;
    const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDate && matchesGender && matchesSearch;
  });

  return (
    <DoctorLayout 
      title="Appointment Requests"
      subtitle="View and manage appointment requests"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:ring-blue-300 focus:border-blue-300"
          >
            <option value="All" className="text-gray-900">All Status</option>
            <option value="Pending" className="text-gray-900">Pending</option>
            <option value="Confirmed" className="text-gray-900">Confirmed</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:ring-blue-300 focus:border-blue-300"
          >
            <option value="All" className="text-gray-900">All Dates</option>
            <option value="12.09.2019" className="text-gray-900">September 12, 2019</option>
            <option value="13.09.2019" className="text-gray-900">September 13, 2019</option>
          </select>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:ring-blue-300 focus:border-blue-300"
          >
            <option value="All" className="text-gray-900">All Gender</option>
            <option value="Male" className="text-gray-900">Male</option>
            <option value="Female" className="text-gray-900">Female</option>
          </select>
          <input
            type="text"
            placeholder="Search by name or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 flex-1 min-w-[200px]"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img src={`https://randomuser.me/api/portraits/men/${appointment.id + 30}.jpg`} alt={appointment.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-gray-900">{appointment.name}</div>
                        <div className="text-xs text-gray-600">{appointment.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{appointment.gender}</td>
                  <td className="py-3 px-4 text-gray-600">{appointment.age}</td>
                  <td className="py-3 px-4 text-gray-600">{appointment.time}</td>
                  <td className="py-3 px-4 text-gray-600">{appointment.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "Confirmed" ? "bg-green-100 text-green-600" :
                      "bg-yellow-100 text-yellow-600"
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View
                      </button>
                      {appointment.status === "Pending" && (
                        <button
                          onClick={() => handleConfirmAppointment(appointment)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          Confirm
                        </button>
                      )}
                      {appointment.status === "Confirmed" && (
                        <button
                          onClick={() => handleReschedule(appointment)}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          Reschedule
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Appointment</h2>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">Are you sure you want to confirm the appointment for {selectedRequest.name}?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAppointment}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={`https://randomuser.me/api/portraits/men/${selectedRequest.id + 30}.jpg`} alt={selectedRequest.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRequest.name}</h3>
                  <p className="text-gray-600">{selectedRequest.contact}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-900">{selectedRequest.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-gray-900">{selectedRequest.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Previous Visits</p>
                  <p className="text-gray-900">{selectedRequest.previousVisits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Time</p>
                  <p className="text-gray-900">{selectedRequest.preferredTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Reason for Visit</p>
                  <p className="text-gray-900">{selectedRequest.reason}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-gray-900">{selectedRequest.notes}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Reschedule Appointment</h2>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedRequest(null);
                  setNewDate("");
                  setNewTime("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">Reschedule appointment for {selectedRequest.name}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-gray-900"
                  >
                    <option value="">Select time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                    <option value="12:00 AM">12:00 AM</option>
                    <option value="01:00 AM">01:00 AM</option>
                    <option value="02:00 AM">02:00 AM</option>
                    <option value="03:00 AM">03:00 AM</option>
                    <option value="04:00 AM">04:00 AM</option>
                    <option value="05:00 AM">05:00 AM</option>
                    <option value="06:00 AM">06:00 AM</option>
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedRequest(null);
                    setNewDate("");
                    setNewTime("");
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={rescheduleAppointment}
                  disabled={!newDate || !newTime}
                  className={`px-4 py-2 bg-purple-600 text-white rounded-lg font-medium ${
                    !newDate || !newTime ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                  }`}
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
} 