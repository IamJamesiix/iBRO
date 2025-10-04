import { format } from 'date-fns';
import { FiTrash2, FiClock, FiCalendar } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SessionCard = ({ session, onDelete, onResume }) => {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      await api.delete(`/session/${session._id}`);
      toast.success('Session deleted');
      onDelete(session._id);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete session');
    }
  };

  const handleCardClick = () => {
    if (session.status !== 'finished' && onResume) {
      onResume(session);
    }
  };

  const calculateDuration = () => {
    if (!session.clockOutTime) return { display: 'In progress', seconds: null, percentage: null };
    
    const worked = (new Date(session.clockOutTime) - new Date(session.clockInTime) - session.totalBreakMillis) / 1000;
    const hours = Math.floor(worked / 3600);
    const minutes = Math.floor((worked % 3600) / 60);
    const seconds = Math.floor(worked % 60);
    
    let percentage = null;
    if (session.targetHours) {
      percentage = ((worked / 3600) / session.targetHours) * 100;
    }
    
    return {
      display: `${hours}h ${minutes}m ${seconds}s`,
      seconds: Math.floor(worked),
      percentage: percentage ? percentage.toFixed(0) : null
    };
  };

  const duration = calculateDuration();

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-5 border border-gray-100 dark:border-gray-700 ${
        session.status !== 'finished' ? 'cursor-pointer hover:border-primary-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <FiCalendar className="text-primary-500 w-4 h-4" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {format(new Date(session.clockInTime), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FiClock className="text-gray-400 w-4 h-4" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(session.clockInTime), 'h:mm a')}
              {session.clockOutTime && ` - ${format(new Date(session.clockOutTime), 'h:mm a')}`}
            </span>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          title="Delete session"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {duration.display}
          </span>
        </div>

        {session.targetHours && session.clockOutTime && duration.percentage && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Target: {session.targetHours}h</span>
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                {duration.percentage}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                style={{ width: `${Math.min(duration.percentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {session.achievement && session.achievement !== 'none' && (
          <div className="flex items-center space-x-2 mt-2">
            {session.achievement === 'perfect' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                ⭐ Perfect Score
                  </span>
                  )}
                  {session.achievement === 'overachiever' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                🏆 Overachiever
              </span>
            )}
          </div>
        )}
        
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            session.status === 'finished'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : session.status === 'working'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          }`}
        >
          {session.status === 'finished' ? '✓ Completed' : session.status}
        </span>
      </div>
    </div>
  );
};

export default SessionCard;