'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTimer } from './TimerContext';

type CaptchaFrequency = 'none' | 'low' | 'medium' | 'high';
type CaptchaType = 'number' | 'text' | 'date' | 'today-date' | 'birth-date' | 'question';

interface Question {
  question: string;
  answer: string;
}

export default function DemoPage() {
  const { countdown, isCardDisabled, startPageTimer, stopPageTimer } = useTimer();
  const [birthDate, setBirthDate] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
  const [captchaFrequency, setCaptchaFrequency] = useState<CaptchaFrequency>('medium');
  const [enabledCaptchaTypes, setEnabledCaptchaTypes] = useState<CaptchaType[]>(['number', 'text', 'date', 'today-date', 'birth-date']);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [tempFrequency, setTempFrequency] = useState<CaptchaFrequency>('medium');
  const [tempEnabledTypes, setTempEnabledTypes] = useState<CaptchaType[]>(['number', 'text', 'date', 'today-date', 'birth-date']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    startPageTimer('Ana Səhifə');
    
    // Global CAPTCHA sayacını sıfırla (yeni oturum başlangıcı)
    localStorage.setItem('globalCaptchaCount', '0');
    localStorage.setItem('globalCaptchaLimit', '0');
    localStorage.setItem('shownSpecialCaptchas', '[]'); // Özel CAPTCHA'ları sıfırla
    console.log('Global CAPTCHA counter reset');
    
    // Load birth date from localStorage
    const savedBirthDate = localStorage.getItem('birthDate');
    if (savedBirthDate) {
      setBirthDate(savedBirthDate);
      setBirthDateInput(savedBirthDate);
    }
    // Load CAPTCHA frequency from localStorage
    const savedFrequency = localStorage.getItem('captchaFrequency') as CaptchaFrequency;
    if (savedFrequency && ['none', 'low', 'medium', 'high'].includes(savedFrequency)) {
      setCaptchaFrequency(savedFrequency);
    }
    // Load enabled CAPTCHA types from localStorage
    const savedTypes = localStorage.getItem('enabledCaptchaTypes');
    if (savedTypes) {
      try {
        const types = JSON.parse(savedTypes) as CaptchaType[];
        if (Array.isArray(types) && types.length > 0) {
          setEnabledCaptchaTypes(types);
          setTempEnabledTypes(types);
        }
      } catch (e) {
        // Invalid JSON, use default
      }
    }
    
    // Load temp frequency
    setTempFrequency(captchaFrequency);
    
    // Load questions from localStorage
    const savedQuestions = localStorage.getItem('captchaQuestions');
    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions) as Question[];
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
        }
      } catch (e) {
        // Invalid JSON, use empty array
      }
    }
    
    return () => {
      stopPageTimer('Ana Səhifə');
    };
  }, [startPageTimer, stopPageTimer]);

  const handleBirthDateInputChange = (value: string) => {
    // Sadece rakamları al
    const digits = value.replace(/\D/g, '');
    
    // Maksimum 8 rakam
    if (digits.length > 8) return;
    
    // Format: DD/MM/YYYY
    let formatted = '';
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
    
    setBirthDateInput(formatted);
  };

  const handleSaveBirthDate = () => {
    // Validate date format (DD/MM/YYYY)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(birthDateInput)) {
      alert('Xahiş edirik tarixi düzgün formatda daxil edin (DD/MM/YYYY)');
      return;
    }
    
    // Validate date values
    const [day, month, year] = birthDateInput.split('/').map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
      alert('Xahiş edirik düzgün tarix dəyərləri daxil edin');
      return;
    }
    
    localStorage.setItem('birthDate', birthDateInput);
    setBirthDate(birthDateInput);
    alert('Doğum tarixi uğurla qeyd edildi!');
  };

  const handleClearBirthDate = () => {
    localStorage.removeItem('birthDate');
    // Doğum tarihi CAPTCHA'sının gösterildiği bilgisini de temizle
    const shownSpecialCaptchas = JSON.parse(localStorage.getItem('shownSpecialCaptchas') || '[]') as string[];
    const updatedShownCaptchas = shownSpecialCaptchas.filter((type: string) => type !== 'birth-date');
    localStorage.setItem('shownSpecialCaptchas', JSON.stringify(updatedShownCaptchas));
    setBirthDate('');
    setBirthDateInput('');
    alert('Doğum tarixi silindi!');
  };

  const handleOpenSettings = () => {
    setTempFrequency(captchaFrequency);
    setTempEnabledTypes(enabledCaptchaTypes);
    setShowSettingsModal(true);
  };

  const handleCloseSettings = () => {
    setShowSettingsModal(false);
  };

  const handleOpenQuestions = () => {
    setShowQuestionsModal(true);
  };

  const handleCloseQuestions = () => {
    setShowQuestionsModal(false);
  };

  const handleSaveSettings = () => {
    setCaptchaFrequency(tempFrequency);
    setEnabledCaptchaTypes(tempEnabledTypes);
    localStorage.setItem('captchaFrequency', tempFrequency);
    localStorage.setItem('enabledCaptchaTypes', JSON.stringify(tempEnabledTypes));
    setShowSettingsModal(false);
    alert('Ayarlar uğurla qeyd edildi!');
  };

  const handleSaveQuestions = () => {
    localStorage.setItem('captchaQuestions', JSON.stringify(questions));
    setShowQuestionsModal(false);
    alert('Suallar uğurla qeyd edildi!');
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert('Xahiş edirik sual və cavabı daxil edin');
      return;
    }
    const newQ: Question = {
      question: newQuestion.trim(),
      answer: newAnswer.trim()
    };
    const updatedQuestions = [...questions, newQ];
    setQuestions(updatedQuestions);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Şəxsi məlumatlar</h2>
            <div className="flex gap-2">
              <button
                onClick={handleOpenQuestions}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Suallar
              </button>
              <button
                onClick={handleOpenSettings}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ayarlar
              </button>
            </div>
          </div>
          
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
              <p className="text-gray-500 mb-2">Doğum tarixi (CAPTCHA üçün)</p>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={birthDateInput}
                  onChange={(e) => handleBirthDateInputChange(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={10}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBirthDate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Kaydet
                </button>
                <button
                  onClick={handleClearBirthDate}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sıfırla
                </button>
              </div>
              {birthDate && (
                <p className="text-xs text-green-600 mt-2">Qeyd edilmiş: {birthDate}</p>
              )}
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

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur Background */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseSettings}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-[slideUp_0.3s_ease-out] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">CAPTCHA Ayarları</h2>
                <button
                  onClick={handleCloseSettings}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* CAPTCHA Sıklığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CAPTCHA sıklığı
                </label>
                <select
                  value={tempFrequency}
                  onChange={(e) => setTempFrequency(e.target.value as CaptchaFrequency)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">CAPTCHAsız</option>
                  <option value="low">Az CAPTCHAlı</option>
                  <option value="medium">Orta CAPTCHAlı</option>
                  <option value="high">Çok CAPTCHAlı</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {tempFrequency === 'none' && '0 CAPTCHA'}
                  {tempFrequency === 'low' && '2 CAPTCHA'}
                  {tempFrequency === 'medium' && '5 CAPTCHA'}
                  {tempFrequency === 'high' && '7-8 CAPTCHA'}
                </p>
              </div>

              {/* CAPTCHA Türleri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  CAPTCHA türləri
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempEnabledTypes.includes('number')}
                      onChange={(e) => {
                        const newTypes: CaptchaType[] = e.target.checked
                          ? [...tempEnabledTypes, 'number']
                          : tempEnabledTypes.filter(t => t !== 'number') as CaptchaType[];
                        setTempEnabledTypes(newTypes);
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Rəqəm CAPTCHA</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempEnabledTypes.includes('text')}
                      onChange={(e) => {
                        const newTypes: CaptchaType[] = e.target.checked
                          ? [...tempEnabledTypes, 'text']
                          : tempEnabledTypes.filter(t => t !== 'text') as CaptchaType[];
                        setTempEnabledTypes(newTypes);
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Metin CAPTCHA</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempEnabledTypes.includes('date')}
                      onChange={(e) => {
                        const newTypes: CaptchaType[] = e.target.checked
                          ? [...tempEnabledTypes, 'date']
                          : tempEnabledTypes.filter(t => t !== 'date') as CaptchaType[];
                        setTempEnabledTypes(newTypes);
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Tarix CAPTCHA</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempEnabledTypes.includes('today-date')}
                      onChange={(e) => {
                        const newTypes: CaptchaType[] = e.target.checked
                          ? [...tempEnabledTypes, 'today-date']
                          : tempEnabledTypes.filter(t => t !== 'today-date') as CaptchaType[];
                        setTempEnabledTypes(newTypes);
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Bugünün Tarixi CAPTCHA</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempEnabledTypes.includes('birth-date')}
                      onChange={(e) => {
                        const newTypes: CaptchaType[] = e.target.checked
                          ? [...tempEnabledTypes, 'birth-date']
                          : tempEnabledTypes.filter(t => t !== 'birth-date') as CaptchaType[];
                        setTempEnabledTypes(newTypes);
                      }}
                      disabled={!birthDate}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className={`text-sm ${!birthDate ? 'text-gray-400' : 'text-gray-700'}`}>
                      Doğum Tarixi CAPTCHA
                      {!birthDate && <span className="text-xs ml-1">(Doğum tarixi qeyd edilməlidir)</span>}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempEnabledTypes.includes('question')}
                      onChange={(e) => {
                        const newTypes: CaptchaType[] = e.target.checked
                          ? [...tempEnabledTypes, 'question']
                          : tempEnabledTypes.filter(t => t !== 'question') as CaptchaType[];
                        setTempEnabledTypes(newTypes);
                      }}
                      disabled={questions.length === 0}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className={`text-sm ${questions.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                      Sual CAPTCHA
                      {questions.length === 0 && <span className="text-xs ml-1">(Ən azı 1 sual əlavə edilməlidir)</span>}
                    </span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseSettings}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Ləğv et
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions Modal */}
      {showQuestionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur Background */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseQuestions}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto animate-[slideUp_0.3s_ease-out] overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">CAPTCHA Sualları</h2>
                <button
                  onClick={handleCloseQuestions}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Mevcut Sorular */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mövcud Suallar ({questions.length})
                </label>
                
                {questions.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 mb-2">{q.question}</p>
                            <p className="text-xs text-gray-600 bg-white px-2 py-1 rounded inline-block">
                              Cavab: <span className="font-medium">{q.answer}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Sil"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                    Hələ heç bir sual əlavə edilməyib
                  </p>
                )}
              </div>

              {/* Yeni Soru Ekleme */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Yeni Sual Əlavə Et
                </label>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Sual
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Sualı daxil edin..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newAnswer.trim()) {
                          handleAddQuestion();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Cavab
                    </label>
                    <input
                      type="text"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Cavabı daxil edin..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newQuestion.trim() && newAnswer.trim()) {
                          handleAddQuestion();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleAddQuestion}
                    disabled={!newQuestion.trim() || !newAnswer.trim()}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Sual Əlavə Et
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={handleCloseQuestions}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Ləğv et
                </button>
                <button
                  onClick={handleSaveQuestions}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

