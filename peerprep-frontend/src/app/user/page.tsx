"use client";

import { useEffect, useState } from 'react';
import { Book, ChevronDown, ArrowRight } from 'lucide-react';
import { fetchTopics } from '@/src/services/questionApi';
import { io } from "socket.io-client";
import { API_BASE } from "@/src/constant/api"
import { useAuth } from '@/src/auth/AuthContext';
import Notification, { NotificationProps } from '@/src/components/Notification';

enum MatchState {
  NOT_STARTED,
  FINDING,
  TIMEOUT,
  FOUND,
  ERROR
}

export default function UserDashboard() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
  const [isLoading, setIsLoading] = useState(true);
  const [matchState, setMatchState] = useState<MatchState>(MatchState.NOT_STARTED);
  const [activeNotification, setActiveNotification] = useState<NotificationProps | null>(null);

  const { logout } = useAuth();

  useEffect(() => {
    fetchTopics().then(setTopics)
    .catch(console.error)
    .finally(() => setIsLoading(false));
  }, []);

  const findMatch = () => {
    if (!selectedTopic) {
      return;
    }

    // TO-REMOVE
    console.log(`Find Match with Topic: ${selectedTopic}, Difficulty: ${selectedDifficulty}`);

    const token = localStorage.getItem("token");

    const socket = io(API_BASE.MATCHING_SERIVCE, {
      auth: {
        token: token, 
      },
      query: {
        topic: selectedTopic,
        difficulty: selectedDifficulty.toLowerCase(),
      },
    });

    socket.on('connect', () => {
      setMatchState(MatchState.FINDING);

      setActiveNotification({
        type: 'info',
        title: 'Finding you a coding partner ...',
        message: 'Time Elapsed: 0s',
        rightAction: 'spinner',
        actionButton: {
          label: 'Cancel',
          variant: 'outlined',
          onClick: () => {
            socket.disconnect();
            setActiveNotification(null);
          },
        }
      });

      socket.on('MATCH_FOUND', (payload) => {
        setMatchState(MatchState.FOUND);
        console.log(`MATCH FOUND: ${JSON.stringify(payload)}`);
      });

      socket.on('MATCH_ERROR', (error) => {
        setMatchState(MatchState.ERROR);
        console.log(`MATCH ERROR: ${error.message}`);
      });
    });

    // TO-DO: Error use code instead
    socket.on("connect_error", (err) => {
      console.error("❌ Connection rejected:", err.message);
      if (err.message === "Authentication error: Invalid or expired token") {
        logout();
      }
    });
  }

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

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-70">
                <Book size={20} />
              </div>
              
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-4 pl-12 pr-10 text-[15px] text-foreground cursor-pointer appearance-none hover:bg-gray-100 transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  {isLoading ? 'Loading topics...' : 'Question Topic'}
                </option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>

              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none opacity-50">
                <ChevronDown size={20} />
              </div>
            </div>

            <div className="flex border border-gray-400 rounded-sm mb-6 overflow-hidden">
              {['Easy', 'Medium', 'Hard'].map((level, idx) => {
                const isSelected = selectedDifficulty === level; 
                return (
                <label 
                  key={level} 
                  className={`flex-1 flex items-center justify-center gap-3 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    idx !== 2 ? 'border-r border-gray-400' : ''
                  }`}
                >
                  <input 
                    type="radio" 
                    name="difficulty" 
                    value={level}
                    checked={isSelected}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-400 cursor-pointer" 
                  />
                  <span className="text-[15px] font-medium">{level}</span>
                </label>)
              })}
            </div>

            <button onClick={findMatch} className="cursor-pointer mt-8 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-sm flex items-center justify-center gap-2 text-lg transition-colors">
              Match Now <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Right Column */}
          <div className="bg-gray-200 w-full min-h-[450px] flex items-center justify-center rounded-sm">
          </div>
        </div>
      </main>
    </div>
  );
}