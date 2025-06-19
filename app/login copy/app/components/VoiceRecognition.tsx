"use client";
import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceRecognitionProps {
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
  onStatusChange: (status: string) => void;
}

export default function VoiceRecognition({ onTranscript, onError, onStatusChange }: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let recognition: any = null;

    const initializeSpeechRecognition = () => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onstart = () => {
            setIsListening(true);
            onError('');
            onStatusChange('Listening... You can say commands like "record my heart rate" or "set a reminder"');
          };

          recognition.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            onTranscript(transcript);
          };

          recognition.onerror = (event: any) => {
            console.error('Recognition error:', event.error);
            let errorMessage = '';
            
            switch (event.error) {
              case 'network':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
              case 'not-allowed':
                errorMessage = 'Please allow microphone access in your browser settings.';
                break;
              case 'no-speech':
                errorMessage = 'No speech detected. Please try again.';
                break;
              default:
                errorMessage = 'Error with voice recognition. Please try again.';
            }
            
            onError(errorMessage);
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
            onStatusChange('Voice recognition ended. Click the microphone to start again.');
          };

          recognition.start();
        } else {
          onError('Speech recognition is not supported in your browser. Please use Chrome.');
        }
      } catch (err) {
        console.error('Speech recognition error:', err);
        onError('Error initializing speech recognition. Please use Chrome browser.');
      }
    };

    initializeSpeechRecognition();

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      }
    };
  }, [onTranscript, onError, onStatusChange]);

  const handleStartListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          onError('');
          onStatusChange('Listening... You can say commands like "record my heart rate" or "set a reminder"');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          onTranscript(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Recognition error:', event.error);
          let errorMessage = '';
          
          switch (event.error) {
            case 'network':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            case 'not-allowed':
              errorMessage = 'Please allow microphone access in your browser settings.';
              break;
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.';
              break;
            default:
              errorMessage = 'Error with voice recognition. Please try again.';
          }
          
          onError(errorMessage);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          onStatusChange('Voice recognition ended. Click the microphone to start again.');
        };

        recognition.start();
      }
    } catch (err) {
      console.error('Error starting recognition:', err);
      onError('Error starting voice recognition. Please try again.');
      setIsListening(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleStartListening}
        disabled={isListening}
        className={`px-6 py-3 rounded-full text-white font-medium text-lg ${
          isListening 
            ? 'bg-red-500 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        } transition-colors`}
      >
        {isListening ? '🎤 Listening...' : '🎤 Start Voice Control'}
      </button>
    </div>
  );
} 