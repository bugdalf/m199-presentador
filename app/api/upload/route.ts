import { type NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload - Cloudinary config:", {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
    })

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    console.log("[v0] File received:", file.name, file.type, file.size)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    console.log("[v0] Starting upload to Cloudinary...")

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "nextjs-uploads",
      resource_type: "auto",
    })

    console.log("[v0] Upload successful:", result.public_id)

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("[v0] Error al subir imagen:", error)
    return NextResponse.json(
      {
        error: "Error al subir la imagen: " + (error as Error).message,
      },
      { status: 500 },
    )
  }
}
