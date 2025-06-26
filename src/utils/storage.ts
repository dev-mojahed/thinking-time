import { AppData, ThinkingSession, UserSettings, Goals } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'thinking-time-data';

const DEFAULT_SETTINGS: UserSettings = {
  duration: 900, // 15 minutes
  quietMode: true,
  dailyTargetMinutes: 30,
  promptMode: 'ask' // Ask user each time by default
};

const DEFAULT_GOALS: Goals = {
  dailyTargetMinutes: 30,
  weekly: {}
};

export const getStoredData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure promptMode exists for backward compatibility
      if (!data.settings.promptMode) {
        data.settings.promptMode = 'ask';
      }
      return data;
    }
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
  
  return {
    settings: DEFAULT_SETTINGS,
    sessions: [],
    goals: DEFAULT_GOALS
  };
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const saveSession = (session: Omit<ThinkingSession, 'id'>): void => {
  const data = getStoredData();
  const newSession: ThinkingSession = {
    ...session,
    id: uuidv4()
  };
  
  data.sessions.push(newSession);
  
  // Update weekly goals
  const weekKey = getWeekKey(new Date(session.startTime));
  if (!data.goals.weekly[weekKey]) {
    data.goals.weekly[weekKey] = { minutes: 0, sessions: 0 };
  }
  
  data.goals.weekly[weekKey].minutes += Math.floor(session.duration / 60);
  data.goals.weekly[weekKey].sessions += 1;
  
  saveData(data);
};

export const updateSettings = (settings: Partial<UserSettings>): void => {
  const data = getStoredData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
};

export const getWeekKey = (date: Date): string => {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getTodaysSessions = (): ThinkingSession[] => {
  const data = getStoredData();
  const today = new Date().toDateString();
  
  return data.sessions.filter(session => 
    new Date(session.startTime).toDateString() === today
  );
};

export const getTodaysMinutes = (): number => {
  const todaysSessions = getTodaysSessions();
  return todaysSessions.reduce((total, session) => 
    total + Math.floor(session.duration / 60), 0
  );
};