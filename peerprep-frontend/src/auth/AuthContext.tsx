'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRoleFromToken } from '@/src/lib/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  role: string | null;
  login: (token: string) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("Current Auth State:", { isLoggedIn, role, isLoading });

  // Clear authentication state and removes token
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRole(null);
  };

  // Stores token and update authentication state
  const login = (token: string) : string | null => {
    const decodeRole = getRoleFromToken(token);

    if (!decodeRole) {
        logout();
        return null;
    }
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setRole(decodeRole);

    return decodeRole;
  };

  // Runs once on app load to validate existing token
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedRole = getRoleFromToken(token);

      if (decodedRole) {
        setIsLoggedIn(true);
        setRole(decodedRole);
      } else {
        // Token exists but is invalid/expired
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};