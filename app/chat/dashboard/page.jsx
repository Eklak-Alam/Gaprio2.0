'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, FaCalendarAlt, FaClock, FaCog, FaEdit, FaEnvelope, 
  FaEnvelopeOpen, FaGlobe, FaIdCard, FaShieldAlt, FaSignOutAlt, 
  FaUser, FaUserShield, FaSearch, FaTimes, FaComments, FaHome,
  FaUserFriends, FaCogs, FaUserCircle, FaPlus, FaPaperPlane,
  FaEllipsisV, FaBars, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import { useApi } from '@/context/ApiContext';

export default function Dashboard() {
  const { 
    user: currentUser, 
    logout, 
    loading: apiLoading,
    searchUsers, 
    createDirectChat, 
    getUserConversations, 
    sendMessage, 
    getMessages, 
    connectWebSocket, 
    isAuthenticated,
    clearError
  } = useApi();

  // State management
  const [activeSection, setActiveSection] = useState('chat');
  const [userDetails, setUserDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({
    conversations: false,
    messages: false,
    search: false,
    general: false
  });
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const wsDisconnectRef = useRef(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Simulate fetching additional user details
  useEffect(() => {
    if (currentUser) {
      setUserDetails({
        ...currentUser,
        joinDate: '2024-01-15',
        lastActive: new Date().toISOString(),
        status: 'Online',
        emailVerified: true,
        twoFactorEnabled: false
      });
    }
  }, [currentUser]);

  // Load conversations on component mount
  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      loadConversations();
    }
  }, [currentUser, isAuthenticated]);

  // Set up WebSocket connection when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Clean up previous connection
      if (wsDisconnectRef.current) {
        wsDisconnectRef.current();
      }

      // Connect to WebSocket for real-time messages
      try {
        wsDisconnectRef.current = connectWebSocket(
          selectedConversation.id,
          handleNewMessage
        );
      } catch (err) {
        console.error('WebSocket connection failed:', err);
        setError('Real-time connection unavailable. Messages may not update in real-time.');
      }

      // Load existing messages
      loadMessages(selectedConversation.id);
    }

    return () => {
      if (wsDisconnectRef.current) {
        wsDisconnectRef.current();
      }
    };
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = useCallback((message) => {
    // Check if this message belongs to the current conversation
    if (message.conversationId === selectedConversation?.id) {
      setMessages(prev => [...prev, message]);
    }
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === message.conversationId 
        ? {...conv, lastMessage: message}
        : conv
    ));
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(prev => ({...prev, conversations: true}));
      const userConversations = await getUserConversations(currentUser.id);
      setConversations(userConversations || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setLoading(prev => ({...prev, conversations: false}));
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading(prev => ({...prev, messages: true}));
      const conversationMessages = await getMessages(conversationId);
      // Ensure we're working with an array
      setMessages(Array.isArray(conversationMessages) ? conversationMessages : []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(prev => ({...prev, messages: false}));
    }
  };

const handleSearch = async (query) => {
  if (!query.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    setLoading(prev => ({...prev, search: true}));
    setError('');
    
    const results = await searchUsers(query);
    setSearchResults(Array.isArray(results) ? results : []);
  } catch (error) {
    console.error('Search failed:', error);
    
    if (error.response?.status === 403) {
      setError('Authentication failed. Please try logging in again.');
      // Optionally trigger logout
      setTimeout(() => logout(), 2000);
    } else {
      setError('Search failed. Please try again.');
    }
    
    setSearchResults([]);
  } finally {
    setLoading(prev => ({...prev, search: false}));
  }
};



