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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Cloudinary + Next.js</h1>
            <p className="text-muted-foreground text-lg">Sube y gestiona tus imágenes fácilmente</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <ImageUploader onUploadSuccess={handleUploadSuccess} />
            <div className="md:col-span-2">
              <ImageGallery refresh={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
