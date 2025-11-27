"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Save, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export interface Event {
  id?: string
  title: string
  rhema: string
  rhemaQuote: string
  nameEvent: string
  date: string
  time: string
  place: string
  tiktokVideo: string
  mapsUrl: string
}

export function EventForm() {
  const [event, setEvent] = useState<Event>({
    title: "",
    rhema: "",
    rhemaQuote: "",
    nameEvent: "",
    date: "",
    time: "",
    place: "",
    tiktokVideo: "",
    mapsUrl: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [eventExists, setEventExists] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [])

  const fetchEvent = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/event")
      const data = await response.json()

      if (data.success && data.event) {
        setEvent(data.event)
        setEventExists(true)
      }
    } catch (error) {
      console.error("Error al cargar evento:", error)
      toast.error("Error al cargar el evento")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !event.title ||
      !event.rhema ||
      !event.rhemaQuote ||
      !event.nameEvent ||
      !event.date ||
      !event.time ||
      !event.place ||
      !event.tiktokVideo ||
      !event.mapsUrl) {
      toast.error("Todos los campos son requeridos")
      return
    }

    // Validar URL de Google Maps
    if (!isValidMapsUrl(event.mapsUrl)) {
      toast.error("Por favor ingresa una URL válida de Google Maps")
      return
    }

    setSaving(true)

    try {
      const url = "/api/event"
      const method = eventExists ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(eventExists ? "Evento actualizado correctamente" : "Evento creado correctamente")
        if (!eventExists) {
          setEventExists(true)
          fetchEvent() // Recargar para obtener el ID
        }
      } else {
        toast.error(data.error || "Error al guardar el evento")
      }
    } catch (error) {
      toast.error("Error al guardar el evento")
    } finally {
      setSaving(false)
    }
  }

  const isValidMapsUrl = (url: string): boolean => {
    if (!url) return false // El campo es obligatorio

    // Validar que sea una URL de Google Maps
    const mapsPatterns = [
      /^https?:\/\/(www\.)?google\.[a-z]+\/maps/i,
      /^https?:\/\/maps\.google\.[a-z]+/i,
      /^https?:\/\/goo\.gl\/maps/i,
      /^https?:\/\/maps\.app\.goo\.gl/i,
    ]

    return mapsPatterns.some(pattern => pattern.test(url))
  }

  const handleChange = (field: keyof Event, value: string) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Información del Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Evento</CardTitle>
        <CardDescription>
          {eventExists ? "Edita los datos del evento" : "Crea un nuevo evento"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ej: Entrenamiento de evangelismo"
              value={event.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rhema">Rhema</Label>
            <Textarea
              id="rhema"
              placeholder="Ej: Todo lo puedo en Cristo que me fortalece"
              value={event.rhema}
              onChange={(e) => handleChange("rhema", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rhemaQuote">Pasaje bíblico del versículo rhema</Label>
            <Input
              id="rhemaQuote"
              placeholder="Ej: Filipenses 4:13"
              value={event.rhemaQuote}
              onChange={(e) => handleChange("rhemaQuote", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameEvent">Nombre del Evento</Label>
            <Input
              id="nameEvent"
              placeholder="Ej: Conferencia Anual 2025 - Cusco"
              value={event.nameEvent}
              onChange={(e) => handleChange("nameEvent", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={event.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={event.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="place">Lugar</Label>
            <Input
              id="place"
              placeholder="Ej: Centro de Convenciones, Lima"
              value={event.place}
              onChange={(e) => handleChange("place", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiktok-video">Video de portada</Label>
            <Input
              id="tiktok-video"
              placeholder="Ej: https://www.youtube.com/shorts..."
              value={event.tiktokVideo}
              onChange={(e) => handleChange("tiktokVideo", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapsUrl">
              Ubicación en Google Maps
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="mapsUrl"
                type="url"
                placeholder="https://maps.google.com/..."
                value={event.mapsUrl}
                onChange={(e) => handleChange("mapsUrl", e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Pega el enlace de Google Maps del lugar del evento
            </p>
            {event.mapsUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(event.mapsUrl, "_blank")}
                className="mt-2"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Ver en Google Maps
              </Button>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {eventExists ? "Actualizar Evento" : "Crear Evento"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}