'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type SessionData = {
  id: string
  customer_email?: string | null
  metadata?: {
    treeId?: string
    treeName?: string
  }
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<SessionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(4)

  const treeId = useMemo(() => session?.metadata?.treeId, [session])
  const treeName = useMemo(() => session?.metadata?.treeName, [session])

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/checkout-session?session_id=${sessionId}`)
        if (!res.ok) {
          throw new Error('No se pudo obtener la sesión de Stripe')
        }
        const data = await res.json()
        setSession(data)
      } catch (err: any) {
        setError(err.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [sessionId])

  useEffect(() => {
    if (!treeId) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push(`/tree/${treeId}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, treeId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-7xl animate-bounce mb-4">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-sage-900 mb-2">
            ¡Pago confirmado!
          </h1>
          <p className="text-xl text-sage-600 font-semibold mb-2">
            Tu adopción fue procesada correctamente
          </p>
          {treeId && (
            <p className="text-sage-600 text-sm">
              Serás redirigido a la página de tu árbol en {countdown} segundos...
            </p>
          )}
          {session?.customer_email && (
            <p className="text-sage-600 text-sm">
              Confirmación enviada a: <span className="font-semibold">{session.customer_email}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-sage-200">
          <h2 className="text-2xl font-bold text-sage-900 mb-4">📋 Estado</h2>
          {loading ? (
            <p className="text-sage-700">Cargando detalles de tu adopción...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-2 text-left text-sage-700">
              <p>✅ Adopción registrada en el sistema</p>
              <p>✅ Certificado en preparación</p>
              <p>✅ Acceso a tu dashboard personal</p>
              {treeId && (
                <p>
                  🌳 Árbol asignado: <span className="font-semibold">{treeName || `#${treeId}`}</span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {treeId ? (
            <Link
              href={`/tree/${treeId}`}
              className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-lg font-semibold transition inline-block"
            >
              Ver Mi Árbol
            </Link>
          ) : (
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Ir a Mi Dashboard
            </button>
          )}
          <Link
            href="/adopt/map"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition inline-block"
          >
            Ver Más Árboles
          </Link>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Consejo:</strong> Revisa tu <Link href="/dashboard" className="underline font-bold">Dashboard</Link> para ver certificados, pagos y próximas renovaciones.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
