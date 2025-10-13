// hooks/use-slides.ts
import { useEffect, useState } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';

interface SlideState {
  currentSlide: number;
  totalSlides: number;
  timestamp: number;
}

export function useSlides(eventId: string = 'default') {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const slideRef = ref(database, `events/${eventId}/slides`);

    // Escuchar cambios en tiempo real
    const unsubscribe = onValue(slideRef, (snapshot) => {
      const data = snapshot.val() as SlideState | null;
      if (data) {
        setCurrentSlide(data.currentSlide);
        setTotalSlides(data.totalSlides);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  const goToSlide = async (slideNumber: number) => {
    const slideRef = ref(database, `events/${eventId}/slides`);
    await set(slideRef, {
      currentSlide: slideNumber,
      totalSlides,
      timestamp: Date.now()
    });
  };

  const nextSlide = async () => {
    if (currentSlide < totalSlides - 1) {
      await goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = async () => {
    if (currentSlide > 0) {
      await goToSlide(currentSlide - 1);
    }
  };

  const setTotal = async (total: number) => {
    const slideRef = ref(database, `events/${eventId}/slides`);
    await set(slideRef, {
      currentSlide: currentSlide >= total ? 0 : currentSlide,
      totalSlides: total,
      timestamp: Date.now()
    });
  };

  const resetSlides = async () => {
    await goToSlide(0);
  };

  return {
    currentSlide,
    totalSlides,
    isLoading,
    goToSlide,
    nextSlide,
    prevSlide,
    setTotal,
    resetSlides
  };
}