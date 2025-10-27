// hooks/use-firestore-slides.ts
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Slide {
  id?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  order: number;
  publicId: string;
  uploadedAt: any;
  url: string;
  videoUrl?: string;
}

export function useFirestoreSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const slidesRef = collection(db, 'slides');
      const q = query(slidesRef, orderBy('order', 'asc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const slidesData: Slide[] = [];
          snapshot.forEach((doc) => {
            slidesData.push({
              id: doc.id,
              ...doc.data()
            } as Slide);
          });
          setSlides(slidesData);
          setIsLoading(false);
        },
        (err) => {
          console.error('Error al cargar slides:', err);
          setError(err as Error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error al configurar listener:', err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, []);

  return { slides, isLoading, error };
}