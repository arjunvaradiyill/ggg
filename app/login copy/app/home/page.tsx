"use client";
import React, { useState } from 'react';
import VoiceRecognition from '../components/VoiceRecognition';
import HealthMetrics from '../components/HealthMetrics';

// Add TypeScript declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface HealthMetric {
  type: string;
  value: string;
  timestamp: string;
}

export default function HomePage() {
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);

  // Voice command patterns
  const commandPatterns = {
    recordMetric: /(?:record|log|add)\s+(?:my|the)?\s*(?:heart rate|blood pressure|temperature|weight|blood sugar)\s*(?:is|as|at)?\s*([0-9]+(?:\/[0-9]+)?(?:\s*(?:bpm|mmHg|°F|°C|kg|lbs|mg\/dL))?)/i,
    setReminder: /(?:remind|set reminder|schedule)\s+(?:me|to)?\s*(?:to|for)?\s*(?:take|have|check)\s+(?:my|the)?\s*(?:medicine|pills|medication|blood pressure|heart rate|temperature)\s*(?:at|in)?\s*([0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm)?)/i,
    emergency: /(?:emergency|help|urgent|911|sos)/i,
    checkMetrics: /(?:show|display|check|view)\s+(?:my|the)?\s*(?:health|medical|vital)?\s*(?:metrics|readings|data|history)/i,
    scheduleAppointment: /(?:schedule|book|make)\s+(?:an|a)?\s*(?:appointment|visit)\s+(?:with|for)?\s*(?:doctor|physician|specialist)\s*(?:for|on)?\s*([a-zA-Z]+(?:\s+[0-9]{1,2})?)/i,
  };

  const processVoiceCommand = (transcript: string) => {
    transcript = transcript.toLowerCase().trim();
    console.log('Processing command:', transcript);

    // Check for emergency
    if (commandPatterns.emergency.test(transcript)) {
      handleEmergency();
      return;
    }

    // Check for metric recording
    const metricMatch = transcript.match(commandPatterns.recordMetric);
    if (metricMatch) {
      const metricType = transcript.match(/(?:heart rate|blood pressure|temperature|weight|blood sugar)/i)?.[0] || '';
      const value = metricMatch[1];
      recordHealthMetric(metricType, value);
      return;
    }

    // Check for reminder setting
    const reminderMatch = transcript.match(commandPatterns.setReminder);
    if (reminderMatch) {
      const time = reminderMatch[1];
      const action = transcript.match(/(?:take|have|check)\s+(?:my|the)?\s*(?:medicine|pills|medication|blood pressure|heart rate|temperature)/i)?.[0] || '';
      setHealthReminder(action, time);
      return;
    }

    // Check for metrics display
    if (commandPatterns.checkMetrics.test(transcript)) {
      displayHealthMetrics();
      return;
    }

    // Check for appointment scheduling
    const appointmentMatch = transcript.match(commandPatterns.scheduleAppointment);
    if (appointmentMatch) {
      const date = appointmentMatch[1];
      scheduleDoctorAppointment(date);
      return;
    }

    // If no patterns match
    setStatus("I didn't understand that command. You can say things like 'record my heart rate is 75 bpm' or 'remind me to take medicine at 2 pm'");
  };

  const handleEmergency = () => {
    setStatus("EMERGENCY MODE ACTIVATED! Calling emergency services...");
    // Add emergency service integration here
    // For demo purposes, we'll just show a message
    alert("EMERGENCY MODE: Please call 911 or your local emergency services immediately!");
  };

  const recordHealthMetric = (type: string, value: string) => {
    const newMetric: HealthMetric = {
      type,
      value,
      timestamp: new Date().toLocaleString(),
    };
    setHealthMetrics(prev => [...prev, newMetric]);
    setStatus(`Recorded ${type}: ${value}`);
  };

  const setHealthReminder = (action: string, time: string) => {
    const reminder = `${action} at ${time}`;
    setReminders(prev => [...prev, reminder]);
    setStatus(`Set reminder to ${reminder}`);
  };

  const displayHealthMetrics = () => {
    if (healthMetrics.length === 0) {
      setStatus("No health metrics recorded yet.");
      return;
    }
    setStatus("Displaying your health metrics...");
  };

  const scheduleDoctorAppointment = (date: string) => {
    setStatus(`Scheduling appointment for ${date}...`);
    // Add appointment scheduling logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Voice-Controlled Healthcare Assistant</h1>
            <p className="text-gray-600">Your personal health monitoring system</p>
          </div>

          <div className="space-y-6">
            {/* Voice Control */}
            <VoiceRecognition
              onTranscript={processVoiceCommand}
              onError={setError}
              onStatusChange={setStatus}
            />

            {/* Status and Error Messages */}
            {status && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-center">{status}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 text-center">{error}</p>
              </div>
            )}

            {/* Health Metrics and Reminders */}
            <HealthMetrics
              metrics={healthMetrics}
              reminders={reminders}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 