
import React from 'react';
import { LogEntry } from '../types.ts';

interface LogViewerProps {
  logs: LogEntry[];
  deviceName: string;
  onClose: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ logs, deviceName, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Logs for {deviceName}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-grow">
                    <div className="font-mono text-sm space-y-2">
                        {logs.slice().reverse().map((log, index) => (
                            <div key={index} className={`flex items-start ${log.isError ? 'text-red-400' : 'text-gray-300'}`}>
                                <span className="text-gray-500 mr-4 flex-shrink-0">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <p className="flex-grow break-words">{log.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="p-4 border-t border-gray-700 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogViewer;