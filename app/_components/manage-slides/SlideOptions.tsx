"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slide } from "@/hooks/use-firestore-slides";
import { Loader2, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SlideOptionsProps {
  open: boolean;
  onOpen: (isOpen: boolean) => void;
  slide?: Slide;
  onChangeSlide: React.Dispatch<React.SetStateAction<Slide>>;
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>
}

export default function SlideOptions({
  open,
  onOpen,
  slide,
  onChangeSlide,
  slides,
  setSlides
}: SlideOptionsProps) {
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || !slide) return;
  }, [open, slide]);

  // Actualizar la url del video
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validar URL de YouTube solo si se proporciona una
    if (slide?.videoUrl && !isValidYoutubeUrl(slide.videoUrl)) {
      toast.error("Por favor ingresa una URL válida de YouTube")
      return
    }

    setSaving(true);

    try {
      const response = await fetch("/api/update-slide", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slide),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Diapositiva actualizada correctamente')
        
        // Actualizar el slide específico en el array de slides
        setSlides(prevSlides => 
          prevSlides.map(s => 
            s.id === slide?.id ? { ...s, videoUrl: slide?.videoUrl || "" } : s
          )
        )
        onOpen(false)
      } else {
        toast.error(data.error || "Error al guardar la diapositiva")
      }
    } catch (error) {
      console.error("Error al actualizar la diapositiva:", error)
      toast.error("Error al guardar la diapositiva")
    } finally {
      setSaving(false)
    }
  }

  const isValidYoutubeUrl = (url: string): boolean => {
    if (!url) return false

    // Validar que sea una URL de YouTube
    const youtubePatterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i,        // https://www.youtube.com/watch?v=VIDEO_ID
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/i,           // https://www.youtube.com/embed/VIDEO_ID
      /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/i,               // https://www.youtube.com/v/VIDEO_ID
      /^https?:\/\/youtu\.be\/[\w-]+/i,                             // https://youtu.be/VIDEO_ID
      /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/i,          // https://www.youtube.com/shorts/VIDEO_ID
      /^https?:\/\/(www\.)?youtube\.com\/live\/[\w-]+/i,            // https://www.youtube.com/live/VIDEO_ID
    ]

    return youtubePatterns.some(pattern => pattern.test(url))
  }

  const handleChange = (field: keyof Slide, value: string) => {
    onChangeSlide((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar video a diapositiva</DialogTitle>
          <DialogDescription>{slide?.fileName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL de video de YouTube (opcional)</Label>
            <Input
              id="videoUrl"
              placeholder="Ej: https://www.youtube.com/watch?v=yaTEX4bXiZc"
              value={slide?.videoUrl || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
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
                <SaveIcon className="mr-2 h-4 w-4" />
                Actualizar Diapositiva
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}