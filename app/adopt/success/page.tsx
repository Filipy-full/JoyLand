import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  return (
    <div className="text-center">
      <div className="mb-8 text-7xl">🎉</div>
      <h1 className="text-5xl font-serif text-gray-800 mb-4">
        ¡Bienvenido a Joyland!
      </h1>
      <p className="text-xl text-sage-600 font-semibold mb-8 max-w-2xl mx-auto leading-relaxed">
        Tu árbol ya está reservado. Recibirás un email en los próximos 5 minutos con toda la información.
      </p>
      
      <div className="bg-gradient-to-br from-sage-50 to-sage-100 p-8 rounded-lg max-w-2xl mx-auto mb-8 border-2 border-sage-300">
        <h2 className="text-2xl font-serif mb-6 text-gray-800">
          📦 Esto es lo que recibirás:
        </h2>
        <ul className="text-left space-y-4 text-gray-700">
          <li className="flex items-start">
            <span className="text-sage-600 mr-3 text-2xl">1️⃣</span>
            <div>
              <strong>En 5 minutos:</strong> Email con acceso a tu página privada + coordenadas GPS
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-sage-600 mr-3 text-2xl">2️⃣</span>
            <div>
              <strong>Cada mes:</strong> Fotos y vídeos HD de tu árbol
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-sage-600 mr-3 text-2xl">3️⃣</span>
            <div>
              <strong>En 2-3 semanas:</strong> Tu pack gourmet premium con productos de la tierra
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-sage-600 mr-3 text-2xl">4️⃣</span>
            <div>
              <strong>Al final del año:</strong> Certificado de impacto + informe completo
            </div>
          </li>
        </ul>
      </div>

      <div className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-lg max-w-2xl mx-auto">
        <p className="text-amber-800 font-semibold text-center">
          💝 ¿Quieres regalar otro árbol? Obtén <strong>15% de descuento</strong> en tu segunda adopción
        </p>
      </div>

      <div className="space-x-4">
        <Link
          href="/adopt"
          className="inline-block bg-gradient-to-r from-sage-600 to-sage-700 text-white px-10 py-4 rounded-full hover:shadow-xl transition-all font-bold"
        >
          ADOPTAR OTRO ÁRBOL (-15%) →
        </Link>
        <Link
          href="/"
          className="inline-block border-2 border-sage-600 text-sage-600 px-10 py-4 rounded-full hover:bg-sage-50 transition-all font-medium"
        >
          Volver al inicio
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 max-w-2xl mx-auto">
        <p className="text-center text-gray-600 mb-4">Únete a nuestra comunidad:</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-sage-600 hover:text-sage-700">📷 Instagram</a>
          <a href="#" className="text-sage-600 hover:text-sage-700">📘 Facebook</a>
          <a href="/contact" className="text-sage-600 hover:text-sage-700">✉️ Contacto</a>
        </div>
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
