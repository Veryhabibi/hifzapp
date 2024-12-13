import React from 'react';

interface VerseTextProps {
  arabicText: string;
  translation: string;
  verseKey: string;
}

export function VerseText({ arabicText, translation, verseKey }: VerseTextProps) {
  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <p className="text-right font-arabic text-[1.35rem] text-gray-900 dark:text-gray-100 leading-[2] flex-grow">
          {arabicText}
        </p>
      </div>
      <div className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
        <p>{translation}</p>
      </div>
    </>
  );
}