
import React from 'react';
import { Device, DeviceStatus, SocialApp } from './types.ts';

export const TOTAL_DEVICES = 10;

const sampleUsernames = [
  'DigitalNomad', 'PixelPioneer', 'CodeWizard', 'ByteBlogger', 'CloudChaser',
  'DataDynamo', 'LogicLurker', 'StreamSurfer', 'GadgetGeek', 'VirtualVibes'
];

const personas = [
    'Tech Enthusiast', 'Foodie', 'Fitness Guru', 'Travel Blogger', 'Fashionista',
    'Gamer', 'Meme Lord', 'Book Worm', 'Crypto Bro', 'Nature Photographer'
].sort(() => 0.5 - Math.random());

const osVersions = ['Android 12L', 'Android 13', 'Android 14'];
const allSocialApps = [SocialApp.INSTAGRAM, SocialApp.TIKTOK, SocialApp.X, SocialApp.FACEBOOK];

const screenResolutions = ['1080x1920', '1080x2340', '1440x3040', '720x1600', '1080x2400', '1440x3200', '720x1560', '1080x2408', '1440x2560', '720x1280'];
const languages = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'ja-JP', 'es-ES', 'pt-BR', 'ko-KR', 'hi-IN', 'ru-RU'];

const generateAppVersion = (appName: SocialApp): string => {
    switch(appName) {
        case SocialApp.INSTAGRAM: return `334.0.0.${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}`;
        case SocialApp.TIKTOK: return `34.7.${Math.floor(1 + Math.random() * 9)}`;
        case SocialApp.X: return `10.40.${Math.floor(1 + Math.random() * 9)}`;
        case SocialApp.FACEBOOK: return `460.0.0.${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}`;
        default: return '1.0.0';
    }
};

const locations = [
  { ip: '8.8.8.8', country: 'USA', flag: '🇺🇸' },
  { ip: '1.1.1.1', country: 'Australia', flag: '🇦🇺' },
  { ip: '87.101.236.70', country: 'Germany', flag: '🇩🇪' },
  { ip: '212.58.244.23', country: 'UK', flag: '🇬🇧' },
  { ip: '106.186.25.143', country: 'Japan', flag: '🇯🇵' },
  { ip: '185.86.149.10', country: 'Netherlands', flag: '🇳🇱' },
  { ip: '64.6.64.6', country: 'Canada', flag: '🇨🇦' },
  { ip: '193.108.91.103', country: 'France', flag: '🇫🇷' },
  { ip: '200.2.12.203', country: 'Brazil', flag: '🇧🇷' },
  { ip: '103.24.16.255', country: 'India', flag: '🇮🇳' },
].sort(() => 0.5 - Math.random()); // Shuffle locations for randomness on each load

export const INITIAL_DEVICES: Device[] = Array.from({ length: TOTAL_DEVICES }, (_, i) => {
  // Each device gets 2 to 4 randomly selected apps
  const numApps = 2 + Math.floor(Math.random() * 3);
  const installedApps = [...allSocialApps].sort(() => 0.5 - Math.random()).slice(0, numApps);
  const appVersions = installedApps.reduce((acc, app) => {
    if (app !== SocialApp.NONE) {
        acc[app] = generateAppVersion(app);
    }
    return acc;
  }, {} as { [key in SocialApp]?: string });
  const location = locations[i];

  return {
    id: i + 1,
    name: `Device ${i + 1}`,
    status: i % 4 === 0 ? DeviceStatus.OFFLINE : DeviceStatus.IDLE,
    currentApp: SocialApp.NONE,
    currentAction: '-',
    logs: [{ timestamp: new Date().toISOString(), message: 'Device initialized.' }],
    profile: {
      socialAccount: `${sampleUsernames[i]}${Math.floor(10 + Math.random() * 90)}`,
      googleAccount: `user${i+1}@gmail.com`,
      osVersion: osVersions[i % osVersions.length],
      installedApps: installedApps,
      ipAddress: location.ip,
      country: location.country,
      flag: location.flag,
      persona: personas[i],
      config: {
        darkMode: Math.random() > 0.5,
        notifications: Math.random() > 0.5 ? 'enabled' : 'disabled',
        appVersions,
        screenResolution: screenResolutions[i % screenResolutions.length],
        language: languages[i % languages.length],
      },
    },
    tasksCompletedSinceReboot: 0,
  };
});

// FIX: Provided a more specific type for the SVG icons to allow cloning with new props.
export const SOCIAL_APP_ICONS: { [key in SocialApp]: React.ReactElement<React.SVGProps<SVGSVGElement>> } = {
    [SocialApp.NONE]: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
    ),
    [SocialApp.INSTAGRAM]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="url(#instagram-gradient)" viewBox="0 0 24 24"><defs><radialGradient id="instagram-gradient" cx="0.3" cy="1" r="1"><stop offset="0" stopColor="#FED977"/><stop offset="0.15" stopColor="#F58529"/><stop offset="0.3" stopColor="#DD2A7B"/><stop offset="0.45" stopColor="#8134AF"/><stop offset="0.6" stopColor="#515BD4"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.2 0-3.556.012-4.786.069-2.583.118-3.961 1.5-4.079 4.08-.057 1.23-.068 1.582-.068 4.751s.012 3.52.068 4.751c.118 2.582 1.496 3.962 4.079 4.08 1.23.057 1.586.069 4.786.069s3.556-.012 4.786-.069c2.583-.118 3.962-1.499 4.08-4.08.057-1.23.068-1.571.068-4.751s-.012-3.52-.068-4.751c-.118-2.581-1.497-3.962-4.08-4.08C15.556 3.614 15.2 3.604 12 3.604zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.441a2.31 2.31 0 110 4.62 2.31 2.31 0 010-4.62zM16.802 6.11a1.096 1.096 0 100 2.192 1.096 1.096 0 000-2.192z"/></svg>,
    [SocialApp.TIKTOK]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="currentColor" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/></svg>,
    [SocialApp.X]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>,
    [SocialApp.FACEBOOK]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>,
};

export const STATUS_COLORS: { [key in DeviceStatus]: string } = {
    [DeviceStatus.IDLE]: 'text-green-400',
    [DeviceStatus.BUSY]: 'text-yellow-400',
    [DeviceStatus.OFFLINE]: 'text-gray-500',
    [DeviceStatus.ERROR]: 'text-red-400',
    [DeviceStatus.COOLDOWN]: 'text-cyan-400',
};