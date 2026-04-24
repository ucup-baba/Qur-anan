'use client';

import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'bq_bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse bookmarks from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  const toggleBookmark = (surahNumber: number) => {
    setBookmarks(prev => {
      let next;
      if (prev.includes(surahNumber)) {
        next = prev.filter(n => n !== surahNumber);
      } else {
        next = [...prev, surahNumber];
      }
      
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save bookmarks to localStorage', e);
      }
      
      return next;
    });
  };

  return {
    bookmarks,
    toggleBookmark,
    isLoaded
  };
}
