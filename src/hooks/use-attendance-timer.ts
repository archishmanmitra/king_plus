import { useState, useEffect, useCallback } from 'react';

interface AttendanceTimerState {
  isClockedIn: boolean;
  startTime: number | null;
  elapsedTime: number;
  isRunning: boolean;
  pausedTime: number;
}

export const useAttendanceTimer = () => {
  const [state, setState] = useState<AttendanceTimerState>(() => {
    // Check localStorage for existing timer state
    const saved = localStorage.getItem('attendanceTimer');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        startTime: parsed.startTime ? Date.now() - parsed.elapsedTime : null,
        elapsedTime: parsed.elapsedTime || 0,
        isRunning: parsed.isRunning || false,
        pausedTime: parsed.pausedTime || 0
      };
    }
    return {
      isClockedIn: false,
      startTime: null,
      elapsedTime: 0,
      isRunning: false,
      pausedTime: 0
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('attendanceTimer', JSON.stringify({
      ...state,
      startTime: state.startTime ? Date.now() - state.elapsedTime : null
    }));
  }, [state]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isRunning && state.startTime) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsedTime: Date.now() - prev.startTime!
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isRunning, state.startTime]);

  const clockIn = useCallback(() => {
    const now = Date.now();
    setState({
      isClockedIn: true,
      startTime: now,
      elapsedTime: 0,
      isRunning: true,
      pausedTime: 0
    });
  }, []);

  const clockOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      pausedTime: prev.elapsedTime
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    if (state.startTime) {
      const now = Date.now();
      const newStartTime = now - state.pausedTime;
      setState(prev => ({
        ...prev,
        startTime: newStartTime,
        isRunning: true
      }));
    }
  }, [state.startTime, state.pausedTime]);

  const resetTimer = useCallback(() => {
    setState({
      isClockedIn: false,
      startTime: null,
      elapsedTime: 0,
      isRunning: false,
      pausedTime: 0
    });
    localStorage.removeItem('attendanceTimer');
  }, []);

  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    ...state,
    clockIn,
    clockOut,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime,
    currentTime: state.formatTime ? formatTime(state.elapsedTime) : '00:00:00'
  };
};
