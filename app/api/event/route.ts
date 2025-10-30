// app/api/events/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp,
  query,
  limit
} from "firebase/firestore"

// GET - Obtener evento (asumiendo que solo hay uno)
export async function GET() {
  try {
    const eventsRef = collection(db, "event")
    const q = query(eventsRef, limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({
        success: true,
        event: null,
      })
    }

    const eventDoc = querySnapshot.docs[0]
    const event = {
      id: eventDoc.id,
      ...eventDoc.data(),
    }

    return NextResponse.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Error al obtener evento:", error)
    return NextResponse.json(
      { error: "Error al obtener el evento" },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo evento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, rhema, rhemaQuote, nameEvent, date, time, place, mapsUrl } = body

    if (!title || !rhema || !rhemaQuote || !nameEvent || !date || !time || !place || !mapsUrl) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, "event"), {
      title,
      rhema,
      rhemaQuote,
      nameEvent,
      date,
      time,
      place,
      mapsUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      eventId: docRef.id,
      message: "Evento creado correctamente",
    })
  } catch (error) {
    console.error("Error al crear evento:", error)
    return NextResponse.json(
      { error: "Error al crear el evento" },
      { status: 500 }
    )
  }
}

// PUT - Actualizar evento existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, rhema, rhemaQuote, nameEvent, date, time, place, tiktokVideo, mapsUrl } = body

    if (!id || !title || !rhema || !rhemaQuote || !nameEvent || !date || !time || !place || !tiktokVideo || !mapsUrl) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const docRef = doc(db, "event", id)
    await updateDoc(docRef, {
      title,
      rhema,
      rhemaQuote,
      nameEvent,
      date,
      time,
      place,
      tiktokVideo,
      mapsUrl,
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