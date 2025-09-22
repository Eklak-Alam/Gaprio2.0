'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ApiContext = createContext(null);

export const useApi = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used within ApiProvider');
  return ctx;
};

// ===== LocalStorage helpers =====
const getLS = (key, def = null) => {
  if (typeof window === 'undefined') return def;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
};

const setLS = (key, value) => {
  if (typeof window === 'undefined') return;
  if (value === null || value === undefined) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(value));
};

// ===== Provider =====
export const ApiProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(new Map());

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

  // Init from LS
  useEffect(() => {
    setToken(getLS('gaprio_token'));
    setUser(getLS('gaprio_user'));
  }, []);

  // Sync token with axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLS('gaprio_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLS('gaprio_token', null);
    }
  }, [token]);

  // Persist user
  useEffect(() => {
    setLS('gaprio_user', user);
  }, [user]);

  // ===== Core API helper with deduplication =====
  const apiRequest = async (method, url, data = null, params = null) => {
    const requestKey = `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`;

    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url: `${API_BASE}${url}`,
        data,
        params,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      const requestPromise = axios(config).then(res => res.data);

      setPendingRequests(prev => new Map(prev).set(requestKey, requestPromise));

      const result = await requestPromise;
      return result;
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;

      console.error('API Error:', { url, method, status, msg, data: err.response?.data });
      setError(msg);

      if (status === 401 || status === 403) {
        setError("Authentication error. Please check your permissions.");
      }

      throw new Error(msg);
    } finally {
      setLoading(false);
      setPendingRequests(prev => {
        const newMap = new Map(prev);
        newMap.delete(requestKey);
        return newMap;
      });
    }
  };

  // ===== AUTH =====
  const signup = (data) => apiRequest('post', '/auth/signup', data);
  const login = async (creds) => {
    const res = await apiRequest('post', '/auth/login', creds);
    const { token: authToken, userId, username, role, expiresAt } = res;

    if (!authToken) throw new Error('No token from server');

    setToken(authToken);
    setUser({ id: userId, username, role, expiresAt });

    return res;
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    setLS('gaprio_user', null);
    setLS('gaprio_token', null);
  };
  const isAuthenticated = () => !!token && !!user;

  // ===== USERS =====
  const getUserById = (id) => apiRequest('get', `/users/${id}`);
  const getUserByUsername = (uname) => apiRequest('get', `/users/username/${uname}`);
  const searchUsers = async (q, limit = 20) => {
    if (!q || q.trim().length < 2) return [];
    try {
      return await apiRequest('get', `/users/search`, null, { q, limit });
    } catch {
      setError('Failed to search users');
      return [];
    }
  };
  const updateUserProfile = (id, data) => apiRequest('patch', `/users/${id}`, data);

  // ===== CONVERSATIONS =====
  const createDirectChat = (u1, u2) =>
    apiRequest('post', '/conversations/direct', { userId1: u1, userId2: u2 });

  // FIXED: Transform data to match backend expectations
  const createGroup = (data) => {
    const backendData = {
      groupName: data.groupName, // This matches CreateGroupRequest
      creatorId: data.creatorId,
      memberIds: data.memberIds || []
    };
    return apiRequest('post', '/conversations/group', backendData);
  };

  const getUserConversations = (id) => apiRequest('get', `/conversations/user/${id}`);
  const getGroup = (groupId) => apiRequest('get', `/conversations/group/${groupId}`);
  const updateGroup = (groupId, data) => apiRequest('put', `/conversations/group/${groupId}`, data);
  const deleteGroup = (groupId, deleterId) =>
    apiRequest('delete', `/conversations/group/${groupId}`, null, { deleterId });

  const addGroupMember = (groupId, adderId, newMemberId) =>
    apiRequest('post', `/conversations/group/${groupId}/members`, null, { adderId, newMemberId });

  const removeGroupMember = (groupId, memberId, removerId) =>
    apiRequest('delete', `/conversations/group/${groupId}/members/${memberId}`, null, { removerId });

  const leaveGroup = (groupId, userId) =>
    apiRequest('post', `/conversations/group/${groupId}/leave`, null, { userId });

  const getGroupMembers = (groupId) => apiRequest('get', `/conversations/group/${groupId}/members`);

  const updateMemberRole = (groupId, memberId, updaterId, newRole) =>
    apiRequest('patch', `/conversations/group/${groupId}/members/${memberId}/role`, null, {
      updaterId,
      newRole,
    });

  const getUserGroups = (userId) => apiRequest('get', `/conversations/user/${userId}/groups`);

  // ===== MESSAGES =====
  const sendMessage = (data) => apiRequest('post', '/messages', data);

  const getMessages = (convId, limit = 50, before = null) => {
    const params = { limit };
    if (before) params.before = before;
    return apiRequest('get', `/messages/conversation/${convId}`, null, params);
  };

  const editMessage = (id, editorId, newContent) =>
    apiRequest('patch', `/messages/${id}`, { editorId, newContent });

  const deleteMessage = (id, operatorId) =>
    apiRequest('delete', `/messages/${id}`, null, { operatorId });

  // ===== WebSocket =====
  const connectWebSocket = (convId, onMsg) => {
    if (typeof window === 'undefined') return () => {};

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/conversations/${convId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (token) {
          ws.send(JSON.stringify({ type: 'auth', token }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMsg(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      return () => ws.readyState === WebSocket.OPEN && ws.close();
    } catch {
      const intervalId = setInterval(() => console.log('WS fallback tick'), 5000);
      return () => clearInterval(intervalId);
    }
  };

  const value = {
    token,
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated,
    getUserById,
    getUserByUsername,
    searchUsers,
    updateUserProfile,
    createDirectChat,
    createGroup,
    getUserConversations,
    getGroup,
    updateGroup,
    deleteGroup,
    addGroupMember,
    removeGroupMember,
    leaveGroup,
    getGroupMembers,
    updateMemberRole,
    getUserGroups,
    sendMessage,
    getMessages,
    editMessage,
    deleteMessage,
    connectWebSocket,
    clearError: () => setError(null),
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};