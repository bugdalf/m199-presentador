"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface CloudinaryImage {
  public_id: string
  secure_url: string
  created_at: string
  width: number
  height: number
}

export function ImageGallery({ refresh }: { refresh: number }) {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/images")
        const data = await response.json()

        if (data.success) {
          setImages(data.images)
        }
      } catch (error) {
        console.error("Error al cargar imágenes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [refresh])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diapositivas actuales</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay diapositivas todavía. ¡Sube una!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.public_id} className="relative aspect-video rounded-lg border border-dashed">
                <Image
                  src={image.secure_url || "/placeholder.svg"}
                  alt={image.public_id}
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
