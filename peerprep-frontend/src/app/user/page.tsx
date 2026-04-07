"use client";

import { useEffect, useState, useRef } from 'react';
import { Book, ChevronDown, ArrowRight } from 'lucide-react';
import { fetchTopics } from '@/src/services/questionApi';
import Notification from '@/src/components/Notification';
import Image from 'next/image';
import findingPartnerSvg from '../../../public/images/finding-partner.svg'
import { useAuth } from '@/src/context/AuthContext';
import { useMatchingSession } from '@/src/hooks/useMatchingSession';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constant/route';


export default function UserDashboard() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(['Easy']);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [topicFieldError, setTopicFieldError] = useState('');
  const [difficultyFieldError, setDifficultyFieldError] = useState('');

  const router = useRouter();
  const { logout } = useAuth();

  const enterCollaborationRoom = (roomId: string, userId: string) => {
    router.push(ROUTES.ROOM(roomId, userId));
  }

  const { activeNotification, isMatching, startMatch, setActiveNotification } = useMatchingSession({
    onAuthError: logout,
    onMatchFound: enterCollaborationRoom
  });

  useEffect(() => {
    fetchTopics().then(setTopics)
    .catch(console.error)
    .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTopicDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const findMatch = () => {
    let hasError = false;
    
    if (selectedTopics.length === 0) {
      setTopicFieldError('Please select at least one question topic');
      hasError = true;
    }
    
    if (selectedDifficulties.length === 0) {
      setDifficultyFieldError('Please select at least one difficulty level');
      hasError = true;
    }

    if (hasError) return;

    const token = localStorage.getItem("token");
    startMatch({
      topic: selectedTopics,
      difficulty: selectedDifficulties,
      token,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-200">

      {activeNotification && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <Notification 
            {...activeNotification} 
            onClose={() => setActiveNotification(null)} 
          />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <h1 className="text-[2.5rem] font-bold mb-8">Start a Session</h1>

            <div className="mb-6">
              <div className="relative" ref={dropdownRef}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-70">
                  <Book size={20} />
                </div>

                <div 
                  className={`w-full border border-gray-200 rounded-sm py-4 pl-12 pr-10 text-[15px] cursor-pointer bg-white transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${isLoading ? 'opacity-50' : ''}`}
                  onClick={() => {
                    if (!isLoading) setIsTopicDropdownOpen(!isTopicDropdownOpen);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!isLoading) setIsTopicDropdownOpen(!isTopicDropdownOpen);
                    }
                  }}
                >
                  <span className="block truncate text-black">
                    {isLoading ? 'Loading topics...' : selectedTopics.length > 0 ? selectedTopics.join(', ') : 'Question Topics (Select multiple)'}
                  </span>
                </div>

                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none opacity-50">
                  <ChevronDown size={20} />
                </div>
                
                {isTopicDropdownOpen && !isLoading && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 text-black rounded-sm shadow-lg max-h-60 overflow-auto">
                    {topics.map(topic => (
                      <label key={topic} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-primary focus:ring-primary border-gray-400 rounded-sm cursor-pointer"
                          checked={selectedTopics.includes(topic)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTopics([...selectedTopics, topic]);
                            } else {
                              setSelectedTopics(selectedTopics.filter(t => t !== topic));
                            }
                            if (topicFieldError) setTopicFieldError('');
                          }}
                        />
                        <span className="text-[15px]">{topic}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {topicFieldError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {topicFieldError}
                </p>
              )}
            </div>

            <div className="flex border border-gray-400 rounded-sm mb-2 overflow-hidden bg-white">
              {['Easy', 'Medium', 'Hard'].map((level, idx) => {
                const isSelected = selectedDifficulties.includes(level); 
                return (
                <label 
                  key={level} 
                  className={`flex-1 flex items-center justify-center gap-3 py-3 cursor-pointer text-black hover:bg-gray-50 transition-colors ${
                    idx !== 2 ? 'border-r border-gray-400' : ''
                  }`}
                >
                  <input 
                    type="checkbox" 
                    name={`difficulty-${level}`} 
                    value={level}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDifficulties([...selectedDifficulties, level]);
                      } else {
                        setSelectedDifficulties(selectedDifficulties.filter(d => d !== level));
                      }
                      if (difficultyFieldError) setDifficultyFieldError('');
                    }}
                    className="w-4 h-4 rounded-sm text-primary focus:ring-primary border-gray-400 cursor-pointer" 
                  />
                  <span className="text-[15px] font-medium">{level}</span>
                </label>)
              })}
            </div>
            
            {difficultyFieldError ? (
              <p className="mb-4 text-sm text-red-600" role="alert">
                {difficultyFieldError}
              </p>
            ) : <div className="mb-6"></div>}

            <button
              onClick={findMatch}
              disabled={isMatching}
              className="cursor-pointer mt-8 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-sm flex items-center justify-center gap-2 text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Match Now <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Right Column */}
          <div className="w-full min-h-[450px] flex items-center justify-center rounded-sm">
            <Image
              priority
              src={findingPartnerSvg}
              alt="Finding Partner Illustration"
            />
          </div>
        </div>
      </main>
    </div>
  );
}