// AI Assistance Disclosure:
// Tool: ChatGPT (GPT-5.3), date: 2026-04-06
// Scope: Assisted in debugging ESLint errors and refactoring React hooks usage.
// Author review: Refactored logic, improved typing, and verified correctness.
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import QuestionsTab from '@/src/components/admin/QuestionsTab';
import UsersTab from '@/src/components/admin/UsersTab';
import { ROUTES } from '@/src/constant/route';

type Tab = 'questions' | 'users';

const tabs: { key: Tab; label: string }[] = [
  { key: 'questions', label: 'Questions' },
  { key: 'users', label: 'Users' },
];

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab: Tab = searchParams.get('tab') === 'users' ? 'users' : 'questions';

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => router.push(ROUTES.ADMIN_TAB(tab.key))}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'questions' && <QuestionsTab />}
        {activeTab === 'users' && <UsersTab />}
      </div>
    </div>
  );
}
