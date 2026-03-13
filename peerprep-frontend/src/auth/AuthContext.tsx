'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRoleFromToken } from '@/src/lib/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  role: string | null;
  user: any | null;
  setUser: (user: any) => void;
  login: (token: string, user: any) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clear authentication state and removes token
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
  };

  // Stores token and update authentication state
  const login = (token: string, user: any) : string | null => {
    const decodeRole = getRoleFromToken(token);

    if (!decodeRole) {
        logout();
        return null;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setRole(decodeRole);
    setUser(user);

    return decodeRole;
  };

  // Runs once on app load to validate existing token
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      const decodedRole = getRoleFromToken(token);

      if (decodedRole) {
        setIsLoggedIn(true);
        setRole(decodedRole);
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } else {
        // Token exists but is invalid/expired
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, role, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};