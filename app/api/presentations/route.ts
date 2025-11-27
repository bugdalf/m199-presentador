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
  limit,
  deleteDoc
} from "firebase/firestore"

// GET - Obtener todas las presentaciones
export async function GET() {
  try {
    const presentationsRef = collection(db, "presentations")
    const q = query(presentationsRef)
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({
        success: true,
        presentations: [],
      })
    }

    const presentations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({
      success: true,
      presentations,
    })
  } catch (error) {
    console.error("Error al obtener presentaciones:", error)
    return NextResponse.json(
      { error: "Error al obtener las presentaciones" },
      { status: 500 }
    )
  }

}

// POST - Crear nueva presentación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, isActive } = body

    if (!name) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, "presentations"), {
      name,
      isActive: isActive === true,
      slides: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      presentation: {
        id: docRef.id,
        name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    })
  } catch (error) {
    console.error("Error al crear presentación:", error)
    return NextResponse.json(
      { error: "Error al crear la presentación" },
      { status: 500 }
    )
  }
}

// PUT - Actualizar presentación
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, isActive } = body

    if (!id || !name) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const docRef = doc(db, "presentations", id)
    await updateDoc(docRef, {
      name,
      isActive: isActive === true,
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      presentation: {
        id,
        name,
        isActive,
        updatedAt: serverTimestamp(),
      },
    })
  } catch (error) {
    console.error("Error al actualizar presentación:", error)
    return NextResponse.json(
      { error: "Error al actualizar la presentación" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar presentación
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const docRef = doc(db, "presentations", id)
    await deleteDoc(docRef)

    return NextResponse.json({
      success: true,
      presentation: {
        id,
      },
    })
  } catch (error) {
    console.error("Error al eliminar presentación:", error)
    return NextResponse.json(
      { error: "Error al eliminar la presentación" },
      { status: 500 }
    )
  }
}


