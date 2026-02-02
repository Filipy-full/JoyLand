'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdoptionCart } from '@/contexts/AdoptionCart'

interface TreeData {
  id: string
  name: string
  species: string
  year: number
  area: string
  price: number
  status: 'available' | 'adopted' | 'reserved'
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { addTree, getTreeCount } = useAdoptionCart()
  const treeId = params.id as string
  const [tree, setTree] = useState<TreeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/geojson-map.json').then((res) => res.json()),
      fetch(`/api/trees?id=${treeId}`).then((res) => res.json()),
    ])
      .then(([data, dbData]) => {
        const feature = data.features.find(
          (f: any) => f.id === treeId && f.properties.type === 'tree'
        )

        if (feature) {
          const status = dbData?.tree?.status || 'available'
          const treeData: TreeData = {
            id: feature.id,
            name: dbData?.tree?.name || feature.properties.name,
            species: feature.properties.species,
            year: feature.properties.year,
            area: feature.properties.area,
            price: 200, // €2 en centavos
            status,
          }
          setTree(treeData)
        }
        setLoading(false)
      })
  }, [treeId])

  const handleAddToCart = () => {
    if (!tree) return
    
    setAdding(true)
    try {
      addTree({
        id: tree.id,
        name: tree.name,
        species: tree.species,
        type: tree.species === 'Oliveira' ? 'olivo' : 'almendro',
        price: tree.price,
        area: tree.area,
        year: tree.year,
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    } catch (err) {
      console.error('Error adding tree:', err)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-amber-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!tree) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-amber-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-serif text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">Tree not found</p>
          <Link href="/adopt/map">
            <button className="bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2 px-6 rounded-lg transition">
              Back to Map
            </button>
          </Link>
        </div>
      </div>
    )
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
          {/* Left Column - Tree Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Selected Tree</h3>

              <div
                className="h-28 rounded-lg mb-4 flex items-end justify-center text-white font-bold text-xl"
                style={{
                  background: `linear-gradient(135deg, ${tree.species === 'Oliveira' ? '#1976d2' : '#d32f2f'} 0%, ${tree.species === 'Oliveira' ? '#0d47a1' : '#b71c1c'} 100%)`,
                }}
              >
                Árvore #{tree.name}
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Espécie:</span>
                  <span className="font-semibold text-gray-800">{tree.species}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zona:</span>
                  <span className="font-semibold text-gray-800">{tree.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ano:</span>
                  <span className="font-semibold text-gray-800">{tree.year}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Preço:</span>
                  <span>€{tree.price}</span>
                </div>
                <div className="bg-sage-50 p-3 rounded-lg">
                  <div className="flex justify-between font-bold text-sage-700">
                    <span>Total:</span>
                    <span>€{tree.price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                <p className="font-semibold mb-2">✅ Incluido:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Certificado</li>
                  <li>Seguimiento</li>
                  <li>Impacto</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Botones */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Cabeçalho */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Agregar al Carrito</h2>
                <p className="text-gray-600">Añade este árbol a tu carrito y continúa explorando</p>
              </div>

              {tree.status !== 'available' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-900">
                  <p className="font-semibold mb-2">⚠️ Árbol no disponible</p>
                  <p className="text-sm mb-4">Esta árvore ya ha sido adoptada. Por favor selecciona otra.</p>
                  <Link href="/adopt/map">
                    <button className="bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                      ← Volver al Mapa
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Info Box */}
                  <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                    <div className="text-sm text-green-900">
                      <p className="font-semibold mb-1">Este árbol está disponible</p>
                      <p>Puedes agregarlo a tu carrito y seguir seleccionando más árboles.</p>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="space-y-3 mb-8">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="w-full bg-sage-600 hover:bg-sage-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition text-lg"
                    >
                      {adding ? 'Agregando...' : `✅ Agregar al Carrito - €2`}
                    </button>

                    {getTreeCount() > 0 && (
                      <Link href="/adopt/checkout" className="block">
                        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition text-lg">
                          🛒 Ir al Carrito ({getTreeCount()})
                        </button>
                      </Link>
                    )}
                  </div>

                  {added && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                      <p className="font-semibold">✓ Árbol agregado al carrito</p>
                      <p className="text-sm">Puedes continuar agregando más árboles o ir al carrito.</p>
                    </div>
                  )}

                  <Link href="/adopt/map">
                    <button className="w-full text-sage-600 hover:text-sage-700 font-semibold py-2 border border-sage-200 rounded-lg transition">
                      ← Volver al Mapa
                    </button>
                  </Link>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
