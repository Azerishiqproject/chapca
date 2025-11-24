'use client';

import { useEffect, useState } from 'react';
import { useTimer } from '../TimerContext';

const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

export default function ApartmentPage() {
  const { stopTimer, isTimerRunning, startPageTimer, stopPageTimer, getCaptchaTimes, getTotalTime } = useTimer();
  const [captchaTimes, setCaptchaTimes] = useState(getCaptchaTimes());
  const [totalTime, setTotalTime] = useState(getTotalTime());

  useEffect(() => {
    startPageTimer('Mənzil');
    if (isTimerRunning) {
      stopTimer();
    }
    // Analiz verilerini güncelle
    setCaptchaTimes(getCaptchaTimes());
    setTotalTime(getTotalTime());
    return () => {
      stopPageTimer('Mənzil');
    };
  }, [isTimerRunning, stopTimer, startPageTimer, stopPageTimer, getCaptchaTimes, getTotalTime]);

  // CAPTCHA'ları sayfalara göre kategorize et ve aynı tip CAPTCHA'ları birleştir
  const processCaptchas = (captchas: typeof captchaTimes) => {
    const grouped = captchas.reduce((acc, captcha) => {
      if (!acc[captcha.captchaName]) {
        acc[captcha.captchaName] = {
          captchaName: captcha.captchaName,
          totalDuration: 0,
          count: 0,
          endTime: captcha.endTime
        };
      }
      acc[captcha.captchaName].totalDuration += captcha.duration;
      acc[captcha.captchaName].count += 1;
      if (captcha.endTime) {
        acc[captcha.captchaName].endTime = captcha.endTime;
      }
      return acc;
    }, {} as Record<string, { captchaName: string; totalDuration: number; count: number; endTime: number | null }>);

    return Object.values(grouped).map(item => ({
      captchaName: item.captchaName,
      duration: item.totalDuration,
      endTime: item.endTime,
      count: item.count
    }));
  };

  const allSelectionsCaptchas = captchaTimes.filter(c => 
    c.captchaName === 'Rəqəm CAPTCHA' || c.captchaName === 'Mətn CAPTCHA'
  );
  const allSearchCaptchas = captchaTimes.filter(c => 
    c.captchaName === 'Tarix CAPTCHA' || c.captchaName === 'Bugünün Tarixi CAPTCHA'
  );

  const selectionsCaptchas = processCaptchas(allSelectionsCaptchas).filter(c => c.duration > 0);
  const searchCaptchas = processCaptchas(allSearchCaptchas).filter(c => c.duration > 0);

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
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mənzil</h1>
        
        {/* Detaylı Analiz */}
        <div className="space-y-6">
          {/* Toplam Zaman */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ümumi Vaxt
            </h2>
            <div className="text-4xl font-bold text-blue-700 font-mono">
              {formatTime(totalTime)}
            </div>
          </div>

          {/* Seçimlər Sayfası - CAPTCHA Zamanları */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Seçimlər
            </h2>
            <div className="space-y-3 mt-4">
              {selectionsCaptchas.length > 0 ? (
                selectionsCaptchas.map((captcha, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {captcha.captchaName}
                          {(captcha as any).count > 1 && (
                            <span className="text-xs text-gray-500 ml-2">({(captcha as any).count}x)</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {captcha.endTime ? 'Tamamlandı' : 'Davam edir...'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800 font-mono">
                        {formatTime(captcha.duration)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {totalTime > 0 ? ((captcha.duration / totalTime) * 100).toFixed(1) : '0'}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">CAPTCHA məlumatı yoxdur</p>
              )}
            </div>
          </div>

          {/* Axtarış Sayfası - CAPTCHA Zamanları */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Axtarış
            </h2>
            <div className="space-y-3 mt-4">
              {searchCaptchas.length > 0 ? (
                searchCaptchas.map((captcha, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {captcha.captchaName}
                          {(captcha as any).count > 1 && (
                            <span className="text-xs text-gray-500 ml-2">({(captcha as any).count}x)</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {captcha.endTime ? 'Tamamlandı' : 'Davam edir...'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800 font-mono">
                        {formatTime(captcha.duration)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {totalTime > 0 ? ((captcha.duration / totalTime) * 100).toFixed(1) : '0'}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">CAPTCHA məlumatı yoxdur</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

