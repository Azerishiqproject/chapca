'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../../demo/TimerContext';

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

  // Select and generate random CAPTCHA type (always use numpad for better UX)
  const generateRandomCaptcha = (): { value: string; type: CaptchaType } => {
    return { value: generateTodayDateNumpadCaptcha(), type: 'date-numpad' };
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
      stopCaptchaTimer('Bugünün Tarixi CAPTCHA');
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
    if (value === 'clear') {
      setNumpadInput('');
    } else if (value === 'backspace') {
      setNumpadInput((prev) => {
        // Eğer son karakter / ise, onu da sil
        if (prev.endsWith('/')) {
          return prev.slice(0, -1);
        }
        return prev.slice(0, -1);
      });
    } else if (value === 'submit') {
      handleSubmit();
    } else {
      // Tarih formatı: DD/MM/YYYY (10 karakter)
      const currentInput = numpadInput.replace(/\//g, '');
      if (currentInput.length < 8) {
        setNumpadInput((prev) => {
          const digitsOnly = prev.replace(/\//g, '');
          const newDigits = digitsOnly + value;
          
          // Format: DD/MM/YYYY
          if (newDigits.length <= 2) {
            return newDigits;
          } else if (newDigits.length <= 4) {
            return `${newDigits.slice(0, 2)}/${newDigits.slice(2)}`;
          } else {
            return `${newDigits.slice(0, 2)}/${newDigits.slice(2, 4)}/${newDigits.slice(4)}`;
          }
        });
      }
    }
  };

  // Parse numpad input into day, month, year
  const parseDateInput = (input: string) => {
    const digits = input.replace(/\//g, '');
    return {
      day: digits.slice(0, 2) || '',
      month: digits.slice(2, 4) || '',
      year: digits.slice(4, 8) || ''
    };
  };

  const dateParts = parseDateInput(numpadInput);

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

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-700 text-center mb-1">
              Bugünün tarixini daxil edin
            </p>
            <p className="text-xs text-gray-500 text-center">
              Aşağıdakı nömrələrdən istifadə edərək tarixi daxil edin
            </p>
          </div>

          {/* Form - Always use numpad */}
          <div className="space-y-4">
            {/* Date Input Fields */}
            <div>
              <p className="text-xs text-gray-600 mb-3 text-center">Bugünün tarixini aşağıdakı düymələr vasitəsi ilə daxil edin:</p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center">
                  <label className="text-xs text-gray-500 mb-1">gün</label>
                  <div className="flex gap-1">
                    <div className={`w-10 h-12 border rounded text-center flex items-center justify-center text-xl font-bold text-black ${
                      dateParts.day.length >= 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                    }`}>
                      {dateParts.day[0] || '_'}
                    </div>
                    <div className={`w-10 h-12 border rounded text-center flex items-center justify-center text-xl font-bold text-black ${
                      dateParts.day.length >= 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                    }`}>
                      {dateParts.day[1] || '_'}
                    </div>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-400 mt-6">/</span>
                <div className="flex flex-col items-center">
                  <label className="text-xs text-gray-500 mb-1">ay</label>
                  <div className="flex gap-1">
                    <div className={`w-10 h-12 border rounded text-center flex items-center justify-center text-xl font-bold text-black ${
                      dateParts.month.length >= 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                    }`}>
                      {dateParts.month[0] || '_'}
                    </div>
                    <div className={`w-10 h-12 border rounded text-center flex items-center justify-center text-xl font-bold text-black ${
                      dateParts.month.length >= 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                    }`}>
                      {dateParts.month[1] || '_'}
                    </div>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-400 mt-6">/</span>
                <div className="flex flex-col items-center">
                  <label className="text-xs text-gray-500 mb-1">il</label>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`w-10 h-12 border rounded text-center flex items-center justify-center text-xl font-bold text-black ${
                        dateParts.year.length > i ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                      }`}>
                        {dateParts.year[i] || '_'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Numpad - Standard phone layout */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {/* Row 1: 1, 2, 3 */}
              <button
                type="button"
                onClick={() => handleNumpadClick('1')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('2')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('3')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                3
              </button>
              
              {/* Row 2: 4, 5, 6 */}
              <button
                type="button"
                onClick={() => handleNumpadClick('4')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                4
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('5')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                5
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('6')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                6
              </button>
              
              {/* Row 3: 7, 8, 9 */}
              <button
                type="button"
                onClick={() => handleNumpadClick('7')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('8')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                8
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('9')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                9
              </button>
              
              {/* Row 4: X (clear), 0, ← (backspace) */}
              <button
                type="button"
                onClick={() => handleNumpadClick('clear')}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg py-3 px-4 rounded transition-colors flex items-center justify-center"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('0')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('backspace')}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-3 px-4 rounded transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Təsdiq et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

