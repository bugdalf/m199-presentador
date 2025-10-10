import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"

export async function GET() {
  try {
    // Crear referencia a la colección
    const slidesRef = collection(db, "slides")
    
    // Crear query ordenada por uploadedAt descendente (más reciente primero)
    const q = query(
      slidesRef,
      orderBy("order", "asc"),
      limit(30)
    )
    
    // Ejecutar la consulta
    const querySnapshot = await getDocs(q)
    
    // Mapear los documentos a un array
    const images = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convertir Timestamp a string para serialización JSON
      uploadedAt: doc.data().uploadedAt?.toDate().toISOString() || null,
    }))

    return NextResponse.json({
      success: true,
      images,
      total: images.length,
    })
  } catch (error) {
    console.error("Error al obtener imágenes:", error)
    return NextResponse.json({ error: "Error al obtener las imágenes" }, { status: 500 })
  }
}