import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { 
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, videoUrl } = body

    if (!id) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const docRef = doc(db, "slides", id)
    await updateDoc(docRef, {
      videoUrl: videoUrl ?? '',
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      message: "Evento actualizado correctamente",
    })
  } catch (error) {
    console.error("Error al actualizar evento:", error)
    return NextResponse.json(
      { error: "Error al actualizar el evento" },
      { status: 500 }
    )
  }
}