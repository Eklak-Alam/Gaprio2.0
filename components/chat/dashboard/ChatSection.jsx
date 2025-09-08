"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaComments,
  FaPaperPlane,
  FaCheck,
  FaExclamationTriangle,
  FaArrowLeft,
  FaSearch,
  FaEllipsisV,
  FaUser,
} from "react-icons/fa";
import { useApi } from "@/context/ApiContext";
import { motion, AnimatePresence } from "framer-motion";

const ChatSection = ({ setError, isMobile, mobileView, setMobileView }) => {
  const {
    user: currentUser,
    getUserConversations,
    getMessages,
    sendMessage,
    connectWebSocket,
  } = useApi();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState({
    conversations: false,
    messages: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef(null);
  const conversationsListRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const wsDisconnectRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, [currentUser]);

  useEffect(() => {
    if (selectedConversation) {
      if (wsDisconnectRef.current) {
        wsDisconnectRef.current();
      }

      try {
        wsDisconnectRef.current = connectWebSocket(
          selectedConversation.id,
          handleNewMessage
        );
      } catch (err) {
        console.error("WebSocket connection failed:", err);
        setError("Real-time connection unavailable.");
      }

      loadMessages(selectedConversation.id);
      
      // On mobile, switch to chat view when a conversation is selected
      if (isMobile) {
        setMobileView('chat');
      }
    }

    return () => {
      if (wsDisconnectRef.current) {
        wsDisconnectRef.current();
      }
    };
  }, [selectedConversation, isMobile, setMobileView]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessage = useCallback(
    (message) => {
      if (message.conversationId === selectedConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? { ...conv, lastMessage: message }
            : conv
        )
      );
    },
    [selectedConversation]
  );

  const loadConversations = async () => {
    try {
      setLoading((prev) => ({ ...prev, conversations: true }));
      const userConversations = await getUserConversations(currentUser.id);
      setConversations(userConversations || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setError("Failed to load conversations");
    } finally {
      setLoading((prev) => ({ ...prev, conversations: false }));
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading((prev) => ({ ...prev, messages: true }));
      const conversationMessages = await getMessages(conversationId);
      setMessages(
        Array.isArray(conversationMessages) ? conversationMessages : []
      );
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Failed to load messages");
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        conversationId: selectedConversation.id,
        content: newMessage.trim(),
        senderId: currentUser.id,
      };

      const tempMessage = {
        ...messageData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: "sending",
        sender: { id: currentUser.id, username: currentUser.username },
      };

      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");

      await sendMessage(messageData);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  const getOtherUser = (conversation) => {
    if (!conversation.participants || !currentUser) return null;
    return conversation.participants.find((p) => p.id !== currentUser.id);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return messageDate.toLocaleDateString([], { weekday: 'long' });
    
    return messageDate.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const retryFailedMessage = async (message) => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "retrying" } : msg
        )
      );

      await sendMessage({
        conversationId: message.conversationId,
        content: message.content,
        senderId: message.senderId,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "sent" } : msg
        )
      );
    } catch (error) {
      console.error("Failed to resend message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const otherUser = getOtherUser(conv);
    const searchTerm = searchQuery.toLowerCase();
    
    return otherUser?.username?.toLowerCase().includes(searchTerm) || 
           conv.lastMessage?.content?.toLowerCase().includes(searchTerm);
  });

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="bg-gray-800 h-screen flex flex-col">
      {/* Mobile Header for Chat View */}
      {isMobile && mobileView === 'chat' && selectedConversation && (
        <div className="flex items-center justify-between p-3 bg-gray-700 border-b border-gray-600">
          <button 
            onClick={() => {
              setMobileView('conversations');
              setSelectedConversation(null);
            }}
            className="p-2 rounded-full hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft className="text-white text-lg" />
          </button>
          
          <div className="flex items-center flex-1 mx-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
              {getOtherUser(selectedConversation)?.username?.charAt(0).toUpperCase() || "G"}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-sm truncate">
                {getOtherUser(selectedConversation)?.username || "Group Conversation"}
              </h3>
              <p className="text-xs text-gray-300">Online</p>
            </div>
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
            <FaEllipsisV className="text-white text-sm" />
          </button>
        </div>
      )}

      <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden`}>
        {/* Conversations List */}
        <div className={`${isMobile ? (mobileView === 'conversations' ? 'flex' : 'hidden') : 'flex'} ${isMobile ? 'w-full' : 'w-full md:w-1/3 lg:w-1/4'} flex-col border-r border-gray-700 bg-gray-900`}>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold mb-3 flex items-center text-white">
              <FaComments className="mr-2" />
              Messages
            </h2>
            
            {/* Search bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div 
            ref={conversationsListRef}
            className="flex-1 overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
          >
            {loading.conversations ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center h-32 p-4">
                <p className="text-gray-400 text-center text-sm">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredConversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation);
                  return (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                        selectedConversation?.id === conversation.id
                          ? "bg-indigo-600"
                          : "hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                          {otherUser
                            ? otherUser.username?.charAt(0).toUpperCase()
                            : "G"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-white text-sm">
                            {otherUser ? otherUser.username : "Group Chat"}
                          </p>
                          <p className="text-xs text-gray-300 truncate mt-1">
                            {conversation.lastMessage?.content ||
                              "Start a conversation..."}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-400 mb-1">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${isMobile ? (mobileView === 'chat' ? 'flex' : 'hidden') : 'flex'} ${isMobile ? 'w-full' : 'w-full md:w-2/3 lg:w-3/4'} flex-col bg-gray-800`}>
          {selectedConversation ? (
            <>
              {/* Desktop Chat Header */}
              {!isMobile && (
                <div className="bg-gray-700 p-4 border-b border-gray-600">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                      {getOtherUser(selectedConversation)
                        ?.username?.charAt(0)
                        .toUpperCase() || "G"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {getOtherUser(selectedConversation)?.username ||
                          "Group Conversation"}
                      </h3>
                      <p className="text-sm text-gray-300">Online • Last seen recently</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-900 bg-opacity-50"
                onWheel={(e) => e.stopPropagation()}
              >
                {loading.messages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <FaUser className="text-2xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-sm">Send a message to start the conversation</p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                      <div key={date} className="relative">
                        <div className="sticky top-2 z-10 flex justify-center mb-4">
                          <span className="bg-gray-700 text-xs text-gray-300 px-3 py-1.5 rounded-full">
                            {date}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {dateMessages.map((message, index) => (
                            <div
                              key={message.id || index}
                              className={`flex ${message.senderId === currentUser.id
                                ? "justify-end" 
                                : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
                                  message.senderId === currentUser.id
                                    ? "bg-indigo-600 rounded-br-md"
                                    : "bg-gray-700 rounded-bl-md"
                                }`}
                              >
                                {message.status === "failed" && (
                                  <button
                                    onClick={() => retryFailedMessage(message)}
                                    className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 p-1"
                                    title="Retry sending"
                                  >
                                    <FaExclamationTriangle />
                                  </button>
                                )}
                                {message.status === "sending" && (
                                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                                  </div>
                                )}
                                <p className="text-white text-sm">{message.content}</p>
                                <p className="text-xs mt-1 opacity-70 flex items-center justify-end text-white">
                                  {formatTime(message.timestamp || new Date())}
                                  {message.senderId === currentUser.id &&
                                    message.status === "sent" && (
                                      <FaCheck className="ml-1 text-xs" />
                                    )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors flex items-center justify-center"
                    disabled={!newMessage.trim()}
                  >
                    <FaPaperPlane className="text-lg" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Empty State for Desktop */
            !isMobile && (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-800 p-8">
                <div className="text-center text-gray-400 max-w-md">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaComments className="text-3xl" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Welcome to Messages</h3>
                  <p className="text-sm mb-6">Select a conversation from the list to start chatting or search for users to begin a new conversation.</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-indigo-500 rounded-full opacity-50"></div>
                    <div className="w-3 h-3 bg-indigo-500 rounded-full opacity-30"></div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSection;