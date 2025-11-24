'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from '../TimerContext';
import { CaptchaModal } from './CaptchaModal';
import { TextCaptchaModal } from './TextCaptchaModal';

const projects = [
  { id: 'yasamal', name: 'Yasamal Yaşayış Kompleksi', bold: false, faded: false },
  { id: 'hovsan', name: 'Hövsan Yaşayış Kompleksi', bold: true, faded: false },
  { id: 'sumgayit-guzestli', name: 'Sumqayıt şəhərində güzəştli mənzillər', bold: false, faded: true },
  { id: 'gence', name: 'Gəncə Yaşayış Kompleksi', bold: false, faded: true },
  { id: 'yasamal-2', name: 'Yasamal Yaşayış Kompleksinin ikinci mərhələsi', bold: false, faded: true },
  { id: 'hovsan-2', name: 'Hövsan Yaşayış Kompleksinin ikinci mərhələsi', bold: true, faded: false },
  { id: 'lenkeran', name: 'Lənkəran Yaşayış Kompleksi', bold: false, faded: false },
  { id: 'sumgayit', name: 'Sumqayıt Yaşayış Kompleksi', bold: false, faded: false },
  { id: 'bineqedi', name: 'Binəqədi Yaşayış Kompleksi', bold: false, faded: false },
  { id: 'sirvan', name: 'Şirvan Yaşayış Kompleksi', bold: false, faded: false },
  { id: 'yevlax', name: 'Yevlax Yaşayış Kompleksi', bold: false, faded: false },
];

