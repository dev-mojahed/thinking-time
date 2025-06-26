import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Settings, History, Info } from 'lucide-react';
import { CircularTimer } from './CircularTimer';
import { IdeaCard } from './PromptCard';
import { SessionSummary } from './SessionSummary';
import { IdeaModeSelector } from './PromptModeSelector';
import { AppIntro } from './AppIntro';
import { audioService } from '../services/AudioService';
import { getRandomPrompt } from '../utils/prompts';
import { saveSession, getStoredData, updateSettings } from '../utils/storage';
import { TimerState, PromptResponse } from '../types';

interface TimerViewProps {
  onViewChange: (view: string) => void;
}

export const TimerView: React.FC<TimerViewProps> = ({ onViewChange }) => {
  const [timerState, setTimerState] = useState<TimerState>({
    timeLeft: 900,
    isRunning: false,
    isPaused: false,
    startTime: null,
    currentSession: null
  });

  const [currentIdea, setCurrentIdea] = useState<string | null>(null);
  const [ideaResponses, setIdeaResponses] = useState<PromptResponse[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showIdeaModeSelector, setShowIdeaModeSelector] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [currentIdeaMode, setCurrentIdeaMode] = useState<'early' | 'delayed' | 'none'>('delayed');
  const [ideaSchedule, setIdeaSchedule] = useState<number[]>([]);
  const [nextIdeaIndex, setNextIdeaIndex] = useState(0);
  const [hasShownEarlyIdea, setHasShownEarlyIdea] = useState(false);
  const [ideaTimeouts, setIdeaTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [settings, setSettings] = useState(() => getStoredData().settings);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Check if this is first visit
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('thinking-time-intro-seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroClose = () => {
    setShowIntro(false);
    localStorage.setItem('thinking-time-intro-seen', 'true');
  };

  // Calculate optimal idea timing based on session duration
  const calculateIdeaSchedule = (duration: number): number[] => {
    const minutes = duration / 60;
    
    if (minutes <= 10) {
      // Short sessions: 1 idea at 60% mark
      return [Math.floor(duration * 0.6)];
    } else if (minutes <= 20) {
      // Medium sessions: 2 ideas
      return [
        Math.floor(duration * 0.35), // ~7 minutes for 20min session
        Math.floor(duration * 0.75)  // ~15 minutes for 20min session
      ];
    } else if (minutes <= 30) {
      // Medium-long sessions: 3 ideas
      return [
        Math.floor(duration * 0.25), // ~7.5 minutes for 30min session
        Math.floor(duration * 0.5),  // ~15 minutes
        Math.floor(duration * 0.8)   // ~24 minutes
      ];
    } else {
      // Long sessions: 4 ideas with increasing intervals
      return [
        Math.floor(duration * 0.2),  // ~12 minutes for 60min session
        Math.floor(duration * 0.4),  // ~24 minutes
        Math.floor(duration * 0.65), // ~39 minutes
        Math.floor(duration * 0.85)  // ~51 minutes
      ];
    }
  };

  // Initialize timer duration and idea schedule from settings
  useEffect(() => {
    const data = getStoredData();
    setSettings(data.settings);
    setTimerState(prev => ({ ...prev, timeLeft: data.settings.duration }));
    setIdeaSchedule(calculateIdeaSchedule(data.settings.duration));
    setNextIdeaIndex(0);
    
    // Set current idea mode from settings if not 'ask'
    if (data.settings.promptMode !== 'ask') {
      setCurrentIdeaMode(data.settings.promptMode);
    }
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      ideaTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [ideaTimeouts]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timerState.timeLeft === 0 && timerState.isRunning) {
      // Timer finished
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.timeLeft]);

  // Idea scheduling based on elapsed time
  useEffect(() => {
    if (!timerState.isRunning || currentIdea) return;

    const elapsedTime = settings.duration - timerState.timeLeft;
    
    // Handle early idea mode - show immediately when timer starts
    if (currentIdeaMode === 'early' && !hasShownEarlyIdea && elapsedTime >= 1) {
      setCurrentIdea(getRandomPrompt());
      setHasShownEarlyIdea(true);
      return;
    }

    // Handle delayed idea mode
    if (currentIdeaMode === 'delayed' && nextIdeaIndex < ideaSchedule.length) {
      const nextIdeaTime = ideaSchedule[nextIdeaIndex];
      if (elapsedTime >= nextIdeaTime) {
        setCurrentIdea(getRandomPrompt());
        setNextIdeaIndex(prev => prev + 1);
      }
    }
  }, [timerState.isRunning, timerState.timeLeft, currentIdea, currentIdeaMode, hasShownEarlyIdea, nextIdeaIndex, ideaSchedule, settings.duration]);

  const handleIdeaModeSelect = (mode: 'early' | 'delayed' | 'none') => {
    setCurrentIdeaMode(mode);
    setShowIdeaModeSelector(false);
    
    // Start the timer immediately after selection
    handleStart();
  };

  const handleStart = () => {
    // If user hasn't chosen idea mode and setting is 'ask', show selector
    if (settings.promptMode === 'ask' && !timerState.isPaused && !showIdeaModeSelector) {
      setShowIdeaModeSelector(true);
      return;
    }

    // Use saved preference if available and not pausing/resuming
    if (settings.promptMode !== 'ask' && !timerState.isPaused) {
      setCurrentIdeaMode(settings.promptMode);
    }

    // Record session start time for elapsed time calculations
    if (!timerState.isPaused) {
      setSessionStartTime(Date.now());
    }

    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: prev.startTime || new Date(),
      currentSession: prev.currentSession || {
        startTime: new Date().toISOString(),
        duration: settings.duration,
        interrupted: false,
        ideas: 0,
        problemsSolved: 0,
        notes: '',
        promptResponses: []
      }
    }));

    // Reset idea schedule when starting fresh (not resuming)
    if (!timerState.isPaused) {
      setIdeaSchedule(calculateIdeaSchedule(settings.duration));
      setNextIdeaIndex(0);
      setHasShownEarlyIdea(false);
    }

    if (settings.quietMode && !isMusicPlaying) {
      audioService.play();
      setIsMusicPlaying(true);
    }
  };

  const handlePause = () => {
    setTimerState(prev => ({ ...prev, isRunning: false, isPaused: true }));
    
    if (isMusicPlaying) {
      audioService.pause();
      setIsMusicPlaying(false);
    }
  };

  const handleStop = () => {
    const wasRunning = timerState.isRunning || timerState.isPaused;
    
    // Clear all timeouts
    ideaTimeouts.forEach(timeout => clearTimeout(timeout));
    setIdeaTimeouts([]);
    
    setTimerState({
      timeLeft: settings.duration,
      isRunning: false,
      isPaused: false,
      startTime: null,
      currentSession: null
    });
    
    setCurrentIdea(null);
    setIdeaResponses([]);
    setNextIdeaIndex(0);
    setHasShownEarlyIdea(false);
    setSessionStartTime(0);
    
    if (isMusicPlaying) {
      audioService.stop();
      setIsMusicPlaying(false);
    }

    // If session was interrupted, save it
    if (wasRunning && timerState.currentSession) {
      const interruptedSession = {
        ...timerState.currentSession,
        interrupted: true,
        duration: settings.duration - timerState.timeLeft,
        promptResponses: ideaResponses
      };
      saveSession(interruptedSession);
    }
  };

  const handleTimerComplete = () => {
    // Clear all timeouts
    ideaTimeouts.forEach(timeout => clearTimeout(timeout));
    setIdeaTimeouts([]);
    
    if (timerState.currentSession) {
      const completedSession = {
        ...timerState.currentSession,
        interrupted: false,
        promptResponses: ideaResponses
      };
      saveSession(completedSession);
    }
    
    setTimerState(prev => ({ ...prev, isRunning: false }));
    setShowSummary(true);
    
    if (isMusicPlaying) {
      audioService.stop();
      setIsMusicPlaying(false);
    }
  };

  const handleIdeaResponse = (response: string) => {
    if (currentIdea) {
      const newResponse: PromptResponse = {
        prompt: currentIdea,
        response,
        timestamp: new Date().toISOString()
      };
      setIdeaResponses(prev => [...prev, newResponse]);
    }
    setCurrentIdea(null);
  };

  const handleIdeaDismiss = () => {
    setCurrentIdea(null);
  };

  const toggleMusic = () => {
    const newMusicState = !isMusicPlaying;
    setIsMusicPlaying(newMusicState);
    
    if (newMusicState) {
      audioService.play();
    } else {
      audioService.pause();
    }
    
    updateSettings({ quietMode: newMusicState });
    setSettings(prev => ({ ...prev, quietMode: newMusicState }));
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  if (showSummary) {
    return (
      <SessionSummary
        session={{
          duration: settings.duration,
          ideas: timerState.currentSession?.ideas || 0,
          problemsSolved: timerState.currentSession?.problemsSolved || 0,
          notes: timerState.currentSession?.notes || '',
          promptResponses: ideaResponses
        }}
        onClose={() => {
          setShowSummary(false);
          setTimerState({
            timeLeft: settings.duration,
            isRunning: false,
            isPaused: false,
            startTime: null,
            currentSession: null
          });
          setIdeaResponses([]);
          setNextIdeaIndex(0);
          setHasShownEarlyIdea(false);
          setSessionStartTime(0);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Controls */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button
            onClick={toggleMusic}
            className="group p-3 sm:p-4 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            {isMusicPlaying ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 group-hover:text-amber-200" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-300" />
            )}
          </button>
          <div className="px-3 py-2 sm:px-4 sm:py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
            <span className="text-slate-300 text-xs sm:text-sm font-medium">
              {formatDuration(settings.duration)} session
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setShowIntro(true)}
            className="group p-3 sm:p-4 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-300" />
          </button>
          <button
            onClick={() => onViewChange('history')}
            className="group p-3 sm:p-4 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-300" />
          </button>
          <button
            onClick={() => onViewChange('settings')}
            className="group p-3 sm:p-4 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Main Timer */}
      <div className="flex flex-col items-center space-y-8 sm:space-y-12 z-10 w-full max-w-sm sm:max-w-none">
        <CircularTimer
          timeLeft={timerState.timeLeft}
          totalTime={settings.duration}
          isRunning={timerState.isRunning}
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-6">
          {!timerState.isRunning && !timerState.isPaused && (
            <button
              onClick={handleStart}
              className="group bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-xl border border-amber-500/30 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 p-5 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            </button>
          )}
          
          {timerState.isRunning && (
            <button
              onClick={handlePause}
              className="group bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-200 p-5 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <Pause className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            </button>
          )}
          
          {timerState.isPaused && (
            <button
              onClick={handleStart}
              className="group bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-600/30 text-emerald-200 p-5 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            </button>
          )}
          
          {(timerState.isRunning || timerState.isPaused) && (
            <button
              onClick={handleStop}
              className="group bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/30 hover:from-red-500/30 hover:to-red-600/30 text-red-200 p-5 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
            >
              <Square className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center max-w-xs sm:max-w-md px-4">
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            {timerState.isRunning
              ? "Thinking..."
              : timerState.isPaused
              ? "Session paused • Take your time"
              : "Create space for deep reflection"
            }
          </p>
        </div>
      </div>

      {/* App Introduction */}
      {showIntro && (
        <AppIntro onClose={handleIntroClose} />
      )}

      {/* Idea Mode Selector */}
      {showIdeaModeSelector && (
        <IdeaModeSelector
          onSelect={handleIdeaModeSelect}
          onClose={() => setShowIdeaModeSelector(false)}
        />
      )}

      {/* Idea Card with smooth animation */}
      {currentIdea && (
        <IdeaCard
          idea={currentIdea}
          onResponse={handleIdeaResponse}
          onDismiss={handleIdeaDismiss}
        />
      )}
    </div>
  );
};