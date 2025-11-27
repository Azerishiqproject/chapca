'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../../demo/TimerContext';

interface BirthDateCaptchaModalProps {
  onSuccess: () => void;
}

type CaptchaType = 'date' | 'date-numpad';

export function BirthDateCaptchaModal({ onSuccess }: BirthDateCaptchaModalProps) {
  const { startCaptchaTimer, stopCaptchaTimer } = useTimer();
  const [captcha, setCaptcha] = useState('');
  const [captchaType, setCaptchaType] = useState<CaptchaType>('date-numpad');
  const [numpadInput, setNumpadInput] = useState('');
  const [numpadLayout, setNumpadLayout] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate numpad layout (50% standard, 50% random)
  const generateNumpadLayout = (): string[] => {
    const standardLayout = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const useRandom = Math.random() < 0.5; // 50% chance
    
    if (useRandom) {
      // Shuffle array using Fisher-Yates algorithm
      const shuffled = [...standardLayout];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    } else {
      return standardLayout;
    }
  };

  // Load birth date from localStorage
  useEffect(() => {
    const savedBirthDate = localStorage.getItem('birthDate');
    if (savedBirthDate) {
      // Format: DD/MM/YYYY
      setCaptcha(savedBirthDate);
      setCaptchaType('date-numpad');
      // Generate numpad layout (50% standard, 50% random)
      setNumpadLayout(generateNumpadLayout());
    } else {
      // Eğer doğum tarihi yoksa, hata göster
      alert('Xahiş edirik əvvəlcə doğum tarixini demo səhifəsində qeyd edin.');
    }
  }, []);

  useEffect(() => {
    if (captcha) {
      startCaptchaTimer('Doğum Tarixi CAPTCHA');
      return () => {
        stopCaptchaTimer('Doğum Tarixi CAPTCHA');
      };
    }
  }, [captcha, startCaptchaTimer, stopCaptchaTimer]);

  // Validate date CAPTCHA (with or without separators)
  const validateDateCaptcha = (userInput: string, correctDate: string) => {
    if (!userInput || !correctDate) {
      return false;
    }
    
    // Trim both inputs
    const trimmedInput = userInput.trim();
    const trimmedCorrect = correctDate.trim();
    
    // Normalize both (remove all separators and spaces)
    const normalizeInput = trimmedInput.replace(/[\/\.\-\s]/g, '').padStart(8, '0');
    const normalizeCorrect = trimmedCorrect.replace(/[\/\.\-\s]/g, '').padStart(8, '0');
    
    // Check if normalized versions match (8 digits)
    if (normalizeInput === normalizeCorrect && normalizeInput.length === 8) {
      return true;
    }
    
    // Check if exact match (with separators)
    if (trimmedInput === trimmedCorrect) {
      return true;
    }
    
    // Try matching with different separator formats
    const formats = [
      trimmedInput.replace(/\//g, '/'),
      trimmedInput.replace(/\./g, '/'),
      trimmedInput.replace(/-/g, '/'),
      trimmedInput.replace(/\s/g, '/'),
    ];
    
    if (formats.some(format => format === trimmedCorrect)) {
      return true;
    }
    
    // Debug için console.log (geliştirme sırasında)
    console.log('Validation failed:', {
      userInput: trimmedInput,
      correctDate: trimmedCorrect,
      normalizedInput: normalizeInput,
      normalizedCorrect: normalizeCorrect,
      inputLength: normalizeInput.length,
      correctLength: normalizeCorrect.length
    });
    
    return false;
  };

  const handleSubmit = () => {
    if (!captcha) {
      alert('Xahiş edirik əvvəlcə doğum tarixini demo səhifəsində qeyd edin.');
      return;
    }

    const trimmedInput = numpadInput.trim();
    const isValid = validateDateCaptcha(trimmedInput, captcha);
    
    if (isValid) {
      stopCaptchaTimer('Doğum Tarixi CAPTCHA');
      onSuccess();
    } else {
      // Yanlış ise input'u temizle ve hata mesajı göster
      alert('Yanlış tarix! Xahiş edirik doğru tarixi daxil edin.');
      setNumpadInput('');
      // Generate new numpad layout (50% standard, 50% random)
      setNumpadLayout(generateNumpadLayout());
      if (inputRef.current) {
        inputRef.current.focus();
      }
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

  if (!captcha) {
    return null;
  }

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
            <h2 className="text-2xl font-bold text-white">Doğum tarixi</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-700 text-center mb-1">
              Doğum tarixinizi daxil edin
            </p>
            <p className="text-xs text-gray-500 text-center">
              Aşağıdakı nömrələrdən istifadə edərək tarixi daxil edin
            </p>
            {/* Debug: Doğru tarihi göster (geliştirme için) */}
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-red-500 text-center mt-2">
                Doğru tarix: {captcha}
              </p>
            )}
          </div>

          {/* Form - Always use numpad */}
          <div className="space-y-4">
            {/* Date Input Fields */}
            <div>
              <p className="text-xs text-gray-600 mb-3 text-center">Doğum tarixinizi aşağıdakı düymələr vasitəsi ilə daxil edin:</p>
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

            {/* Numpad - Dynamic layout (standard or random) */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {/* Row 1: First 3 numbers from layout */}
              {numpadLayout.slice(0, 3).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumpadClick(num)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
                >
                  {num}
                </button>
              ))}
              
              {/* Row 2: Next 3 numbers from layout */}
              {numpadLayout.slice(3, 6).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumpadClick(num)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
                >
                  {num}
                </button>
              ))}
              
              {/* Row 3: Next 3 numbers from layout */}
              {numpadLayout.slice(6, 9).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumpadClick(num)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
                >
                  {num}
                </button>
              ))}
              
              {/* Row 4: X (clear), last number (0 or random), ← (backspace) */}
              <button
                type="button"
                onClick={() => handleNumpadClick('clear')}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg py-3 px-4 rounded transition-colors flex items-center justify-center"
              >
                ✕
              </button>
              {numpadLayout.length > 9 && (
                <button
                  type="button"
                  onClick={() => handleNumpadClick(numpadLayout[9])}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-bold text-lg py-3 px-4 rounded transition-colors"
                >
                  {numpadLayout[9]}
                </button>
              )}
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
              disabled={numpadInput.replace(/\//g, '').length !== 8}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Təsdiq et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

