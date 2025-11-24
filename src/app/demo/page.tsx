'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTimer } from './TimerContext';

export default function DemoPage() {
  const { countdown, isCardDisabled, startPageTimer, stopPageTimer } = useTimer();

  useEffect(() => {
    startPageTimer('Ana Səhifə');
    return () => {
      stopPageTimer('Ana Səhifə');
    };
  }, [startPageTimer, stopPageTimer]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex">
        {/* Left Content */}
        <div className="flex-1 p-6">
          {/* Top Section - Information Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Satış başlayıb Card */}
            <div className="relative">
              {isCardDisabled ? (
                <div className="bg-white rounded-lg shadow-sm border-l-4 h-[220px] border-green-500 p-6 opacity-90 cursor-not-allowed relative">
                  {countdown !== null && countdown > 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                        <span className="text-4xl font-bold">{countdown}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Satış başlayıb</h3>
                      <p className="text-sm text-gray-600">
                        Güzəştli mənzillərin satışı 02.12.2025-ci il saat 00:00-dək davam edəcəkdir.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/demo/selections" className="block">
                  <div className="bg-white rounded-lg shadow-sm border-l-4 h-[220px] border-green-500 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Satış başlayıb</h3>
                        <p className="text-sm text-gray-600">
                          Güzəştli mənzillərin satışı 02.12.2025-ci il saat 00:00-dək davam edəcəkdir.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Elektron kabinet Card */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-yellow-500 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Elektron kabinet</h3>
                  <p className="text-sm text-gray-600">
                    Əsas elektron kabinetə qayıtmaq üçün bu bölməyə daxil olun.
                  </p>
                </div>
              </div>
            </div>

            {/* Gözləmə / Mənzillər Card */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Gözləmə / Mənzillər</h3>
                  <p className="text-sm text-gray-600">
                    Gözləmə qaydasında mənzillərin seçimi 02.12.2025-ci il saat 00:00-dək davam edəcəkdir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Modules */}
          <div className="space-y-6">
            {/* Satış modulu üzrə */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-base font-semibold text-gray-800 mb-4">Satış modulu üzrə</h4>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  <span className="text-sm font-medium">Video təlimat</span>
                </button>
                <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium">İstifadə təlimatı</span>
                </button>
              </div>
            </div>

            {/* Gözləmə qaydasında mənzil seçiminə dair */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-base font-semibold text-gray-800 mb-4">Gözləmə qaydasında mənzil seçiminə dair</h4>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  <span className="text-sm font-medium">Video təlimat</span>
                </button>
                <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium">İstifadə təlimatı</span>
                </button>
              </div>
            </div>

            {/* İlkin razılıq qərarının alınmasına dair */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-base font-semibold text-gray-800 mb-4">İlkin razılıq qərarının alınmasına dair</h4>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  <span className="text-sm font-medium">Video təlimat</span>
                </button>
                <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium">İstifadə təlimatı</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Şəxsi məlumatlar</h2>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Şəxsi məlumatlar
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
              Əlaqə vasitələri
            </button>
          </div>

          {/* Personal Information */}
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Ş/V seriya, nömrəsi, FİN</p>
              <p className="text-gray-800 font-medium">AA 0160341, 1E1JCBL</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Soyadı, adı, atasının adı</p>
              <p className="text-gray-800 font-medium">MƏLİKOVA SİMUZƏR ELDAR QIZI</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Doğulduğu tarix və yer</p>
              <p className="text-gray-800 font-medium">01/06/1986, AZƏRBAYCAN, MASALLI şəh.</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Ünvan</p>
              <p className="text-gray-800 font-medium">
                AZƏRBAYCAN, BAKI ŞƏHƏRİ, QARADAĞ RAYONU, SAHİL ƏRAZİ DAİRƏSİ, SAHİL QƏSƏBƏSİ, ƏLİYAR GÜLBABAYEV KÜÇƏSİ, EV 16A, MƏNZİL 58
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Ş/V etibarlıq müddəti</p>
              <p className="text-gray-800 font-medium">12.01.2019 - 02.01.2029</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Ailə vəziyyəti</p>
              <p className="text-gray-800 font-medium">Evli</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Kateqoriya</p>
              <p className="text-gray-800 font-medium">
                Ən azı 3 il dövlət ümumi təhsil müəssisəsində müəllim işləyən şəxs
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Kabinetin nömrəsi</p>
              <p className="text-gray-800 font-medium">201707121332321E1JCBL</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Verilmə tarixi</p>
              <p className="text-gray-800 font-medium">12.07.2017</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-gray-600">2025 © MİDA</p>
      </footer>
    </div>
  );
}

