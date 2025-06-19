'use client';
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// Add proper type definitions at the top
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
}

interface WindowWithSpeechRecognition extends Window {
  webkitSpeechRecognition: new () => SpeechRecognition;
}

// Doctor image with gradient frame
const DoctorImage = () => {
  return (
    <div
      className="hidden md:flex items-end w-1/2 overflow-hidden z-10"
      style={{ borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}
    >
      <div
        className="relative flex items-end justify-center"
        style={{
          background: 'linear-gradient(135deg, #6ec1e4 0%, #3578e5 100%)',
          width: '480px',
          height: '570px',
          borderRadius: '50px',
          overflow: 'visible',
        }}
      >
        <Image
          src="/doctor.png"
          alt="Doctor"
          width={340}
          height={480}
          className="object-contain drop-shadow-xl"
          priority
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: 0,
            width: '100%',
            height: 'auto',
            maxHeight: '680px',
            zIndex: 2,
            borderBottomLeftRadius: '50px',
            borderBottomRightRadius: '50px',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
      </div>
    </div>
  );
};

// Decorative waves at the top left
const Waves = () => {
  return (
    <div className="absolute top-0 left-0 w-[698.8px] h-[250px]">
      <img src="/waves.png" alt="" width={698.8} height={250} />
    </div>
  );
};

// Starbursts decorations
const Starbursts = () => {
  return (
    <>
      <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '48px', left: '621px', opacity: 1 }} draggable={false} />
      <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '410px', left: '535px', opacity: 1 }} draggable={false} />
      <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '634px', left: '562px', opacity: 0.8 }} draggable={false} />
      <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '658px', left: '1091px', opacity: 0.4 }} draggable={false} />
    </>
  );
};

