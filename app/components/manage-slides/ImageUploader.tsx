"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ImageUploaderProps {
  onUploadSuccess: () => void
  presentationId: string
}

export function ImageUploader({ onUploadSuccess, presentationId }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append("presentationId", presentationId)
    const file = formData.get("file") as File

    if (!file) return

    setUploading(true)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setPreview(null);
        (e.target as HTMLFormElement).reset()
        onUploadSuccess()
      } else {
        alert("Error al subir la imagen")
      }
    } catch (error) {
      alert("Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Imagen</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted hover:text-black transition-colors"
            >
              {preview ? (
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="h-full w-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-10 w-10" />
                  <p className="text-sm">Haz clic para seleccionar una imagen</p>
                </div>
              )}
              <Input
                id="file-upload"
                name="file"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          <Button variant="outline" type="submit" disabled={uploading || !preview} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Imagen
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
