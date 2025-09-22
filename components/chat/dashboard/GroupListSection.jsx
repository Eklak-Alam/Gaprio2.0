'use client';
import { RefreshCcw } from 'lucide-react';
import React from 'react';
import { FaCog, FaPlus, FaUsers } from 'react-icons/fa';

const GroupListSection = ({ groups, loading, onSelectGroup, onCreateGroup, onRefresh, setError }) => {
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Groups</h1>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Groups</h1>
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            title="Refresh groups"
          >
            <RefreshCcw />
          </button>
          <button
            onClick={onCreateGroup}
            className="flex items-center space-x-2 bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            <FaPlus />
            <span>New Group</span>
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No groups yet</h3>
          <p className="text-gray-400 mb-4">Create your first group to start chatting with multiple people</p>
          <button
            onClick={onCreateGroup}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Create Group
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {group.memberCount || group.members?.length || 0} members
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  <FaCog />
                </div>
              </div>
              
              {group.description && (
                <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                  {group.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupListSection;