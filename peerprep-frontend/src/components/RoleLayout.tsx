'use client';

import { useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useAuth } from '@/src/auth/AuthContext';
import { ROUTES } from '@/src/constant/route'

interface RoleLayoutProps {
  role: 'admin' | 'user';
  children: React.ReactNode;
}

export default function RoleLayout({ role: requiredRole, children }: RoleLayoutProps) {
  const { isLoggedIn, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    console.log("Current Auth State:", { isLoggedIn, role, isLoading });
    if (!isLoggedIn) {
      router.push(ROUTES.LOGIN);
    }
    
  }, [isLoggedIn, isLoading, role, requiredRole, router]);

  if (isLoading || role === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500 animate-pulse">
          Verifying access...
        </p>
      </div>
    );
  }

  if (role !== requiredRole) {
    notFound();
  }

  return <>{children}</>;
}