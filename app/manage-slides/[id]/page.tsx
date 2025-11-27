'use client'
import { ImageGallery } from "@/app/components/manage-slides/ImageGallery"
import { ImageUploader } from "@/app/components/manage-slides/ImageUploader"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div>
      <ImageUploader onUploadSuccess={handleUploadSuccess} presentationId={id} />
      <ImageGallery refresh={refreshKey} presentationId={id} />
    </div>
  )
}