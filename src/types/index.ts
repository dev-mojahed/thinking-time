export interface ThinkingSession {
  id: string;
  startTime: string;
  duration: number;
  interrupted: boolean;
  ideas: number;
  problemsSolved: number;
  notes: string;
  promptResponses: PromptResponse[];
}

export interface PromptResponse {
  prompt: string;
  response: string;
  timestamp: string;
}

export interface UserSettings {
  duration: number;
  quietMode: boolean;
  dailyTargetMinutes: number;
  promptMode: 'early' | 'delayed' | 'none' | 'ask';
}

export interface WeeklyData {
  minutes: number;
  sessions: number;
}

export interface Goals {
  dailyTargetMinutes: number;
  weekly: Record<string, WeeklyData>;
}

export interface AppData {
  settings: UserSettings;
  sessions: ThinkingSession[];
  goals: Goals;
}

export type ViewType = 'timer' | 'history' | 'settings';

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  currentSession: Partial<ThinkingSession> | null;
}