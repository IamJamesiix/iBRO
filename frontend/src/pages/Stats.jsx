import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FiCalendar, FiClock, FiTrendingUp } from 'react-icons/fi';

const Stats = () => {
  const { user } = useAuth();
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id) return;
      
      try {
        const { data } = await api.get(`/session/weekly/${user._id}`);
        setWeeklyStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Your Statistics
        </h1>

        {/* Weekly Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            This Week
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <FiClock className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {weeklyStats?.totalHours || 0}h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
            </div>
            
            <div className="text-center">
              <FiTrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {weeklyStats?.completedSessions || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</p>
            </div>
            
            <div className="text-center">
              <FiCalendar className="w-8 h-8 text-accent-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {weeklyStats?.avgSessionLength || 0}h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Badges Earned This Week
          </h2>
          
          <div className="flex gap-6">
            <div className="flex items-center space-x-3 bg-yellow-50 dark:bg-yellow-900/20 px-6 py-4 rounded-xl">
              <span className="text-4xl">⭐</span>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weeklyStats?.perfectCount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Perfect Scores</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-purple-50 dark:bg-purple-900/20 px-6 py-4 rounded-xl">
              <span className="text-4xl">🏆</span>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weeklyStats?.overachieverCount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overachiever</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;