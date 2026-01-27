import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  return (
    <div className="text-center">
      <div className="mb-8 text-7xl animate-bounce">🎉</div>
      <h1 className="text-4xl sm:text-5xl font-serif text-sage-900 mb-4">
        ¡Bienvenido a Joyland!
      </h1>
      <p className="text-lg sm:text-xl text-sage-600 font-semibold mb-8 max-w-2xl mx-auto leading-relaxed">
        Tu adopción se ha completado con éxito. Recibirás un email de confirmación en los próximos minutos.
      </p>
      
      <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto mb-8">
        <h2 className="text-xl sm:text-2xl font-serif mb-6 text-sage-900">
          📦 ¿Qué sigue ahora?
        </h2>
        <ul className="text-left space-y-4 text-sage-700 text-sm sm:text-base">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">1</span>
            <div>
              <strong>Email de confirmación:</strong> Recibirás todos los detalles de tu adopción
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">2</span>
            <div>
              <strong>Actualizaciones regulares:</strong> Te mantendremos informado del progreso de tu árbol
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">3</span>
            <div>
              <strong>Giftbox estacional:</strong> Recibirás productos frescos de la finca
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-bold">4</span>
            <div>
              <strong>Informe anual:</strong> Un resumen completo del impacto de tu adopción
            </div>
          </li>
        </ul>
      </div>

      <div className="mb-8 p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl max-w-2xl mx-auto">
        <p className="text-amber-800 font-semibold text-center text-sm sm:text-base">
          💝 ¿Quieres regalar un árbol? Comparte la experiencia de Joyland con tus seres queridos
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link
          href="/giftbox"
          className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all font-bold text-sm sm:text-base"
        >
          Regalar un árbol 🎁
        </Link>
        <Link
          href="/"
          className="inline-block border-2 border-sage-600 text-sage-600 px-8 py-4 rounded-full hover:bg-sage-50 transition-all font-medium text-sm sm:text-base"
        >
          Volver al inicio
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-sage-200 max-w-2xl mx-auto">
        <p className="text-center text-sage-600 mb-4 text-sm sm:text-base">Únete a nuestra comunidad:</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <a href="https://www.instagram.com/chiara.abell.joyland/" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-800 transition-colors">
            📷 Instagram
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-800 transition-colors">
            📘 Facebook
          </a>
          <a href="/contact" className="text-sage-600 hover:text-sage-800 transition-colors">
            ✉️ Contacto
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-sage-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-sage-600">Cargando...</p>
            </div>
          }>
            <SuccessContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
