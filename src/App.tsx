import React, { useState } from 'react';
import { TimerView } from './components/TimerView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { BoltBadge } from './components/BoltBadge';
import { ViewType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('timer');

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'timer':
        return <TimerView onViewChange={handleViewChange} />;
      case 'history':
        return <HistoryView onBack={() => setCurrentView('timer')} />;
      case 'settings':
        return <SettingsView onBack={() => setCurrentView('timer')} />;
      default:
        return <TimerView onViewChange={handleViewChange} />;
    }
  };

  return (
    <div className="font-inter">
      {renderCurrentView()}
      <BoltBadge />
    </div>
  );
}

export default App;