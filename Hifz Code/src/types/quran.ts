export interface QuranVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  text_translation: string;
  audio_url?: string;
}

export interface VerseResponse {
  verse_key: string;
  text_uthmani: string;
  translations: {
    text: string;
  }[];
  audio: {
    url: string;
  };
}

export interface Reciter {
  id: number;
  name: string;
  style?: string;
}