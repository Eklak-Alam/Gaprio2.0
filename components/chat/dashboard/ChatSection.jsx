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
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import { useApi } from "@/context/ApiContext";
import { motion, AnimatePresence } from "framer-motion";

const ChatSection = ({ setError, isMobile, mobileView, setMobileView }) => {
  const {
    user: currentUser,
    getUserConversations,
    getMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    deleteConversation,
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
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showConversationMenu, setShowConversationMenu] = useState(null);

  const messagesEndRef = useRef(null);
  const conversationsListRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const wsDisconnectRef = useRef(null);
  const menuTimeoutRef = useRef(null);

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

      if (isMobile) {
        setMobileView("chat");
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

 // In your handleDeleteConversation function, update it to:
const handleDeleteConversation = async (conversationId) => {
  if (!window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) return;

  try {
    await deleteConversation(conversationId, currentUser.id);
    
    // Remove from local state
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
      setMessages([]);
    }
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    setError("Failed to delete conversation: " + (error.message || "You may not have permission to delete this conversation"));
  }
};

// In your handleDeleteMessage function, update it to:
const handleDeleteMessage = async (messageId) => {
  if (!window.confirm("Are you sure you want to delete this message?")) return;

  try {
    // Store the message being deleted in case we need to restore it
    const messageToDelete = messages.find(msg => msg.id === messageId);
    
    // Optimistic update
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    await deleteMessage(messageId, currentUser.id);
  } catch (error) {
    console.error("Failed to delete message:", error);
    setError("Failed to delete message: " + (error.message || "You may not have permission to delete this message"));
    
    // Restore the message on error
    if (messageToDelete) {
      setMessages(prev => [...prev, messageToDelete].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      ));
    }
  }
};

