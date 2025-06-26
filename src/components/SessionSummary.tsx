import React, { useState } from 'react';
import { CheckCircle, Lightbulb, Target, Edit3, ArrowRight, Sparkles } from 'lucide-react';
import { getRandomInspiration } from '../utils/prompts';
import { saveSession } from '../utils/storage';
import { PromptResponse } from '../types';

interface SessionSummaryProps {
  session: {
    duration: number;
    ideas: number;
    problemsSolved: number;
    notes: string;
    promptResponses: PromptResponse[];
  };
  onClose: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({ session, onClose }) => {
  const [ideas, setIdeas] = useState(session.ideas);
  const [problemsSolved, setProblemsSolved] = useState(session.problemsSolved);
  const [notes, setNotes] = useState(session.notes);
  const [isSaving, setIsSaving] = useState(false);

  const inspirationMessage = getRandomInspiration();
  const durationMinutes = Math.floor(session.duration / 60);

  const handleSave = async () => {
    setIsSaving(true);
    
    const finalSession = {
      startTime: new Date().toISOString(),
      duration: session.duration,
      interrupted: false,
      ideas,
      problemsSolved,
      notes,
      promptResponses: session.promptResponses
    };

    saveSession(finalSession);
    
    // Small delay for better UX
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-700/50 relative overflow-hidden z-10">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 rounded-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <CheckCircle className="w-10 h-10 text-emerald-300" />
            </div>
            <h2 className="text-3xl font-light text-slate-100 mb-3">
              Session Complete
            </h2>
            <p className="text-slate-400 text-lg">
              {durationMinutes} minutes of focused reflection
            </p>
          </div>

          <div className="space-y-6">
            {/* Ideas Counter */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-blue-300" />
                </div>
                <span className="font-medium text-slate-200">Ideas Generated</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIdeas(Math.max(0, ideas - 1))}
                  className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors text-slate-300 hover:text-slate-200"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-slate-100 text-lg">{ideas}</span>
                <button
                  onClick={() => setIdeas(ideas + 1)}
                  className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors text-slate-300 hover:text-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Problems Solved Counter */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/20">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-emerald-300" />
                </div>
                <span className="font-medium text-slate-200">Problems Solved</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setProblemsSolved(Math.max(0, problemsSolved - 1))}
                  className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors text-slate-300 hover:text-slate-200"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-slate-100 text-lg">{problemsSolved}</span>
                <button
                  onClick={() => setProblemsSolved(problemsSolved + 1)}
                  className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors text-slate-300 hover:text-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Edit3 className="w-5 h-5 text-purple-300" />
                </div>
                <label className="font-medium text-slate-200">Reflection Notes</label>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What insights or thoughts emerged during your session?"
                className="w-full h-28 p-4 bg-slate-900/50 border border-slate-600/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 text-slate-200 placeholder-slate-500 backdrop-blur-sm"
              />
            </div>

            {/* Inspiration Message */}
            <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <Sparkles className="w-5 h-5 text-amber-300/50" />
              </div>
              <p className="text-slate-200 italic font-light leading-relaxed">
                "{inspirationMessage}"
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-xl border border-amber-500/30 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 py-5 px-6 rounded-2xl transition-all duration-300 font-medium flex items-center justify-center space-x-3 disabled:opacity-50 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-300 border-t-transparent"></div>
                  <span>Saving your reflection...</span>
                </>
              ) : (
                <>
                  <span>Save Session</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};