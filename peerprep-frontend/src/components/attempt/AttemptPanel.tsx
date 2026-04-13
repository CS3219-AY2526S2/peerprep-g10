'use client';

import { UserIcon } from 'lucide-react';
import Image from 'next/image';
import { AttemptWithDetails } from '@/src/services/attempt/types';

interface AttemptPanelProps {
  attempt: AttemptWithDetails;
}

function getTimeTaken(startedAt: string, endedAt: string): string {
  const diff = Math.floor(
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000
  );
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  return `${mins}mins ${secs}s`;
}

export default function AttemptPanel({ attempt }: AttemptPanelProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Your Attempt</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Time Taken: {getTimeTaken(attempt.startedAt, attempt.endedAt)}
        </p>
      </div>

      {/* Coding Partner */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-800">Coding Partner</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            {attempt.partner.profile_icon ? (
              <Image
                src={attempt.partner.profile_icon}
                alt={attempt.partner.username}
                width={256}
                height={256}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-zinc-400" />
            )}
          </div>
          <span className="text-sm font-medium text-zinc-700">{attempt.partner.username}</span>
        </div>
      </div>

      {/* Submitted Answer */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-800">Submitted Answer</h3>
        <pre className="rounded-lg bg-zinc-100 p-4 text-xs leading-relaxed text-zinc-700 overflow-x-auto whitespace-pre-wrap">
          {attempt.code}
        </pre>
      </div>
    </div>
  );
}
