'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTimer } from '../TimerContext';
import { Captcha } from '../../components/chapca/Captcha';

export default function SearchPage() {
  const router = useRouter();
  const { startPageTimer, stopPageTimer } = useTimer();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isBuildingTypeSelected, setIsBuildingTypeSelected] = useState(false);
  const [selectedBuildingType, setSelectedBuildingType] = useState<string>('');
  const [floorFrom, setFloorFrom] = useState('');
  const [floorTo, setFloorTo] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [isSearchCaptcha, setIsSearchCaptcha] = useState(false);
  const [hasMiriData, setHasMiriData] = useState(false);
  const [showMiriImage, setShowMiriImage] = useState(false);
  const [imagePosition, setImagePosition] = useState<{ top: string; left: string }>({ top: '0', left: '0' });

  // Seçilen projeyi localStorage'dan oku
  useEffect(() => {
    const project = localStorage.getItem('selectedProject');
    if (project) {
      setSelectedProject(project);
    }
    // Miri data kontrolü
    const miriData = localStorage.getItem('miriData');
    if (miriData === 'true') {
      setHasMiriData(true);
    }
  }, []);

  // Miri data değişikliklerini dinle
  useEffect(() => {
    const checkMiriData = () => {
      const miriData = localStorage.getItem('miriData');
      const hasData = miriData === 'true';
      setHasMiriData(hasData);
    };
    
    // Sayfa yüklendiğinde kontrol et
    checkMiriData();
    
    // Storage değişikliklerini dinle
    window.addEventListener('storage', checkMiriData);
    
    // Her 200ms'de bir kontrol et (aynı tab'da değişiklikler için)
    const interval = setInterval(checkMiriData, 200);
    
    return () => {
      window.removeEventListener('storage', checkMiriData);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    startPageTimer('Axtarış');
    setCaptchaKey(0);
    setIsSearchCaptcha(false);
    return () => {
      stopPageTimer('Axtarış');
    };
  }, [startPageTimer, stopPageTimer]);

  // Sumqayıt güzəştli mənzillər için özel durum
  const isSumgayitGuzestli = selectedProject === 'sumgayit-guzestli';

  // Miri data'yı kontrol et - her render'da güncel değeri al
  const checkMiriData = () => {
    const miriData = localStorage.getItem('miriData');
    return miriData === 'true';
  };

  // Rastgele pozisyon oluştur
  const generateRandomPosition = () => {
    // Sayfanın farklı yerlerinden çıkması için rastgele pozisyon
    const positions = [
      { top: '10%', left: '10%' },   // Sol üst
      { top: '10%', left: '50%' },   // Üst orta
      { top: '10%', left: '90%' },   // Sağ üst
      { top: '50%', left: '10%' },   // Sol orta
      { top: '50%', left: '90%' },   // Sağ orta
      { top: '80%', left: '10%' },   // Sol alt
      { top: '80%', left: '50%' },   // Alt orta
      { top: '80%', left: '90%' },   // Sağ alt
      { top: '30%', left: '30%' },   // Sol üst iç
      { top: '30%', left: '70%' },   // Sağ üst iç
      { top: '70%', left: '30%' },   // Sol alt iç
      { top: '70%', left: '70%' },   // Sağ alt iç
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  };

  // 9 mərtəbəli butonuna tıklandığında miri resmi göster
  const handleBuildingTypeClick = () => {
    setIsBuildingTypeSelected(!isBuildingTypeSelected);
    
    // Eğer miriData true ise resmi göster
    if (checkMiriData()) {
      // Rastgele pozisyon oluştur
      const randomPos = generateRandomPosition();
      setImagePosition(randomPos);
      setShowMiriImage(true);
      // 3.5 saniye sonra kaybolsun (animasyon süresi)
      setTimeout(() => {
        setShowMiriImage(false);
      }, 3500);
    }
  };

  // 9. mərtəbə seçildiğinde resmi göster ve otomatik kayboldur
  useEffect(() => {
    const isFloor9 = floorFrom === '9' || floorTo === '9';
    const hasMiri = checkMiriData();
    
    if (isFloor9 && hasMiri) {
      setShowMiriImage(true);
      // 3 saniye sonra kaybolsun
      const timer = setTimeout(() => {
        setShowMiriImage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowMiriImage(false);
    }
  }, [floorFrom, floorTo]);

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    setIsSearchCaptcha(false);
    setShowResults(true);
  };

  // 100 tane mənzil verisi oluştur
  const generateApartments = () => {
    const apartments = [];
    const areas = [
      { min: 45.20, max: 52.30, price: 54240 },
      { min: 57.70, max: 69.10, price: 69240 },
      { min: 72.90, max: 85.20, price: 87480 },
      { min: 99.00, max: 119.50, price: 118800 },
    ];
    const rooms = ['1', '2', '3', '4'];
    const entrances = ['11', '12', '13', '14'];
    
    for (let i = 0; i < 100; i++) {
      const floor = (i % 9) + 1;
      const apartment = (i % 3) + 1;
      const roomIndex = i % 4;
      const areaIndex = roomIndex;
      const entrance = entrances[i % 4];
      
      apartments.push({
        building: '3',
        entrance: entrance,
        floor: `${floor}/9`,
        apartment: apartment.toString(),
        rooms: rooms[roomIndex],
        area: `${areas[areaIndex].min} - ${areas[areaIndex].max}`,
        price: areas[areaIndex].price.toString(),
      });
    }
    
    return apartments;
  };

  const apartments = generateApartments();

  const handleReset = () => {
    setIsBuildingTypeSelected(false);
    setSelectedBuildingType('');
    setFloorFrom('');
    setFloorTo('');
    setSelectedRooms([]);
    setShowResults(false);
  };

  // Form validasyonu - tüm alanlar doldurulmalı
  const isFormValid = () => {
    if (isSumgayitGuzestli) {
      return selectedBuildingType !== '' && floorFrom !== '' && floorTo !== '' && selectedRooms.length > 0;
    }
    return isBuildingTypeSelected && floorFrom !== '' && floorTo !== '' && selectedRooms.length > 0;
  };

  // Mərtəbə aralığı belirleme
  const getMaxFloor = () => {
    if (isSumgayitGuzestli) {
      return 15;
    }
    return 9;
  };

  // Bina tipi seçimi (Sumqayıt için)
  const handleBuildingTypeSelect = (type: string) => {
    if (selectedBuildingType === type) {
      setSelectedBuildingType('');
      setIsBuildingTypeSelected(false);
    } else {
      setSelectedBuildingType(type);
      setIsBuildingTypeSelected(true);
    }
  };

  const handleSearch = () => {
    // Form validasyonu kontrolü
    if (!isFormValid()) {
      alert('Xahiş edirik bütün sahələri doldurun.');
      return;
    }

    // CAPTCHA göster
    setShowCaptcha(true);
    setIsSearchCaptcha(true);
    setCaptchaKey(prev => prev + 1);
  };

  const handleSearchCaptchaSuccess = () => {
    setShowCaptcha(false);
    setIsSearchCaptcha(false);
    setShowResults(true);
  };

  const toggleRoom = (room: string) => {
    setSelectedRooms(prev =>
      prev.includes(room)
        ? prev.filter(r => r !== room)
        : [...prev, room]
    );
  };

  const handleInitialCaptchaSuccess = () => {
    setShowCaptcha(false);
    setIsSearchCaptcha(false);
  };

  return (
    <div className="min-h-screen bg-white">
        {showCaptcha && isSearchCaptcha && (
          <Captcha 
            onSuccess={handleCaptchaSuccess}
            key={captchaKey}
          />
        )}
        
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
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <span className="text-blue-600 font-medium underline text-sm">Axtarış</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <span className="text-gray-600 font-medium text-sm">Mənzil</span>
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
      <div className="flex p-8 gap-8">
        {/* Left Panel - Form */}
        <div className="w-[24%] sticky top-8 self-start">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <h1 className="text-xl font-bold text-gray-800">Binəqədi Yaşayış Kompleksi</h1>

            {/* Warning Banner */}
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

            <h2 className="text-base font-semibold text-gray-800">Parametrlər üzrə mənzil seçimi</h2>

            {/* Bina tipi - Buton */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bina tipi <span className="text-red-500">*</span></label>
              {isSumgayitGuzestli ? (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    {['9 mərtəbəli', '12 mərtəbəli'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleBuildingTypeSelect(type)}
                        className={`flex-1 px-4 py-2 border cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                          selectedBuildingType === type
                            ? 'bg-teal-500 text-white border-teal-600'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleBuildingTypeSelect('15 mərtəbəli')}
                    className={`w-full px-4 py-2 border cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                      selectedBuildingType === '15 mərtəbəli'
                        ? 'bg-teal-500 text-white border-teal-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    15 mərtəbəli
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBuildingTypeClick}
                  className={`w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 text-sm text-left transition-colors ${
                    isBuildingTypeSelected
                      ? 'bg-gray-300 border-gray-700 '
                      : 'bg-white '
                  }`}
                >
                  9 mərtəbəli
                </button>
              )}
            </div>

            {/* Mərtəbə seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mərtəbə seçimi <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <select
                    value={floorFrom}
                    onChange={(e) => setFloorFrom(e.target.value)}
                    className="w-full px-4 cursor-pointer py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
                    disabled={isSumgayitGuzestli ? selectedBuildingType === '' : !isBuildingTypeSelected}
                  >
                    <option value="">Seçin</option>
                    {((isSumgayitGuzestli ? selectedBuildingType !== '' : isBuildingTypeSelected) && Array.from({ length: getMaxFloor() }, (_, i) => i + 1).map(floor => (
                      <option key={floor} value={floor}>{floor}</option>
                    )))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="relative flex-1">
                  <select
                    value={floorTo}
                    onChange={(e) => setFloorTo(e.target.value)}
                    className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
                    disabled={isSumgayitGuzestli ? selectedBuildingType === '' : !isBuildingTypeSelected}
                  >
                    <option value="">Seçin</option>
                    {((isSumgayitGuzestli ? selectedBuildingType !== '' : isBuildingTypeSelected) && Array.from({ length: getMaxFloor() }, (_, i) => i + 1).map(floor => (
                      <option key={floor} value={floor}>{floor}</option>
                    )))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Otaq sayı - Çoklu seçim */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Otaq sayı <span className="text-red-500">*</span></label>
              {isSumgayitGuzestli ? (
                <div className="grid grid-cols-2 gap-3">
                  {['1 otaqlı', '2 otaqlı', '3 otaqlı', '4 otaqlı'].map((room) => (
                    <button
                      key={room}
                      onClick={() => toggleRoom(room)}
                      className={`w-full px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 text-sm font-medium transition-colors ${
                        selectedRooms.includes(room)
                          ? 'bg-gray-100'
                          : 'bg-white'
                      }`}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    {['1 otaqlı', '2 otaqlı', '3 otaqlı'].map((room) => (
                      <button
                        key={room}
                        onClick={() => toggleRoom(room)}
                        className={`flex-1 px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 text-sm font-medium transition-colors ${
                          selectedRooms.includes(room)
                            ? 'bg-gray-100 '
                            : 'bg-white'
                        }`}
                      >
                        {room}
                      </button>
                    ))}
                  </div>
                  <div>
                    <button
                      onClick={() => toggleRoom('4 otaqlı')}
                      className={`w-full px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 text-sm font-medium transition-colors ${
                        selectedRooms.includes('4 otaqlı')
                          ? 'bg-gray-100 '
                          : 'bg-white'
                      }`}
                    >
                      4 otaqlı
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="px-6 w-[48%] py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                Sıfırla
              </button>
              <button 
                onClick={handleSearch}
                disabled={!isFormValid()}
                className="px-6 w-[48%] cursor-pointer py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm"
              >
                Axtar
              </button>
            </div>

            {/* Geri Link */}
            <Link href="/demo/selections" className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Geri
            </Link>
          </div>
        </div>

        {/* Right Panel - Results or Placeholder */}
        <div className="flex-1">
          {showResults ? (
            <div className="w-full">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Bina</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Giriş</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mərtəbə</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mənzil</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Otaq sayı</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sahə, m²</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Qiymət, AZN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {apartments.map((apt, index) => (
                    <tr
                      key={index}
                      onClick={() => router.push('/demo/apartment')}
                      className="hover:bg-green-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">{apt.building}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{apt.entrance}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{apt.floor}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{apt.apartment}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{apt.rooms}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{apt.area}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{apt.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center relative">
                {/* 9. mərtəbə seçildiğinde ve miri data varsa resim göster - animasyonlu */}
                {showMiriImage ? (
                  <div 
                    className="fixed z-50"
                    style={{
                      top: imagePosition.top,
                      left: imagePosition.left,
                      transform: 'translate(-50%, -50%)',
                      animation: 'slideDownShakeFade 3.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}
                  >
                    <div>
                      <img 
                        src="/joke.png" 
                        alt="Miri" 
                        className="w-auto h-auto max-w-2xl mx-auto rounded-lg shadow-2xl"
                        style={{ maxHeight: '70vh' }}
                      />
                    </div>
                  </div>
                ) : null}
                
                {/* Normal placeholder */}
                {!showMiriImage && (
                  <>
                    <div className="inline-block p-8 border-2 border-dashed border-gray-300 rounded-lg mb-4">
                      <svg className="w-16 h-16 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm">Parametrlər üzrə axtarış edin.</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
