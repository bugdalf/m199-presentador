"use client"

import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { useFullscreen } from "@/hooks/use-fullscreen";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PencilIcon, PresentationIcon } from "lucide-react";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const isFullscreen = useFullscreen();

  const handleFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  };

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
    <div className="h-[calc(100vh-3rem)] flex flex-col items-center">
      {user && (
        <>
          <span className="text-xs font-mono text-cyan-400">MODO LIDER</span>
          <div className="border border-dashed border-cyan-400 py-1 px-4 m-1 w-full flex justify-between items-center">
            <Link href="/manage-slides">
              <Button variant='link'><PresentationIcon />Diapositivas</Button>
            </Link>
            <div>
              mandos principales
            </div>
            <Link href="/event">
              <Button variant='link'><PencilIcon />Evento</Button>
            </Link>
          </div>
        </>
      )}
      {!isFullscreen && (
        <div className="w-full mb-2 flex flex-col justify-center items-center">
          <button
            onClick={handleFullscreen}
            className="text-xs border cursor-pointer p-2"
          >
            Pantalla completa
          </button>
          <span className='md:hidden text-xs'>*Gira tu celular*</span>
        </div>
      )}
      <div className="border border-dashed w-full h-full">
        {/* Aqui los slides */}
        <span>aqui los slides</span>
      </div>
    </div>
  )
}