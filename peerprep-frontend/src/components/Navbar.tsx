'use client';

import Link from 'next/link';
import { useAuth } from '@/src/auth/AuthContext';
import { UserNavbar } from './UserNavbar';

export const Navbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
           <div className="border-2 border-zinc-900 p-1 flex items-center justify-center">
             <div className="w-4 h-4 border-2 border-zinc-900 rotate-45"></div>
           </div>
          <span className="text-xl font-bold text-zinc-800">PeerPrep</span>
        </Link>

        <div className="flex items-center">
          {isLoggedIn && <UserNavbar />}
        </div>
      </div>
    </nav>
  );
};