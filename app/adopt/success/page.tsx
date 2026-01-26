import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  return (
    <div className="text-center">
      <div className="mb-8 text-7xl">🎉</div>
      <h1 className="text-5xl font-serif text-gray-800 mb-4">
        ¡Felicidades!
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Has adoptado tu árbol con éxito. Recibirás un email de confirmación con todos los detalles.
      </p>
      
      <div className="bg-sage-50 p-8 rounded-lg max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-serif mb-4 text-gray-800">
          ¿Qué sigue?
        </h2>
        <ul className="text-left space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-sage-600 mr-3 text-xl">📧</span>
            <span>Revisa tu email para acceder a la página privada de tu árbol</span>
          </li>
          <li className="flex items-start">
            <span className="text-sage-600 mr-3 text-xl">📍</span>
            <span>Visita tu árbol cuando quieras - tienes la ubicación exacta</span>
          </li>
          <li className="flex items-start">
            <span className="text-sage-600 mr-3 text-xl">📸</span>
            <span>Recibirás actualizaciones con fotos y vídeos durante el año</span>
          </li>
          <li className="flex items-start">
            <span className="text-sage-600 mr-3 text-xl">🎁</span>
            <span>Tu giftbox de temporada llegará cuando la tierra esté lista</span>
          </li>
        </ul>
      </div>

      <div className="space-x-4">
        <Link
          href="/adopt"
          className="inline-block bg-sage-600 text-white px-8 py-3 rounded-full hover:bg-sage-700 transition-colors"
        >
          Adoptar otro árbol
        </Link>
        <Link
          href="/"
          className="inline-block border-2 border-sage-600 text-sage-600 px-8 py-3 rounded-full hover:bg-sage-50 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div>Cargando...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
