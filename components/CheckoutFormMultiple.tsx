'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAdoptionCart, CartTree } from '@/contexts/AdoptionCart'

interface CheckoutFormProps {
  tree?: {
    id: string
    name: string
    type: string
    status: string
  }
}

export default function CheckoutForm({ tree }: CheckoutFormProps) {
  const router = useRouter()
  const { trees, removeTree, updateTreeCustomName, getTotalPrice, clearCart } = useAdoptionCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customNames, setCustomNames] = useState<{ [key: string]: string }>({})
  const [almondPrice, setAlmondPrice] = useState<number>(20000)
  const [olivePrice, setOlivePrice] = useState<number>(20000)
  
  const [formData, setFormData] = useState({
    adopterName: '',
    adopterEmail: '',
    isGift: false,
    giftMessage: '',
  })

  const totalTrees = trees.length
  
  // Calcular total con precios dinámicos
  const dynamicTotal = trees.reduce((sum, tree) => {
    const price = tree.type === 'almendro' ? almondPrice : olivePrice
    return sum + price
  }, 0)
  const priceInEuros = dynamicTotal / 100
  
  // Obtener precio por árbol (promedio si hay de ambos tipos)
  const almondTreesCount = trees.filter(t => t.type === 'almendro').length
  const oliveTreesCount = trees.filter(t => t.type === 'olivo').length
  const displayPrice = almondTreesCount > 0 && oliveTreesCount === 0 ? almondPrice : oliveTreesCount > 0 && almondTreesCount === 0 ? olivePrice : almondPrice // Mostrar el precio que corresponda
  
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
    
    // Obtener precios cada 5 segundos para actualizarlos en tiempo real
    const interval = setInterval(fetchPrices, 5000)
    return () => clearInterval(interval)
  }, [])

  // Pre-rellenar datos del usuario autenticado
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setFormData({
          adopterName: user.user_metadata?.name || user.email?.split('@')[0] || '',
          adopterEmail: user.email || '',
          isGift: false,
          giftMessage: '',
        })
      }
    }

    loadUserData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('You must log in to continue')
        setLoading(false)
        return
      }

      // Actualizar nombres personalizados
      Object.entries(customNames).forEach(([treeId, name]) => {
        if (name) updateTreeCustomName(treeId, name)
      })

      const payload = {
        adopterName: formData.adopterName || (user?.user_metadata?.name as string) || (user?.email?.split('@')[0] || ''),
        adopterEmail: user?.email || '',
        trees: trees.map(t => ({
          id: t.id,
          name: customNames[t.id] || t.customName || t.name,
          type: t.type,
          price: t.type === 'almendro' ? almondPrice / 100 : olivePrice / 100, // Usar precio dinámico
        })),
        isGift: formData.isGift,
        giftMessage: formData.giftMessage,
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userName: payload.adopterName,
          userEmail: payload.adopterEmail,
          trees: payload.trees,
          isGift: payload.isGift,
          giftMessage: payload.giftMessage,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      if (data.url) {
        // Limpiar carrito al ir a pagar
        clearCart()
        window.location.href = data.url
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (totalTrees === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <a href="/adopt/map" className="text-sage-600 hover:text-sage-700 font-semibold">
          ← Back to select trees
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tree Summary */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Selected Trees ({totalTrees})</h3>
        <div className="space-y-3">
          {trees.map((tree) => (
            <div key={tree.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Tree #{tree.id}</p>
                  <input
                    type="text"
                    placeholder={`Name for ${tree.name}...`}
                    value={customNames[tree.id] || ''}
                    onChange={(e) => setCustomNames({ ...customNames, [tree.id]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>
              <div className="text-right ml-4">
                  <p className="font-semibold text-gray-800">€{(tree.type === 'almendro' ? almondPrice : olivePrice) / 100}</p>
                  <button
                    type="button"
                    onClick={() => removeTree(tree.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                {tree.species} • Zone: {tree.area} • Year: {String(tree.year || 0).padStart(4, '0')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-6">
        <div className="bg-sage-50 p-4 rounded-lg">
          <div className="flex justify-between font-bold text-sage-700 text-lg">
            <span>Total ({totalTrees} tree{totalTrees > 1 ? 's' : ''}):</span>
            <span>€{priceInEuros}</span>
          </div>
        </div>
      </div>

      {/* Owner Info */}
      <div>
        <label htmlFor="adopterName" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="adopterName"
          required
          value={formData.adopterName}
          onChange={(e) => setFormData({ ...formData, adopterName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="adopterEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Your Email *
        </label>
        <input
          type="email"
          id="adopterEmail"
          required
          value={formData.adopterEmail}
          onChange={(e) => setFormData({ ...formData, adopterEmail: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
        />
      </div>

      {/* Gift Option */}
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isGift}
          onChange={(e) => setFormData({ ...formData, isGift: e.target.checked })}
          className="w-5 h-5 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
        />
        <span className="text-gray-700">
          This is a gift
        </span>
      </label>

      {formData.isGift && (
        <div className="mt-4">
          <label htmlFor="giftMessage" className="block text-sm font-medium text-gray-700 mb-2">
            Gift Message
          </label>
          <textarea
            id="giftMessage"
            value={formData.giftMessage}
            onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="Write a personal message..."
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-sage-600 to-sage-700 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Continue to Payment → €${priceInEuros}`}
      </button>

      <div className="text-center space-y-2">
        <p className="text-xs text-gray-500">
          🔒 100% secure payment by Stripe
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span>✓ Protected data</span>
          <span>•</span>
          <span>✓ SSL encrypted</span>
        </div>
      </div>
    </form>
  )
}
