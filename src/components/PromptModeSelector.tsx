import React from 'react';
import { Lightbulb, Clock, Zap, Brain } from 'lucide-react';

interface IdeaModeSelectorProps {
  onSelect: (mode: 'early' | 'delayed' | 'none') => void;
  onClose: () => void;
}

export const IdeaModeSelector: React.FC<IdeaModeSelectorProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Brain className="w-8 h-8 text-blue-300" />
            </div>
            <h2 className="text-2xl font-light text-slate-100 mb-3">
              How would you like to think?
            </h2>
            <p className="text-slate-400">
              Choose your preferred reflection style
            </p>
          </div>

          <div className="space-y-4">
            {/* Early Idea Option */}
            <button
              onClick={() => onSelect('early')}
              className="w-full p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/20 hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                  <Zap className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-100 mb-2">Start with an idea</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Get a gentle thinking topic right away. Perfect if you want inspiration from the start.
                  </p>
                </div>
              </div>
            </button>

            {/* Delayed Idea Option */}
            <button
              onClick={() => onSelect('delayed')}
              className="w-full p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20 hover:from-blue-500/20 hover:to-indigo-500/20 transition-all duration-300 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <Clock className="w-5 h-5 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-100 mb-2">Give me quiet time first</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Start with unstructured thinking, then receive gentle ideas later.
                  </p>
                </div>
              </div>
            </button>

            {/* No Ideas Option */}
            <button
              onClick={() => onSelect('none')}
              className="w-full p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <Lightbulb className="w-5 h-5 text-purple-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-100 mb-2">Pure quiet time</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    No ideas at all. Complete freedom for your own thoughts and reflections.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <button
              onClick={onClose}
              className="w-full text-slate-400 hover:text-slate-300 transition-colors text-sm"
            >
              I'll decide later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};