import { reciters } from '../services/reciters';
import type { Reciter } from '../types/quran';

interface ReciterSelectorProps {
  selectedReciter: Reciter;
  onSelect: (reciter: Reciter) => void;
}

export function ReciterSelector({ selectedReciter, onSelect }: ReciterSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-sm w-full">
      <label htmlFor="reciter" className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Reciter:
      </label>
      <select
        id="reciter"
        value={selectedReciter.id}
        onChange={(e) => {
          const reciter = reciters.find(r => r.id === Number(e.target.value));
          if (reciter) onSelect(reciter);
        }}
        className="w-full px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        {reciters.map((reciter) => (
          <option key={`${reciter.id}-${reciter.style || ''}`} value={reciter.id}>
            {reciter.name}{reciter.style ? ` (${reciter.style})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}