'use client';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import { UserNavbar } from './UserNavbar';
import { ROUTES } from '@/src/constant/route';

export const Navbar = () => {
  const { isLoggedIn, role, isLoading } = useAuth();

  if (isLoading || !isLoggedIn || !role) return null;

  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <Link href={role === 'admin' ? ROUTES.ADMIN : ROUTES.USER} className="flex items-center gap-2">
          <div className="border-2 border-zinc-900 dark:border-zinc-100 p-1 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-zinc-900 dark:border-zinc-100 rotate-45"></div>
          </div>
          <span className="text-xl font-bold text-zinc-800 dark:text-white">PeerPrep</span>
        </Link>
        <div className="flex items-center">
          <UserNavbar />
        </div>
      </div>
    </nav>
  );
};