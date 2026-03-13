import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fs_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('fs_token') || null);
  const [loading, setLoading] = useState(false);

  const persistAuth = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('fs_user', JSON.stringify(userData));
    localStorage.setItem('fs_token', jwtToken);
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      persistAuth(data.user || data, data.token);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const data = await registerUser(formData);
      persistAuth(data.user || data, data.token);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fs_token');
    localStorage.removeItem('fs_user');
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await getUserProfile();
      setUser(profile);
      localStorage.setItem('fs_user', JSON.stringify(profile));
    } catch {
      logout();
    }
  }, [token, logout]);

  const isAuthenticated = !!token;
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      isStudent, isTeacher, isAdmin,
      login, register, logout, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
