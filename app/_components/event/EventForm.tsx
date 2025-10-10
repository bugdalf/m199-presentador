"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface Event {
  id?: string
  nombre: string
  fecha: string
  lugar: string
}

export function EventForm() {
  const [event, setEvent] = useState<Event>({
    nombre: "",
    fecha: "",
    lugar: "",
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

    if (!event.nombre || !event.fecha || !event.lugar) {
      toast.error("Todos los campos son requeridos")
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
      console.error("Error al guardar evento:", error)
      toast.error("Error al guardar el evento")
    } finally {
      setSaving(false)
    }
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
            <Label htmlFor="nombre">Nombre del Evento</Label>
            <Input
              id="nombre"
              placeholder="Ej: Conferencia Anual 2025"
              value={event.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={event.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lugar">Lugar</Label>
            <Input
              id="lugar"
              placeholder="Ej: Centro de Convenciones, Lima"
              value={event.lugar}
              onChange={(e) => handleChange("lugar", e.target.value)}
              required
            />
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