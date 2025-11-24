'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../TimerContext';

interface TodayDateCaptchaModalProps {
  onSuccess: () => void;
}

type CaptchaType = 'date' | 'date-numpad';

export function TodayDateCaptchaModal({ onSuccess }: TodayDateCaptchaModalProps) {
  const { startCaptchaTimer, stopCaptchaTimer } = useTimer();
  const [captcha, setCaptcha] = useState('');
  const [captchaType, setCaptchaType] = useState<CaptchaType>('date');
  const [input, setInput] = useState('');
  const [numpadInput, setNumpadInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate today's date CAPTCHA
  const generateTodayDateCaptcha = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    
    const separators = ['/', '.', '-', ' '];
    const separator = separators[Math.floor(Math.random() * separators.length)];
    
    return `${day}${separator}${month}${separator}${year}`;
  };

  // Generate today's date for numpad (always uses / separator)
  const generateTodayDateNumpadCaptcha = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    
    return `${day}/${month}/${year}`;
  };

  // Select and generate random CAPTCHA type (but always today's date)
  const generateRandomCaptcha = (): { value: string; type: CaptchaType } => {
    const rand = Math.random();
    if (rand < 0.5) {
      return { value: generateTodayDateCaptcha(), type: 'date' };
    } else {
      return { value: generateTodayDateNumpadCaptcha(), type: 'date-numpad' };
    }
  };

  useEffect(() => {
    startCaptchaTimer('Bugünün Tarixi CAPTCHA');
    const newCaptcha = generateRandomCaptcha();
    setCaptcha(newCaptcha.value);
    setCaptchaType(newCaptcha.type);
    return () => {
      stopCaptchaTimer('Bugünün Tarixi CAPTCHA');
    };
  }, [startCaptchaTimer, stopCaptchaTimer]);

  useEffect(() => {
    if (inputRef.current && captchaType === 'date') {
      inputRef.current.focus();
    }
  }, [captchaType]);

  // Validate date CAPTCHA (with or without separators)
  const validateDateCaptcha = (userInput: string, correctDate: string) => {
    const normalizeInput = userInput.replace(/[\/\.\-\s]/g, '');
    const normalizeCorrect = correctDate.replace(/[\/\.\-\s]/g, '');
    
    if (normalizeInput === normalizeCorrect) {
      return true;
    }
    
    if (userInput === correctDate) {
      return true;
    }
    
    return false;
  };

  const handleSubmit = () => {
    let isValid = false;
    
    if (captchaType === 'date') {
      isValid = validateDateCaptcha(input.trim(), captcha);
    } else if (captchaType === 'date-numpad') {
      isValid = validateDateCaptcha(numpadInput.trim(), captcha);
    }
    
    if (isValid) {
      onSuccess();
    } else {
      // Yanlış ise yeni CAPTCHA oluştur (yine bugünün tarihi)
      const newCaptcha = generateRandomCaptcha();
      setCaptcha(newCaptcha.value);
      setCaptchaType(newCaptcha.type);
      setInput('');
      setNumpadInput('');
      if (inputRef.current && captchaType === 'date') {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Handle numpad button click
  const handleNumpadClick = (value: string) => {
    if (value === 'backspace') {
      setNumpadInput((prev) => prev.slice(0, -1));
    } else if (value === 'submit') {
      handleSubmit();
    } else {
      if (numpadInput.length < 10) {
        setNumpadInput((prev) => {
          const newValue = prev + value;
          if (newValue.length === 2 && newValue.length < 10) {
            return newValue + '/';
          } else if (newValue.length === 5 && newValue.length < 10) {
            return newValue + '/';
          }
          return newValue;
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto animate-[slideUp_0.3s_ease-out] overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Bugünün tarixi</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <p className="text-base text-gray-700 text-center mb-2 font-medium">
              Bugünün tarixini daxil edin
            </p>
            <p className="text-sm text-gray-500 text-center">
              {captchaType === 'date-numpad' 
                ? 'Aşağıdakı nömrələrdən istifadə edərək tarixi daxil edin'
                : 'Klaviaturadan tarixi daxil edin (ayırıcı ilə və ya olmadan)'}
            </p>
          </div>

          {/* Form */}
          {captchaType === 'date-numpad' ? (
            <div className="space-y-4">
              {/* Numpad Input Display */}
              <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
                <div className="text-3xl font-mono font-bold text-gray-800 text-center min-h-[2.5rem]">
                  {numpadInput || <span className="text-gray-400">_ _ / _ _ / _ _ _ _</span>}
                </div>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleNumpadClick(num.toString())}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xl py-4 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleNumpadClick('backspace')}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-bold text-lg py-4 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadClick('0')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xl py-4 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadClick('submit')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg active:scale-95"
                >
                  ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tarixi daxil edin (məs: 15/01/2025 və ya 15012025)"
                className="w-full text-black px-4 py-3 text-center text-lg font-mono border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                maxLength={10}
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Təsdiq et
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

