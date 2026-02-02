'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { TreeIcon } from '@/components/Icons'

const InteractiveGeoJsonMap = dynamic(() => import('@/components/InteractiveGeoJsonMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center bg-gradient-to-br from-sage-50 to-sage-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
        <p className="text-sage-700 font-medium">Loading map...</p>
      </div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-sage-100 rounded-full">
            <TreeIcon className="w-5 h-5 text-sage-700" />
            <span className="text-sage-700 font-medium text-sm">Interactive Map</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-sage-900 mb-4 leading-tight">
            Explore our trees
          </h1>
          <p className="text-base sm:text-lg text-sage-600 max-w-2xl mx-auto leading-relaxed">
            Click on a tree to see its details and adopt it
          </p>
        </div>
      </section>

      {/* Map Container */}
      <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
          <div className="h-[500px] sm:h-[600px] lg:h-[700px] w-full">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-50 to-sage-100">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mb-2"></div>
                    <p className="text-sm text-sage-700">Loading map...</p>
                  </div>
                </div>
              }
            >
              <InteractiveGeoJsonMap />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-6 sm:p-8 rounded-3xl">
            <h2 className="text-2xl sm:text-3xl font-serif text-sage-900 mb-4 text-center">
              How to use the map
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-sage-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🔍</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Explore</h3>
                  <p className="text-sm">Use filters to find your perfect tree</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">👆</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Select</h3>
                  <p className="text-sm">Click on a tree to see its details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🌳</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adopt</h3>
                  <p className="text-sm">Add your favorites to the cart</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-sm">All trees are located at Joyland, Spain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
