import type { QuranVerse } from '../types/quran';

const BASE_URL = 'https://api.quran.com/api/v4';
const usedVerses = new Set<string>();

export async function fetchRandomVerse(reciterId: number = 2): Promise<QuranVerse> {
  if (usedVerses.size >= 6236) {
    usedVerses.clear();
  }

  let verse: QuranVerse | null = null;
  let attempts = 0;
  const maxAttempts = 10;

  while (!verse && attempts < maxAttempts) {
    const response = await fetch(
      `${BASE_URL}/verses/random?translations=131&fields=text_uthmani,verse_key&audio=${reciterId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch verse');
    }
    const data = await response.json();
    const verseKey = data.verse.verse_key;

    if (!usedVerses.has(verseKey)) {
      usedVerses.add(verseKey);
      verse = {
        id: data.verse.id,
        verse_key: verseKey,
        text_uthmani: data.verse.text_uthmani,
        text_translation: data.verse.translations[0].text,
        audio_url: data.verse.audio.url
      };
    }
    attempts++;
  }

  if (!verse) {
    throw new Error('Unable to find a new verse after multiple attempts');
  }

  return verse;
}

export async function fetchSpecificVerse(chapter: number, verse: number, reciterId: number = 2): Promise<QuranVerse> {
  const response = await fetch(
    `${BASE_URL}/verses/by_key/${chapter}:${verse}?translations=131&fields=text_uthmani,verse_key&audio=${reciterId}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch verse ${chapter}:${verse}`);
  }
  const data = await response.json();
  
  return {
    id: data.verse.id,
    verse_key: data.verse.verse_key,
    text_uthmani: data.verse.text_uthmani,
    text_translation: data.verse.translations[0].text,
    audio_url: data.verse.audio.url
  };
}