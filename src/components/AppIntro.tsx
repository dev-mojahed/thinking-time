import React from 'react';
import { Brain, Clock, Lightbulb, Target, X } from 'lucide-react';

interface AppIntroProps {
  onClose: () => void;
}

export const AppIntro: React.FC<AppIntroProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-700/50 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
                <Brain className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-slate-100">Welcome to Thinking Time</h1>
                <p className="text-slate-400">Your digital sanctuary for deep reflection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* What is Thinking Time */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-slate-100 mb-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-300" />
              </div>
              <span>What is Thinking Time?</span>
            </h2>
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
              <p className="text-slate-300 leading-relaxed mb-4">
                Thinking Time is a mindful reflection app designed to help you create dedicated space for deep thinking, problem-solving, and creative insights. In our busy world, we rarely give ourselves permission to just <em>think</em>.
              </p>
              <p className="text-slate-300 leading-relaxed">
                This app provides a distraction-free environment where you can explore your thoughts, work through challenges, and discover new perspectives through guided reflection.
              </p>
            </div>
          </div>

          {/* How to Use */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-slate-100 mb-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-emerald-300" />
              </div>
              <span>How to Use</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-2xl border border-emerald-500/10">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-300 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-200 mb-1">Choose Your Session Length</h3>
                  <p className="text-slate-400 text-sm">Start with 15-20 minutes. You can adjust this in Settings.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl border border-blue-500/10">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-300 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-200 mb-1">Select Your Thinking Style</h3>
                  <p className="text-slate-400 text-sm">Choose whether you want thinking prompts early, later, or not at all.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl border border-purple-500/10">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-300 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-200 mb-1">Think Freely</h3>
                  <p className="text-slate-400 text-sm">Let your mind wander, solve problems, or explore creative ideas.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl border border-amber-500/10">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-amber-300 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-200 mb-1">Capture Insights</h3>
                  <p className="text-slate-400 text-sm">Respond to thinking prompts and record your reflections at the end.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-slate-100 mb-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-300" />
              </div>
              <span>Key Features</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-300" />
                  <h3 className="font-medium text-slate-200">Thinking Prompts</h3>
                </div>
                <p className="text-slate-400 text-sm">Gentle questions to spark deeper reflection when you need inspiration.</p>
              </div>
              
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-300" />
                  <h3 className="font-medium text-slate-200">Flexible Sessions</h3>
                </div>
                <p className="text-slate-400 text-sm">Choose from 5 to 60-minute sessions that fit your schedule.</p>
              </div>
              
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="w-5 h-5 text-emerald-300" />
                  <h3 className="font-medium text-slate-200">Progress Tracking</h3>
                </div>
                <p className="text-slate-400 text-sm">Track your daily thinking goals and reflection history.</p>
              </div>
              
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Brain className="w-5 h-5 text-purple-300" />
                  <h3 className="font-medium text-slate-200">Distraction-Free</h3>
                </div>
                <p className="text-slate-400 text-sm">Clean, minimal interface designed for focused thinking.</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mb-8">
            <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20">
              <h3 className="font-medium text-slate-100 mb-3 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-300" />
                <span>Pro Tips</span>
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-amber-300 mt-1">•</span>
                  <span>Find a quiet space where you won't be interrupted</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-300 mt-1">•</span>
                  <span>Keep a notebook nearby for important insights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-300 mt-1">•</span>
                  <span>Don't worry about "productive" thinking—let your mind explore</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-300 mt-1">•</span>
                  <span>Regular short sessions are better than occasional long ones</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Get Started Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-xl border border-amber-500/30 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 py-4 px-6 rounded-2xl transition-all duration-300 font-medium hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10"
          >
            Start Your First Thinking Session
          </button>
        </div>
      </div>
    </div>
  );
};