export default function SelectionsPage() {
  const router = useRouter();
  const { startPageTimer, stopPageTimer } = useTimer();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectionMethod, setSelectionMethod] = useState('');
  const [captchaCount, setCaptchaCount] = useState(() => {
    // Random olarak CAPTCHA kaç kere çıkacak: 0, 1 veya 2
    return Math.floor(Math.random() * 3); // 0, 1 veya 2
  });
  const [currentCaptchaIndex, setCurrentCaptchaIndex] = useState(0);
  const [showTextCaptcha, setShowTextCaptcha] = useState(false);
  const [isTextCaptchaVerified, setIsTextCaptchaVerified] = useState(false);
  const showCaptcha = currentCaptchaIndex < captchaCount;

  useEffect(() => {
    startPageTimer('Seçimlər');
    return () => {
      stopPageTimer('Seçimlər');
    };
  }, [startPageTimer, stopPageTimer]);

  const handleCaptchaSuccess = () => {
    if (currentCaptchaIndex + 1 < captchaCount) {
      // Daha fazla CAPTCHA gösterilecek
      setCurrentCaptchaIndex(currentCaptchaIndex + 1);
    } else {
      // Tüm CAPTCHA'lar tamamlandı
      setCurrentCaptchaIndex(captchaCount); // Modal'ı kapatmak için
    }
  };

  const handleTextCaptchaVerified = () => {
    setIsTextCaptchaVerified(true);
  };

  const handleTextCaptchaSuccess = () => {
    setShowTextCaptcha(false);
    setIsTextCaptchaVerified(false);
    router.push('/demo/search');
  };

  const handleNextButton = () => {
    // Eğer Text CAPTCHA doğrulandıysa, sayfa geçişi yap
    if (isTextCaptchaVerified) {
      setShowTextCaptcha(false);
      setIsTextCaptchaVerified(false);
      router.push('/demo/search');
      return;
    }

    // Eğer CAPTCHA gösteriliyorsa ama doğrulanmadıysa, işlem yapma
    if ((showTextCaptcha && !isTextCaptchaVerified) || showCaptcha) {
      return;
    }

    // Eğer form doldurulmuşsa, Text CAPTCHA göster
    if (selectedProject) {
      setShowTextCaptcha(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Eğer Text CAPTCHA doğrulandıysa, Enter ile sayfa geçişi yap
      if (isTextCaptchaVerified && e.key === 'Enter') {
        setShowTextCaptcha(false);
        setIsTextCaptchaVerified(false);
        router.push('/demo/search');
        return;
      }

      // Eğer CAPTCHA gösteriliyorsa ama doğrulanmadıysa, Enter'ı işleme
      if ((showTextCaptcha && !isTextCaptchaVerified) || showCaptcha) {
        return;
      }
      
      // Eğer form doldurulmuşsa ve Enter'a basılmışsa
      if (e.key === 'Enter' && selectedProject) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Text CAPTCHA göster
        setShowTextCaptcha(true);
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedProject, showTextCaptcha, showCaptcha, isTextCaptchaVerified, router]);

  return (
    <div className="min-h-screen bg-white p-16">
        {showCaptcha && <CaptchaModal onSuccess={handleCaptchaSuccess} key={currentCaptchaIndex} />}
        
        {/* Step Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <span className="text-blue-600 font-medium underline text-sm">Seçimlər</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-gray-600 font-medium text-sm">Mənzil</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-gray-600 font-medium text-sm">Ərizə</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Left Sidebar Indicator */}
          <div className="w-1 bg-green-500 relative">
            <div className="absolute top-8 left-0 pl-4 whitespace-nowrap">
              <span className="text-sm text-gray-600">Mənzil sifarişi</span>
            </div>
          </div>
          
          {/* Main Form Area */}
          <div className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Seçimlər</h1>

            <div className="max-w-2xl space-y-6">
              {/* Layihə Section */}
              <div className="flex items-center gap-4 py-2">
                <label className="text-base font-medium text-gray-700 whitespace-nowrap">
                  Layihə
                </label>
                <div className="relative ml-32">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-96 text-sm px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  >
                    <option value="">Layihəni seçin</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
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

              {/* Ödəniş üsulu Section */}
              <div className="py-2">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Ödəniş üsulu
                </label>
                <div className="flex gap-6">
                  <label className={`flex items-center gap-3 py-2 px-4 ${!selectedProject ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="own"
                      checked={paymentMethod === 'own'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={!selectedProject}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-gray-700 text-base">Öz vəsaiti hesabına</span>
                  </label>
                  <label className={`flex items-center gap-3 py-2 px-4 ${!selectedProject ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="mortgage"
                      checked={paymentMethod === 'mortgage'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={!selectedProject}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-gray-700 text-base flex items-center gap-2">
                      İpoteka krediti hesabına
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs text-blue-600 font-semibold">i</span>
                      </div>
                    </span>
                  </label>
                </div>
              </div>

              {/* Mənzil seçimi üsulu Section */}
              <div className="py-2">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Mənzil seçimi üsulu
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer py-2 px-4">
                    <input
                      type="radio"
                      name="selection"
                      value="map"
                      checked={selectionMethod === 'map'}
                      onChange={(e) => setSelectionMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-base">Xəritə üzərində</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer py-2 px-4">
                    <input
                      type="radio"
                      name="selection"
                      value="params"
                      checked={selectionMethod === 'params'}
                      onChange={(e) => setSelectionMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-base">Parametrlər üzrə</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer py-2 px-4">
                    <input
                      type="radio"
                      name="selection"
                      value="address"
                      checked={selectionMethod === 'address'}
                      onChange={(e) => setSelectionMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-base">Ünvan üzrə</span>
                  </label>
                </div>
              </div>

              {/* Warning Banner ve CAPTCHA */}
              {showTextCaptcha ? (
                <TextCaptchaModal 
                  onSuccess={handleTextCaptchaSuccess} 
                  onVerified={handleTextCaptchaVerified}
                />
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-yellow-800">
                      DİQQƏT! Mənzil seçimi prosesində əlavə təhlükəsizlik tədbirləri tətbiq edilə bilər.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 bg-gray-50">
              &lt; Əvvəlki
            </button>
            <button 
              onClick={handleNextButton}
              disabled={!selectedProject && !isTextCaptchaVerified}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium"
            >
              Növbəti &gt;
            </button>
          </div>
          <p className="text-sm text-gray-600">2025 © MİDA</p>
        </footer>
    </div>
  );
}
