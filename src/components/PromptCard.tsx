import React, { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

interface IdeaCardProps {
  idea: string;
  onResponse: (response: string) => void;
  onDismiss: () => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  onResponse, 
  onDismiss 
}) => {
  const [response, setResponse] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'leaving'>('entering');

  // Smooth entrance animation with proper timing
  useEffect(() => {
    // Start entrance animation immediately
    const enterTimer = setTimeout(() => {
      setAnimationState('visible');
    }, 50);

    return () => clearTimeout(enterTimer);
  }, []);

  const handleSubmit = () => {
    if (response.trim()) {
      handleExit(() => {
        onResponse(response);
        setResponse('');
        setIsExpanded(false);
      });
    }
  };

  const handleDismiss = () => {
    handleExit(onDismiss);
  };

  const handleExit = (callback: () => void) => {
    setAnimationState('leaving');
    setTimeout(callback, 400);
  };

  // Dynamic classes based on animation state
  const getContainerClasses = () => {
    const baseClasses = "fixed inset-x-4 sm:inset-x-6 top-1/2 transform -translate-y-1/2 z-50 max-w-sm sm:max-w-lg mx-auto transition-all duration-500 ease-out";
    
    switch (animationState) {
      case 'entering':
        return `${baseClasses} opacity-0 scale-90 translate-y-8 blur-sm`;
      case 'visible':
        return `${baseClasses} opacity-100 scale-100 translate-y-0 blur-0`;
      case 'leaving':
        return `${baseClasses} opacity-0 scale-95 -translate-y-4 blur-sm`;
      default:
        return baseClasses;
    }
  };

  const getContentClasses = (delay: number = 0) => {
    const baseClasses = `transition-all duration-700 ease-out`;
    const delayClass = delay > 0 ? `delay-${delay}` : '';
    
    switch (animationState) {
      case 'entering':
        return `${baseClasses} ${delayClass} opacity-0 translate-y-3`;
      case 'visible':
        return `${baseClasses} ${delayClass} opacity-100 translate-y-0`;
      case 'leaving':
        return `${baseClasses} opacity-0 -translate-y-2`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={getContainerClasses()}>
      <div className="bg-slate-800/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Subtle gradient overlay with gentle pulse */}
        <div className={`absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl sm:rounded-3xl transition-all duration-1000 ${
          animationState === 'visible' ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Gentle glow effect */}
        <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-all duration-1000 ${
          animationState === 'visible'
            ? 'shadow-[0_0_40px_rgba(251,191,36,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]' 
            : 'shadow-none'
        }`} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className={`p-2 sm:p-3 bg-amber-500/10 rounded-xl sm:rounded-2xl border border-amber-500/20 ${getContentClasses(100)}`}>
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <button
              onClick={handleDismiss}
              className={`p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110 ${getContentClasses(100)}`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <h3 className={`text-lg sm:text-xl font-light text-slate-100 mb-6 sm:mb-8 leading-relaxed ${getContentClasses(200)}`}>
            {idea}
          </h3>
          
          <div className={getContentClasses(300)}>
            {!isExpanded ? (
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="flex-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-xl border border-amber-500/30 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 font-medium hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 group"
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">
                    Explore this idea
                  </span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 sm:px-6 py-3 sm:py-4 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30 rounded-xl sm:rounded-2xl transition-all duration-200 font-medium hover:scale-[1.02]"
                >
                  Later
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full h-24 sm:h-32 p-3 sm:p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl sm:rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-slate-200 placeholder-slate-500 backdrop-blur-sm text-sm sm:text-base transition-all duration-300 focus:scale-[1.01]"
                    autoFocus
                  />
                  {/* Subtle focus glow */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none transition-all duration-300 focus-within:shadow-[0_0_20px_rgba(251,191,36,0.1)]" />
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!response.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-600/30 text-emerald-200 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 group"
                  >
                    <span className="group-hover:scale-105 transition-transform duration-200">
                      Save Reflection
                    </span>
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="px-4 sm:px-6 py-3 sm:py-4 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30 rounded-xl sm:rounded-2xl transition-all duration-200 font-medium hover:scale-[1.02]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};