"use client"

import { useState } from "react"
import { ImageUploader } from "../_components/manage-slides/ImageUploader"
import { ImageGallery } from "../_components/manage-slides/ImageGallery"


export default function ManageSlidesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background py-4 px-12 flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">Gestionar imágenes de la presentación</h1>
      <ImageUploader onUploadSuccess={handleUploadSuccess} />
      <ImageGallery refresh={refreshKey} />
    </div>
  )
}
