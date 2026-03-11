'use client';

import { useAuth } from '@/src/auth/AuthContext';
import { ROUTES } from '@/src/constant/route';
import { LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: ROUTES.ADMIN, icon: LayoutDashboard },
  ];

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-zinc-200 bg-white">
      <div className="px-6 py-5">
        <h1 className="text-xl font-bold text-zinc-900">PeerPrep</h1>
        <p className="text-xs text-zinc-500">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
