import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

const getUserFromStorage = () => {
  try {
    const stored = localStorage.getItem('splitease_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage);
  const [token, setToken] = useState(() => localStorage.getItem('splitease_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('splitease_token', token);
    } else {
      localStorage.removeItem('splitease_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('splitease_user', JSON.stringify(user || null));
  }, [user]);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setToken(response.token);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setToken(response.token);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('splitease_token');
    localStorage.removeItem('splitease_user');
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    const fresh = await authService.getMe();
    setUser(fresh);
    return fresh;
  }, [token]);

  const updateUser = useCallback((updated) => {
    setUser(updated);
  }, []);

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        refreshUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};