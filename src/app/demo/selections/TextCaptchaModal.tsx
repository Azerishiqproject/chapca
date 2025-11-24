'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../TimerContext';

interface TextCaptchaModalProps {
  onSuccess: () => void;
  onVerified: () => void;
}

export function TextCaptchaModal({ onSuccess, onVerified }: TextCaptchaModalProps) {
  const { startCaptchaTimer, stopCaptchaTimer } = useTimer();
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [charStyles, setCharStyles] = useState<Array<React.CSSProperties>>([]);

  const generateNewCaptcha = () => {
    // 7 karakterlik random harf ve rakam karışımı oluştur
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomText = Array.from({ length: 7 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    setCaptchaText(randomText);

    // Her karakter için bir kere random stil oluştur ve sabit tut
    const styles = Array.from({ length: 7 }, (_, index) => {
      const rotation = (Math.random() - 0.5) * 30; // -15 to 15 degrees
      const skewX = (Math.random() - 0.5) * 20; // -10 to 10 degrees
      const scaleY = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const translateY = (Math.random() - 0.5) * 10; // -5 to 5px
      
      return {
        display: 'inline-block',
        transform: `rotate(${rotation}deg) skewX(${skewX}deg) scaleY(${scaleY}) translateY(${translateY}px)`,
        fontSize: `${18 + Math.random() * 4}px`, // 18-22px (küçük tasarım için)
        fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
        color: `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`,
      };
    });
    setCharStyles(styles);
  };

  useEffect(() => {
    startCaptchaTimer('Mətn CAPTCHA');
    generateNewCaptcha();
    return () => {
      stopCaptchaTimer('Mətn CAPTCHA');
    };
  }, [startCaptchaTimer, stopCaptchaTimer]);

  useEffect(() => {
    // Input'a otomatik focus
    if (inputRef.current && !isVerified) {
      inputRef.current.focus();
    }
  }, [isVerified]);

  useEffect(() => {
    // Eğer doğrulandıysa, Enter tuşu ile sayfa geçişi yap
    if (isVerified) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          onSuccess();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVerified, onSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVerified) {
      setUserInput(e.target.value);
    }
  };

  const handleVerify = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setIsVerified(true);
      onVerified();
    } else {
      // Yanlış ise yeni CAPTCHA oluştur, input'u temizle ve tekrar focus et
      generateNewCaptcha();
      setUserInput('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };


  return (
    <div className="w-full max-w-2xl">
      {/* DİQQƏT Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-yellow-800">
            DİQQƏT! Mənzil seçimi prosesində əlavə təhlükəsizlik tədbirləri tətbiq edilə bilər.
          </p>
        </div>
      </div>

      {/* CAPTCHA Display - Küçük */}
      <div className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
        isVerified 
          ? 'bg-green-50 border-green-400' 
          : 'bg-gray-50 border-gray-300'
      }`}>
        {/* CAPTCHA Text */}
        <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded border border-gray-300 shadow-inner">
            <div className="text-center" style={{ 
              fontFamily: 'monospace',
              letterSpacing: '4px',
              userSelect: 'none',
              lineHeight: '1.2'
            }}>
              {captchaText.split('').map((char, index) => (
                <span key={index} style={charStyles[index] || {}}>
                  {char}
                </span>
              ))}
            </div>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onClick={() => inputRef.current?.focus()}
          placeholder="Mətni daxil edin"
          disabled={isVerified}
          className={`w-32 px-3 text-black py-2 text-center text-base font-bold border-2 rounded-lg focus:outline-none focus:ring-2 uppercase tracking-widest transition-all ${
            isVerified
              ? 'border-green-400 bg-green-50 text-green-700 cursor-not-allowed'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          maxLength={7}
          autoFocus
        />
        
        {/* Okey Button */}
        <button
          onClick={handleVerify}
          disabled={userInput.length !== 7 || isVerified}
          className={`px-6 py-2 rounded-lg font-semibold text-sm shadow-md transition-all duration-300 ${
            isVerified
              ? 'bg-green-500 text-white cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white'
          }`}
        >
          {isVerified ? '✓' : 'Okey'}
        </button>
      </div>

      {isVerified && (
        <p className="text-sm text-green-600 mt-2 text-center font-medium">
          Doğrulandı! Enter tuşuna basın.
        </p>
      )}
    </div>
  );
}

