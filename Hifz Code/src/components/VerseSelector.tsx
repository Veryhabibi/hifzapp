import { useState } from 'react';

interface VerseSelectorProps {
  onSelect: (chapter: number, verse: number) => void;
}

export function VerseSelector({ onSelect }: VerseSelectorProps) {
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chapter && verse) {
      onSelect(parseInt(chapter, 10), parseInt(verse, 10));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
      <input
        type="number"
        min="1"
        max="114"
        value={chapter}
        onChange={(e) => setChapter(e.target.value)}
        placeholder="Chapter (1-114)"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <input
        type="number"
        min="1"
        value={verse}
        onChange={(e) => setVerse(e.target.value)}
        placeholder="Ayah Number"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
      >
        Search
      </button>
    </form>
  );
}