// Login form
type LoginFormProps = { onForgotPassword: () => void };
const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  // Voice-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = () => {
    setError("");
    setTranscript("");
    setIsRecording(true);
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        setTranscript(event.results[0][0].transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setError("Could not recognize speech. Try again.");
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      setError("Speech recognition not supported in this browser.");
      setIsRecording(false);
    }
  };
  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Import the authAPI dynamically to avoid SSR issues
      const { authAPI } = await import('./services/api');
      const response = await authAPI.login({ username, password });
      
      // Show success message
      setIsSuccess(true);
      
      // Check user role and redirect accordingly
      const user = response.user;
      let redirectPath = '/dashboard'; // Default to admin dashboard
      
      if (user.role === 'doctor') {
        redirectPath = '/doctor/dashboard';
      } else if (user.role === 'admin') {
        redirectPath = '/dashboard';
      }
      
      // Redirect after 2 seconds to show success message
      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-center relative z-10">
      <h2 className="text-[1.35rem] sm:text-2xl font-semibold mb-6 mt-2 text-left leading-tight text-[#1E1E1E]">
        Lets protect your health and together<br />with us
      </h2>
      {/* Record Voice to Fill bar */}
      <div className="flex items-center bg-[#f8fbff] border border-blue-300 rounded-lg px-4 py-3 mb-4 shadow-sm relative">
        <button
          type="button"
          className="mr-3 text-blue-400 hover:text-blue-600 focus:outline-none"
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? "Stop recording" : "Record voice to fill"}
        >
          {/* New modern mic icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21h3a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h3v-2.08A7 7 0 0 1 4 12a1 1 0 1 1 2 0 5 5 0 0 0 10 0z" />
          </svg>
        </button>
        <span className={`flex-1 text-[#1E1E1E] text-base ${isRecording ? 'animate-pulse' : ''}`}>{isRecording ? 'Listening...' : 'Record Voice to Fill'}</span>
        {(error || isRecording) && (
          <span className="ml-2 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </span>
        )}
      </div>
      {/* Transcript display */}
      {transcript && (
        <div className="mb-4">
          <label className="block text-blue-400 text-xs mb-1">Transcript</label>
          <textarea
            className="w-full rounded-lg px-3 py-2 bg-[#f8fbff] text-[#1E1E1E] border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={2}
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Transcript from voice will appear here..."
          />
        </div>
      )}
      <form
        className="space-y-6 mt-2"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#1E1E1E]">Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm bg-[#f8fbff] placeholder-[#1E1E1E] text-[#1E1E1E]"
            disabled={isLoading || isSuccess}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#1E1E1E]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm bg-[#f8fbff] placeholder-[#1E1E1E] text-[#1E1E1E]"
              disabled={isLoading || isSuccess}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-blue-500 focus:outline-none"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading || isSuccess}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.885 7.244 19.5 12 19.5c1.658 0 3.237-.314 4.646-.885M21.065 11.977A10.45 10.45 0 0021.998 12c-1.292 3.885-5.31 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.885M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center text-xs text-[#1E1E1E]">
              <input type="checkbox" className="mr-2 accent-blue-500" /> Remember me
            </label>
            <a
              href="#"
              className="text-xs text-[#1E1E1E] hover:underline"
              onClick={e => { e.preventDefault(); onForgotPassword(); }}
            >
              Forget Password?
            </a>
          </div>
        </div>
        
        {/* Success message */}
        {isSuccess && (
          <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Login successful! Redirecting to dashboard...
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className={`w-full bg-[#1886ff] text-white py-2 rounded-lg font-semibold shadow transition text-base mt-2 ${
            isLoading || isSuccess
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[#0f6cd6]'
          }`}
        >
          {isLoading ? 'Logging in...' : isSuccess ? 'Success!' : 'Submit'}
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-blue-400 py-2 rounded-lg font-semibold text-blue-700 bg-white hover:bg-blue-50 transition text-base"
          disabled={isLoading || isSuccess}
        >
          {/* Google SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.07-10.34 7.07-17.676z" fill="#4285F4" />
              <path d="M24.48 48c6.48 0 11.94-2.14 15.92-5.82l-7.74-6.06c-2.14 1.44-4.88 2.3-8.18 2.3-6.28 0-11.6-4.24-13.5-9.96H2.6v6.24C6.56 43.98 14.8 48 24.48 48z" fill="#34A853" />
              <path d="M10.98 28.46A14.98 14.98 0 019.1 24c0-1.56.28-3.08.78-4.46v-6.24H2.6A23.98 23.98 0 000 24c0 3.98.96 7.74 2.6 11.24l8.38-6.78z" fill="#FBBC05" />
              <path d="M24.48 9.54c3.54 0 6.68 1.22 9.16 3.62l6.84-6.84C36.42 2.14 30.96 0 24.48 0 14.8 0 6.56 4.02 2.6 10.76l8.38 6.24c1.9-5.72 7.22-9.96 13.5-9.96z" fill="#EA4335" />
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Sign in with Google
        </button>
        
        {/* Demo credentials info */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Demo credentials: <strong>admin@carebot.com</strong> / <strong>admin123</strong>
          </p>
        </div>
      </form>
    </div>
  );
};

// OTP Verification Page
const OtpVerification = ({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus next input on change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    setError("");
    // Move to next input
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (paste.length === 6) {
      setOtp(paste.split(""));
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(d => d === "")) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    setResent(true);
    setTimeout(() => setResent(false), 2000);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-0 sm:p-4 relative overflow-hidden">
      <div
        className="relative flex flex-col md:flex-row bg-white shadow-2xl z-10 overflow-hidden"
        style={{ width: '1160px', height: '709px', borderRadius: '50px' }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-[698.8px] h-[250px]">
          <img src="/waves.png" alt="" width={698.8} height={250} />
        </div>
        {/* Starbursts */}
        <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '48px', left: '621px', opacity: 1 }} draggable={false} />
        <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '410px', left: '535px', opacity: 1 }} draggable={false} />
        <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '634px', left: '562px', opacity: 0.8 }} draggable={false} />
        <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '658px', left: '1091px', opacity: 0.4 }} draggable={false} />
        {/* Left: Doctor Image with gradient frame */}
        <div
          className="flex flex-col justify-end w-[48%] h-full relative z-10"
        >
          <div
            className="relative flex items-end justify-center"
            style={{
              width: '520px',
              height: '520px',
              background: 'linear-gradient(135deg, #6ec1e4 0%, #3578e5 100%)',
              borderBottomLeftRadius: '40px',
              borderBottomRightRadius: '40px',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              overflow: 'visible',
            }}
          >
            <img
              src="/doctor3.png"
              alt="Doctor"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 0,
                width: '100%',
                height: 'auto',
                maxHeight: '1020px',
                zIndex: 2,
                borderBottomLeftRadius: '40px',
                borderBottomRightRadius: '40px',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
        {/* Right: OTP Form */}
        <div className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-center relative z-10">
          <h1 className="text-4xl font-extrabold text-black mb-2 leading-tight text-center">Enter Your OTP</h1>
          <p className="mb-2 text-lg text-black leading-snug text-center">
            Enter the one-time password we have sent to your email address.
          </p>
          <p className="mb-6 text-gray-500 text-base text-center">we have send the code to xxxx@gmail.com</p>
          <form className="flex flex-col items-center" onSubmit={handleSubmit} autoComplete="off">
            <div className="flex gap-4 mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e, idx)}
                  onPaste={handlePaste}
                  className="w-16 h-16 text-3xl text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white text-black"
                  style={{ boxShadow: '0 2px 8px #3578e511' }}
                />
              ))}
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className="text-gray-500">Didn&apos;t receive OTP code?</span>
              <button type="button" className="text-[#1886ff] font-semibold hover:underline" onClick={handleResend} disabled={resent}>{resent ? 'Sent!' : 'Resend code'}</button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1886ff] text-white py-3 rounded-lg font-bold shadow hover:bg-[#0f6cd6] transition text-base mb-3"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              type="button"
              className="w-full border border-blue-400 py-3 rounded-lg font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base"
              onClick={onBack}
            >
              Back
            </button>
          </form>
        </div>
        {/* Curly lines bottom right */}
        <img src="/curly.png" alt="" className="absolute right-0 bottom-0 w-[180px] h-[140px] pointer-events-none select-none" style={{zIndex: 1}} aria-hidden="true" />
      </div>
    </div>
  );
};

