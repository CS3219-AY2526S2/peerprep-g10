'use client';

import { Question } from '@/src/services/types';
import Image from 'next/image';

interface QuestionPanelProps {
  question: Question;
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

      {/* Image */}
      {question.image_url && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-800">Images</h3>
          <div className="rounded-lg border border-zinc-200 overflow-hidden">
            <Image
              src={question.image_url}
              alt={question.title}
              width={256}
              height={256}
              className="w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
