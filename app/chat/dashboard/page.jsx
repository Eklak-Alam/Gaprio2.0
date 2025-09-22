'use client';
import ChatSection from '@/components/chat/dashboard/ChatSection';
import CreateGroupSection from '@/components/chat/dashboard/CreateGroupSection';
import GroupChatSection from '@/components/chat/dashboard/GroupChatSection';
import GroupListSection from '@/components/chat/dashboard/GroupListSection';
import ProfileSection from '@/components/chat/dashboard/ProfileSection';
import SearchSection from '@/components/chat/dashboard/SearchSection';
import SecuritySection from '@/components/chat/dashboard/SecuritySection';
import Sidebar from '@/components/chat/dashboard/Sidebar';
import { useApi } from '@/context/ApiContext';
import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const { isAuthenticated, user: currentUser, getUserGroups } = useApi();
  const [activeSection, setActiveSection] = useState('chat');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Fetch user's groups
  const fetchUserGroups = async () => {
    if (!currentUser) return;
    
    setLoadingGroups(true);
    try {
      const groups = await getUserGroups(currentUser.id);
      setUserGroups(groups);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      setError('Failed to load your groups');
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserGroups();
    }
  }, [currentUser]);

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
      <div className="flex flex-1 mt-24"> 
        <Sidebar
          currentUser={currentUser}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          userGroups={userGroups}
          refreshGroups={fetchUserGroups}
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

          {activeSection === 'chat' && (
            selectedGroup ? (
              <GroupChatSection
                group={selectedGroup} 
                currentUser={currentUser}
                setError={setError}
                onLeaveGroup={() => {
                  setSelectedGroup(null);
                  fetchUserGroups();
                }}
              />
            ) : (
              <ChatSection setError={setError} />
            )
          )}
          
          {activeSection === 'search' && <SearchSection setError={setError} />}
          {activeSection === 'groups' && (
            <GroupListSection
              groups={userGroups}
              loading={loadingGroups}
              onSelectGroup={setSelectedGroup}
              onCreateGroup={() => setActiveSection('create-group')}
              onRefresh={fetchUserGroups}
              setError={setError}
            />
          )}
          {activeSection === 'create-group' && (
            <CreateGroupSection
              currentUser={currentUser}
              onGroupCreated={() => {
                setActiveSection('groups');
                fetchUserGroups();
              }}
              onCancel={() => setActiveSection('groups')}
              setError={setError}
            />
          )}
          {activeSection === 'profile' && <ProfileSection currentUser={currentUser} />}
          {activeSection === 'security' && <SecuritySection />}
        </main>
      </div>
    </div>
  );
}