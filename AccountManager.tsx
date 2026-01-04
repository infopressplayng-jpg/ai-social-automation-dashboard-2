
import React, { useState } from 'react';
import { Device } from '../types.ts';
import { generateSocialUsername } from '../services/geminiService.ts';

interface AccountManagerProps {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  onClose: () => void;
}

const interests = ['gaming', 'travel', 'foodie', 'tech', 'fitness', 'fashion', 'crypto'];

const AccountManager: React.FC<AccountManagerProps> = ({ devices, setDevices, onClose }) => {
    const [editingGmail, setEditingGmail] = useState<number | null>(null);
    const [gmailValue, setGmailValue] = useState('');
    const [loadingSocial, setLoadingSocial] = useState<number | null>(null);

    const handleGmailEdit = (device: Device) => {
        setEditingGmail(device.id);
        setGmailValue(device.profile.googleAccount);
    };

    const handleGmailSave = (deviceId: number) => {
        setDevices(prev => prev.map(d => 
            d.id === deviceId 
                ? { ...d, profile: { ...d.profile, googleAccount: gmailValue } }
                : d
        ));
        setEditingGmail(null);
    };
    
    const handleCreateSocial = async (deviceId: number) => {
        setLoadingSocial(deviceId);
        try {
            const randomInterest = interests[Math.floor(Math.random() * interests.length)];
            const newUsername = await generateSocialUsername(randomInterest);
            setDevices(prev => prev.map(d =>
                d.id === deviceId
                    ? { ...d, profile: { ...d.profile, socialAccount: newUsername } }
                    : d
            ));
        } catch (error) {
            console.error("Failed to generate social username", error);
        } finally {
            setLoadingSocial(null);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-40 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Universal Account Manager</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="overflow-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Device</th>
                                <th scope="col" className="px-6 py-3">Location</th>
                                <th scope="col" className="px-6 py-3">IP Address</th>
                                <th scope="col" className="px-6 py-3">Resolution</th>
                                <th scope="col" className="px-6 py-3">Language</th>
                                <th scope="col" className="px-6 py-3">Google Account</th>
                                <th scope="col" className="px-6 py-3">Social Account</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map(device => (
                                <tr key={device.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{device.name}</td>
                                    <td className="px-6 py-4">{device.profile.flag} {device.profile.country}</td>
                                    <td className="px-6 py-4 font-mono">{device.profile.ipAddress}</td>
                                    <td className="px-6 py-4 font-mono">{device.profile.config.screenResolution}</td>
                                    <td className="px-6 py-4">{device.profile.config.language}</td>
                                    <td className="px-6 py-4">
                                        {editingGmail === device.id ? (
                                            <input 
                                                type="email"
                                                value={gmailValue}
                                                onChange={(e) => setGmailValue(e.target.value)}
                                                onBlur={() => handleGmailSave(device.id)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleGmailSave(device.id)}
                                                className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm w-full"
                                                autoFocus
                                            />
                                        ) : (
                                            <span onDoubleClick={() => handleGmailEdit(device)}>{device.profile.googleAccount}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">@{device.profile.socialAccount}</td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button onClick={() => handleGmailEdit(device)} className="font-medium text-indigo-400 hover:underline text-xs">Link Gmail</button>
                                        <button 
                                            onClick={() => handleCreateSocial(device.id)} 
                                            disabled={loadingSocial === device.id}
                                            className="font-medium text-indigo-400 hover:underline text-xs disabled:opacity-50"
                                        >
                                            {loadingSocial === device.id ? 'Creating...' : 'Create Social'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 border-t border-gray-700 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountManager;