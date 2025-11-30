'use client';

import { useState, useEffect } from 'react';
import { CaptchaModal } from './CaptchaModal';
import { TextCaptchaModal } from './TextCaptchaModal';
import { DateCaptchaModal } from './DateCaptchaModal';
import { TodayDateCaptchaModal } from './TodayDateCaptchaModal';
import { BirthDateCaptchaModal } from './BirthDateCaptchaModal';
import { QuestionCaptchaModal } from './QuestionCaptchaModal';

interface CaptchaProps {
  onSuccess: () => void;
  onVerified?: () => void;
}

type CaptchaType = 'number' | 'text' | 'date' | 'today-date' | 'birth-date' | 'question';

export function Captcha({ onSuccess, onVerified }: CaptchaProps) {
  const [captchaType, setCaptchaType] = useState<CaptchaType | null>(null);
  const [captchaCount, setCaptchaCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [captchaQueue, setCaptchaQueue] = useState<CaptchaType[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Sadece bir kere çalışsın
    if (initialized) return;
    setInitialized(true);
    
    // CAPTCHA sıklık modunu kontrol et
    const frequency = localStorage.getItem('captchaFrequency') || 'medium';
    
    // Eğer CAPTCHAsız mod seçilmişse, hiçbir şey gösterme ve direkt başarılı ol
    if (frequency === 'none') {
      onSuccess();
      return;
    }
    
    // Global CAPTCHA sayacını kontrol et
    const globalCaptchaCount = parseInt(localStorage.getItem('globalCaptchaCount') || '0');
    const globalCaptchaLimit = parseInt(localStorage.getItem('globalCaptchaLimit') || '0');
    
    console.log('Global CAPTCHA - count:', globalCaptchaCount, 'limit:', globalCaptchaLimit);
    
    // Eğer limit dolmuşsa, direkt başarılı ol
    if (globalCaptchaCount >= globalCaptchaLimit && globalCaptchaLimit > 0) {
      console.log('Global CAPTCHA limit reached, skipping');
      onSuccess();
      return;
    }
    
    // Sıklık moduna göre TOPLAM CAPTCHA sayısını belirle (tüm uygulama için)
    let totalLimit;
    switch (frequency) {
      case 'low':
        totalLimit = 2;
        break;
      case 'medium':
        totalLimit = 5;
        break;
      case 'high':
        totalLimit = Math.floor(Math.random() * 2) + 7; // 7 veya 8
        break;
      default:
        totalLimit = 5;
    }
    
    // İlk kez çalışıyorsa, limiti kaydet
    if (globalCaptchaLimit === 0) {
      localStorage.setItem('globalCaptchaLimit', totalLimit.toString());
      localStorage.setItem('globalCaptchaCount', '0');
    }
    
    // Bu component için kaç CAPTCHA göstereceğimizi hesapla
    const currentLimit = globalCaptchaLimit || totalLimit;
    const remainingCaptchas = currentLimit - globalCaptchaCount;
    
    // Eğer kalan CAPTCHA yoksa, direkt başarılı ol
    if (remainingCaptchas <= 0) {
      console.log('No remaining CAPTCHAs, skipping');
      onSuccess();
      return;
    }
    
    const totalCount = Math.min(remainingCaptchas, 2); // Maksimum 2 CAPTCHA bu component'te
    
    console.log('This component will show:', totalCount, 'CAPTCHAs (remaining:', remainingCaptchas, ')');
    
    // Aktif CAPTCHA türlerini localStorage'dan al
    const savedEnabledTypes = localStorage.getItem('enabledCaptchaTypes');
    let enabledTypes: CaptchaType[] = ['number', 'text', 'date', 'today-date', 'birth-date', 'question'];
    if (savedEnabledTypes) {
      try {
        const parsed = JSON.parse(savedEnabledTypes) as CaptchaType[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          enabledTypes = parsed;
        }
      } catch (e) {
        // Invalid JSON, use default
      }
    }
    
    // Doğum tarihi kontrolü
    const savedBirthDate = localStorage.getItem('birthDate');
    
    // Gösterilmiş özel CAPTCHA'ları kontrol et (bugünün tarixi və doğum tarixi)
    const shownSpecialCaptchas = JSON.parse(localStorage.getItem('shownSpecialCaptchas') || '[]') as CaptchaType[];
    console.log('Shown special CAPTCHAs:', shownSpecialCaptchas);
    
    const baseTypes: CaptchaType[] = [];
    
    // Sadece aktif olan CAPTCHA türlerini ekle
    if (enabledTypes.includes('number')) {
      baseTypes.push('number');
    }
    
    if (enabledTypes.includes('text')) {
      baseTypes.push('text', 'text'); // Metin CAPTCHA'sı 2 kere
    }
    
    if (enabledTypes.includes('date')) {
      baseTypes.push('date');
    }
    
    // Bugünün tarixi CAPTCHA'sı - sadece 1 kere göster
    if (enabledTypes.includes('today-date') && !shownSpecialCaptchas.includes('today-date')) {
      baseTypes.push('today-date'); // Sadece 1 kere ekle
    }
    
    // Doğum tarixi CAPTCHA'sı - sadece 1 kere göster
    if (enabledTypes.includes('birth-date') && savedBirthDate && !shownSpecialCaptchas.includes('birth-date')) {
      baseTypes.push('birth-date'); // Sadece 1 kere ekle
    }
    
    // Soru CAPTCHA'sı - sorular varsa ekle
    if (enabledTypes.includes('question')) {
      const savedQuestions = localStorage.getItem('captchaQuestions');
      if (savedQuestions) {
        try {
          const questions = JSON.parse(savedQuestions);
          if (Array.isArray(questions) && questions.length > 0) {
            baseTypes.push('question');
          }
        } catch (e) {
          // Invalid JSON, skip
        }
      }
    }
    
    console.log('=== CAPTCHA Setup ===');
    console.log('frequency:', frequency);
    console.log('totalCount:', totalCount);
    console.log('enabledTypes:', enabledTypes);
    console.log('baseTypes:', baseTypes);
    console.log('===================');
    
    // Eğer hiç aktif CAPTCHA yoksa, direkt başarılı ol
    if (baseTypes.length === 0) {
      console.log('No CAPTCHA types available, calling onSuccess directly');
      onSuccess();
      return;
    }
    
    // Random CAPTCHA kuyruğu oluştur
    const queue: CaptchaType[] = [];
    const usedSpecialCaptchas = new Set<CaptchaType>(); // Özel CAPTCHA'ları takip et
    
    for (let i = 0; i < totalCount; i++) {
      const randomType = baseTypes[Math.floor(Math.random() * baseTypes.length)];
      
      // Eğer özel CAPTCHA ise ve daha önce kullanıldıysa, başka bir tane seç
      if ((randomType === 'today-date' || randomType === 'birth-date') && usedSpecialCaptchas.has(randomType)) {
        // Özel olmayan bir CAPTCHA seç
        const nonSpecialTypes = baseTypes.filter(t => t !== 'today-date' && t !== 'birth-date');
        if (nonSpecialTypes.length > 0) {
          const alternativeType = nonSpecialTypes[Math.floor(Math.random() * nonSpecialTypes.length)];
          queue.push(alternativeType);
        } else {
          // Eğer sadece özel CAPTCHA'lar varsa, kuyruğu kısalt
          break;
        }
      } else {
        queue.push(randomType);
        // Özel CAPTCHA ise, kullanıldı olarak işaretle
        if (randomType === 'today-date' || randomType === 'birth-date') {
          usedSpecialCaptchas.add(randomType);
        }
      }
    }
    
    console.log('CAPTCHA Queue:', queue);
    console.log('Queue length:', queue.length);
    console.log('Used special CAPTCHAs in queue:', Array.from(usedSpecialCaptchas));
    
    if (queue.length === 0) {
      console.log('Empty queue, calling onSuccess');
      onSuccess();
      return;
    }
    
    setCaptchaQueue(queue);
    setCaptchaCount(queue.length);
    setCurrentIndex(0);
    setCaptchaType(queue[0]); // İlk CAPTCHA'yı göster
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // CAPTCHA başarılı olduğunda
  const handleSuccess = () => {
    console.log('CAPTCHA Success - currentIndex:', currentIndex, 'captchaCount:', captchaCount, 'type:', captchaType);
    
    // Eğer özel CAPTCHA ise (bugünün tarixi veya doğum tarixi), gösterildi olarak işaretle
    if (captchaType === 'today-date' || captchaType === 'birth-date') {
      const shownSpecialCaptchas = JSON.parse(localStorage.getItem('shownSpecialCaptchas') || '[]') as CaptchaType[];
      if (!shownSpecialCaptchas.includes(captchaType)) {
        shownSpecialCaptchas.push(captchaType);
        localStorage.setItem('shownSpecialCaptchas', JSON.stringify(shownSpecialCaptchas));
        console.log('Marked special CAPTCHA as shown:', captchaType);
      }
    }
    
    // Global sayacı artır
    const currentGlobalCount = parseInt(localStorage.getItem('globalCaptchaCount') || '0');
    const newGlobalCount = currentGlobalCount + 1;
    localStorage.setItem('globalCaptchaCount', newGlobalCount.toString());
    console.log('Global CAPTCHA count updated:', newGlobalCount);
    
    // Bir sonraki CAPTCHA'ya geç
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < captchaCount) {
      // Daha fazla CAPTCHA var
      console.log('Next CAPTCHA - index:', nextIndex, 'type:', captchaQueue[nextIndex]);
      setCurrentIndex(nextIndex);
      setCaptchaType(captchaQueue[nextIndex]);
    } else {
      // Bu component'teki CAPTCHA'lar tamamlandı
      console.log('Component CAPTCHAs completed');
      onSuccess();
    }
  };

  // CAPTCHA tipi seçilene kadar hiçbir şey gösterme
  if (!captchaType) {
    return null;
  }

  // Seçilen CAPTCHA tipine göre ilgili component'i render et
  // Key prop ile her CAPTCHA'nın benzersiz olmasını sağla
  const captchaKey = `${captchaType}-${currentIndex}`;
  
  switch (captchaType) {
    case 'number':
      return <CaptchaModal key={captchaKey} onSuccess={handleSuccess} />;
    
    case 'text':
      return (
        <TextCaptchaModal 
          key={captchaKey}
          onSuccess={handleSuccess} 
          onVerified={onVerified || (() => {})}
        />
      );
    
    case 'date':
      return <DateCaptchaModal key={captchaKey} onSuccess={handleSuccess} />;
    
    case 'today-date':
      return <TodayDateCaptchaModal key={captchaKey} onSuccess={handleSuccess} />;
    
    case 'birth-date':
      return <BirthDateCaptchaModal key={captchaKey} onSuccess={handleSuccess} />;
    
    case 'question':
      return <QuestionCaptchaModal key={captchaKey} onSuccess={handleSuccess} />;
    
    default:
      return null;
  }
}
