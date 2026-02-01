'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const InteractiveGeoJsonMap = dynamic(() => import('@/components/InteractiveGeoJsonMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header - Hidden on Mobile */}
      <div className="hidden sm:block bg-white border-b border-gray-200 shadow-md flex-shrink-0 relative z-50">
        <div className="max-w-full px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">🗺️ Mapa Interativo de Árvores</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Toca o clica en un árbol para ver detalles</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden w-full">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mb-2"></div>
                <p className="text-sm text-gray-600">Carregando mapa...</p>
              </div>
            </div>
          }
        >
          <InteractiveGeoJsonMap />
        </Suspense>
      </div>
    </div>
  )
}
