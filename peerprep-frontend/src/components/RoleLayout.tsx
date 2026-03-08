'use client';

import { useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useAuth } from '@/src/auth/AuthContext';

interface RoleLayoutProps {
  role: 'admin' | 'user';
  children: React.ReactNode;
}

export default function RoleLayout({ role: requiredRole, children }: RoleLayoutProps) {
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
    } else if (role === requiredRole) {
      router.push(`/${role}`);
    }
  }, [isLoggedIn, role, requiredRole, router]);

  if (!isLoggedIn || role === null) {
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