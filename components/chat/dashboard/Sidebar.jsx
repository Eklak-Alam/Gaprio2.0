'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaComments, FaSearch, FaUserCircle, FaShieldAlt, 
  FaSignOutAlt, FaUser, FaBars, FaTimes,
  FaUsers, FaPlus, FaCog, FaBell
} from 'react-icons/fa';
import { useApi } from '@/context/ApiContext';

const Sidebar = ({ 
  currentUser, 
  activeSection, 
  setActiveSection, 
  mobileSidebarOpen, 
  setMobileSidebarOpen,
  selectedGroup,
  setSelectedGroup,
  userGroups,
  refreshGroups
}) => {
  const { logout, createGroup } = useApi();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: <FaComments className="text-lg" /> },
    { id: 'search', label: 'Find Users', icon: <FaSearch className="text-lg" /> },
    { id: 'groups', label: 'Groups', icon: <FaUsers className="text-lg" /> },
    { id: 'profile', label: 'Profile', icon: <FaUserCircle className="text-lg" /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt className="text-lg" /> },
  ];

  // Handle create group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    setCreatingGroup(true);
    try {
      await createGroup({
        name: newGroupName.trim(),
        description: '',
        creatorId: currentUser.id,
        members: [currentUser.id]
      });
      setNewGroupName('');
      setShowCreateGroup(false);
      refreshGroups(); // Refresh the groups list
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setCreatingGroup(false);
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      
      if (mobileSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          mobileMenuButton && 
          !mobileMenuButton.contains(event.target)) {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileSidebarOpen, setMobileSidebarOpen]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
        <button
          id="mobile-menu-button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? (
            <FaTimes className="text-white text-xl" />
          ) : (
            <FaBars className="text-white text-xl" />
          )}
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.username} 
                className="w-10 h-10 rounded-full object-cover" 
              />
            ) : (
              <FaUser className="text-white text-sm" />
            )}
          </div>
          <div className="hidden xs:block">
            <h2 className="font-bold text-sm text-white truncate max-w-[120px]">
              {currentUser.name || currentUser.username}
            </h2>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for mobile */}
      {mobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`bg-gray-800 w-64 min-h-screen fixed lg:static inset-y-0 left-0 z-40 transform 
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out 
        lg:border-r border-gray-700 flex flex-col pt-16 lg:pt-0`}
      >
        {/* Desktop header */}
        <div className="p-6 border-b border-gray-700 hidden lg:block">
          <h1 className="text-xl font-bold text-white">Gaprio Messenger</h1>
          <p className="text-gray-400 text-sm">Welcome, {currentUser.username}</p>
        </div>

        <div className="p-4 pt-6 lg:pt-4 flex-1 overflow-y-auto">
          {/* Mobile user info */}
          <div className="lg:hidden flex items-center space-x-4 mb-6 p-3 bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.username} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
              ) : (
                <FaUser className="text-white" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-white truncate">
                {currentUser.name || currentUser.username}
              </h2>
              <p className="text-gray-400 text-sm truncate">@{currentUser.username}</p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2 mb-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { 
                  setActiveSection(item.id); 
                  setMobileSidebarOpen(false); 
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                  activeSection === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Groups Section */}
          {activeSection === 'groups' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide">
                  Your Groups
                </h3>
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Create new group"
                >
                  <FaPlus size={14} />
                </button>
              </div>

              {/* Create Group Form */}
              {showCreateGroup && (
                <div className="mb-3 p-3 bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full p-2 mb-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-indigo-400 focus:outline-none"
                    disabled={creatingGroup}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateGroup}
                      disabled={creatingGroup || !newGroupName.trim()}
                      className="flex-1 bg-indigo-600 text-white py-1 px-3 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {creatingGroup ? 'Creating...' : 'Create'}
                    </button>
                    <button
                      onClick={() => setShowCreateGroup(false)}
                      className="bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Groups List */}
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {userGroups && userGroups.length > 0 ? (
                  userGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => {
                        setSelectedGroup(group);
                        setActiveSection('chat');
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded flex items-center space-x-2 transition-colors ${
                        selectedGroup?.id === group.id
                          ? 'bg-indigo-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUsers className="text-white text-xs" />
                      </div>
                      <span className="text-sm truncate">{group.name}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm p-2 text-center">
                    No groups yet. Create one!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-auto pt-6 border-t border-gray-700">
            <button
              onClick={() => {
                logout();
                setMobileSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile version info */}
        <div className="p-4 border-t border-gray-700 lg:hidden">
          <p className="text-xs text-gray-500 text-center">
            Gaprio Messenger v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;