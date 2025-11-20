'use client';

import { useState, useEffect, useRef } from 'react';

type CaptchaType = 'text' | 'date';

export default function Home() {
  const [captcha, setCaptcha] = useState('');
  const [captchaType, setCaptchaType] = useState<CaptchaType>('text');
  const [input, setInput] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random date CAPTCHA
  const generateDateCaptcha = () => {
    // Generate a random date (from the last 10 years)
    const currentYear = new Date().getFullYear();
    const randomYear = currentYear - Math.floor(Math.random() * 10);
    const randomMonth = Math.floor(Math.random() * 12) + 1; // 1-12
    const daysInMonth = new Date(randomYear, randomMonth, 0).getDate();
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1; // 1-28/29/30/31
    
    const day = randomDay.toString().padStart(2, '0');
    const month = randomMonth.toString().padStart(2, '0');
    const year = randomYear.toString();
    
    // Randomly select separator: /, ., -, or space
    const separators = ['/', '.', '-', ' '];
    const separator = separators[Math.floor(Math.random() * separators.length)];
    
    return `${day}${separator}${month}${separator}${year}`;
  };

  // Generate random CAPTCHA (6 characters - mixed letters and numbers)
  const generateTextCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Select and generate random CAPTCHA type
  const generateRandomCaptcha = (): { value: string; type: CaptchaType } => {
    const isDate = Math.random() < 0.5; // 50% chance
    if (isDate) {
      return { value: generateDateCaptcha(), type: 'date' };
    } else {
      return { value: generateTextCaptcha(), type: 'text' };
    }
  };

  // Apply theme
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  // Theme management - read from localStorage and apply
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Generate CAPTCHA when page loads or refreshes
  useEffect(() => {
    const newCaptcha = generateRandomCaptcha();
    setCaptcha(newCaptcha.value);
    setCaptchaType(newCaptcha.type);
  }, []);

  // Timer function
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Validate date CAPTCHA (with or without separators)
  const validateDateCaptcha = (userInput: string, correctDate: string) => {
    // Remove separators
    const normalizeInput = userInput.replace(/[\/\.\-\s]/g, '');
    const normalizeCorrect = correctDate.replace(/[\/\.\-\s]/g, '');
    
    // Exact match check
    if (normalizeInput === normalizeCorrect) {
      return true;
    }
    
    // Exact match check with separators
    if (userInput === correctDate) {
      return true;
    }
    
    return false;
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(false);
    
    let isValid = false;
    
    if (captchaType === 'date') {
      isValid = validateDateCaptcha(input.trim(), captcha);
    } else {
      isValid = input === captcha;
    }
    
    if (isValid) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setInput('');
      const newCaptcha = generateRandomCaptcha();
      setCaptcha(newCaptcha.value);
      setCaptchaType(newCaptcha.type);
      setSeconds(0);
      setIsRunning(true);
    }
  };

  // Start new CAPTCHA
  const handleNewCaptcha = () => {
    setIsCorrect(false);
    setInput('');
    const newCaptcha = generateRandomCaptcha();
    setCaptcha(newCaptcha.value);
    setCaptchaType(newCaptcha.type);
    setSeconds(0);
    setIsRunning(true);
  };

  // Submit with Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  // Format seconds (mm:ss)
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 relative">
          {/* New CAPTCHA Button */}
          <button
            onClick={handleNewCaptcha}
            className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold text-sm transition-colors flex items-center gap-2"
            aria-label="New CAPTCHA"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Timer */}
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {formatTime(seconds)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Time</p>
          </div>

          {/* CAPTCHA */}
          <div className="text-center space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600">
              <div className={`font-mono font-bold tracking-widest text-gray-800 dark:text-gray-200 select-none ${
                captchaType === 'date' ? 'text-2xl' : 'text-4xl'
              }`}>
                {captcha}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {captchaType === 'date' 
                ? 'Enter the date above (with or without separators)' 
                : 'Enter the code above'}
            </p>
          </div>

          {/* Success Message */}
          {isCorrect && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-400 rounded-lg p-4 text-center space-y-3">
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                Correct! CAPTCHA verified successfully.
              </p>
              <p className="text-sm text-green-600 dark:text-green-500">
                Time: {formatTime(seconds)}
              </p>
              <button
                onClick={handleNewCaptcha}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                New CAPTCHA
              </button>
            </div>
          )}

          {/* Form */}
          {!isCorrect && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={captchaType === 'date' ? 'Enter the date (e.g., 15/01/2025 or 15012025)' : 'Enter the CAPTCHA code'}
                  className="w-full px-4 py-3 text-center text-lg font-mono border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  maxLength={captchaType === 'date' ? 10 : 6}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