// Forgot Password Modal
type ForgotPasswordModalProps = { onClose: () => void, onOtp: () => void };
const ForgotPasswordModal = ({ onClose, onOtp }: ForgotPasswordModalProps) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!username) {
      setError('Please enter your username');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onOtp(); // Show OTP page
    } catch {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#eaf4ff] bg-opacity-80">
      <section
        className="relative flex flex-row bg-white shadow-2xl shadow-[0_8px_40px_0_#3578e533,0_1.5px_8px_0_#3578e511] overflow-hidden"
        style={{ width: '950px', height: '540px', borderRadius: '50px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl text-blue-400 hover:text-blue-600 focus:outline-none z-20"
          aria-label="Close"
          style={{lineHeight: 1}}
        >
          ×
        </button>
        {/* Waves background - anchored top left, not stretched */}
        <div className="absolute top-0 left-0 w-[500px] h-[180px] z-0" aria-hidden="true">
          <img src="/waves.png" alt="" width={500} height={180} className="object-contain" />
        </div>
        {/* Starbursts */}
        <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '38px', left: '60%', opacity: 1, zIndex: 2 }} draggable={false} aria-hidden="true" />
        <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '410px', left: '55%', opacity: 1, zIndex: 2 }} draggable={false} aria-hidden="true" />
        <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '440px', left: '90%', opacity: 0.7, zIndex: 2 }} draggable={false} aria-hidden="true" />
        {/* Left: Doctor image with gradient frame (modal-specific, head overlaps) */}
        <div className="flex flex-col justify-end w-[48%] h-full relative z-10">
          <div
            className="relative flex items-end justify-center"
            style={{
              width: '370px',
              height: '470px',
              background: 'linear-gradient(135deg, #6ec1e4 0%, #3578e5 100%)',
              borderBottomLeftRadius: '40px',
              borderBottomRightRadius: '40px',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              overflow: 'visible',
            }}
          >
            <img
              src="/doctor2.png"
              alt="Doctor"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 0,
                width: '100%',
                height: 'auto',
                maxHeight: '520px',
                zIndex: 2,
                borderBottomLeftRadius: '40px',
                borderBottomRightRadius: '40px',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              className="object-contain"
            />
          </div>
        </div>
        {/* Right: Form */}
        <div className="flex items-center justify-center w-[52%] h-full px-12 z-10">
          <div className="w-full max-w-md">
            <h1 id="forgot-password-title" className="text-4xl font-extrabold text-black mb-2 leading-tight text-center whitespace-nowrap">
              Forget Your Password?
            </h1>
            <p className="mb-8 text-lg text-black text-center">
              Enter the email id associated with your account.
            </p>
            <form onSubmit={handleSubmit} className="w-full space-y-6" autoComplete="off" noValidate>
              <div>
                <label htmlFor="username" className="block text-base font-bold mb-1 text-black">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your Username"
                  className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-white placeholder-[#1E1E1E] text-[#1E1E1E]"
                  required
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'username-error' : undefined}
                  autoComplete="username"
                />
                {error && (
                  <p id="username-error" className="mt-1 text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1886ff] text-white py-3 rounded-lg font-bold shadow hover:bg-[#0f6cd6] transition text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'submit'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full border border-blue-400 py-3 rounded-lg font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
        {/* Curly lines bottom right */}
        <img src="/curly.png" alt="" className="absolute right-0 bottom-0 w-[180px] h-[140px] pointer-events-none select-none" style={{zIndex: 1}} aria-hidden="true" />
      </section>
    </div>
  );
};

