'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/src/context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { ROUTES } from '@/src/constant/route';

export const UserNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <Link
        href={ROUTES.USER_PROFILE}
        className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded-lg active:scale-95"
      >
        {user?.profile_icon ? (
          <Image
            src={user.profile_icon}
            alt="Profile avatar" 
            width={256} 
            height={256}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <UserIcon size={18} />
        )}
        <span>My Profile</span>
      </Link>

      <button
        onClick={() => logout()}
        className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg active:scale-95 outline-none"
      >
        <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
        <span>Logout</span>
      </button>
    </div>
  );
};