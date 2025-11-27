import { type NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { db } from "@/lib/firebase"
import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore"

export async function DELETE(request: NextRequest) {
  try {
    // Obtener el ID del documento desde el body o query params
    const body = await request.json()
    const { slideId, slidePublicId, presentationId } = body

    if (!slideId || !presentationId) {
      return NextResponse.json(
        { error: "No se proporcionó la información necesaria" },
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
    const publicId = slidePublicId

    // Eliminar de Cloudinary
    let cloudinaryDeleted = false
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId)
        cloudinaryDeleted = true
      } catch (cloudinaryError) {
        console.error("Error al eliminar de Cloudinary:", cloudinaryError)
        // Continuar con la eliminación de Firebase aunque falle Cloudinary
      }
    }

    const newSlides = (presentationData.slides || []).filter((slide: any) => slide.id !== slideId);

    // Actualizar el documento en Firebase
    await updateDoc(presentationRef, { slides: newSlides });

    return NextResponse.json({
      success: true,
      message: "Imagen eliminada correctamente",
      cloudinaryDeleted,
      firestoreDeleted: true,
    })
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    return NextResponse.json(
      { error: "Error al eliminar la imagen" },
      { status: 500 }
    )
  }
}