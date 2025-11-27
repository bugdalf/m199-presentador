import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import cloudinary from "@/lib/cloudinary"
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion, getDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const presentationId = formData.get("presentationId") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!presentationId) {
      return NextResponse.json({ error: "No se proporcionó el ID de la presentación" }, { status: 400 })
    }

    // Convertir el archivo a base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "slides-uploads",
      resource_type: "auto",
    })

    // Obtener la presentación actual para calcular el orden
    const presentationRef = doc(db, "presentations", presentationId)
    const presentationSnap = await getDoc(presentationRef)

    if (!presentationSnap.exists()) {
      return NextResponse.json({ error: "Presentación no encontrada" }, { status: 404 })
    }

    const presentationData = presentationSnap.data()
    const currentSlides = presentationData.slides || []
    const nextOrder = currentSlides.length > 0
      ? Math.max(...currentSlides.map((s: any) => s.order || 0)) + 1
      : 1

    const newSlide = {
      id: crypto.randomUUID(),
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      order: nextOrder,
      uploadedAt: new Date().toISOString(), // Usar string ISO para compatibilidad con JSON
      videoUrl: "" // Campo opcional inicializado vacío
    }

    // Actualizar el documento de la presentación agregando el slide
    await updateDoc(presentationRef, {
      slides: arrayUnion(newSlide),
      updatedAt: serverTimestamp()
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      firestoreId: newSlide.id,
      order: nextOrder,
    })
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 })
  }
}