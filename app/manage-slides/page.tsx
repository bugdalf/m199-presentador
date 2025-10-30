"use client"

import { useEffect, useState } from "react"
import { ImageUploader } from "../components/manage-slides/ImageUploader"
import { ImageGallery } from "../components/manage-slides/ImageGallery"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import router from "next/router"


export default function ManageSlidesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:px-20 flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">Gestionar diapositivas de la presentación</h1>
      <ImageUploader onUploadSuccess={handleUploadSuccess} />
      <ImageGallery refresh={refreshKey} />
    </div>
  )
}
