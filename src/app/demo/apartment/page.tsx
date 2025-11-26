'use client';

import { useEffect, useMemo } from 'react';
import { useTimer } from '../TimerContext';

const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

// CAPTCHA adlarını Azərbaycan dilinə çevir
const getCaptchaDisplayName = (captchaName: string): string => {
  const names: { [key: string]: string } = {
    'Rəqəm CAPTCHA': 'Rəqəm CAPTCHA',
    'Mətn CAPTCHA': 'Mətn CAPTCHA',
    'Tarix CAPTCHA': 'Tarix CAPTCHA',
    'Bugünün Tarixi CAPTCHA': 'Bugünün Tarixi CAPTCHA',
    'Doğum Tarixi CAPTCHA': 'Doğum Tarixi CAPTCHA',
    'Number CAPTCHA': 'Rəqəm CAPTCHA',
    'Text CAPTCHA': 'Mətn CAPTCHA',
    'Date CAPTCHA': 'Tarix CAPTCHA',
    'Today\'s Date CAPTCHA': 'Bugünün Tarixi CAPTCHA',
    'Birth Date CAPTCHA': 'Doğum Tarixi CAPTCHA'
  };
  return names[captchaName] || captchaName;
};

export default function ApartmentPage() {
  const { stopTimer, isTimerRunning, startPageTimer, stopPageTimer, getCaptchaTimes, getTotalTime } = useTimer();
  
  const totalTime = useMemo(() => getTotalTime(), [getTotalTime]);

  useEffect(() => {
    startPageTimer('Mənzil');
    if (isTimerRunning) {
      stopTimer();
    }
    return () => {
      stopPageTimer('Mənzil');
    };
  }, [isTimerRunning, stopTimer, startPageTimer, stopPageTimer]);

  // Her CAPTCHA'yı ayrı ayrı göster (gruplama yok)
  const allCaptchas = useMemo(() => {
    const captchaTimes = getCaptchaTimes();
    
    // Her CAPTCHA'yı ayrı ayrı göster, sadece duration > 0 olanları filtrele
    return captchaTimes
      .filter(c => c.duration > 0)
      .map((captcha, index) => ({
        id: `${captcha.captchaName}-${captcha.startTime}-${index}`, // Benzersiz ID
        captchaName: captcha.captchaName,
        duration: captcha.duration,
        endTime: captcha.endTime
      }));
  }, [getCaptchaTimes]);

  // CAPTCHA istatistikleri
  const captchaStats = useMemo(() => {
    const totalCaptchas = allCaptchas.length;
    const totalCaptchaTime = allCaptchas.reduce((sum, c) => sum + c.duration, 0);
    const averageCaptchaTime = totalCaptchas > 0 ? totalCaptchaTime / totalCaptchas : 0;
    const netTime = totalTime - totalCaptchaTime; // CAPTCHA olmadan xalis vaxt
    
    return {
      totalCaptchas,
      totalCaptchaTime,
      averageCaptchaTime,
      netTime
    };
  }, [allCaptchas, totalTime]);

  return (
    <div className="min-h-screen bg-white">
      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Seçimlər</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Axtarış</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <span className="text-blue-600 font-medium underline text-sm">Mənzil</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
              4
            </div>
            <span className="text-gray-600 font-medium text-sm">Ərizə</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mənzil Seçimi</h1>
          
          {/* 70-30 Layout */}
          <div className="flex gap-6">
            {/* Sol tərəf - CAPTCHA'lar (70%) */}
            <div className="flex-[7]">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">CAPTCHA Təhlili</h2>
                  <p className="text-sm text-gray-500 mt-1">Tamamlanan CAPTCHA'ların detaylı siyahısı</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {allCaptchas.length > 0 ? (
                    allCaptchas.map((captcha, index) => (
                      <div key={captcha.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {getCaptchaDisplayName(captcha.captchaName)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {(captcha.duration / 1000).toFixed(2)}s
                          </span>
                          <p className="text-sm font-mono font-semibold text-gray-900 min-w-[80px] text-right">
                            {formatTime(captcha.duration)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">CAPTCHA məlumatı yoxdur</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sağ tərəf - Zamanlar (30%) */}
            <div className="flex-[3]">
              <div className="space-y-4 sticky top-8">
                {/* Ümumi və Xalis Vaxt */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                    <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">Ümumi Vaxt</p>
                  </div>
                  <div className="px-5 py-6">
                    <div className="text-3xl font-bold text-gray-900 font-mono">
                      {formatTime(totalTime)}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">CAPTCHA daxil</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-white border-b border-green-100">
                    <p className="text-xs font-semibold text-green-900 uppercase tracking-wide">Xalis Vaxt</p>
                  </div>
                  <div className="px-5 py-6">
                    <div className="text-3xl font-bold text-gray-900 font-mono">
                      {formatTime(captchaStats.netTime)}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">CAPTCHA olmadan</p>
                  </div>
                </div>

                {/* CAPTCHA Statistikası */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
                    <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">Statistika</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Toplam</span>
                      <span className="text-xl font-bold text-gray-900">{captchaStats.totalCaptchas}</span>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Əlavə Vaxt</span>
                      <span className="text-lg font-mono font-semibold text-gray-900">{formatTime(captchaStats.totalCaptchaTime)}</span>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ortalama</span>
                      <span className="text-lg font-mono font-semibold text-gray-900">{formatTime(captchaStats.averageCaptchaTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