// In your search useEffect
useEffect(() => {
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }
  
  if (searchQuery.trim() && isAuthenticated()) {
    setLoading(prev => ({...prev, search: true}));
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
  } else {
    setSearchResults([]);
  }
  
  return () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };
}, [searchQuery]);


  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (searchQuery.trim()) {
      setLoading(prev => ({...prev, search: true}));
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500);
    } else {
      setSearchResults([]);
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const startConversation = async (user) => {
    try {
      setLoading(prev => ({...prev, general: true}));
      const conversation = await createDirectChat(currentUser.id, user.id);
      
      // Add to conversations list
      setConversations(prev => [conversation, ...prev]);
      
      // Select the new conversation
      setSelectedConversation(conversation);
      setActiveSection('chat');
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation');
    } finally {
      setLoading(prev => ({...prev, general: false}));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        conversationId: selectedConversation.id,
        content: newMessage.trim(),
        senderId: currentUser.id
      };

      // Optimistically add message to UI
      const tempMessage = {
        ...messageData,
        id: Date.now(), // temporary ID
        timestamp: new Date().toISOString(),
        status: 'sending',
        sender: { id: currentUser.id, username: currentUser.username }
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      // Send message to server
      await sendMessage(messageData);
      
      // Update message status on success
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? {...msg, status: 'sent'} 
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
      
      // Update message status on failure
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? {...msg, status: 'failed'} 
            : msg
        )
      );
    }
  };

  const getOtherUser = (conversation) => {
    if (!conversation.participants || !currentUser) return null;
    return conversation.participants.find(p => p.id !== currentUser.id);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/chat/login';
  };

  const retryFailedMessage = async (message) => {
    try {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? {...msg, status: 'retrying'} 
            : msg
        )
      );
      
      await sendMessage({
        conversationId: message.conversationId,
        content: message.content,
        senderId: message.senderId
      });
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? {...msg, status: 'sent'} 
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to resend message:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? {...msg, status: 'failed'} 
            : msg
        )
      );
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

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
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Gaprio - Dashboard</title>
        <meta name="description" content="Your Gaprio dashboard" />
      </Head>

      {/* Mobile header */}
      <header className="lg:hidden bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <button 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
        >
          <FaBars className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">Gaprio</h1>
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          {currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-8 h-8 rounded-full" />
          ) : (
            <FaUser size={14} />
          )}
        </div>
      </header>

      <div className="flex pt-16 lg:pt-0">
        {/* Sidebar */}
        <aside className={`bg-gray-800 w-64 min-h-screen fixed lg:static inset-y-0 left-0 z-50 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:border-r border-gray-700`}>
          <div className="p-6 border-b border-gray-700 hidden lg:block">
            <h1 className="text-xl font-bold">Gaprio Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome, {currentUser.username}</p>
          </div>

          <div className="p-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-12 h-12 rounded-full" />
                ) : (
                  <FaUser size={20} className="text-white" />
                )}
              </div>
              <div>
                <h2 className="font-bold">{currentUser.name || currentUser.username}</h2>
                <p className="text-gray-400 text-sm">@{currentUser.username}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => { setActiveSection('chat'); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                  activeSection === 'chat' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaComments className="mr-3" />
                Chat
              </button>
              <button
                onClick={() => { setActiveSection('search'); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                  activeSection === 'search' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaSearch className="mr-3" />
                Find Users
              </button>
              <button
                onClick={() => { setActiveSection('profile'); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                  activeSection === 'profile' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaUserCircle className="mr-3" />
                Profile
              </button>
              <button
                onClick={() => { setActiveSection('security'); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                  activeSection === 'security' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaShieldAlt className="mr-3" />
                Security
              </button>
              <button
                onClick={() => { setActiveSection('activity'); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                  activeSection === 'activity' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaClock className="mr-3" />
                Activity
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center text-red-400 hover:bg-red-600 hover:text-white"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-6">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                <FaTimes />
              </button>
            </div>
          )}

          {/* Chat Section */}
          {activeSection === 'chat' && (
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FaComments className="mr-2" />
                Messages
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
                {/* Conversations list */}
                <div className="lg:col-span-1 bg-gray-700/50 rounded-lg p-4 overflow-hidden flex flex-col">
                  <h3 className="font-semibold mb-4">Conversations</h3>
                  {loading.conversations ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-gray-400">No conversations yet</p>
                    </div>
                  ) : (
                    <div className="overflow-y-auto flex-1">
                      {conversations.map(conversation => {
                        const otherUser = getOtherUser(conversation);
                        return (
                          <div
                            key={conversation.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${selectedConversation?.id === conversation.id ? 'bg-indigo-600' : 'hover:bg-gray-600'}`}
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                                {otherUser ? otherUser.username?.charAt(0).toUpperCase() : 'G'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {otherUser ? otherUser.username : 'Group Chat'}
                                </p>
                                <p className="text-sm text-gray-300 truncate">
                                  {conversation.lastMessage?.content || 'Start a conversation...'}
                                </p>
                              </div>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Chat area */}
                <div className="lg:col-span-2 bg-gray-700/50 rounded-lg overflow-hidden flex flex-col">
                  {selectedConversation ? (
                    <>
                      {/* Chat header */}
                      <div className="bg-gray-600 p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {getOtherUser(selectedConversation)?.username?.charAt(0).toUpperCase() || 'G'}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {getOtherUser(selectedConversation)?.username || 'Group Conversation'}
                            </h3>
                            <p className="text-sm text-gray-300">Online</p>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-500">
                          <FaEllipsisV />
                        </button>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loading.messages ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="text-center text-gray-400 py-8 h-full flex items-center justify-center">
                            <div>
                              <FaComments className="text-4xl mx-auto mb-4 opacity-50" />
                              <p>No messages yet. Start the conversation!</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {messages.map((message, index) => {
                              const showDate = index === 0 || 
                                formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                              
                              return (
                                <React.Fragment key={message.id || index}>
                                  {showDate && (
                                    <div className="flex justify-center my-4">
                                      <span className="bg-gray-600 text-gray-300 text-xs px-3 py-1 rounded-full">
                                        {formatDate(message.timestamp)}
                                      </span>
                                    </div>
                                  )}
                                  <div
                                    className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div
                                      className={`max-w-xs px-4 py-2 rounded-lg relative ${message.senderId === currentUser.id ? 'bg-indigo-600' : 'bg-gray-600'}`}
                                    >
                                      {message.status === 'failed' && (
                                        <button 
                                          onClick={() => retryFailedMessage(message)}
                                          className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300"
                                          title="Retry sending"
                                        >
                                          <FaExclamationTriangle />
                                        </button>
                                      )}
                                      {message.status === 'sending' && (
                                        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                                        </div>
                                      )}
                                      <p>{message.content}</p>
                                      <p className="text-xs mt-1 opacity-70 flex items-center justify-end">
                                        {formatTime(message.timestamp || new Date())}
                                        {message.senderId === currentUser.id && message.status === 'sent' && (
                                          <FaCheck className="ml-1 text-xs" />
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            })}
                          </>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message input */}
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-600">
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={loading.general}
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                            disabled={!newMessage.trim() || loading.general}
                          >
                            <FaPaperPlane />
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <FaComments className="text-4xl mx-auto mb-4 opacity-50" />
                        <p>Select a conversation to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Search Section */}
          {activeSection === 'search' && (
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FaSearch className="mr-2" />
                Find Users
              </h2>

              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name or username..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FaTimes className="text-gray-400 hover:text-gray-300" />
                    </button>
                  )}
                </div>
              </div>

              {loading.search ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map(user => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => startConversation(user)}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{user.username}</h3>
                          <p className="text-sm text-gray-300 truncate">{user.email}</p>
                        </div>
                        <button className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg transition-colors">
                          <FaPlus />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-400">
                  <FaSearch className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>No users found. Try a different search term.</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaUserFriends className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>Enter a name or username to search for users</p>
                </div>
              )}
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && userDetails && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="space-y-6"
            >
              <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <FaUser className="mr-2" />
                    Profile Information
                  </h2>
                  <button className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
                    <FaEdit className="mr-1" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                      <p className="text-white font-medium">{currentUser.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Username</label>
                      <p className="text-white font-medium">@{currentUser.username}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">User ID</label>
                      <p className="text-white font-medium text-sm font-mono">{currentUser.id}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-1 flex items-center">
                        <FaEnvelope className="mr-1" />
                        Email Address
                      </label>
                      <p className="text-white font-medium">{currentUser.email}</p>
                      {userDetails.emailVerified && (
                        <span className="text-green-400 text-sm flex items-center mt-1">
                          <FaCheck className="mr-1" /> Verified
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Role</label>
                      <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-sm">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Account Status Card */}
              <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <FaIdCard className="mr-2" />
                  Account Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <FaGlobe className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="text-white font-medium">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400">Member Since</p>
                      <p className="text-white font-medium">
                        {userDetails.joinDate ? new Date(userDetails.joinDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Security Settings Section */}
          {activeSection === 'security' && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="space-y-6"
            >
              <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <FaUserShield className="mr-2" />
                  Security Settings
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <FaShieldAlt className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm transition-colors">
                      {userDetails?.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <FaEnvelopeOpen className="text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-gray-400 text-sm">Verify your email address</p>
                      </div>
                    </div>
                    <span className={`text-sm ${userDetails?.emailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {userDetails?.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <FaClock className="text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Session Management</p>
                        <p className="text-gray-400 text-sm">Manage active sessions</p>
                      </div>
                    </div>
                    <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                      View Sessions
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Activity Section */}
          {activeSection === 'activity' && userDetails && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="space-y-6"
            >
              <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <FaClock className="mr-2" />
                  Account Activity
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">Last Login</p>
                      <p className="text-gray-400 text-sm">
                        {userDetails.lastActive ? new Date(userDetails.lastActive).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">
                      Successful
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-gray-400 text-sm">
                        {userDetails.joinDate ? new Date(userDetails.joinDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">Current Status</p>
                      <p className="text-gray-400 text-sm">Your account is active and in good standing</p>
                    </div>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                      Active
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* System Information */}
              <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">User ID: </span>
                    <span className="text-gray-300 font-mono">{currentUser.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Role: </span>
                    <span className="text-indigo-300">{currentUser.role}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Username: </span>
                    <span className="text-gray-300">@{currentUser.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email: </span>
                    <span className="text-gray-300">{currentUser.email}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}