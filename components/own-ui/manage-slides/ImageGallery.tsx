"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, PencilIcon, Trash2Icon, YoutubeIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import SlideOptions from "./SlideOptions"
import { Slide } from "@/shared/ui-types"
import Link from "next/link"
import { FaYoutube } from "react-icons/fa"


export function ImageGallery({ refresh, presentationId }: { refresh: number, presentationId: string }) {
  const [slides, setSlides] = useState<Slide[]>([])
  const [selectedSlide, setSelectedSlide] = useState<Slide>({
    fileName: '',
    fileSize: 0,
    fileType: '',
    order: 0,
    publicId: '',
    uploadedAt: '',
    url: '',
    videoUrl: '',
  });
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/images?presentationId=${presentationId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const data = await response.json()
        console.log(data)

        if (data.success) {
          setSlides(data.images)
        }
      } catch (error) {
        console.error("Error al cargar imágenes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [refresh])

  const handleDelete = async (slideId: string | undefined, fileName: string, slidePublicId: string) => {
    if (!slideId) {
      return;
    }

    // Confirmación antes de eliminar
    if (!confirm(`¿Estás seguro de eliminar "${fileName}"?`)) {
      return
    }

    setDeleting(slideId)

    try {
      const response = await fetch("/api/delete-slide", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slideId, slidePublicId, presentationId }),
      })

      const data = await response.json()

      if (data.success) {
        // Eliminar la imagen del estado local
        setSlides((prevSlides) => prevSlides.filter((img) => img.id !== slideId))
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

  const handleEdit = async (slide: Slide) => {
    if (!slide) {
      return;
    }
    setOpenModalEdit(true);
    setSelectedSlide(slide);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Diapositivas actuales</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay diapositivas todavía. ¡Sube una!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              {slides.map((slide) => {
                const isDeleting = deleting === slide.id

                return (
                  <div key={slide.id} className="relative aspect-video rounded-lg border border-dashed">
                    <div className="absolute -top-3 -left-3 bg-cyan-700 w-10 h-10 rounded-full flex items-center justify-center z-10">
                      {slide.order}
                    </div>

                    {isDeleting && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-20">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}

                    <Image
                      src={slide.url || "/placeholder.svg"}
                      alt={slide.fileName || "placeholder"}
                      fill
                      className="object-contain transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                    {(slide.videoUrl != undefined && slide.videoUrl != '') && (
                      <div className="absolute top-1 right-1 flex items-center justify-center">
                        <Link href={slide.videoUrl} target="_blank">
                          <Button variant='link' className="bg-red-500">
                            <FaYoutube />
                          </Button>
                        </Link>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-11 flex items-center justify-center">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => handleEdit(slide)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-1 right-1 flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(slide.id, slide.fileName, slide.publicId)}
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
      <SlideOptions
        open={openModalEdit}
        onOpen={setOpenModalEdit}
        slide={selectedSlide}
        onChangeSlide={setSelectedSlide}
        setSlides={setSlides}
        presentationId={presentationId}
      />
    </>
  )
}
