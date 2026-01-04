
import React from 'react';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <svg className="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.218 10.372L19.22 12.372M19.22 12.372L17.218 14.372M19.22 12.372H4.78M3 12.372h.01M6.782 14.372L4.78 12.372M4.78 12.372L6.782 10.372M12 21.372c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    <h1 className="text-xl font-bold ml-3 tracking-wider">AI Social Automation</h1>
                </div>
            </div>
        </div>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default App;