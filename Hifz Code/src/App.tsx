import { useCallback, useState, useEffect } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { VerseCard } from './components/VerseCard';
import { ErrorMessage } from './components/ErrorMessage';
import { fetchRandomVerse, fetchSpecificVerse } from './services/quranApi';
import type { QuranVerse } from './types/quran';
import { InstagramIcon } from './components/icons/InstagramIcon';

function App() {
  const [verse, setVerse] = useState<QuranVerse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chapter, setChapter] = useState('');
  const [verseNumber, setVerseNumber] = useState('');

  const fetchVerse = useCallback(async (chapter?: number, verseNumber?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const verseData = chapter && verseNumber 
        ? await fetchSpecificVerse(chapter, verseNumber)
        : await fetchRandomVerse();
      
      setVerse(verseData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch verse');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerse();
  }, [fetchVerse]);

  const handleNewAyah = () => {
    const chapterNum = chapter ? parseInt(chapter, 10) : undefined;
    const verseNum = verseNumber ? parseInt(verseNumber, 10) : undefined;
    
    if (chapterNum && verseNum) {
      fetchVerse(chapterNum, verseNum);
    } else {
      fetchVerse();
    }
    
    // Clear input fields after fetching
    setChapter('');
    setVerseNumber('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chapter && verseNumber) {
      fetchVerse(parseInt(chapter, 10), parseInt(verseNumber, 10));
      setChapter('');
      setVerseNumber('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="flex-1" />
          <div className="text-center flex-1">
            <h1 className="text-4xl sm:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              Hifz
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-col items-center gap-8">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : verse ? (
            <>
              <VerseCard verse={verse} />
              <div className="w-full max-w-2xl flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="number"
                    min="1"
                    max="114"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Chapter رقم السورة"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="number"
                    min="1"
                    value={verseNumber}
                    onChange={(e) => setVerseNumber(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ayah رقم الآية"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleNewAyah}
                    className="w-full sm:w-64 py-2.5 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-base"
                  >
                    New Ayah
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              Loading...
            </div>
          )}

          <a
            href="https://www.instagram.com/hasanjanahii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            aria-label="Follow on Instagram"
          >
            <InstagramIcon className="w-10 h-10" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;