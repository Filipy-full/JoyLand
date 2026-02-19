'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAdoptionCart } from '@/contexts/AdoptionCart'
import CheckoutFormMultiple from '@/components/CheckoutFormMultiple'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { trees, getTotalPrice, getTreeCount } = useAdoptionCart()
  const [almondPrice, setAlmondPrice] = useState<number>(20000)
  const [olivePrice, setOlivePrice] = useState<number>(20000)
  const totalPrice = getTotalPrice()
  const totalTrees = getTreeCount()
  
  // Calcular total dinámico
  const dynamicTotal = trees.reduce((sum, tree) => {
    const price = tree.type === 'almendro' ? almondPrice : olivePrice
    return sum + price
  }, 0)
  const priceInEuros = dynamicTotal / 100
  
  // Precio medio por árbol
  const displayPrice = totalTrees > 0 ? Math.round(dynamicTotal / totalTrees) : 0

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Save cart in localStorage before redirecting
        sessionStorage.setItem('pendingCheckout', 'true')
        // Redirect to login with returnUrl
        router.push('/login?returnUrl=/adopt/checkout')
      } else {
        setIsAuthenticated(true)
        // Clear the flag if the user is already authenticated
        sessionStorage.removeItem('pendingCheckout')
      }
      setIsLoading(false)
    }

    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/admin/pricing')
        if (res.ok) {
          const data = await res.json()
          setAlmondPrice(Math.round(data.almondPrice * 100))
          setOlivePrice(Math.round(data.olivePrice * 100))
        }
      } catch (err) {
        // ...existing code...
      }
    }
    
    checkAuth()
    fetchPrices()
    
    // Obtener precios cada 5 segundos para actualizarlos en tiempo real
    const interval = setInterval(fetchPrices, 5000)
    return () => clearInterval(interval)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Already redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-amber-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Selection</span>
              </div>
              <div className="flex-1 h-1 bg-sage-600 mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Details</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <span className="ml-3 text-sm font-medium text-gray-500">Payment</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">Step 2 of 3: Complete your details</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Summary</h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Trees:</span>
                  <span className="font-semibold text-gray-800">{totalTrees}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per tree:</span>
                  <span className="font-semibold text-gray-800">€{(displayPrice / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="bg-sage-50 p-3 rounded-lg">
                  <div className="flex justify-between font-bold text-sage-700 text-lg">
                    <span>Total:</span>
                    <span>€{priceInEuros}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                <p className="font-semibold mb-2">✅ Included per tree:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Certificate</li>
                  <li>Tracking</li>
                  <li>Giftbox</li>
                </ul>
              </div>

              <Link href="/adopt/map">
                <button className="w-full mt-4 text-sage-600 hover:text-sage-700 font-semibold py-2 border border-sage-200 rounded-lg transition">
                  ← Add more trees
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Details</h2>
                <p className="text-gray-600">Complete the information for {totalTrees} tree{totalTrees > 1 ? 's' : ''}</p>
              </div>

              {/* Info Box */}
              <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <span className="text-blue-600 text-2xl flex-shrink-0">ℹ️</span>
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Next: Secure Payment</p>
                  <p>After completing these details, you will be redirected to Stripe for secure payment.</p>
                </div>
              </div>

              {totalTrees > 0 ? (
                <CheckoutFormMultiple />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Link href="/adopt/map">
                    <button className="bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                      ← Select trees
                    </button>
                  </Link>
                </div>
              )}

              {totalTrees > 0 && (
                <>
                  {/* Footer Info */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">🔒</span>
                    <p>
                      <strong>Guaranteed security:</strong> We use Stripe to process your payment. Your data is not stored on our servers.
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="mt-6 flex justify-between pt-6 border-t border-gray-200">
                    <Link href="/adopt/map">
                      <button className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2">
                        ← Back
                      </button>
                    </Link>
                    <p className="text-xs text-gray-500">Step 2 of 3</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
