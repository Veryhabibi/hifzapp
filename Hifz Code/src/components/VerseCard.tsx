import { Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { QuranVerse, Reciter } from '../types/quran';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { XIcon } from './icons/XIcon';
import { AudioPlayer } from './AudioPlayer';
import { ReciterSelector } from './ReciterSelector';
import { VerseText } from './VerseText';
import { reciters } from '../services/reciters';

interface VerseCardProps {
  verse: QuranVerse;
}

export function VerseCard({ verse }: VerseCardProps) {
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const defaultReciter = reciters.find(r => r.id === 2) || reciters[0];
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(defaultReciter);
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch(
          `https://api.quran.com/api/v4/verses/by_key/${verse.verse_key}?audio=${selectedReciter.id}`
        );
        if (!response.ok) throw new Error('Failed to fetch audio');
        const data = await response.json();
        setAudioUrl(data.verse.audio.url);
      } catch (error) {
        console.error('Failed to fetch audio:', error);
      }
    };
    fetchAudio();
  }, [verse.verse_key, selectedReciter.id]);

  const cleanTranslation = (text: string) => {
    return text.replace(/<sup.*?<\/sup>/g, '');
  };

  const handleCopy = async () => {
    try {
      const cleanText = cleanTranslation(verse.text_translation);
      await navigator.clipboard.writeText(`${verse.text_uthmani}\n\n${cleanText}\n\nQuran ${verse.verse_key}`);
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleWhatsAppShare = () => {
    const cleanText = cleanTranslation(verse.text_translation);
    const text = encodeURIComponent(`${cleanText}\n\nQuran ${verse.verse_key}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleTweet = () => {
    const cleanText = cleanTranslation(verse.text_translation);
    const text = encodeURIComponent(`${cleanText}\n\nQuran ${verse.verse_key}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleReciterChange = (reciter: Reciter) => {
    setSelectedReciter(reciter);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg max-w-2xl w-full mx-auto">
      <VerseText 
        arabicText={verse.text_uthmani}
        translation={cleanTranslation(verse.text_translation)}
        verseKey={verse.verse_key}
      />
      
      <div className="flex flex-col gap-4">
        <div className="border-t border-gray-200 dark:border-gray-700/50 pt-4">
          <ReciterSelector selectedReciter={selectedReciter} onSelect={handleReciterChange} />
        </div>

        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap min-w-[60px]">
              Verse: {verse.verse_key}
            </span>
            {audioUrl && <AudioPlayer url={audioUrl} />}
          </div>
          <div className="flex gap-4 sm:gap-6 items-center">
            {showCopyMessage && (
              <span className="text-sm text-green-600 dark:text-green-400 absolute">Copied!</span>
            )}
            <button
              onClick={handleCopy}
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              aria-label="Copy verse"
            >
              <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              aria-label="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleTweet}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Share on X"
            >
              <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}