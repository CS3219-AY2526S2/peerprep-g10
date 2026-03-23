'use client';

import { useState } from 'react';
import QuestionsTab from '@/src/components/admin/QuestionsTab';
import UsersTab from '@/src/components/admin/UsersTab';

type Tab = 'questions' | 'users';

const tabs: { key: Tab; label: string }[] = [
  { key: 'questions', label: 'Questions' },
  { key: 'users', label: 'Users' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('questions');

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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
