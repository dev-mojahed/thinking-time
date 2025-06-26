import React, { useState } from 'react';
import { ArrowLeft, Clock, Target, Volume2, Palette, Lightbulb } from 'lucide-react';
import { getStoredData, updateSettings } from '../utils/storage';

interface SettingsViewProps {
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [settings, setSettings] = useState(() => getStoredData().settings);
  const [isSaving, setIsSaving] = useState(false);

  const durationOptions = [
    { value: 300, label: '5 min' },
    { value: 600, label: '10 min' },
    { value: 900, label: '15 min' },
    { value: 1200, label: '20 min' },
    { value: 1500, label: '25 min' },
    { value: 1800, label: '30 min' },
    { value: 2700, label: '45 min' },
    { value: 3600, label: '60 min' }
  ];

  const dailyTargetOptions = [
    { value: 15, label: '15 min' },
    { value: 20, label: '20 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '60 min' },
    { value: 90, label: '90 min' },
    { value: 120, label: '2 hours' }
  ];

  const ideaModeOptions = [
    { value: 'ask', label: 'Ask me each time', description: 'Choose your idea style before each session' },
    { value: 'early', label: 'Start with ideas', description: 'Get thinking topics right away' },
    { value: 'delayed', label: 'Quiet time first', description: 'Ideas appear after a few minutes' },
    { value: 'none', label: 'No ideas', description: 'Pure unguided reflection time' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    updateSettings(settings);
    
    // Small delay for better UX
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleDurationChange = (duration: number) => {
    setSettings(prev => ({ ...prev, duration }));
  };

  const handleDailyTargetChange = (dailyTargetMinutes: number) => {
    setSettings(prev => ({ ...prev, dailyTargetMinutes }));
  };

  const handleIdeaModeChange = (promptMode: 'early' | 'delayed' | 'none' | 'ask') => {
    setSettings(prev => ({ ...prev, promptMode }));
  };

  const handleQuietModeToggle = () => {
    setSettings(prev => ({ ...prev, quietMode: !prev.quietMode }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
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
          <h1 className="text-3xl font-light text-slate-100">Settings</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="space-y-8">
          {/* Session Duration */}
          <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                  <Clock className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-100">Session Duration</h2>
                  <p className="text-slate-400">Choose your default thinking session length</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDurationChange(option.value)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      settings.duration === option.value
                        ? 'border-blue-500/50 bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-500/10'
                        : 'border-slate-600/50 bg-slate-700/30 text-slate-300 hover:border-slate-500/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Thinking Ideas */}
          <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-amber-500/20 rounded-2xl">
                  <Lightbulb className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-100">Thinking Ideas</h2>
                  <p className="text-slate-400">How would you like ideas to appear during sessions?</p>
                </div>
              </div>
              <div className="space-y-3">
                {ideaModeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleIdeaModeChange(option.value as any)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      settings.promptMode === option.value
                        ? 'border-amber-500/50 bg-amber-500/20 text-amber-200 shadow-lg shadow-amber-500/10'
                        : 'border-slate-600/50 bg-slate-700/30 text-slate-300 hover:border-slate-500/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-medium mb-1">{option.label}</div>
                    <div className="text-sm opacity-75">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <Target className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-100">Daily Goal</h2>
                  <p className="text-slate-400">Set your daily thinking time target</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dailyTargetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDailyTargetChange(option.value)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      settings.dailyTargetMinutes === option.value
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-600/50 bg-slate-700/30 text-slate-300 hover:border-slate-500/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ambient Music */}
          <div className="bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <Volume2 className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-slate-100">Ambient Music</h2>
                    <p className="text-slate-400">Play calming background music during sessions</p>
                  </div>
                </div>
                <button
                  onClick={handleQuietModeToggle}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                    settings.quietMode 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/20' 
                      : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                      settings.quietMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
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
                <span>Saving preferences...</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};