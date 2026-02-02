'use client'

import { useState, useEffect } from 'react'

export default function SitePassword({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Verificar si ya está desbloqueado en sessionStorage
    const isUnlocked = sessionStorage.getItem('site_unlocked') === 'true'
    setUnlocked(isUnlocked)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD

    if (!correctPassword) {
      // Si no hay contraseña configurada, permitir acceso
      setUnlocked(true)
      return
    }

    if (password === correctPassword) {
      sessionStorage.setItem('site_unlocked', 'true')
      setUnlocked(true)
      setError('')
    } else {
      setError('Contraseña incorrecta')
      setPassword('')
    }
  }

  // Si está desbloqueado, mostrar el contenido
  if (unlocked) {
    return <>{children}</>
  }

  // Mostrar formulario de contraseña
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serif text-sage-900 mb-2">🌳 Joyland</h1>
          <p className="text-sage-600">Introduce la contraseña para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-sage-600 text-white py-3 rounded-lg hover:bg-sage-700 transition-colors font-medium"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
