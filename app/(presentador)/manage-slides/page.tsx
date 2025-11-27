"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import router from "next/router"
import PresentationList from "@/components/own-ui/manage-slides/PresentationList"


export default function ManageSlidesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background p-4 lg:px-20 flex flex-col gap-2 overflow-auto">
      <h1 className="text-2xl font-bold tracking-tight">Gestionar presentaciones</h1>
      <PresentationList />
    </div>
  )
}
