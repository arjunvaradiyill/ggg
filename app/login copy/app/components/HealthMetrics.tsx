"use client";
import React from 'react';

interface HealthMetric {
  type: string;
  value: string;
  timestamp: string;
}

interface HealthMetricsProps {
  metrics: HealthMetric[];
  reminders: string[];
}

export default function HealthMetrics({ metrics, reminders }: HealthMetricsProps) {
  return (
    <div className="space-y-6">
      {/* Health Metrics Display */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Health Metrics</h2>
        {metrics.length > 0 ? (
          <div className="space-y-2">
            {metrics.slice(-5).map((metric, index) => (
              <div key={index} className="bg-white p-3 rounded shadow">
                <p className="font-medium">{metric.type}</p>
                <p className="text-gray-600">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.timestamp}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No health metrics recorded yet</p>
        )}
      </div>

      {/* Reminders Display */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Active Reminders</h2>
        {reminders.length > 0 ? (
          <div className="space-y-2">
            {reminders.map((reminder, index) => (
              <div key={index} className="bg-white p-3 rounded shadow">
                <p className="text-gray-800">{reminder}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No active reminders</p>
        )}
      </div>

      {/* Voice Command Examples */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Voice Command Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Health Metrics</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>"Record my heart rate is 75 bpm"</li>
              <li>"Log blood pressure 120/80"</li>
              <li>"Add temperature 98.6"</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Reminders</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>"Remind me to take medicine at 2 pm"</li>
              <li>"Set reminder for blood pressure at 9 am"</li>
              <li>"Schedule check temperature in 2 hours"</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Appointments</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>"Schedule appointment with doctor for Monday"</li>
              <li>"Book visit with specialist on Friday"</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Other Commands</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>"Show my health metrics"</li>
              <li>"Display medical history"</li>
              <li>"Emergency" (for urgent situations)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 