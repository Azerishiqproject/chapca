'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface PageTimeEntry {
  pageName: string;
  startTime: number;
  endTime: number | null;
  duration: number; // milliseconds
}

export interface CaptchaTimeEntry {
  captchaName: string;
  startTime: number;
  endTime: number | null;
  duration: number; // milliseconds
}

interface TimerContextType {
  isTimerRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  elapsedTime: number;
  resetTimer: () => void;
  countdown: number | null;
  setCountdown: React.Dispatch<React.SetStateAction<number | null>>;
  isCardDisabled: boolean;
  setIsCardDisabled: (disabled: boolean) => void;
  startPageTimer: (pageName: string) => void;
  stopPageTimer: (pageName: string) => void;
  startCaptchaTimer: (captchaName: string) => void;
  stopCaptchaTimer: (captchaName: string) => void;
  getPageTimes: () => PageTimeEntry[];
  getCaptchaTimes: () => CaptchaTimeEntry[];
  getTotalTime: () => number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Now in milliseconds
  const [startTime, setStartTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCardDisabled, setIsCardDisabled] = useState(true);
  const [pageTimes, setPageTimes] = useState<PageTimeEntry[]>([]);
  const [captchaTimes, setCaptchaTimes] = useState<CaptchaTimeEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedStartTime = localStorage.getItem('timerStartTime');
    const savedElapsed = localStorage.getItem('timerElapsed');
    const savedRunning = localStorage.getItem('timerRunning');
    const savedPageTimes = localStorage.getItem('pageTimes');
    const savedCaptchaTimes = localStorage.getItem('captchaTimes');
    const savedCountdown = localStorage.getItem('countdown');
    const savedCardDisabled = localStorage.getItem('isCardDisabled');
    
    if (savedStartTime && savedRunning === 'true') {
      const start = parseInt(savedStartTime);
      const now = Date.now();
      // Calculate elapsed time in milliseconds
      const elapsed = now - start;
      setStartTime(start);
      setElapsedTime(elapsed);
      setIsTimerRunning(true);
    } else if (savedElapsed) {
      // If timer was stopped, use saved elapsed time
      setElapsedTime(parseInt(savedElapsed));
    }
    
    if (savedCountdown) {
      const countdownValue = parseInt(savedCountdown);
      if (countdownValue > 0) {
        setCountdown(countdownValue);
      }
    }
    
    if (savedCardDisabled) {
      setIsCardDisabled(savedCardDisabled === 'true');
    }
    
    if (savedPageTimes) {
      try {
        setPageTimes(JSON.parse(savedPageTimes));
      } catch (e) {
        console.error('Failed to parse pageTimes from localStorage', e);
      }
    }
    
    if (savedCaptchaTimes) {
      try {
        setCaptchaTimes(JSON.parse(savedCaptchaTimes));
      } catch (e) {
        console.error('Failed to parse captchaTimes from localStorage', e);
      }
    }
  }, []);

  const startTimer = useCallback(() => {
    const now = Date.now();
    setStartTime(now);
    setIsTimerRunning(true);
    setElapsedTime(0);
    localStorage.setItem('timerStartTime', now.toString());
    localStorage.setItem('timerRunning', 'true');
    localStorage.setItem('timerElapsed', '0');
  }, []);

  useEffect(() => {
    let animationFrame: number | null = null;
    
    if (isTimerRunning && startTime) {
      const update = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        setElapsedTime(elapsed);
        localStorage.setItem('timerElapsed', elapsed.toString());
        
        animationFrame = requestAnimationFrame(update);
      };
      
      animationFrame = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isTimerRunning, startTime]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            setIsCardDisabled(false);
            startTimer();
            localStorage.removeItem('countdown');
            localStorage.setItem('isCardDisabled', 'false');
            return null;
          }
          const newCountdown = prev - 1;
          localStorage.setItem('countdown', newCountdown.toString());
          return newCountdown;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, setIsCardDisabled, startTimer]);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
    localStorage.setItem('timerRunning', 'false');
  }, []);

  const resetTimer = useCallback(() => {
    setIsTimerRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    setCountdown(null);
    setIsCardDisabled(true);
    setPageTimes([]);
    setCaptchaTimes([]);
    localStorage.removeItem('timerStartTime');
    localStorage.removeItem('timerRunning');
    localStorage.removeItem('timerElapsed');
    localStorage.removeItem('pageTimes');
    localStorage.removeItem('captchaTimes');
    localStorage.removeItem('countdown');
    localStorage.removeItem('isCardDisabled');
  }, []);

  const startPageTimer = useCallback((pageName: string) => {
    const now = Date.now();
    setPageTimes(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(p => p.pageName === pageName && p.endTime === null);
      
      if (existingIndex === -1) {
        updated.push({
          pageName,
          startTime: now,
          endTime: null,
          duration: 0
        });
      }
      
      const saved = JSON.stringify(updated);
      localStorage.setItem('pageTimes', saved);
      return updated;
    });
  }, []);

  const stopPageTimer = useCallback((pageName: string) => {
    const now = Date.now();
    setPageTimes(prev => {
      const updated = prev.map(page => {
        if (page.pageName === pageName && page.endTime === null) {
          const duration = now - page.startTime;
          return {
            ...page,
            endTime: now,
            duration
          };
        }
        return page;
      });
      
      const saved = JSON.stringify(updated);
      localStorage.setItem('pageTimes', saved);
      return updated;
    });
  }, [setPageTimes]);

  const startCaptchaTimer = useCallback((captchaName: string) => {
    const now = Date.now();
    setCaptchaTimes(prev => {
      const updated = [...prev];
      updated.push({
        captchaName,
        startTime: now,
        endTime: null,
        duration: 0
      });
      
      const saved = JSON.stringify(updated);
      localStorage.setItem('captchaTimes', saved);
      return updated;
    });
  }, []);

  const stopCaptchaTimer = useCallback((captchaName: string) => {
    const now = Date.now();
    setCaptchaTimes(prev => {
      const updated = [...prev];
      // Find the last entry with this name that hasn't ended
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].captchaName === captchaName && updated[i].endTime === null) {
          updated[i] = {
            ...updated[i],
            endTime: now,
            duration: now - updated[i].startTime
          };
          break;
        }
      }
      
      const saved = JSON.stringify(updated);
      localStorage.setItem('captchaTimes', saved);
      return updated;
    });
  }, []);

  const getPageTimes = (): PageTimeEntry[] => {
    return pageTimes.map(page => {
      if (page.endTime === null) {
        // If page is still active, calculate current duration
        const now = Date.now();
        return {
          ...page,
          duration: now - page.startTime
        };
      }
      return page;
    });
  };

  const getCaptchaTimes = (): CaptchaTimeEntry[] => {
    return captchaTimes.map(captcha => {
      if (captcha.endTime === null) {
        // If captcha is still active, calculate current duration
        const now = Date.now();
        return {
          ...captcha,
          duration: now - captcha.startTime
        };
      }
      return captcha;
    });
  };

  const getTotalTime = (): number => {
    return elapsedTime;
  };

  return (
    <TimerContext.Provider value={{ 
      isTimerRunning, 
      startTimer, 
      stopTimer, 
      elapsedTime, 
      resetTimer,
      countdown,
      setCountdown,
      isCardDisabled,
      setIsCardDisabled,
      startPageTimer,
      stopPageTimer,
      startCaptchaTimer,
      stopCaptchaTimer,
      getPageTimes,
      getCaptchaTimes,
      getTotalTime
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}

