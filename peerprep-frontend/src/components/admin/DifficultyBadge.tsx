const colorMap: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export default function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        colorMap[difficulty] ?? 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {difficulty}
    </span>
  );
}