// Reusable status modal
const StatusModal = ({ message, icon, onClose }: { message: React.ReactNode, icon: React.ReactNode, onClose: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center">
    <div
      className="relative flex flex-col items-center justify-center bg-white shadow-2xl"
      style={{ width: 420, height: 260, borderRadius: 32, boxShadow: '0 0 24px 4px #1886ff33' }}
    >
      {/* Subtle background pattern */}
      <img src="/waves.png" alt="" className="absolute left-0 top-0 w-2/3 h-2/3 opacity-20 pointer-events-none select-none" style={{borderTopLeftRadius: 32}} />
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-2xl text-blue-400 hover:text-blue-600 focus:outline-none"
        aria-label="Close"
        style={{lineHeight: 1}}
      >
        ×
      </button>
      {/* Icon */}
      <div className="mt-10 mb-4">{icon}</div>
      <div className="text-center text-[1.35rem] font-bold text-[#1886ff] leading-tight">{message}</div>
    </div>
  </div>
);

const NewPasswordPage = ({ onBack }: { onBack: () => void }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Simulate success
    setSuccess(true);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-0 sm:p-4 relative overflow-hidden" style={{ background: 'rgba(222, 237, 255, 1)' }}>
      {/* YouTube video background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/1bX_OHSJMwk?autoplay=1&mute=1&loop=1&playlist=1bX_OHSJMwk&controls=0&showinfo=0&modestbranding=1&rel=0"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full object-cover"
          style={{ pointerEvents: 'none', filter: 'brightness(0.7)' }}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white bg-opacity-40 z-10" />
      </div>
      <div
        className="relative flex flex-col md:flex-row bg-white shadow-2xl z-10 overflow-hidden"
        style={{ width: '1160px', height: '709px', borderRadius: '50px' }}
      >
        {/* Decorative elements */}
        <Waves />
        <Starbursts />
        {/* Left: Doctor Image with gradient frame */}
        <DoctorImage />
        {/* Right: Form */}
        <div className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-center relative z-10">
          <h1 className="text-4xl font-extrabold text-black mb-2 leading-tight">Enter New Password</h1>
          <p className="mb-6 text-lg text-black">enter your new strong password and confirm it.</p>
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-base font-bold mb-1 text-black">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-white placeholder-[#1E1E1E] text-[#1E1E1E]"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-blue-500 focus:outline-none"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.885 7.244 19.5 12 19.5c1.658 0 3.237-.314 4.646-.885M21.065 11.977A10.45 10.45 0 0021.998 12c-1.292 3.885-5.31 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.885M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-base font-bold mb-1 text-black">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-white placeholder-[#1E1E1E] text-[#1E1E1E]"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-blue-500 focus:outline-none"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.885 7.244 19.5 12 19.5c1.658 0 3.237-.314 4.646-.885M21.065 11.977A10.45 10.45 0 0021.998 12c-1.292 3.885-5.31 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.885M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#006aff] text-white py-2 rounded-lg font-bold shadow hover:bg-[#0051c7] transition text-base"
            >
              Verify & Continue
            </button>
            <button
              type="button"
              className="w-full border border-blue-400 py-2 rounded-lg font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base"
              onClick={onBack}
            >
              Back
            </button>
          </form>
        </div>
        {/* Status Modal as popup over card */}
        {success && (
          <StatusModal
            onClose={onBack}
            icon={
              <img src="/icon-park-outline_success.png" alt="Success" width={48} height={48} className="mx-auto mb-2" />
            }
            message={<><span>Password changed<br />successfully</span></>}
          />
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-0 sm:p-4 relative overflow-hidden" style={{ background: 'rgba(222, 237, 255, 1)' }}>
      {/* YouTube video background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/1bX_OHSJMwk?autoplay=1&mute=1&loop=1&playlist=1bX_OHSJMwk&controls=0&showinfo=0&modestbranding=1&rel=0"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full object-cover"
          style={{ pointerEvents: 'none', filter: 'brightness(0.7)' }}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white bg-opacity-40 z-10" />
      </div>
      {/* Card container or modal/otp/new password */}
      {!showForgotPassword && !showOtp && !showNewPassword && (
        <div
          className="relative flex flex-col md:flex-row bg-white shadow-2xl z-10 overflow-hidden"
          style={{
            width: '1160px',
            height: '709px',
            borderRadius: '50px',
          }}
        >
          {/* Decorative elements */}
          <Waves />
          <Starbursts />
          {/* Left: Doctor Image with gradient frame */}
          <DoctorImage />
          {/* Right: Login Form */}
          <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
        </div>
      )}
      {showForgotPassword && !showOtp && !showNewPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} onOtp={() => { setShowForgotPassword(false); setShowOtp(true); }} />
      )}
      {showOtp && !showNewPassword && (
        <OtpVerification onBack={() => { setShowOtp(false); setShowForgotPassword(true); }} onSuccess={() => { setShowOtp(false); setShowNewPassword(true); }} />
      )}
      {showNewPassword && (
        <NewPasswordPage onBack={() => { setShowNewPassword(false); setShowOtp(true); }} />
      )}
      <Head>
        <meta name="description" content="Your page description here." />
      </Head>
    </div>
  );
};

export default Home;