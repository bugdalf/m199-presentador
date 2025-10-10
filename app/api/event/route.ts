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
    const eventsRef = collection(db, "events")
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
      fecha: eventDoc.data().fecha || null,
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
    const { nombre, fecha, lugar } = body

    if (!nombre || !fecha || !lugar) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, "events"), {
      nombre,
      fecha,
      lugar,
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
    const { id, nombre, fecha, lugar } = body

    if (!id || !nombre || !fecha || !lugar) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const docRef = doc(db, "events", id)
    await updateDoc(docRef, {
      nombre,
      fecha,
      lugar,
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