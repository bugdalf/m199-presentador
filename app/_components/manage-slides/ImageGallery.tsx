"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "sonner" // o tu sistema de notificaciones

interface FirebaseImage {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  order: number
  uploadedAt: string
  url: string
}

export function ImageGallery({ refresh }: { refresh: number }) {
  const [images, setImages] = useState<FirebaseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/images")
        const data = await response.json()
        console.log(data)

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

  const handleDelete = async (imageId: string, fileName: string) => {
    // Confirmación antes de eliminar
    if (!confirm(`¿Estás seguro de eliminar "${fileName}"?`)) {
      return
    }

    setDeleting(imageId)
    
    try {
      const response = await fetch("/api/delete-slide", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firestoreId: imageId }),
      })

      const data = await response.json()

      if (data.success) {
        // Eliminar la imagen del estado local
        setImages((prevImages) => prevImages.filter((img) => img.id !== imageId))
        toast.success("Imagen eliminada correctamente")
      } else {
        toast.error(data.error || "Error al eliminar la imagen")
      }
    } catch (error) {
      console.error("Error al eliminar imagen:", error)
      toast.error("Error al eliminar la imagen")
    } finally {
      setDeleting(null)
    }
  }

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {images.map((image) => {
              const isDeleting = deleting === image.id
              
              return (
                <div key={image.id} className="relative aspect-video rounded-lg border border-dashed">
                  <div className="absolute -top-3 -left-3 bg-cyan-700 w-10 h-10 rounded-full flex items-center justify-center z-10">
                    {image.order}
                  </div>
                  
                  {isDeleting && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-20">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                  
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.fileName || "placeholder"}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  
                  <div className="absolute bottom-1 right-1 flex items-center justify-center">
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(image.id, image.fileName)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2Icon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}