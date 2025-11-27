import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const presentationId = searchParams.get("presentationId")
    // Crear referencia a la colección
    const presentationsRef = collection(db, "presentations")

    // query para obtener la presentación
    const q = query(
      presentationsRef,
      where("id", "==", presentationId),
    )

    // Ejecutar la consulta
    const querySnapshot = await getDocs(q)
    console.log('presentationId', presentationId)
    console.log('querySnapshot', querySnapshot.docs)

    // Obtener el primer documento (debería ser único por ID)
    if (querySnapshot.empty) {
      return NextResponse.json({
        success: true,
        images: [],
        total: 0,
      })
    }

    const presentationDoc = querySnapshot.docs[0].data()
    const images = presentationDoc.slides || []

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