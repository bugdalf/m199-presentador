import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function GET() {
  try {
    console.log("[v0] Fetching images - Cloudinary config:", {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
    })

    // Obtener todas las imágenes de la carpeta nextjs-uploads
    const result = await cloudinary.search
      .expression("folder:nextjs-uploads")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute()

    console.log("[v0] Images fetched:", result.resources.length)

    return NextResponse.json({
      success: true,
      images: result.resources,
    })
  } catch (error) {
    console.error("[v0] Error al obtener imágenes:", error)
    return NextResponse.json(
      {
        error: "Error al obtener las imágenes: " + (error as Error).message,
      },
      { status: 500 },
    )
  }
}
