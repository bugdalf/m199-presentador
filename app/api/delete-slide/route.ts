import { type NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { db } from "@/lib/firebase"
import { doc, deleteDoc, getDoc } from "firebase/firestore"

export async function DELETE(request: NextRequest) {
  try {
    // Obtener el ID del documento desde el body o query params
    const body = await request.json()
    const { firestoreId } = body

    if (!firestoreId) {
      return NextResponse.json(
        { error: "No se proporcionó el ID del documento" },
        { status: 400 }
      )
    }

    // Obtener el documento de Firebase para acceder al publicId
    const docRef = doc(db, "slides", firestoreId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Documento no encontrado en Firebase" },
        { status: 404 }
      )
    }

    const data = docSnap.data()
    const publicId = data.publicId

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

    // Eliminar de Firebase
    await deleteDoc(docRef)

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