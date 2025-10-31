import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://petrol-calc-1.preview.emergentagent.com';

  // Check for existing session on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle session_id from URL fragment after OAuth
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const sessionId = params.get('session_id');
      
      if (sessionId) {
        setLoading(true);
        try {
          await processSessionId(sessionId);
          // Clean up URL fragment
          window.history.replaceState(null, null, window.location.pathname);
        } catch (error) {
          console.error('OAuth callback error:', error);
        }
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const processSessionId = async (sessionId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/session`, {
        method: 'POST',
        headers: {
          'X-Session-ID': sessionId,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error('Failed to process session');
      }
    } catch (error) {
      console.error('Session processing error:', error);
      throw error;
    }
  };

  const login = () => {
    const redirectUrl = window.location.origin;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const syncData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/sync/backup`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const backupData = await response.json();
        return backupData;
      } else {
        throw new Error('Failed to backup data');
      }
    } catch (error) {
      console.error('Sync error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    syncData,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};