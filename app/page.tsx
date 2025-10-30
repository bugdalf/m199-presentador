"use client"
import { useEffect, useState } from "react";
import Contact from "./components/Contact";
import Counter from "./components/Counter";
import ImageCarousel from "./components/ImageCarousel";
import InfoEvent from "./components/InfoEvent";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Event } from "@/app/components/event/EventForm";
import Rhema from "./components/Rhema";
import YoutubeShortEmbed from "./components/YoutubeShortEmbed";


export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)

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

  useEffect(() => {
    fetchEvent()
  }, [])

  const fetchEvent = async () => {
    try {
      const response = await fetch("/api/event")
      const data = await response.json()
      if (data.success && data.event) {
        setEvent(data.event)
      }
    } catch (error) {
      console.error("Error al cargar evento:", error)
    } finally {
      setIsLoadingEvent(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="flex flex-col justify-center text-center">
        {user && (
          <span className="text-xs font-mono text-cyan-400">MODO LIDER</span>
        )}

        {/* hero */}
        <h1 className="text-4xl font-mono px-3">{event?.title || '...'}</h1>
        <p>Evan. Obed Armando</p>

        <ImageCarousel />

        {/* Solo renderizar Counter cuando event esté cargado */}
        {!isLoadingEvent && event?.date && event?.time ? (
          <Counter targetDate={`${event.date}T${event.time}:00`} />
        ) : (
          <div className="text-center py-4">
            <p className="font-bold font-mono">...</p>
          </div>
        )}

        {!isLoadingEvent && event?.date && event?.time && (
          <InfoEvent
            targetDate={`${event.date}T${event.time}:00`}
            place={event?.place || ''}
            mapsUrl={event?.mapsUrl || ''}
          />
        )}

        {event?.rhema && (
          <Rhema rhema={event.rhema} rhemaQuote={event.rhemaQuote || ''} />
        )}

        <p className="text-center my-6">{event?.nameEvent}</p>
        <p className="text-center font-display my-6">---</p>
        <p className="font-bold font-mono mb-4 -mt-4 text-xl">Más sobre nuestro ministerio</p>
        {/* <VideoM199 /> */}
        <div className="flex justify-center">
          <YoutubeShortEmbed url={event?.tiktokVideo || ""} />
        </div>
        <Contact />
      </section>
    </div>
  )
}