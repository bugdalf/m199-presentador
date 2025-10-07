import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            La plataforma completa para construir la web.
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Tu toolkit para dejar de configurar y empezar a innovar. Construye, despliega y escala las mejores
            experiencias web de forma segura.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Comenzar Ahora
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Ver Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground">
              <svg className="h-6 w-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-card-foreground">Rápido y Eficiente</h3>
            <p className="text-muted-foreground">
              Construye aplicaciones de alto rendimiento con las mejores prácticas integradas.
            </p>
          </Card>

          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground">
              <svg className="h-6 w-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-card-foreground">Seguro por Defecto</h3>
            <p className="text-muted-foreground">
              Autenticación robusta con Firebase y las mejores prácticas de seguridad.
            </p>
          </Card>

          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground">
              <svg className="h-6 w-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-card-foreground">Fácil de Usar</h3>
            <p className="text-muted-foreground">Interfaz intuitiva y componentes listos para usar con shadcn/ui.</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="border-border bg-card p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-card-foreground md:text-4xl">¿Listo para comenzar?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Únete a miles de desarrolladores que ya están construyendo con nuestra plataforma.
          </p>
          <Link href="/login">
            <Button size="lg">Comenzar Gratis</Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}
