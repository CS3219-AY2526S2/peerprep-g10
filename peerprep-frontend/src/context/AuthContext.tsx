'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User } from '@/src/services/user/types';
import { verifyToken } from '../services/user/userApi';
import Notification from '../components/Notification';
import { ROUTES } from '../constant/route';

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
  // Controls account-status notification (banned/deleted) and countdown before redirecting to login.
  const [accountStatusReason, setAccountStatusReason] = useState<'banned' | 'deleted' | null>(null);
  const [accountStatusCountdown, setAccountStatusCountdown] = useState(5);

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

  // Global fetch interceptor — catches 403 account-status responses from any service
  // and immediately clears the session, redirecting the user to the login page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const response = await originalFetch(...args);

      if (response.status === 403) {
        const cloned = response.clone();
        try {
          const data = await cloned.json();
          if (data?.code === 'USER_BANNED' || data?.code === 'USER_DELETED') {
            localStorage.removeItem('token');
            const reason = data.code === 'USER_DELETED' ? 'deleted' : 'banned';

            // Avoid spawning duplicate countdown intervals if multiple requests fail together.
            if (accountStatusReason) return response;

            let count = 5;
            setAccountStatusCountdown(count);
            setAccountStatusReason(reason);

            const interval = setInterval(() => {
              count--;
              setAccountStatusCountdown(count);
              if (count <= 0) {
                clearInterval(interval);
                window.location.href = `${ROUTES.LOGIN}?reason=${reason}`;
              }
            }, 1000);
          }
        } catch {
          // Non-JSON 403 response
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [accountStatusReason]);

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
      {accountStatusReason && (
        <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <Notification
            type="error"
            title={accountStatusReason === 'deleted' ? 'Deleted' : 'Banned'}
            message={accountStatusReason === 'deleted'
              ? `Your account has been deleted. Redirecting to login in ${accountStatusCountdown} second${accountStatusCountdown !== 1 ? 's' : ''}...`
              : `Your account has been banned. Redirecting to login in ${accountStatusCountdown} second${accountStatusCountdown !== 1 ? 's' : ''}...`}
            rightAction="none"
          />
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};