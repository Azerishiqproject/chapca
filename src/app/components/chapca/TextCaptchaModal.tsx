'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../../demo/TimerContext';

interface TextCaptchaModalProps {
  onSuccess: () => void;
  onVerified: () => void;
}

export function TextCaptchaModal({ onSuccess, onVerified }: TextCaptchaModalProps) {
  const { startCaptchaTimer, stopCaptchaTimer } = useTimer();
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [charStyles, setCharStyles] = useState<Array<React.CSSProperties>>([]);

  const generateNewCaptcha = () => {
    // 7 karakterlik random harf ve rakam karışımı oluştur
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomText = Array.from({ length: 7 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    setCaptchaText(randomText);

    // Her karakter için çok daha karmaşık ve stilize stil oluştur
    const styles = Array.from({ length: 7 }, (_, index) => {
      const char = randomText[index];
      const isUpperCase = /[A-Z]/.test(char);
      const isLowerCase = /[a-z]/.test(char);
      const isNumber = /[0-9]/.test(char);
      
      const rotation = (Math.random() - 0.5) * 40; // -20 to 20 degrees (daha fazla rotasyon)
      const skewX = (Math.random() - 0.5) * 30; // -15 to 15 degrees (daha fazla skew)
      const skewY = (Math.random() - 0.5) * 20; // -10 to 10 degrees (Y ekseni skew)
      const scaleX = 0.7 + Math.random() * 0.6; // 0.7 to 1.3 (X ekseni scale)
      const scaleY = 0.7 + Math.random() * 0.6; // 0.7 to 1.3 (Y ekseni scale)
      const translateX = (Math.random() - 0.5) * 8; // -4 to 4px
      
      // Büyük/küçük harf ayrımı için font size ve weight ayarları
      let fontSize: number;
      let fontWeight: string | number;
      let translateY: number;
      
      if (isUpperCase) {
        // Büyük harfler: daha büyük ve kalın
        fontSize = 20 + Math.random() * 6; // 20-26px
        fontWeight = Math.random() > 0.2 ? 'bold' : '700';
        translateY = (Math.random() - 0.5) * 8; // -4 to 4px (yukarıda)
      } else if (isLowerCase) {
        // Küçük harfler: daha küçük ve ince, biraz aşağıda
        fontSize = 14 + Math.random() * 4; // 14-18px
        fontWeight = Math.random() > 0.5 ? 'normal' : '400';
        translateY = 4 + Math.random() * 4; // 4-8px (aşağıda)
      } else {
        // Rakamlar: orta boyut
        fontSize = 16 + Math.random() * 6; // 16-22px
        fontWeight = Math.random() > 0.4 ? 'bold' : '600';
        translateY = (Math.random() - 0.5) * 6; // -3 to 3px
      }
      
      // Daha koyu ve çeşitli renkler
      const colorVariations = [
        `rgb(${Math.floor(Math.random() * 60)}, ${Math.floor(Math.random() * 60)}, ${Math.floor(Math.random() * 60)})`, // Koyu renkler
        `rgb(${Math.floor(Math.random() * 80) + 20}, ${Math.floor(Math.random() * 80) + 20}, ${Math.floor(Math.random() * 80) + 20})`, // Orta tonlar
      ];
      
      return {
        display: 'inline-block',
        transform: `rotate(${rotation}deg) skewX(${skewX}deg) skewY(${skewY}deg) scale(${scaleX}, ${scaleY}) translate(${translateX}px, ${translateY}px)`,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        fontStyle: Math.random() > 0.7 ? 'italic' : 'normal',
        color: colorVariations[Math.floor(Math.random() * colorVariations.length)],
        textShadow: `1px 1px 2px rgba(0,0,0,0.3), -1px -1px 2px rgba(255,255,255,0.2)`,
        filter: `contrast(${0.8 + Math.random() * 0.4}) brightness(${0.7 + Math.random() * 0.3})`,
        verticalAlign: isLowerCase ? 'baseline' : 'middle',
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
    if (inputRef.current && !isVerified && !showCorrectAnswer) {
      inputRef.current.focus();
    }
  }, [isVerified, showCorrectAnswer]);

  useEffect(() => {
    // Eğer doğrulandıysa, Enter tuşu ile sayfa geçişi yap
    if (isVerified) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          stopCaptchaTimer('Mətn CAPTCHA');
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
    // Büyük-küçük harf duyarlı karşılaştırma
    if (userInput === captchaText) {
      setIsVerified(true);
      onVerified();
    } else {
      // Yanlış ise doğru cevabı göster
      setShowCorrectAnswer(true);
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
      <div className={`flex flex-col gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
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
              lineHeight: '1.2',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {captchaText.split('').map((char, index) => (
                <span key={index} style={charStyles[index] || {}}>
                  {char}
                </span>
              ))}
            </div>
        </div>
        
        {/* Input ve Butonlar */}
        <div className="flex items-center gap-3">

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onClick={() => inputRef.current?.focus()}
            placeholder="Mətni daxil edin"
            disabled={isVerified || showCorrectAnswer}
            className={`flex-1 px-3 text-black py-2 text-center text-base font-bold border-2 rounded-lg focus:outline-none focus:ring-2 tracking-widest transition-all ${
              isVerified
                ? 'border-green-400 bg-green-50 text-green-700 cursor-not-allowed'
                : showCorrectAnswer
                ? 'border-red-300 bg-red-50 text-red-700 cursor-not-allowed'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            maxLength={7}
            autoFocus
          />
          
          {/* Okey Button */}
          <button
            onClick={handleVerify}
            disabled={userInput.length !== 7 || isVerified || showCorrectAnswer}
            className={`px-6 py-2 rounded-lg font-semibold text-sm shadow-md transition-all duration-300 ${
              isVerified
                ? 'bg-green-500 text-white cursor-default'
                : showCorrectAnswer
                ? 'bg-red-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white'
            }`}
          >
            {isVerified ? '✓' : showCorrectAnswer ? '✗' : 'Okey'}
          </button>
        </div>
        
        {/* Yenile Button */}
        {!isVerified && (
          <button
            onClick={() => {
              generateNewCaptcha();
              setUserInput('');
              setShowCorrectAnswer(false);
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
            className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              showCorrectAnswer
                ? 'bg-red-200 hover:bg-red-300 text-red-800'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Yenilə
          </button>
        )}
      </div>

      {isVerified && (
        <p className="text-sm text-green-600 mt-2 text-center font-medium">
          Doğrulandı! Enter tuşuna basın.
        </p>
      )}

      {showCorrectAnswer && (
        <div className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
          <p className="text-sm text-red-700 text-center font-medium mb-2">
            Yanlış cavab! Düzgün cavab:
          </p>
          <div className="text-center">
            <span className="text-lg font-bold text-red-800 tracking-widest">
              {captchaText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

