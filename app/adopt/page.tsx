'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TreeIcon } from '@/components/Icons'


export default function AdoptPage() {
  const router = useRouter()
  const [loadingType, setLoadingType] = useState<'almond' | 'olive' | null>(null)
  const [treeFilter, setTreeFilter] = useState<'all' | 'almond' | 'olive'>('all')
  const [almondPrice, setAlmondPrice] = useState<number>(20000)
  const [olivePrice, setOlivePrice] = useState<number>(20000)

  // Obtener precios dinámicos
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/admin/pricing')
        if (res.ok) {
          const data = await res.json()
          setAlmondPrice(Math.round(data.almondPrice * 100))
          setOlivePrice(Math.round(data.olivePrice * 100))
        }
      } catch (err) {
        console.error('Error fetching prices:', err)
      }
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAdopt = (treeType: 'almond' | 'olive') => {
    setLoadingType(treeType)
    const filter = treeType === 'almond' ? 'almond' : 'olive'
    router.push(`/adopt/map?filter=${filter}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50 relative">

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16">
        {/* Background decorativo más grande */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-0 top-0 w-screen h-[60vh] sm:h-[90vh] md:h-[120vh] lg:h-[180vh] flex justify-center items-center"
          style={{
            zIndex: 0,
            backgroundImage: 'url(/adopt/flor-adoptar.jpeg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            opacity: 1,
            filter: 'none',
            maxHeight: '100vh'
          }}
        />
        {/* Overlay para mejorar legibilidad */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 w-screen h-[60vh] sm:h-[90vh] md:h-[120vh] lg:h-[180vh]"
          style={{
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.82) 60%, rgba(255,255,255,0.95) 100%)',
            pointerEvents: 'none',
            maxHeight: '100vh'
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-sage-100 rounded-full">
            <span className="text-2xl">🌿</span>
            <span className="text-sage-700 font-medium text-sm">Joyland</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-sage-900 mb-6 leading-tight">
            Adopt a tree at Joyland
          </h1>
          <p className="text-lg sm:text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Choose a tree and accompany it for a full year
          </p>
          {/* Button to view adoption map over the background */}
          <div className="flex justify-center">
            <a
              href="/adopt/map"
              className="bg-sage-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow hover:bg-sage-700 transition-all relative z-20"
              style={{ boxShadow: '0 6px 32px 0 rgba(60, 80, 60, 0.18)' }}
            >
              View adoption map
            </a>
          </div>
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
              What does your adoption include?
            </h2>
            <ul className="text-sage-700 text-base sm:text-lg leading-relaxed mb-6 list-none space-y-2">
              <li>🌱 Joyland membership for 1 year</li>
              <li>💌 Personalized adoption certificate</li>
              <li>🏷 Tag with your chosen name on your tree</li>
              <li>📚 Annual report on your tree and the land</li>
              <li>🎁 Artisanal Joyland giftbox, created with what the land offered that year</li>
              <li>👑 Exclusive opportunities for members throughout the year</li>
            </ul>
            <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 text-sage-800 text-sm mb-4">
              <strong>Note:</strong> The giftbox is the same for both trees, but <b>only olive adoptions</b> include a larger bottle of oil (if there is an oil harvest that year).
            </div>
          </div>
        </div>
      </section>

      {/* Tree Selection */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Almond Tree Card */}
            <div className="group glass-card p-6 sm:p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-7xl sm:text-8xl mb-16">🌸</div>
                
                <h3 className="text-2xl sm:text-3xl font-serif text-sage-900 mb-2">
                  Almond Tree
                </h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-sage-700">€{(almondPrice / 100).toFixed(2)}</span>
                  <span className="text-sage-600">/year</span>
                </div>
                
                <p className="text-sage-600 mb-6 leading-relaxed text-sm sm:text-base">
                  Almond trees bloom in spring with beautiful pink flowers. Perfect for those who love natural beauty and want to support Mediterranean regenerative agriculture.
                </p>
                
                <ul className="space-y-3 mb-8 text-sm sm:text-base">
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Spring beauty and blossoms</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Annual progress report</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Giftbox with products from the land</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Support regenerative agriculture</span>
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
                      <span>Processing...</span>
                    </>
                  ) : (
                    'Adopt an almond tree'
                  )}
                </button>
              </div>
            </div>

            {/* Olive Tree Card */}
            <div className="group glass-card p-6 sm:p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <img src="/rama-oliva.png" alt="Olive Tree" className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-6" />
                
                <h3 className="text-2xl sm:text-3xl font-serif text-sage-900 mb-2">
                  Olive Tree
                </h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-sage-700">€{(olivePrice / 100).toFixed(2)}</span>
                  <span className="text-sage-600">/year</span>
                </div>
                
                <p className="text-sage-600 mb-6 leading-relaxed text-sm sm:text-base">
                  Olive trees are ancient symbols of peace and longevity. Ideal for those who value Mediterranean tradition and want to contribute to quality olive oil production.
                </p>
                
                <ul className="space-y-3 mb-8 text-sm sm:text-base">
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Ancient symbol of peace</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Annual progress report</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Giftbox with products from the land</span>
                  </li>
                  <li className="flex items-start gap-2 text-sage-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Support regenerative agriculture</span>
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
                      <span>Processing...</span>
                    </>
                  ) : (
                    'Adopt an olive tree'
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
              <span className="font-medium">100% secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Processed by Stripe</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
