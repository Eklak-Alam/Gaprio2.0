'use client';
import React, { useState, useEffect } from 'react';
import { FaUsers, FaSignOutAlt, FaPlus, FaTrash, FaCrown, FaSearch } from 'react-icons/fa';
import { useApi } from '@/context/ApiContext';

const GroupChatSection = ({ group, currentUser, setError, onLeaveGroup }) => {
  const { getGroupMembers, addGroupMember, removeGroupMember, deleteGroup, searchUsers } = useApi();
  const [members, setMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [group]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const membersData = await getGroupMembers(group.id);
      setMembers(membersData);
    } catch (error) {
      setError('Failed to load group members');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query, 10);
      // Filter out current user and existing members
      const filteredResults = results.filter(
        user => user.id !== currentUser.id && 
               !members.some(m => m.id === user.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      setError('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async (user) => {
    setActionLoading(true);
    try {
      await addGroupMember(group.id, currentUser.id, user.id);
      setSearchQuery('');
      setSearchResults([]);
      setShowAddMember(false);
      loadMembers(); // Refresh members list
    } catch (error) {
      setError('Failed to add member: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    setActionLoading(true);
    try {
      await removeGroupMember(group.id, memberId, currentUser.id);
      loadMembers(); // Refresh members list
    } catch (error) {
      setError('Failed to remove member: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    
    setActionLoading(true);
    try {
      await removeGroupMember(group.id, currentUser.id, currentUser.id);
      onLeaveGroup();
    } catch (error) {
      setError('Failed to leave group: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;
    
    setActionLoading(true);
    try {
      await deleteGroup(group.id, currentUser.id);
      onLeaveGroup();
    } catch (error) {
      setError('Failed to delete group: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const isCreator = group.creatorId === currentUser.id;
  const currentMember = members.find(m => m.id === currentUser.id);
  const isAdmin = currentMember?.role === 'admin' || isCreator;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Group Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <FaUsers className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>
              {group.description && (
                <p className="text-gray-400">{group.description}</p>
              )}
              <p className="text-gray-400 text-sm">
                {members.length} members • Created by {group.creatorUsername || 'you'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isCreator ? (
              <button
                onClick={handleDeleteGroup}
                disabled={actionLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 disabled:opacity-50 flex items-center space-x-2"
              >
                <FaTrash />
                <span>Delete Group</span>
              </button>
            ) : (
              <button
                onClick={handleLeaveGroup}
                disabled={actionLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 disabled:opacity-50 flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Leave Group</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Group Members</h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 flex items-center space-x-2"
              disabled={actionLoading}
            >
              <FaPlus />
              <span>Add Member</span>
            </button>
          )}
        </div>

        {/* Add Member Form */}
        {showAddMember && (
          <div className="mb-6 p-4 bg-gray-750 rounded-lg">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search users to add..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-3"
                disabled={searching}
              />
              {searching && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            {searchResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-lg">
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleAddMember(user)}
                    className="p-3 hover:bg-gray-600 cursor-pointer flex items-center space-x-3 border-b border-gray-600 last:border-b-0"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FaUsers className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-white text-sm">{user.username}</p>
                      <p className="text-gray-400 text-xs">{user.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members List */}
        <div className="space-y-3">
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          ) : (
            members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {member.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{member.username}</span>
                      {member.role === 'admin' && (
                        <FaCrown className="text-yellow-400 text-sm" />
                      )}
                      {member.id === group.creatorId && (
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">Creator</span>
                      )}
                    </div>
                    <span className="text-gray-400 text-sm">{member.name}</span>
                  </div>
                </div>

                {isAdmin && member.id !== currentUser.id && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={actionLoading}
                    className="text-red-400 hover:text-red-300 p-2 disabled:opacity-50"
                    title="Remove member"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Interface would go here */}
      <div className="mt-6 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Group Chat</h2>
        <div className="text-center text-gray-400 py-12">
          <FaUsers className="text-4xl mx-auto mb-4" />
          <p>Group chat interface will be implemented here</p>
          <p className="text-sm">Messages, file sharing, and real-time updates</p>
        </div>
      </div>
    </div>
  );
};

export default GroupChatSection;