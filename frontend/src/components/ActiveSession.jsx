import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlay, FiPause, FiStopCircle, FiClock, FiTarget } from 'react-icons/fi';

const ActiveSession = ({ session, onSessionEnd, onSessionUpdate }) => {
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(session);

  // Fetch progress every second
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await api.get(`/session/progress/${currentSession._id}`);
        setProgress(data);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 1000);

    return () => clearInterval(interval);
  }, [currentSession._id]);

  const handleBreak = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/session/breakin', { sessionId: currentSession._id });
      toast.success('Break started');
      setCurrentSession(data);
      if (onSessionUpdate) onSessionUpdate(data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start break');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResume = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/session/resumein', { sessionId: currentSession._id });
      toast.success('Resumed working');
      setCurrentSession(data);
      if (onSessionUpdate) onSessionUpdate(data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!window.confirm('Are you sure you want to clock out?')) return;
    
    setIsLoading(true);
    try {
      const { data } = await api.post('/session/clockout', { sessionId: currentSession._id });
      toast.success(
        `Session complete! Worked ${data.hoursWorked} hours (${data.minutesWorked} minutes)`
      );
      onSessionEnd();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to clock out');
      setIsLoading(false);
    }
  };

  if (!progress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-primary-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Session</h2>
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            currentSession.status === 'working'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          }`}
        >
          {currentSession.status === 'working' ? '🚀 Working' : '☕ On Break'}
        </span>
      </div>

      {/* Time Display */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <FiClock className="text-primary-500 w-6 h-6" />
          <span className="text-5xl font-bold font-mono text-gray-900 dark:text-white">
            {formatTime(progress.secondsWorked)}
          </span>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          {progress.hoursWorked} hours • {progress.minutesWorked} minutes
        </p>
      </div>

      {/* Progress Bar (if target set) */}
      {progress.targetHours && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FiTarget className="text-accent-500 w-5 h-5" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Progress
              </span>
            </div>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {progress.progressPercent}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
              style={{ width: `${Math.min(progress.progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            Goal: {progress.targetHours} hours
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {session.status === 'working' ? (
          <button
            onClick={handleBreak}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition disabled:opacity-50"
          >
            <FiPause />
            <span>Take Break</span>
          </button>
        ) : (
          <button
            onClick={handleResume}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition disabled:opacity-50"
          >
            <FiPlay />
            <span>Resume</span>
          </button>
        )}

        <button
          onClick={handleClockOut}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:opacity-50"
        >
          <FiStopCircle />
          <span>Clock Out</span>
        </button>
      </div>
    </div>
  );
};

export default ActiveSession;