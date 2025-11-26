'use client';

import { useState, useEffect } from 'react';
import { useTimer } from '../../demo/TimerContext';

interface CaptchaModalProps {
  onSuccess: () => void;
}

export function CaptchaModal({ onSuccess }: CaptchaModalProps) {
  const { startCaptchaTimer, stopCaptchaTimer } = useTimer();
  const [digits, setDigits] = useState<number[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(() => Math.floor(Math.random() * 2) + 1); // 1 veya 2 kere

  useEffect(() => {
    startCaptchaTimer('Rəqəm CAPTCHA');
    return () => {
      stopCaptchaTimer('Rəqəm CAPTCHA');
    };
  }, [startCaptchaTimer, stopCaptchaTimer]);

  useEffect(() => {
    // 6 random rakam oluştur (0-9)
    const randomDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
    setDigits(randomDigits);
  }, [attempts]);

  const handleSelectChange = (index: number, value: string) => {
    const newValues = [...selectedValues];
    newValues[index] = value;
    setSelectedValues(newValues);
  };

  const handleSubmit = () => {
    const isCorrect = digits.every((digit, index) => {
      return selectedValues[index] === digit.toString();
    });

    if (isCorrect) {
      stopCaptchaTimer('Rəqəm CAPTCHA');
      onSuccess();
    } else {
      if (attempts + 1 >= maxAttempts) {
        // Maksimum deneme sayısına ulaşıldı, yine de geç
        onSuccess();
      } else {
        // Tekrar dene
        setAttempts(attempts + 1);
        setSelectedValues(['', '', '', '', '', '']);
        // Yeni rakamlar oluşturulacak (useEffect ile)
      }
    }
  };

  const isComplete = selectedValues.every(val => val !== '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto animate-[slideUp_0.3s_ease-out] overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Təhlükəsizlik yoxlaması</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <p className="text-base text-gray-700 text-center mb-2 font-medium">
              Aşağıdakı rəqəmləri müvafiq seçimlərdən seçin
            </p>
            <p className="text-sm text-gray-500 text-center">
              Hər rəqəm üçün aşağıdakı siyahıdan düzgün rəqəmi seçin
            </p>
          </div>
          
          {/* Digits Grid */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {digits.map((digit, index) => (
              <div key={index} className="flex flex-col items-center group">
                {/* Digit Display */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mb-4 border-2 border-blue-200 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                  <span className="text-4xl font-bold text-blue-700">{digit}</span>
                </div>
                
                {/* Select Input */}
                <div className="relative w-full">
                  <select
                    value={selectedValues[index]}
                    onChange={(e) => handleSelectChange(index, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-xl font-bold transition-all duration-200 ${
                      selectedValues[index] 
                        ? selectedValues[index] === digits[index].toString()
                          ? 'border-green-400 bg-green-50 text-green-700'
                          : 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-300 text-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <option value="">Seç</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i.toString()}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {attempts > 0 && attempts < maxAttempts && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-[shake_0.5s_ease-in-out]">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800">Yanlış seçim!</p>
                  <p className="text-sm text-red-600">Qalan cəhd sayı: <span className="font-bold">{maxAttempts - attempts}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 flex items-center gap-2"
            >
              <span>Təsdiq et</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

