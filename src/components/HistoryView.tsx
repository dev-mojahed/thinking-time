import React from 'react';
import { ArrowLeft, Calendar, Clock, Lightbulb, Target, MessageCircle, TrendingUp } from 'lucide-react';
import { getStoredData, getTodaysMinutes } from '../utils/storage';

interface HistoryViewProps {
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
  const data = getStoredData();
  const todaysMinutes = getTodaysMinutes();
  const dailyTarget = data.settings.dailyTargetMinutes;
  const progressPercentage = Math.min((todaysMinutes / dailyTarget) * 100, 100);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const sortedSessions = [...data.sessions].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 pt-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-3 text-slate-400 hover:text-slate-300 transition-colors group"
          >
            <div className="p-2 bg-slate-800/50 rounded-xl group-hover:bg-slate-700/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-light text-slate-100">Reflection History</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Today's Progress */}
        <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 mb-10 shadow-2xl border border-slate-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-3xl" />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-300" />
              </div>
              <h2 className="text-xl font-medium text-slate-100">Today's Progress</h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Daily Goal</span>
              <span className="font-semibold text-slate-200 text-lg">
                {todaysMinutes} / {dailyTarget} minutes
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/20"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-slate-400">
              {progressPercentage >= 100
                ? "🎉 Daily goal achieved! Excellent work."
                : `${Math.ceil(dailyTarget - todaysMinutes)}m remaining to reach your daily goal`
              }
            </p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {sortedSessions.length === 0 ? (
            <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-10 text-center shadow-2xl border border-slate-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                  <Clock className="w-10 h-10 text-blue-300" />
                </div>
                <h3 className="text-xl font-medium text-slate-100 mb-3">No sessions yet</h3>
                <p className="text-slate-400">Start your first thinking session to see your progress here.</p>
              </div>
            </div>
          ) : (
            sortedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-transparent rounded-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <Calendar className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-200 text-lg">
                          {formatDate(session.startTime)}
                        </span>
                        <span className="text-slate-400 ml-2">at {formatTime(session.startTime)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-slate-700/50 rounded-full">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 font-medium">{formatDuration(session.duration)}</span>
                      </div>
                      {session.interrupted && (
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                          Interrupted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-2xl border border-amber-500/20">
                      <Lightbulb className="w-5 h-5 text-amber-300" />
                      <div>
                        <div className="text-slate-400 text-sm">Ideas</div>
                        <div className="text-slate-200 font-semibold">{session.ideas}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/20">
                      <Target className="w-5 h-5 text-emerald-300" />
                      <div>
                        <div className="text-slate-400 text-sm">Problems</div>
                        <div className="text-slate-200 font-semibold">{session.problemsSolved}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20">
                      <MessageCircle className="w-5 h-5 text-blue-300" />
                      <div>
                        <div className="text-slate-400 text-sm">Ideas</div>
                        <div className="text-slate-200 font-semibold">{session.promptResponses.length}</div>
                      </div>
                    </div>
                  </div>

                  {session.notes && (
                    <div className="p-5 bg-slate-900/50 rounded-2xl mb-4 border border-slate-700/30">
                      <p className="text-slate-300 italic leading-relaxed">"{session.notes}"</p>
                    </div>
                  )}

                  {session.promptResponses.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-200 flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-blue-300" />
                        <span>Idea Responses</span>
                      </h4>
                      {session.promptResponses.map((response, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl border border-blue-500/10">
                          <p className="text-sm font-medium text-blue-300 mb-2">
                            {response.prompt}
                          </p>
                          <p className="text-sm text-slate-300 leading-relaxed">{response.response}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};