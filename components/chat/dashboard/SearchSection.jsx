'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserFriends, FaTimes, FaUser, FaComment, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '@/context/ApiContext';

const SearchSection = ({ setError, onUserSelect }) => {
  const { searchUsers, createDirectChat, user: currentUser } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const results = await searchUsers(query);
      // Filter out current user from search results
      const filteredResults = Array.isArray(results) 
        ? results.filter(user => user.id !== currentUser.id)
        : [];
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (searchQuery.trim()) {
      setLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setLoading(false);
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const startConversation = async (user) => {
    try {
      // Add to recent searches
      const newRecent = [user, ...recentSearches.filter(u => u.id !== user.id)].slice(0, 5);
      setRecentSearches(newRecent);
      
      const conversation = await createDirectChat(currentUser.id, user.id);
      setSearchQuery('');
      setSearchResults([]);
      setError('');
      
      // Notify parent component about the new conversation
      if (onUserSelect) {
        onUserSelect(conversation || user);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation. Please try again.');
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const UserCard = ({ user, isRecent = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-700/60 rounded-xl p-4 hover:bg-gray-700 transition-all duration-300 cursor-pointer group border border-gray-600 hover:border-indigo-500"
      onClick={() => startConversation(user)}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isRecent && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
              <FaSearch className="text-xs text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-sm lg:text-base">
            {user.username}
          </h3>
          <p className="text-gray-300 text-xs lg:text-sm truncate">
            {user.email}
          </p>
          {user.bio && (
            <p className="text-gray-400 text-xs truncate mt-1">
              {user.bio}
            </p>
          )}
        </div>
        
        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white">
          <FaComment className="text-sm" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gray-800 p-4 lg:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg mr-3">
            <FaSearch className="text-white text-lg" />
          </div>
          Find People
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Search for users to start new conversations
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by username, name, or email..."
            className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-400">Searching users...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Search Results</h3>
            {searchResults.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-3xl text-gray-400 opacity-50" />
            </div>
            <h3 className="text-gray-400 font-medium mb-2">No users found</h3>
            <p className="text-gray-500 text-sm">
              Try a different search term or check the spelling
            </p>
          </div>
        ) : recentSearches.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400">Recent Searches</h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear all
              </button>
            </div>
            {recentSearches.map(user => (
              <UserCard key={user.id} user={user} isRecent={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserFriends className="text-3xl text-gray-400 opacity-50" />
            </div>
            <h3 className="text-gray-400 font-medium mb-2">Find people to chat with</h3>
            <p className="text-gray-500 text-sm">
              Search for users by their username, name, or email address
            </p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      {!searchQuery && searchResults.length === 0 && (
        <div className="mt-6 p-4 bg-gray-700/50 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Quick tips:</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Use partial names for better results</li>
            <li>• Try searching by email address</li>
            <li>• Check your spelling if no results appear</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchSection;