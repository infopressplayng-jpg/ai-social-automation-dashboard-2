
import React, { useState, useCallback, useEffect } from 'react';
import { Device, DeviceStatus, LogEntry, ActionStep, SocialApp, Toast, ToastType } from '../types.ts';
import { INITIAL_DEVICES } from '../constants.tsx';
import { generateActionPlan, generateContent, suggestGoal } from '../services/geminiService.ts';
import DeviceCard from './DeviceCard.tsx';
import ControlPanel from './ControlPanel.tsx';
import AccountManager from './AccountManager.tsx';
import ToastComponent from './Toast.tsx';

const MAX_TASKS_BEFORE_COOLDOWN = 2;
const COOLDOWN_DURATION_MS = 30000;
const APP_CRASH_CHANCE = 0.1;
const MISCLICK_CHANCE = 0.15;

const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [masterGoal, setMasterGoal] = useState('');
  const [isMasterBusy, setIsMasterBusy] = useState(false);
  const [isSuggestingGoal, setIsSuggestingGoal] = useState(false);
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (title: string, message: string, type: ToastType) => {
    const newToast: Toast = { id: Date.now(), title, message, type };
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Effect to manage cooldown timers
  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
    const timers: ReturnType<typeof setTimeout>[] = [];
    devices.forEach(device => {
      if (device.status === DeviceStatus.COOLDOWN) {
        const timer = setTimeout(() => {
          updateDeviceState(device.id, { status: DeviceStatus.IDLE });
          addLog(device.id, 'Cooldown finished. Device is now idle.');
        }, COOLDOWN_DURATION_MS);
        timers.push(timer);
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [devices]);


  const updateDeviceState = (deviceId: number, updates: Partial<Device>) => {
    setDevices(prev =>
      prev.map(d => (d.id === deviceId ? { ...d, ...updates } : d))
    );
  };

  const addLog = (deviceId: number, message: string, isError: boolean = false) => {
    const newLog: LogEntry = { timestamp: new Date().toISOString(), message, isError };
    setDevices(prev =>
      prev.map(d => (d.id === deviceId ? { ...d, logs: [...d.logs, newLog] } : d))
    );
  };

  const runTaskForDevice = useCallback(async (deviceId: number, goal: string) => {
    // Using a function with setDevices to get the latest state
    let device: Device | undefined;
    setDevices(currentDevices => {
        device = currentDevices.find(d => d.id === deviceId);
        return currentDevices;
    });

    if (!device) return;

    addLog(deviceId, `Task started: "${goal}"`);
    updateDeviceState(deviceId, { status: DeviceStatus.BUSY, currentAction: 'Requesting action plan from AI...' });

    try {
      const actionPlan = await generateActionPlan(goal, device.profile.persona);
      addLog(deviceId, `AI generated persona-driven plan for ${device.profile.persona}.`);

      for (const step of actionPlan) {
        let currentDevice: Device | undefined;
        setDevices(currentDevices => {
            currentDevice = currentDevices.find(d => d.id === deviceId);
            return currentDevices;
        });
        if (!currentDevice) break;


        // Simulate human-like behavior: misclick chance
        if (Math.random() < MISCLICK_CHANCE) {
          addLog(deviceId, 'Simulating a misclick...');
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Simulate health check: app crash chance
        if (Math.random() < APP_CRASH_CHANCE) {
          throw new Error("App Crashed");
        }

        // Validate if app is installed before trying to open
        if (step.action === 'OPEN_APP') {
          const appToOpen = step.details as SocialApp;
          if (!currentDevice.profile.installedApps.includes(appToOpen)) {
              addLog(deviceId, `Action failed: App '${appToOpen}' is not installed. Skipping step.`, true);
              updateDeviceState(deviceId, { currentAction: `Failed to open ${appToOpen}` });
              continue; // Skip to next action in the plan
          }
        }
        
        // Simulate action delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
        
        let currentApp = currentDevice.currentApp;

        switch (step.action) {
          case 'OPEN_APP':
            currentApp = step.details as SocialApp;
            updateDeviceState(deviceId, { currentAction: `Opening ${step.details}`, currentApp });
            break;
          case 'CLOSE_APP':
            updateDeviceState(deviceId, { currentAction: 'Closing app...', currentApp: SocialApp.NONE });
            break;
          case 'COMMENT_ON_POST':
          case 'POST_CONTENT':
            const contentType = step.action === 'COMMENT_ON_POST' ? 'comment' : 'post';
            updateDeviceState(deviceId, { currentAction: `AI is generating a ${contentType}...` });
            const content = await generateContent(step.details, contentType, currentDevice.profile.persona);
            addLog(deviceId, `AI Generated Content (${currentDevice.profile.persona}): "${content}"`);
            updateDeviceState(deviceId, { currentAction: `Posted ${contentType}: "${content.substring(0,30)}..."` });
            break;
          case 'SCROLL_FEED':
            updateDeviceState(deviceId, { currentAction: `Scrolling feed: ${step.details}` });
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000)); // Longer delay for scrolling
            break;
          case 'IDLE':
            updateDeviceState(deviceId, { currentAction: `Idle: ${step.details}` });
            await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 4000)); // Longest delay for idle
            break;
          default:
            updateDeviceState(deviceId, { currentAction: `${step.action}: ${step.details}` });
            break;
        }
         addLog(deviceId, `Action completed: ${step.action} - ${step.details}`);
      }
      
      let finalDeviceState: Device | undefined;
      setDevices(currentDevices => {
        finalDeviceState = currentDevices.find(d => d.id === deviceId);
        return currentDevices;
      });

      if (!finalDeviceState) return;
      
      const newTasksCompleted = (finalDeviceState.tasksCompletedSinceReboot || 0) + 1;

      if (newTasksCompleted >= MAX_TASKS_BEFORE_COOLDOWN) {
        addLog(deviceId, 'Task limit reached. Device entering cooldown.');
        updateDeviceState(deviceId, { status: DeviceStatus.COOLDOWN, currentAction: 'On cooldown', tasksCompletedSinceReboot: 0 });
      } else {
        addLog(deviceId, 'Task completed successfully.');
        updateDeviceState(deviceId, { status: DeviceStatus.IDLE, currentAction: 'Task finished', tasksCompletedSinceReboot: newTasksCompleted });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error(`Error running task for device ${deviceId}:`, error);
      addLog(deviceId, `Critical Error: ${errorMessage}`, true);
      addToast('Device Error', `Device ${deviceId} encountered a critical error.`, 'error');
      updateDeviceState(deviceId, { status: DeviceStatus.ERROR, currentAction: 'Failed to complete task.' });

      // Auto-Recovery for specific, recoverable errors
      if (errorMessage === "App Crashed") {
        addLog(deviceId, "Attempting auto-recovery: Restarting app...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        updateDeviceState(deviceId, { status: DeviceStatus.IDLE, currentAction: 'App restarted' });
        addLog(deviceId, "Auto-recovery successful. Device is now idle.");
      }
    }
  }, []);

  const handleAssignMasterTask = async (goal: string) => {
    setIsMasterBusy(true);
    const idleDevices = devices.filter(d => d.status === DeviceStatus.IDLE);
    addToast('Master Task Assigned', `"${goal}" assigned to ${idleDevices.length} devices.`, 'info');
    const promises = idleDevices.map(device => runTaskForDevice(device.id, goal));
    await Promise.allSettled(promises);
    setIsMasterBusy(false);
    setMasterGoal('');
  };

  const handleSuggestGoal = async () => {
    setIsSuggestingGoal(true);
    try {
        const idlePersonas = devices
            .filter(d => d.status === DeviceStatus.IDLE)
            .map(d => d.profile.persona);
        if (idlePersonas.length > 0) {
            const suggested = await suggestGoal(idlePersonas);
            setMasterGoal(suggested);
            addToast('Goal Suggested', 'AI has generated a new goal for idle devices.', 'success');
        }
    } catch (error) {
        console.error("Failed to suggest goal", error);
        addToast('Suggestion Failed', 'The AI could not generate a goal.', 'error');
    } finally {
        setIsSuggestingGoal(false);
    }
  };

  const handleRebootDevice = (deviceId: number) => {
    addLog(deviceId, 'Manual reboot initiated...');
    updateDeviceState(deviceId, { status: DeviceStatus.IDLE, currentAction: 'Rebooted', tasksCompletedSinceReboot: 0, currentApp: SocialApp.NONE });
    addLog(deviceId, 'Device is now Idle.');
  };
  
  const idleDeviceCount = devices.filter(d => d.status === DeviceStatus.IDLE).length;

  return (
    <>
    <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
    </div>
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {isAccountManagerOpen && (
          <AccountManager 
            devices={devices} 
            setDevices={setDevices}
            onClose={() => setIsAccountManagerOpen(false)}
          />
      )}
      <ControlPanel 
        goal={masterGoal}
        onGoalChange={setMasterGoal}
        onAssignMasterTask={handleAssignMasterTask} 
        onSuggestGoal={handleSuggestGoal}
        onOpenAccountManager={() => setIsAccountManagerOpen(true)}
        isBusy={isMasterBusy}
        isSuggesting={isSuggestingGoal}
        idleDeviceCount={idleDeviceCount}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
        {devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onAssignTask={runTaskForDevice}
            onReboot={handleRebootDevice}
            isMasterBusy={isMasterBusy}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default Dashboard;