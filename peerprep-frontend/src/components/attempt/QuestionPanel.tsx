'use client';

import { QuestionSnapshot } from '@/src/services/attempt/types';

interface QuestionPanelProps {
  question: QuestionSnapshot;
}

export default function QuestionPanel({ question }: QuestionPanelProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col gap-5">
      {/* Meta */}
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>Topic: {question.topics.join(', ')}</span>
        <span className="capitalize">Difficulty: {question.difficulty}</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-zinc-900">{question.title}</h2>

      {/* Description */}
      <p className="text-sm leading-relaxed text-zinc-600">{question.description}</p>

      {/* Code Example */}
      {question.examples && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-800">Code Example</h3>
          <pre className="rounded-lg bg-zinc-100 p-4 text-xs leading-relaxed text-zinc-700 overflow-x-auto whitespace-pre-wrap">
            {question.examples}
          </pre>
        </div>
      )}
    </div>
  );
}
