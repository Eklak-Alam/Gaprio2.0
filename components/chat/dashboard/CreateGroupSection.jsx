'use client';
import React, { useState } from 'react';
import { FaArrowLeft, FaUsers, FaPlus } from 'react-icons/fa';
import { useApi } from '@/context/ApiContext';

const CreateGroupSection = ({ currentUser, onGroupCreated, onCancel, setError }) => {
  const { createGroup, searchUsers } = useApi();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query, 10);
      // Filter out current user and already selected members
      const filteredResults = results.filter(
        user => user.id !== currentUser.id && 
               !selectedMembers.some(m => m.id === user.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      setError('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const addMember = (user) => {
    if (!selectedMembers.some(m => m.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (selectedMembers.length === 0) {
      setError('Please add at least one member');
      return;
    }

    setCreating(true);
    try {
      const memberIds = selectedMembers.map(m => m.id);
      
      // FIXED: Send correct data structure
      await createGroup({
        groupName: groupName.trim(),
        description: description.trim(),
        creatorId: currentUser.id,
        memberIds: [currentUser.id, ...memberIds] // Correct field name
      });
      
      onGroupCreated();
    } catch (error) {
      console.error('Group creation error:', error);
      setError('Failed to create group: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="p-2 mr-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          disabled={creating}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Create New Group</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
        {/* Group Info */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Group Name *
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
            placeholder="Enter group name"
            maxLength={50}
            disabled={creating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
            placeholder="Optional group description"
            rows={3}
            maxLength={200}
            disabled={creating}
          />
        </div>

        {/* Add Members */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Add Members *
          </label>
          
          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedMembers.map(member => (
                <div key={member.id} className="flex items-center bg-indigo-600 px-3 py-1 rounded-full">
                  <span className="text-sm mr-2">{member.username}</span>
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-white hover:text-red-200 text-xs"
                    disabled={creating}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
              placeholder="Search users to add..."
              disabled={creating || searching}
            />
            
            {searching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    onClick={() => addMember(user)}
                    className="p-3 hover:bg-gray-600 cursor-pointer flex items-center space-x-3"
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
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
            disabled={creating}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={creating || !groupName.trim() || selectedMembers.length === 0}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {creating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FaPlus className="mr-2" />
                Create Group
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupSection;