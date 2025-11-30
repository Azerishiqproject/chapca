'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../../demo/TimerContext';

interface QuestionCaptchaModalProps {
  onSuccess: () => void;
}

interface Question {
  question: string;
  answer: string;
}

export function QuestionCaptchaModal({ onSuccess }: QuestionCaptchaModalProps) {
  const { startCaptchaTimer, stopCaptchaTimer } = useTimer();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // Load questions from localStorage and select a random one (only once on mount)
  useEffect(() => {
    // Prevent multiple initializations
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    startCaptchaTimer('Sual CAPTCHA');
    
    const savedQuestions = localStorage.getItem('captchaQuestions');
    if (savedQuestions) {
      try {
        const questions: Question[] = JSON.parse(savedQuestions);
        if (questions.length > 0) {
          // Select a random question
          const randomIndex = Math.floor(Math.random() * questions.length);
          setSelectedQuestion(questions[randomIndex]);
        } else {
          // No questions available, skip CAPTCHA
          stopCaptchaTimer('Sual CAPTCHA');
          onSuccess();
        }
      } catch (e) {
        // Invalid JSON, skip CAPTCHA
        stopCaptchaTimer('Sual CAPTCHA');
        onSuccess();
      }
    } else {
      // No questions saved, skip CAPTCHA
      stopCaptchaTimer('Sual CAPTCHA');
      onSuccess();
    }
    
    return () => {
      stopCaptchaTimer('Sual CAPTCHA');
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (inputRef.current && selectedQuestion) {
      inputRef.current.focus();
    }
  }, [selectedQuestion]);

  const handleSubmit = () => {
    if (!selectedQuestion) return;
    
    // Normalize answers (trim, lowercase, remove extra spaces)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedCorrectAnswer = selectedQuestion.answer.trim().toLowerCase().replace(/\s+/g, ' ');
    
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      stopCaptchaTimer('Sual CAPTCHA');
      onSuccess();
    } else {
      // Wrong answer, reload a new random question
      const savedQuestions = localStorage.getItem('captchaQuestions');
      if (savedQuestions) {
        try {
          const questions: Question[] = JSON.parse(savedQuestions);
          if (questions.length > 0) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            setSelectedQuestion(questions[randomIndex]);
            setUserAnswer('');
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }
        } catch (e) {
          // Error loading questions
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!selectedQuestion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto animate-[slideUp_0.3s_ease-out] overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Sual CAPTCHA</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
              {selectedQuestion.question}
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="answer-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Cavabınızı daxil edin:
                </label>
                <input
                  ref={inputRef}
                  id="answer-input"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Cavabı yazın..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                  autoFocus
                />
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Təsdiq et
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

