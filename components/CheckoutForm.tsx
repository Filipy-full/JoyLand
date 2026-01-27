import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Tree {
  id: string
  name: string | null
  type: string
  status: string
}

interface CheckoutFormProps {
  tree: Tree
}

export default function CheckoutForm({ tree }: CheckoutFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    adopterName: '',
    adopterEmail: '',
    treeName: '',
    giftMessage: '',
    isGift: false,
  })

  const price = tree.type === 'olive' ? 12000 : 10000 // Stripe uses cents

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          treeId: tree.id,
          ...formData,
          price,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError('Algo salió mal. Por favor, inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Adopter Info */}
      <div>
        <label htmlFor="adopterName" className="block text-sm font-medium text-gray-700 mb-2">
          Tu nombre *
        </label>
        <input
          type="text"
          id="adopterName"
          required
          value={formData.adopterName}
          onChange={(e) => setFormData({ ...formData, adopterName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Juan García"
        />
      </div>

      <div>
        <label htmlFor="adopterEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Tu email *
        </label>
        <input
          type="email"
          id="adopterEmail"
          required
          value={formData.adopterEmail}
          onChange={(e) => setFormData({ ...formData, adopterEmail: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="treeName" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre para tu árbol (opcional)
        </label>
        <input
          type="text"
          id="treeName"
          value={formData.treeName}
          onChange={(e) => setFormData({ ...formData, treeName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Dale un nombre especial a tu árbol"
        />
      </div>

      {/* Gift Option */}
      <div className="border-t pt-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isGift}
            onChange={(e) => setFormData({ ...formData, isGift: e.target.checked })}
            className="w-5 h-5 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
          />
          <span className="text-gray-700">
            Esto es un regalo
          </span>
        </label>

        {formData.isGift && (
          <div className="mt-4">
            <label htmlFor="giftMessage" className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje de regalo
            </label>
            <textarea
              id="giftMessage"
              value={formData.giftMessage}
              onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder="Escribe un mensaje personal para el destinatario..."
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-5 rounded-full hover:shadow-2xl transition-all font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {loading ? 'Procesando...' : `🔒 PAGAR €${price / 100} - ADOPTAR AHORA`}
      </button>

      <div className="text-center space-y-2">
        <p className="text-xs text-gray-500">
          Pago 100% seguro con cifrado SSL
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>✓ Garantía de satisfacción</span>
          <span>✓ Envío gratis</span>
          <span>✓ Soporte 24/7</span>
        </div>
      </div>
    </form>
  )
}
