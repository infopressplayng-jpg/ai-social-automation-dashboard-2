
import React, { useState } from 'react';
import { Device, DeviceStatus } from '../types.ts';
import { SOCIAL_APP_ICONS, STATUS_COLORS } from '../constants.tsx';
import LogViewer from './LogViewer.tsx';

interface DeviceCardProps {
  device: Device;
  onAssignTask: (deviceId: number, goal: string) => void;
  onReboot: (deviceId: number) => void;
  isMasterBusy: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onAssignTask, onReboot, isMasterBusy }) => {
  const [isLogVisible, setIsLogVisible] = useState(false);
  const [goal, setGoal] = useState('');

  const statusColor = STATUS_COLORS[device.status];
  const isInteractive = device.status === DeviceStatus.IDLE && !isMasterBusy;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && isInteractive) {
      onAssignTask(device.id, goal);
      setGoal('');
    }
  };
  
  const shadowGlowClasses: { [key in DeviceStatus]: string } = {
    [DeviceStatus.IDLE]: 'hover:shadow-green-500/20',
    [DeviceStatus.BUSY]: 'shadow-lg shadow-yellow-500/30',
    [DeviceStatus.OFFLINE]: 'hover:shadow-gray-500/20',
    [DeviceStatus.ERROR]: 'shadow-lg shadow-red-500/40',
    [DeviceStatus.COOLDOWN]: 'shadow-lg shadow-cyan-500/30',
  };

  return (
    <>
      <div className={`bg-gray-800/50 rounded-lg p-4 flex flex-col justify-between transition-all duration-300 ${shadowGlowClasses[device.status]} hover:scale-[1.02]`}>
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-200">{device.name}</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${statusColor}`}>{device.status}</span>
              <div className={`w-3 h-3 rounded-full ${statusColor.replace('text', 'bg')} ${(device.status === DeviceStatus.BUSY || device.status === DeviceStatus.COOLDOWN) && 'animate-pulse'}`}></div>
            </div>
          </div>
           <div className="text-xs text-gray-400 mt-1">@{device.profile.socialAccount}</div>
           <div className="text-xs text-indigo-400 mt-1 font-medium">{device.profile.persona}</div>


          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center">
              <span className="text-gray-400 w-24">Current App:</span>
              <div className="flex items-center space-x-2">
                {SOCIAL_APP_ICONS[device.currentApp]}
                <span className="text-gray-200 font-medium">{device.currentApp}</span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-gray-400 w-24 flex-shrink-0">Last Action:</span>
              <p className="text-gray-200 break-words">{device.currentAction}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 my-3"></div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center">
                <span className="text-gray-500 w-24">OS Version:</span>
                <span className="text-gray-300 font-medium">{device.profile.osVersion}</span>
            </div>
            <div className="flex items-center">
                <span className="text-gray-500 w-24">Location:</span>
                <span className="text-gray-300 font-medium">{device.profile.flag} {device.profile.country}</span>
            </div>
             <div className="flex items-center">
                <span className="text-gray-500 w-24">IP Address:</span>
                <span className="text-gray-300 font-mono">{device.profile.ipAddress}</span>
            </div>
            <div className="flex items-center">
                <span className="text-gray-500 w-24">Resolution:</span>
                <span className="text-gray-300 font-mono">{device.profile.config.screenResolution}</span>
            </div>
            <div className="flex items-center">
                <span className="text-gray-500 w-24">Language:</span>
                <span className="text-gray-300 font-medium">{device.profile.config.language}</span>
            </div>
            <div className="flex items-start">
                <span className="text-gray-500 w-24 flex-shrink-0">Installed Apps:</span>
                <div className="flex flex-wrap gap-2 items-center">
                    {device.profile.installedApps.map(app => (
                        <span key={app} title={app}>
                            {React.cloneElement(SOCIAL_APP_ICONS[app], { className: 'h-4 w-4' })}
                        </span>
                    ))}
                </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700/50">
          {device.status === DeviceStatus.OFFLINE ? (
             <button
              onClick={() => onReboot(device.id)}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-500"
            >
              Reboot Device
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Assign individual task..."
                disabled={!isInteractive}
                className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!isInteractive || !goal.trim()}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Run
              </button>
            </form>
          )}

          <button
            onClick={() => setIsLogVisible(true)}
            className="mt-2 w-full text-center text-indigo-400 text-xs hover:underline"
          >
            View Logs
          </button>
        </div>
      </div>
      {isLogVisible && <LogViewer logs={device.logs} deviceName={device.name} onClose={() => setIsLogVisible(false)} />}
    </>
  );
};

export default DeviceCard;
