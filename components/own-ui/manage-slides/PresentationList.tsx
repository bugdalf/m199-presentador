'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import CreatePresentationModal from "./CreatePresentationModal"
import { Loader2Icon, PencilIcon, PresentationIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Presentation } from "@/shared/ui-types";

export default function PresentationList() {
  const [open, setOpen] = useState(false);
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(true)
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);

  useEffect(() => {
    fetchPresentations()
  }, [])

  const fetchPresentations = async () => {
    try {
      const response = await fetch("/api/presentations")
      const data = await response.json()
      if (data.success && data.presentations) {
        setPresentations(data.presentations)
      }
    } catch (error) {
      console.error("Error al cargar presentaciones:", error)
    } finally {
      setIsLoadingPresentations(false)
    }
  }

  const handleEditPresentation = (presentation: Presentation) => {
    setSelectedPresentation(presentation)
    setOpen(true)
  }

  const handleCreatePresentation = () => {
    setSelectedPresentation(null)
    setOpen(true)
  }

  const handleSavePresentation = async (presentation: Presentation) => {
    if (presentation.id) {
      try {
        const response = await fetch(`/api/presentations`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(presentation),
        })
        const data = await response.json()
        if (data.success && data.presentation) {
          setPresentations((prev) =>
            prev.map((p) => (p.id === presentation.id ? data.presentation : p))
          )
          setOpen(false)
        }
      } catch (error) {
        console.error("Error al actualizar presentación:", error)
      }
      return
    }

    try {
      const response = await fetch("/api/presentations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(presentation),
      })
      const data = await response.json()
      if (data.success && data.presentation) {
        setPresentations((prev) => [...prev, data.presentation])
        setOpen(false)
      }
    } catch (error) {
      console.error("Error al guardar presentación:", error)
    }
  }

  const handleDeletePresentation = async (presentation: Presentation) => {
    if ((presentation.slides?.length || 0) > 0) {
      alert("No se puede eliminar una presentación con slides")
      return
    }

    // Confirmación antes de eliminar
    if (!confirm(`¿Estás seguro de eliminar "${presentation.name}"?`)) {
      return
    }


    try {
      const response = await fetch(`/api/presentations`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: presentation.id }),
      })
      const data = await response.json()
      if (data.success && data.presentation) {
        setPresentations((prev) => prev.filter((p) => p.id !== presentation.id))
      }
    } catch (error) {
      console.error("Error al eliminar presentación:", error)
    }
  }

  return (
    <div className="grow flex flex-col gap-2 overflow-auto">
      <Button className="w-full" onClick={handleCreatePresentation}>Crear nueva presentación</Button>
      <div className="grow flex-auto space-y-2 overflow-auto">
        {isLoadingPresentations ? (
          <div className="flex justify-center items-center h-full">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          presentations.map(presentation => {
            return (
              <div
                key={presentation.id}
                className="flex justify-between items-center border border-dashed rounded p-2"
              >
                <h2>{presentation.name}</h2>
                <div className="flex gap-2">
                  <div className={cn("text-xs text-white rounded border flex items-center justify-center px-2", presentation.isActive === true && 'bg-cyan-500')}>{presentation.isActive ? 'Activo' : 'Inactivo'}</div>
                  <Button variant='link'>
                    <Link href={`/manage-slides/${presentation.id}`}>
                      <PresentationIcon />
                    </Link>
                  </Button>
                  <Button onClick={() => handleDeletePresentation(presentation)}><TrashIcon /></Button>
                  <Button onClick={() => handleEditPresentation(presentation)}><PencilIcon /></Button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <CreatePresentationModal
        open={open}
        onOpenChange={setOpen}
        selectedPresentation={selectedPresentation}
        setSelectedPresentation={setSelectedPresentation}
        onSave={handleSavePresentation}
      />
    </div>
  )
}