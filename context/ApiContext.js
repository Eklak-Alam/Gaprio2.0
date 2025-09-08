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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

  // Init from LS
  useEffect(() => {
    setToken(getLS('gaprio_token'));
    setUser(getLS('gaprio_user'));
  }, []);

  // Keep axios headers in sync with token
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

  // ===== Core API helper =====
  const apiRequest = async (method, url, data = null, params = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios({
        method,
        url: `${API_BASE}${url}`,
        data,
        params, // ✅ FIXED: pass query params properly
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      return res.data;
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;

      console.error('API Error:', { url, method, status, msg, data: err.response?.data });
      setError(msg);

      if (status === 401 || status === 403) {
        console.warn('Auth error → logging out');
        logout();
      }

      throw new Error(msg);
    } finally {
      setLoading(false);
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
  };

  const isAuthenticated = () => !!token && !!user;

  // ===== USERS =====
  const getUserById = (id) => apiRequest('get', `/users/${id}`);
  const getUserByUsername = (uname) => apiRequest('get', `/users/username/${uname}`);

  // ✅ FIXED SEARCH
  const searchUsers = async (q, limit = 20) => {
    if (!q || q.trim().length < 2) return [];
    try {
      console.log('🔍 Searching users with query:', q);
      const response = await apiRequest('get', `/users/search`, null, { q, limit });
      console.log('✅ Search results:', response);
      return response;
    } catch (error) {
      console.error('❌ Search error:', error);
      setError('Failed to search users');
      return [];
    }
  };

  const updateUserProfile = (id, data) => apiRequest('patch', `/users/${id}`, data);

  // ===== CONVERSATIONS =====
  const createDirectChat = (u1, u2) =>
    apiRequest('post', '/conversations/direct', { userId1: u1, userId2: u2 });
  const createGroup = (data) => apiRequest('post', '/conversations/group', data);
  const getUserConversations = (id) => apiRequest('get', `/conversations/user/${id}`);
  const getConversationById = (id) => apiRequest('get', `/conversations/${id}`);

  // ===== MESSAGES =====
  const sendMessage = (data) => apiRequest('post', '/messages', data);
  const getMessages = (convId, limit = 50, before = null) => {
    let url = `/messages/conversation/${convId}?limit=${limit}`;
    if (before) url += `&before=${before}`;
    return apiRequest('get', url);
  };
  const editMessage = (id, editorId, newContent) =>
    apiRequest('patch', `/messages/${id}`, { editorId, newContent });
  const deleteMessage = (id, operatorId) =>
    apiRequest('delete', `/messages/${id}`, { data: { operatorId } });

  // ===== WS placeholder =====
  const connectWebSocket = (convId, onMsg) => {
    if (typeof window === 'undefined') return () => {};
    console.log(`Connecting WebSocket for ${convId}`);
    const intv = setInterval(() => console.log('Simulated WS message'), 30000);
    return () => clearInterval(intv);
  };

  const value = {
    token, user, loading, error,
    signup, login, logout, isAuthenticated,
    getUserById, getUserByUsername, searchUsers, updateUserProfile,
    createDirectChat, createGroup, getUserConversations, getConversationById,
    sendMessage, getMessages, editMessage, deleteMessage,
    connectWebSocket,
    clearError: () => setError(null),
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
