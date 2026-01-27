'use client'

import { useState } from 'react'
import { TreeIcon } from '@/components/Icons'

export default function AdoptPage() {
  const [loadingType, setLoadingType] = useState<'almond' | 'olive' | null>(null)

  const handleAdopt = async (treeType: 'almond' | 'olive') => {
    setLoadingType(treeType)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treeType }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Error:', data.error)
        setLoadingType(null)
      }
    } catch (error) {
      console.error('Error al crear sesión:', error)
      setLoadingType(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-sage-100 rounded-full">
            <span className="text-2xl">🌿</span>
            <span className="text-sage-700 font-medium text-sm">Joyland</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-sage-900 mb-6 leading-tight">
            Adopta un árbol en Joyland
          </h1>
          
          <p className="text-lg sm:text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed">
            Elige un árbol y acompáñalo durante un año completo
          </p>
        </div>
      </section>

      {/* What Adoption Means */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-6 sm:p-10 rounded-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-full mb-6">
              <TreeIcon className="w-8 h-8 text-sage-700" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-serif text-sage-900 mb-4">
              ¿Qué incluye la adopción?
            </h2>
            
            <p className="text-sage-700 text-base sm:text-lg leading-relaxed mb-6">
              Cada adopción apoya la tierra durante un año completo. 
              Recibirás un árbol con nombre, un informe anual de progreso, 
              y una caja de regalo estacional de Joyland con productos de la finca.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🌳</div>
                <p className="text-sm font-medium text-sage-800">Árbol nombrado</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm font-medium text-sage-800">Informe anual</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎁</div>
                <p className="text-sm font-medium text-sage-800">Giftbox estacional</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tree Selection */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-sage-900 text-center mb-12">
            Elige tu tipo de árbol
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Almond Tree Card */}
            <div className="group glass-card p-6 sm:p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-6xl sm:text-7xl mb-4">🌸</div>
                
                <h3 className="text-2xl sm:text-3xl font-serif text-sage-900 mb-2">
                  Almendro
                </h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-sage-700">96€</span>
                  <span className="text-sage-600">/año</span>
                </div>
                
                <p className="text-sage-600 mb-6 leading-relaxed text-sm sm:text-base">
                  Los almendros florecen en primavera con hermosas flores rosadas. 
                  Perfectos para quienes aman la belleza natural y quieren apoyar 
                  la agricultura regenerativa mediterránea.
                </p>
                
                <ul className="space-y-3 mb-8 text-sm sm:text-base">
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Flores espectaculares en primavera</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Almendras frescas en otoño</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Informe de progreso anual</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Giftbox con productos de la finca</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleAdopt('almond')}
                  disabled={loadingType !== null}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-full hover:shadow-xl transition-all font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingType === 'almond' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    'Adoptar un almendro'
                  )}
                </button>
              </div>
            </div>

            {/* Olive Tree Card */}
            <div className="group glass-card p-6 sm:p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-6xl sm:text-7xl mb-4">🫒</div>
                
                <h3 className="text-2xl sm:text-3xl font-serif text-sage-900 mb-2">
                  Olivo
                </h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-sage-700">125€</span>
                  <span className="text-sage-600">/año</span>
                </div>
                
                <p className="text-sage-600 mb-6 leading-relaxed text-sm sm:text-base">
                  Los olivos son símbolos milenarios de paz y longevidad. 
                  Ideales para quienes valoran la tradición mediterránea y 
                  quieren contribuir a la producción de aceite de oliva de calidad.
                </p>
                
                <ul className="space-y-3 mb-8 text-sm sm:text-base">
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Símbolo de paz milenario</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Aceite de oliva premium</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Informe de progreso anual</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Giftbox con productos de la finca</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleAdopt('olive')}
                  disabled={loadingType !== null}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-full hover:shadow-xl transition-all font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingType === 'olive' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    'Adoptar un olivo'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-sage-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Procesado por Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">500+ adoptantes felices</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
