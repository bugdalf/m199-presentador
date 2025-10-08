"use client"
import { useEffect, useState } from "react";
import Contact from "./_components/Contact";
import Counter from "./_components/Counter";
import ImageCarousel from "./_components/ImageCarousel";
import InfoEvent from "./_components/InfoEvent";
import TikTokEmbed from "./_components/TikTokEmbed";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";


export default function Home() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])


  return (
    <div className="min-h-screen bg-background">
      <section className="flex flex-col justify-center text-center">
        {user && (
          <span className="text-xs font-mono text-cyan-400">MODO LIDER</span>
        )}
        {/* hero */}
        <h1 className="text-4xl font-mono">ENTRENAMIENTO DE EVANGELISMO</h1>
        <p>Evan. Obed Armando</p>

        <ImageCarousel />
        <Counter targetDate="2025-10-08T20:30:00" />
        <InfoEvent targetDate="2025-10-08T20:30:00" />
        <p className="text-center font-display">---</p>
        <p className="font-bold font-mono mt-8 mb-4">Más sobre nuestro ministerio</p>
        <TikTokEmbed
          videoId="7419263094586740011"
          username="evangelismo_sin_limites"
          description="RECURSOS PARA EVANGELIZAR. Los métodos cambian, pero la palabra jamás...!!!"
          hashtags={[
            'evangelsimocreativo',
            'jovenesconproposito',
            'evangelismosinlimitesoficial',
            'evangelismoenlascalles',
            'ftp',
            'evangelismo',
            'Dios',
            'adoracioncristiana',
            'iglesiacristiana',
            'jovenescristianos',
            'llamado'
          ]}
        />
        <Contact />
      </section>

    </div>
  )
}
