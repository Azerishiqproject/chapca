'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTimer } from './TimerContext';

export function Navbar() {
  const pathname = usePathname();
  const { startTimer, isTimerRunning, elapsedTime, resetTimer, countdown, setCountdown, setIsCardDisabled } = useTimer();

  const handleStart = () => {
    if (countdown === null) {
      setCountdown(5);
      setIsCardDisabled(true);
      localStorage.setItem('countdown', '5');
      localStorage.setItem('isCardDisabled', 'true');
    }
  };


  const formatTime = (totalMilliseconds: number) => {
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((totalMilliseconds % 1000) / 10); // Show centiseconds (00-99)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/demo" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-800">MİDA</span>
      </Link>
      <div className="flex items-center gap-4">
        {/* Başla Button */}
        <button
          onClick={handleStart}
          disabled={countdown !== null}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors"
        >
          {countdown !== null ? `Başlanır... ${countdown}` : 'Başla'}
        </button>

        {/* Timer Display */}
        {(isTimerRunning || elapsedTime > 0) && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition-colors ${
              elapsedTime > 5000 
                ? 'bg-red-50 border-red-300 animate-pulse' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                elapsedTime > 5000 ? 'bg-red-600' : 'bg-red-500'
              }`}></div>
              <div>
                <p className="text-xs text-gray-500">Vaxt</p>
                <p 
                  key={Math.floor(elapsedTime / 10)} 
                  className={`text-lg font-bold font-mono transition-all duration-75 ease-out ${
                    elapsedTime > 5000 
                      ? 'text-red-600 animate-pulse' 
                      : 'text-blue-600'
                  }`}
                  style={{
                    animation: elapsedTime > 5000 ? 'fadeIn 0.075s ease-out, pulse 1s ease-in-out infinite' : 'fadeIn 0.075s ease-out'
                  }}
                >
                  {formatTime(elapsedTime)}
                </p>
              </div>
            </div>
            <button
              onClick={resetTimer}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg transition-colors whitespace-nowrap"
            >
              Sıfırla
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">MƏLİKOVA SİMUZƏR ELDAR QIZI</span>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <span>Çıxış et</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100">
          <span className="text-xs">æ</span>
        </button>
      </div>
    </header>
  );
}

