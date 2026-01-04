
import React, { useEffect, useState } from 'react';
import { Toast, ToastType } from '../types.ts';

interface ToastComponentProps extends Toast {
  onClose: () => void;
}

const ICONS: { [key in ToastType]: React.ReactElement } = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const ToastComponent: React.FC<ToastComponentProps> = ({ id, title, message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 500); // Wait for animation to finish
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500);
  };

  return (
    <div className={`bg-gray-700/80 backdrop-blur-sm rounded-lg shadow-lg p-4 flex items-start space-x-4 ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}`}>
      <div className="flex-shrink-0">{ICONS[type]}</div>
      <div className="flex-1">
        <p className="font-bold text-white">{title}</p>
        <p className="text-sm text-gray-300">{message}</p>
      </div>
      <button onClick={handleClose} className="text-gray-400 hover:text-white">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ToastComponent;
