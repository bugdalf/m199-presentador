import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import {
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore"
import { Slide } from "@/hooks/use-firestore-slides"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, videoUrl, presentationId } = body

    if (!id || !presentationId) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const presentationRef = doc(db, "presentations", presentationId);
    const snapshotPresentation = await getDoc(presentationRef);

    if (!snapshotPresentation.exists()) {
      return NextResponse.json(
        { error: "Presentación no encontrada" },
        { status: 404 }
      )
    }

    const presentationData = snapshotPresentation.data()
    const updatedAt = new Date().toISOString()

    const updatedSlides = presentationData?.slides.map((slide: Slide) => {
      if (slide.id === id) {
        return {
          ...slide,
          videoUrl: videoUrl ?? '',
          updatedAt,
        }
      }
      return slide
    })

    await updateDoc(presentationRef, {
      slides: updatedSlides,
    })

    return NextResponse.json({
      success: true,
      message: "Diapositiva actualizada correctamente",
    })
  } catch (error) {
    console.error("Error al actualizar diapositiva:", error)
    return NextResponse.json(
      { error: "Error al actualizar la diapositiva" },
      { status: 500 }
    )
  }
}