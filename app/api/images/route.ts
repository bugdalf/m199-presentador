import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function GET() {
  try {
    // Obtener todas las imágenes de la carpeta nextjs-uploads
    const result = await cloudinary.search
      .expression("folder:nextjs-uploads")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute()

    return NextResponse.json({
      success: true,
      images: result.resources,
    })
  } catch (error) {
    console.error("Error al obtener imágenes:", error)
    return NextResponse.json({ error: "Error al obtener las imágenes" }, { status: 500 })
  }
}
