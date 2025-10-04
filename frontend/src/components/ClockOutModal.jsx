import { FiTarget, FiTrendingUp } from 'react-icons/fi';

const ClockOutModal = ({ onClockOut, onContinue, targetHours }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Celebration background effect */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
        
        <div className="text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTarget className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Target Reached!
          </h2>
          
          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've hit your {targetHours}-hour goal! Ready to clock out and celebrate, or keep the momentum going?
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onClockOut}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition flex items-center justify-center space-x-2"
            >
              <span>⭐</span>
              <span>Clock Out - Perfect Score!</span>
            </button>
            
            <button
              onClick={onContinue}
              className="w-full py-3 px-6 rounded-lg border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-semibold transition flex items-center justify-center space-x-2"
            >
              <FiTrendingUp />
              <span>Keep Going - Be an Overachiever!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockOutModal;