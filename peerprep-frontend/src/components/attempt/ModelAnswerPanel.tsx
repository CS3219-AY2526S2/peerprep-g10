'use client';

import { Question } from '@/src/services/types';

interface ModelAnswerPanelProps {
  question: Question;
}

export default function ModelAnswerPanel({ question }: ModelAnswerPanelProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
      <h2 className="text-2xl font-bold text-zinc-900">Model Answer</h2>

      {/* Description */}
      {question.description && (
        <p className="text-sm leading-relaxed text-zinc-600">{question.description}</p>
      )}

      {/* Sample Code from pseudocode */}
      {question.pseudocode && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-zinc-800">Sample Code</h3>
          <div className="flex flex-col gap-3">
            {question.pseudocode.split('\n\n').map((block, i) => (
              <pre
                key={i}
                className="rounded-lg bg-zinc-100 p-4 text-xs leading-relaxed text-zinc-700 overflow-x-auto whitespace-pre-wrap"
              >
                {block}
              </pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
