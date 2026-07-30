import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('lms_token');
      const storedUser = localStorage.getItem('lms_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Optionally fetch fresh profile details
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('lms_user', JSON.stringify(res.data));
        } catch (e) {
          // Token expired or invalid
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwt, name, email: userEmail, role, userId } = res.data;
      
      const loggedUser: User = { id: userId, name, email: userEmail, role };

      localStorage.setItem('lms_token', jwt);
      localStorage.setItem('lms_user', JSON.stringify(loggedUser));

      setToken(jwt);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', payload);
      const { token: jwt, name, email: userEmail, role, userId } = res.data;

      const loggedUser: User = { id: userId, name, email: userEmail, role };

      localStorage.setItem('lms_token', jwt);
      localStorage.setItem('lms_user', JSON.stringify(loggedUser));

      setToken(jwt);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
