'use client';

import { useState, useEffect } from 'react';

// SHA-256 hash fonksiyonu
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Obfuscated hash değeri - runtime'da decode ediliyor
// Bu şekilde inspect'ten direkt görünmez
const getCorrectHash = (): string => {
  // Hash değeri offset ile karıştırılmış (offset: 13)
  // Bu sayede inspect'ten direkt hash görünmez
  const offset = 13;
  const encoded = [
    66, 112, 110, 114, 64, 110, 68, 65, 63, 65, 63, 69, 111, 65, 110, 111,
    61, 63, 115, 62, 62, 114, 111, 112, 70, 114, 110, 69, 70, 61, 61, 67,
    70, 65, 112, 68, 111, 69, 115, 68, 65, 69, 112, 112, 110, 110, 114, 65,
    68, 68, 111, 113, 63, 65, 63, 113, 111, 112, 70, 61, 110, 69, 114, 67
  ];
  // Offset'i geri al ve string'e çevir
  return encoded.map(n => String.fromCharCode(n - offset)).join('');
};

export function PasswordProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage'dan kontrol et
    const authStatus = localStorage.getItem('demoAuth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Xahiş edirik parolanı daxil edin.');
      return;
    }

    // Parolayı hash'le ve kontrol et
    const hashedPassword = await hashPassword(password);
    
    // Hash'leri karşılaştır
    const correctHash = getCorrectHash();
    if (hashedPassword === correctHash) {
      // Parola doğru, localStorage'a kaydet
      localStorage.setItem('demoAuth', 'authenticated');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Yanlış parola! Xahiş edirik düzgün parolanı daxil edin.');
      setPassword('');
    }
  };

  // Tarayıcı kapanınca localStorage'dan sil
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('demoAuth');
    };

    // Sayfa kapatılırken veya yenilenirken temizle
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Visibility change (sekme değiştiğinde veya tarayıcı kapanırken)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Tarayıcı kapanıyor olabilir, ama kesin değil
        // beforeunload daha güvenilir
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Yüklənir...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Parola Tələb Olunur</h2>
            <p className="text-gray-600">Bu səhifəyə daxil olmaq üçün parola daxil edin</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Parola
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Parolanı daxil edin"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Daxil ol
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