// In your handleEditMessage function, update it to:
const handleEditMessage = async () => {
  if (!editingMessage || !editContent.trim()) return;

  try {
    // Store original content in case of error
    const originalContent = editingMessage.content;
    
    // Update locally first for instant feedback
    setMessages(prev => prev.map(msg => 
      msg.id === editingMessage.id 
        ? { ...msg, content: editContent, isEditing: true }
        : msg
    ));

    await editMessage(editingMessage.id, currentUser.id, editContent.trim());
    
    // Update with server response
    setMessages(prev => prev.map(msg => 
      msg.id === editingMessage.id 
        ? { ...msg, content: editContent.trim(), isEditing: false }
        : msg
    ));
    
    setEditingMessage(null);
    setEditContent("");
    inputRef.current?.focus();
  } catch (error) {
    console.error("Failed to edit message:", error);
    setError("Failed to edit message: " + (error.message || "You may not have permission to edit this message"));
    
    // Revert on error
    setMessages(prev => prev.map(msg => 
      msg.id === editingMessage.id 
        ? { ...msg, content: originalContent, isEditing: false }
        : msg
    ));
  }
};

  const startEditing = (message) => {
    setEditingMessage(message);
    setEditContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditContent("");
    inputRef.current?.focus();
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
    if (diffDays < 7)
      return messageDate.toLocaleDateString([], { weekday: "long" });

    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year:
        messageDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
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

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;

    const otherUser = getOtherUser(conv);
    const searchTerm = searchQuery.toLowerCase();

    return (
      otherUser?.username?.toLowerCase().includes(searchTerm) ||
      conv.lastMessage?.content?.toLowerCase().includes(searchTerm)
    );
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

  const showMenu = (conversationId, e) => {
    e.stopPropagation();
    setShowConversationMenu(
      conversationId === showConversationMenu ? null : conversationId
    );
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowConversationMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-800 h-screen flex flex-col">
      {/* Mobile Header for Chat View */}
      {isMobile && mobileView === "chat" && selectedConversation && (
        <div className="flex items-center justify-between p-3 bg-gray-700 border-b border-gray-600">
          <button
            onClick={() => {
              setMobileView("conversations");
              setSelectedConversation(null);
            }}
            className="p-2 rounded-full hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft className="text-white text-lg" />
          </button>

          <div className="flex items-center flex-1 mx-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
              {getOtherUser(selectedConversation)
                ?.username?.charAt(0)
                .toUpperCase() || "G"}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-sm truncate">
                {getOtherUser(selectedConversation)?.username ||
                  "Group Conversation"}
              </h3>
              <p className="text-xs text-gray-300">Online</p>
            </div>
          </div>

          <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
            <FaEllipsisV className="text-white text-sm" />
          </button>
        </div>
      )}

      <div
        className={`flex-1 flex ${
          isMobile ? "flex-col" : "flex-row"
        } overflow-hidden`}
      >
        {/* Conversations List */}
        <div
          className={`${
            isMobile
              ? mobileView === "conversations"
                ? "flex"
                : "hidden"
              : "flex"
          } ${
            isMobile ? "w-full" : "w-full md:w-1/3 lg:w-1/4"
          } flex-col border-r border-gray-700 bg-gray-900`}
        >
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
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredConversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation);
                  return (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 relative group ${
                        selectedConversation?.id === conversation.id
                          ? "bg-indigo-600"
                          : "hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      {/* Delete conversation button (X icon) */}
                      <button
                        className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        title="Delete conversation"
                      >
                        <FaTimes className="text-gray-300 text-xs hover:text-red-400" />
                      </button>

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
        <div
          className={`${
            isMobile ? (mobileView === "chat" ? "flex" : "hidden") : "flex"
          } ${
            isMobile ? "w-full" : "w-full md:w-2/3 lg:w-3/4"
          } flex-col bg-gray-800`}
        >
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
                      <p className="text-sm text-gray-300">
                        Online • Last seen recently
                      </p>
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
                    <h3 className="text-lg font-medium mb-2">
                      No messages yet
                    </h3>
                    <p className="text-sm">
                      Send a message to start the conversation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {Object.entries(groupedMessages).map(
                      ([date, dateMessages]) => (
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
                                className={`flex ${
                                  message.senderId === currentUser.id
                                    ? "justify-end"
                                    : "justify-start"
                                } group/message relative`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
                                    message.senderId === currentUser.id
                                      ? "bg-indigo-600 rounded-br-md"
                                      : "bg-gray-700 rounded-bl-md"
                                  } ${
                                    message.isEditing
                                      ? "ring-2 ring-yellow-500"
                                      : ""
                                  }`}
                                >
                                  {/* Message status indicators */}
                                  {message.status === "failed" && (
                                    <button
                                      onClick={() =>
                                        retryFailedMessage(message)
                                      }
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

                                  {/* Message content */}
                                  <p className="text-white text-sm">
                                    {message.content}
                                  </p>

                                  {/* Message timestamp and status */}
                                  <p className="text-xs mt-1 opacity-70 flex items-center justify-end text-white">
                                    {formatTime(
                                      message.timestamp || new Date()
                                    )}
                                    {message.senderId === currentUser.id &&
                                      message.status === "sent" && (
                                        <FaCheck className="ml-1 text-xs" />
                                      )}
                                  </p>

                                  {/* Message actions (only for user's own messages) */}
                                  {message.senderId === currentUser.id &&
                                    message.status === "sent" && (
                                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-opacity flex space-x-1 bg-gray-800 rounded p-1">
                                        <button
                                          onClick={() => startEditing(message)}
                                          className="p-1 text-gray-300 hover:text-yellow-400 transition-colors"
                                          title="Edit message"
                                        >
                                          <FaEdit className="text-xs" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteMessage(message.id)
                                          }
                                          className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                                          title="Delete message"
                                        >
                                          <FaTrash className="text-xs" />
                                        </button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input - Shows edit controls when editing */}
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                {editingMessage ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-2">
                      <p className="text-xs text-yellow-300 mb-1">
                        Editing message
                      </p>
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditMessage();
                          if (e.key === "Escape") cancelEditing();
                        }}
                      />
                    </div>
                    <button
                      onClick={handleEditMessage}
                      className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Save changes"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      title="Cancel editing"
                    >
                      <FaBan />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center"
                  >
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
                )}
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
                  <h3 className="text-xl font-medium mb-2">
                    Welcome to Messages
                  </h3>
                  <p className="text-sm mb-6">
                    Select a conversation from the list to start chatting or
                    search for users to begin a new conversation.
                  </p>
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
