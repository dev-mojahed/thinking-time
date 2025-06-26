import React from 'react';

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({ 
  timeLeft, 
  totalTime, 
  isRunning 
}) => {
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const circumference = 2 * Math.PI * 120; // Smaller radius for mobile
  const strokeDashoffset = circumference - (progress * circumference);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
        isRunning 
          ? 'shadow-[0_0_40px_rgba(251,191,36,0.3),0_0_80px_rgba(251,191,36,0.1)] sm:shadow-[0_0_60px_rgba(251,191,36,0.3),0_0_120px_rgba(251,191,36,0.1)]' 
          : 'shadow-[0_0_30px_rgba(148,163,184,0.2)] sm:shadow-[0_0_40px_rgba(148,163,184,0.2)]'
      }`} />
      
      <svg
        className="transform -rotate-90 w-64 h-64 sm:w-80 sm:h-80"
        width="256"
        height="256"
        viewBox="0 0 256 256"
      >
        {/* Background circle */}
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth="3"
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke="url(#timerGradient)"
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out filter drop-shadow-lg"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl font-extralight text-slate-100 mb-2 sm:mb-3 tracking-wide">
            {formatTime(timeLeft)}
          </div>
          <div className={`text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-500 ${
            isRunning ? 'text-amber-300' : 'text-slate-400'
          }`}>
            {isRunning ? 'Thinking' : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  );
};