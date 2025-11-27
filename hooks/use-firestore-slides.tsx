// hooks/use-firestore-slides.ts
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Slide } from '@/shared/ui-types';


export function useFirestoreSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // escuchar la presentación activa
    const presentationsRef = collection(db, "presentations");
    const q = query(presentationsRef, where("isActive", "==", true));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setSlides([]);
          setIsLoading(false);
          return;
        }

        // asumimos que solo hay una presentation activa
        const presentation = snapshot.docs[0].data() as any;

        const sortedSlides: Slide[] = (presentation.slides || [])
          .map((s: any, idx: number) => ({
            id: s.id ?? idx.toString(),
            ...s
          }))
          .sort((a: Slide, b: Slide) => a.order - b.order);

        setSlides(sortedSlides);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error al cargar slides:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { slides, isLoading, error };
}
