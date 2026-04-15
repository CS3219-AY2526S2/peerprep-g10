// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-11
// Scope: Generated React SVG component for forbidden/access denied page.
// Author review: Accepted as-is and integrated directly into UI.
'use client';

import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield */}
        <path
          d="M110 20 L170 45 L170 95 C170 130 110 160 110 160 C110 160 50 130 50 95 L50 45 Z"
          fill="#EFF4FF"
          stroke="#0F62FE"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Lock body */}
        <rect x="88" y="95" width="44" height="34" rx="5" fill="#0F62FE" />
        {/* Lock shackle */}
        <path
          d="M97 95 L97 83 C97 72 123 72 123 83 L123 95"
          stroke="#0F62FE"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Keyhole */}
        <circle cx="110" cy="108" r="5" fill="white" />
        <rect x="107.5" y="110" width="5" height="9" rx="2" fill="white" />
        {/* Decorative dots */}
        <circle cx="60" cy="40" r="3" fill="#B8D0FF" />
        <circle cx="160" cy="35" r="4" fill="#B8D0FF" />
        <circle cx="170" cy="60" r="2.5" fill="#D6E4FF" />
        <circle cx="48" cy="65" r="2.5" fill="#D6E4FF" />
      </svg>

      <h1 className="mt-6 text-6xl font-bold text-[#0F62FE]">403</h1>
      <h2 className="mt-2 text-xl font-semibold text-zinc-800">Access Denied</h2>
      <p className="mt-2 text-sm text-zinc-500 text-center max-w-xs">
        You don&apos;t have permission to view this page. Contact an administrator if you think this is a mistake.
      </p>

      <div className="mt-8">
        <button
          onClick={() => router.back()}
          style={{ background: '#0F62FE' }}
          className="px-4 py-2 text-sm rounded-lg text-white hover:opacity-90 transition-opacity"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
