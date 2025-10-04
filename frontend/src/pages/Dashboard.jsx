import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ActiveSession from '../components/ActiveSession';
import SessionCard from '../components/SessionCard';
import { FiPlay, FiTrash2 } from 'react-icons/fi';

const Dashboard = () => {
  const { user, deleteAccount } = useAuth();
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showStartModal, setShowStartModal] = useState(false);
  const [targetHours, setTargetHours] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { data } = await api.get(`/session/user/${user._id}`);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }, [user?._id]);

  const checkForActiveSession = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { data } = await api.get(`/session/user/${user._id}`);
      console.log('All sessions:', data); 

      const active = data.find(s => s.status !== 'finished');
      console.log('Active session found:', active);
      
      if (active) {
        setActiveSession(active);
      }
    } catch (error) {
      console.error('Failed to check for active session:', error);
    }
  }, [user?._id]);

  // Load sessions on mount and check for active session
  useEffect(() => {
    if (user?._id) {
      loadSessions();
      checkForActiveSession();
    }
  }, [user?._id, loadSessions, checkForActiveSession]);

  const handleClockIn = async () => {
    setIsLoading(true);
    try {
      const payload = { userId: user._id };
      if (targetHours && parseFloat(targetHours) > 0) {
        payload.targetHours = parseFloat(targetHours);
      }
      
      const { data } = await api.post('/session/clockin', payload);
      setActiveSession(data);
      setShowStartModal(false);
      setTargetHours('');
      toast.success('Session started!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to start session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionEnd = () => {
    setActiveSession(null);
    loadSessions();
  };

  const handleSessionUpdate = (updatedSession) => {
    setActiveSession(updatedSession);
  };

  const handleResumeSession = (session) => {
    setActiveSession(session);
    toast.success('Session resumed');
  };

  const handleDeleteSession = (sessionId) => {
    setSessions(sessions.filter((s) => s._id !== sessionId));
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    const doubleConfirm = window.prompt('Type "DELETE" to confirm:');
    if (doubleConfirm !== 'DELETE') return;

    try {
      await deleteAccount();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.userName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your work sessions and stay accountable
          </p>
        </div>

        {/* Active Session or Start Button */}
        {activeSession ? (
          <div className="mb-8">
            <ActiveSession 
              session={activeSession} 
              onSessionEnd={handleSessionEnd}
              onSessionUpdate={handleSessionUpdate}
            />
          </div>
        ) : (
          <div className="mb-8">
            <button
              onClick={() => setShowStartModal(true)}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white py-6 rounded-2xl shadow-lg font-medium text-lg flex items-center justify-center space-x-3 transition"
            >
              <FiPlay className="w-6 h-6" />
              <span>Start New Session</span>
            </button>
          </div>
        )}

        {/* Session History */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Sessions
          </h2>
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  onDelete={handleDeleteSession}
                  onResume={handleResumeSession}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No sessions yet. Start your first session above!
              </p>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
            Danger Zone
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            <FiTrash2 />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Start Session Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Start New Session
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Hours (optional)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={targetHours}
                onChange={(e) => setTargetHours(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="e.g., 4"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Set a goal to track your progress
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStartModal(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClockIn}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-medium transition disabled:opacity-50"
              >
                {isLoading ? 'Starting...' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;