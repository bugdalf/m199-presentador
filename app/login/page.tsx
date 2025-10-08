"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (err: any) {
      setError("Credenciales inválidas. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex flex-col gap-8 min-h-[calc(100vh-4rem)] items-center justify-start px-4 py-12">
        <div className="flex flex-col justify-center mt-8">
          <button className="flex flex-col items-center gap-2">
            <img src="oveja.png" alt="logo ministerio" className="w-12" />
          </button>
          <h3 className="text-xl font-mono">MISIÓN 1-99</h3>
        </div>
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-card-foreground">Iniciar Sesión</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background text-foreground"
                />
              </div>

              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
