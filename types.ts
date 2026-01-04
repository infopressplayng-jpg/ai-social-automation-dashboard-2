
export enum DeviceStatus {
  IDLE = 'Idle',
  BUSY = 'Busy',
  OFFLINE = 'Offline',
  ERROR = 'Error',
  COOLDOWN = 'Cooldown',
}

export enum SocialApp {
  NONE = 'None',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  X = 'X',
  FACEBOOK = 'Facebook',
}

export interface LogEntry {
  timestamp: string;
  message: string;
  isError?: boolean;
}

export interface Device {
  id: number;
  name: string;
  status: DeviceStatus;
  currentApp: SocialApp;
  currentAction: string;
  logs: LogEntry[];
  profile: {
    socialAccount: string;
    googleAccount: string;
    osVersion: string;
    installedApps: SocialApp[];
    ipAddress: string;
    country: string;
    flag: string;
    persona: string;
    config: {
      darkMode: boolean;
      notifications: 'enabled' | 'disabled';
      appVersions: { [key in SocialApp]?: string };
      screenResolution: string;
      language: string;
    };
  };
  tasksCompletedSinceReboot: number;
}

export interface ActionStep {
    action: 'OPEN_APP' | 'SEARCH' | 'LIKE_POST' | 'COMMENT_ON_POST' | 'VIEW_STORY' | 'CLOSE_APP' | 'POST_CONTENT' | 'IDLE' | 'SCROLL_FEED';
    details: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  title: string;
  message: string;
  type: ToastType;
}
