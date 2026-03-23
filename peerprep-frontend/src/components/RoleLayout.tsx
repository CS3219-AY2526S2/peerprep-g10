'use client';

import { useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { ROUTES } from '@/src/constant/route'
import { Role } from '@/src/services/user/types';

interface RoleLayoutProps {
  role: Role | Role[];
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
      return;
    }
    
  }, [isLoggedIn, isLoading, router]);

  if (isLoading || role === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500 animate-pulse">
          Verifying access...
        </p>
      </div>
    );
  }

  // Check if role matches
  const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  if (!allowed.includes(role)) {
    notFound();
  }

  return <>{children}</>;
}