'use client';
import ChatSection from '@/components/chat/dashboard/ChatSection';
import ProfileSection from '@/components/chat/dashboard/ProfileSection';
import SearchSection from '@/components/chat/dashboard/SearchSection';
import SecuritySection from '@/components/chat/dashboard/SecuritySection';
import Sidebar from '@/components/chat/dashboard/Sidebar';
import { useApi } from '@/context/ApiContext';
import React, { useState } from 'react';

export default function Dashboard() {
  const { isAuthenticated, user: currentUser } = useApi();
  const [activeSection, setActiveSection] = useState('chat');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Please log in to access the dashboard</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Fixed Navbar already above this, so we use mt-[96px] instead of pt */}
      <div className="flex flex-1 mt-24"> 
        <Sidebar
          currentUser={currentUser}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        <main className="flex-1 h-full overflow-y-auto px-4 lg:px-6">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                &times;
              </button>
            </div>
          )}

          {activeSection === 'chat' && <ChatSection setError={setError} />}
          {activeSection === 'search' && <SearchSection setError={setError} />}
          {activeSection === 'profile' && <ProfileSection currentUser={currentUser} />}
          {activeSection === 'security' && <SecuritySection />}
        </main>
      </div>
    </div>
  );
}
