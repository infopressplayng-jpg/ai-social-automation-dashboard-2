
import React from 'react';

interface ControlPanelProps {
  goal: string;
  onGoalChange: (value: string) => void;
  onAssignMasterTask: (goal: string) => void;
  onSuggestGoal: () => void;
  onOpenAccountManager: () => void;
  isBusy: boolean;
  isSuggesting: boolean;
  idleDeviceCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
    goal,
    onGoalChange,
    onAssignMasterTask, 
    onSuggestGoal,
    onOpenAccountManager, 
    isBusy,
    isSuggesting, 
    idleDeviceCount 
}) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && !isBusy) {
      onAssignMasterTask(goal);
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200">Master Control</h2>
        <button
            onClick={onOpenAccountManager}
            className="px-4 py-2 bg-gray-700 text-sm text-white rounded-md font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
        >
            Manage Accounts
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Assign a high-level goal to all idle devices. The AI will generate a unique, persona-driven action plan for each device.
        There are currently <span className="font-bold text-green-400">{idleDeviceCount}</span> devices ready for tasks.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <input
            type="text"
            value={goal}
            onChange={(e) => onGoalChange(e.target.value)}
            placeholder="E.g., Engage with posts about AI on X"
            disabled={isBusy}
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button
                type="button"
                onClick={onSuggestGoal}
                disabled={isSuggesting || isBusy || idleDeviceCount === 0}
                className="px-4 py-3 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                 {isSuggesting ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 ) : (
                    <span className="text-indigo-300">✨</span>
                 )}
                <span>Suggest Goal</span>
            </button>
        </div>
        <button
          type="submit"
          disabled={isBusy || !goal.trim() || idleDeviceCount === 0}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isBusy ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <span>Assign to All Idle Devices</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ControlPanel;
