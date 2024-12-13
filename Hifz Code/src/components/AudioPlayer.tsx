import { Volume2, VolumeX, Repeat } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  url: string;
}

export function AudioPlayer({ url }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setError(false);
    setIsPlaying(false);

    const audio = new Audio(`https://verses.quran.com/${url}`);
    
    const handleCanPlayThrough = () => {
      setError(false);
    };

    const handleError = () => {
      console.error('Audio error:', error);
      setError(true);
    };

    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
      } else {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.loop = isLooping;

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [url]);

  const handlePlay = async () => {
    if (!url || error || !audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Audio playback error:', err);
      setError(true);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      const newLoopState = !isLooping;
      setIsLooping(newLoopState);
      audioRef.current.loop = newLoopState;
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePlay}
        disabled={error}
        className={`text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
          isPlaying ? 'text-purple-600 dark:text-purple-400' : ''
        } ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={error ? 'Audio unavailable' : isPlaying ? 'Pause recitation' : 'Play recitation'}
        title={error ? 'Audio unavailable' : isPlaying ? 'Pause recitation' : 'Play recitation'}
      >
        {error ? (
          <VolumeX className="w-7 h-7" />
        ) : (
          <Volume2 className="w-7 h-7" />
        )}
      </button>
      <button
        onClick={toggleLoop}
        disabled={error}
        className={`text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
          isLooping ? 'text-purple-600 dark:text-purple-400' : ''
        } ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isLooping ? 'Disable loop' : 'Enable loop'}
        title={isLooping ? 'Disable loop' : 'Enable loop'}
      >
        <Repeat className="w-7 h-7" />
      </button>
    </div>
  );
}