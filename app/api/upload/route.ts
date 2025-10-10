import { type NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { db } from "@/lib/firebase" // Importa tu instancia de Firestore
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
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

    // Obtener el último order de la colección
    const slidesRef = collection(db, "slides")
    const q = query(slidesRef, orderBy("order", "desc"), limit(1))
    const querySnapshot = await getDocs(q)
    
    let nextOrder = 1 // Valor por defecto si es el primer documento
    if (!querySnapshot.empty) {
      const lastDoc = querySnapshot.docs[0]
      nextOrder = (lastDoc.data().order || 0) + 1
    }

    // Crear documento en Firebase Firestore
    const docRef = await addDoc(collection(db, "slides"), {
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      order: nextOrder,
      uploadedAt: serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      firestoreId: docRef.id, // ID del documento en Firestore
      order: nextOrder, // Orden asignado
    })
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 })
  }
}