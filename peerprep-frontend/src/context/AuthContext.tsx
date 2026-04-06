'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User } from '@/src/services/user/types';
import { verifyToken } from '../services/user/userApi';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  role: Role | null;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  });

  // Clear authentication state and removes token
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
  };

  // Stores token and update authentication state
  const login = (token: string, user: User) : string | null => {
    if (!user.access_role) {
      logout();
      return null;
    }

    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setRole(user.access_role);
    setUser(user);

    return user.access_role;
  };

  // Runs once on app load to validate existing token with backend
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    verifyToken()
      .then(({ user }) => {
        setIsLoggedIn(true);
        setRole(user.access_role);
        setUser(user);
      })
      .catch(() => logout())
      .finally(() => setIsLoading(false));
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