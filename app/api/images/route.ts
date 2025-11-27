import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const presentationId = searchParams.get("presentationId") ?? ''

    const docRef = doc(db, "presentations", presentationId);
    const querySnapshot = await getDoc(docRef);

    // Obtener el primer documento (debería ser único por ID)
    if (!querySnapshot.exists()) {
      return NextResponse.json({
        success: true,
        images: [],
        total: 0,
      })
    }

    const presentationDoc = querySnapshot.data()
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