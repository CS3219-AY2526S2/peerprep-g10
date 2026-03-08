'use client';

import Link from 'next/link';
import { useAuth } from '@/src/auth/AuthContext';
import { User, LogOut } from 'lucide-react';

export const UserNavbar = () => {
  const { logout } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {/* Profile Link */}
      <Link 
        href="/user/profile" 
        className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 rounded-lg active:scale-95"
      >
        <User size={18} className="transition-transform group-hover:scale-110" />
        <span>My Profile</span>
      </Link>

      {/* Logout Button */}
      <button 
        onClick={() => logout()} 
        className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 rounded-lg active:scale-95 outline-none"
      >
        <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
        <span>Logout</span>
      </button>
    </div>
  );
};