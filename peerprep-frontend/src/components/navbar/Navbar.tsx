'use client';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import { UserNavbar } from './UserNavbar';
import { ROUTES } from '@/src/constant/route';

export const Navbar = () => {
  const { isLoggedIn, role, isLoading } = useAuth();

  if (isLoading || !isLoggedIn || !role) return null;

  return (
    <nav className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <Link href={role === 'admin' ? ROUTES.ADMIN : ROUTES.USER} className="flex items-center gap-2">
          {/* Peerprep logo */}
          <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="10" fill="#0F62FE"/>
            <polyline points="10,24 19,14 19,34" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="38,24 29,14 29,34" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="32" x2="27" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
          </svg>
          <span className="text-xl font-bold text-zinc-800">PeerPrep</span>
        </Link>
        <div className="flex items-center">
          <UserNavbar />
        </div>
      </div>
    </nav>
  );
};