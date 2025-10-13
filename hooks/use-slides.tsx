// hooks/use-slides.ts
import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '@/lib/firebase';

interface SlideState {
  currentSlide: number;
  totalSlides: number;
  timestamp: number;
}

export function useSlides(eventId: string = 'default', isLeader: boolean = false) {
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
      } else if (isLeader) {
        // Solo el líder inicializa si no hay datos
        set(slideRef, {
          currentSlide: 0,
          totalSlides: 0,
          timestamp: Date.now()
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [eventId, isLeader]);

  const goToSlide = async (slideNumber: number) => {
    if (!isLeader) {
      console.warn('Solo el líder puede cambiar de slide');
      return;
    }
    
    const slideRef = ref(database, `events/${eventId}/slides`);
    await set(slideRef, {
      currentSlide: slideNumber,
      totalSlides,
      timestamp: Date.now()
    });
  };

  const nextSlide = async () => {
    if (!isLeader) {
      console.warn('Solo el líder puede cambiar de slide');
      return;
    }
    
    if (currentSlide < totalSlides - 1) {
      await goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = async () => {
    if (!isLeader) {
      console.warn('Solo el líder puede cambiar de slide');
      return;
    }
    
    if (currentSlide > 0) {
      await goToSlide(currentSlide - 1);
    }
  };

  const setTotal = async (total: number) => {
    if (!isLeader) {
      console.warn('Solo el líder puede actualizar el total de slides');
      return;
    }
    
    const slideRef = ref(database, `events/${eventId}/slides`);
    await set(slideRef, {
      currentSlide: currentSlide >= total ? 0 : currentSlide,
      totalSlides: total,
      timestamp: Date.now()
    });
  };

  const resetSlides = async () => {
    if (!isLeader) {
      console.warn('Solo el líder puede reiniciar los slides');
      return;
    }
    
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
    resetSlides,
    isLeader
  };
}