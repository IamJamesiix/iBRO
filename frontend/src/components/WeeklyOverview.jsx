import { useState, useEffect } from 'react';
import { FiTrendingUp, FiClock, FiTarget, FiAward } from 'react-icons/fi';
import api from '../api/axios';

const WeeklyOverview = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const { data } = await api.get(`/session/weekly/${userId}`);
        setStats(data);
      } catch (error) {
        console.error('Failed to load weekly stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWeeklyStats();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        This Week's Progress
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Hours */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FiClock className="text-primary-500 w-5 h-5" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Hours</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalHours}h
          </p>
        </div>

        {/* Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FiTrendingUp className="text-green-500 w-5 h-5" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completedSessions}
          </p>
        </div>

        {/* Perfect Badges */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">⭐</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Perfect</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.perfectCount}
          </p>
        </div>

        {/* Overachiever Badges */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">🏆</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Overachiever</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.overachieverCount}
          </p>
        </div>
      </div>

      {/* Average Session Length */}
      {stats.avgSessionLength > 0 && (
        <div className="mt-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-primary-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Average session length
            </span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {stats.avgSessionLength}h
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyOverview;