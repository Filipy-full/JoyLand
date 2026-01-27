'use client'

import { useState } from 'react'
import TreeMap from '@/components/TreeMap'
import Link from 'next/link'

interface Tree {
  id: string
  name: string | null
  type: string
  latitude: number
  longitude: number
  status: string
}

interface AdoptPageClientProps {
  trees: Tree[]
}

export default function AdoptPageClient({ trees }: AdoptPageClientProps) {
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null)

  const handleTreeSelect = (tree: import('./TreeMapLeafletClient').Tree) => {
    // Se necessário, buscar o objeto original pelo id
    const original = trees.find(t => t.id === tree.id);
    if (original && original.status === 'available') {
      setSelectedTree(original);
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-serif text-gray-800 mb-4 text-center">
          Elige Tu Árbol Ahora
        </h1>
        <p className="text-xl text-amber-600 font-semibold mb-2 text-center">
          ⚡ Solo 15 árboles disponibles
        </p>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Selecciona tu árbol en el mapa y completa tu adopción en 3 minutos. 
          <span className="text-sage-600 font-semibold">Garantía de satisfacción 100%</span>
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <TreeMap
              trees={trees.map(tree => ({
                id: tree.id,
                name: tree.name ?? undefined,
                lat: tree.latitude,
                lng: tree.longitude
              }))}
              onTreeSelect={handleTreeSelect}
            />
            
            <div className="mt-6 flex items-center gap-6 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Adoptado</span>
              </div>
            </div>
          </div>

          {/* Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
              {selectedTree ? (
                <>
                  <h2 className="text-2xl font-serif mb-4 text-gray-800">
                    🎉 ¡Perfecto!
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-sm text-gray-500">Paquete:</span>
                      <p className="text-lg font-medium">
                        {selectedTree.type === 'olive' ? '🫒 Olivo Premium' : '🌸 Almendro Primavera'}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Inversión:</span>
                      <p className="text-3xl font-bold text-sage-700">
                        €{selectedTree.type === 'olive' ? '120' : '100'}
                      </p>
                      <p className="text-xs text-gray-500 line-through">Valor: €{selectedTree.type === 'olive' ? '290' : '240'}</p>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <p className="text-sm text-amber-800 font-semibold">
                        ⚡ Solo quedan {selectedTree.type === 'olive' ? '8' : '7'} {selectedTree.type === 'olive' ? 'olivos' : 'almendros'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/adopt/${selectedTree.id}`}
                    className="block w-full bg-gradient-to-r from-sage-600 to-sage-700 text-white text-center px-6 py-4 rounded-full hover:shadow-xl transition-all font-bold text-lg"
                  >
                    ADOPTAR AHORA →
                  </Link>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    ✓ Pago 100% seguro · ✓ Satisfacción garantizada
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h3 className="text-lg font-serif mb-2 text-gray-800">
                    Selecciona un árbol
                  </h3>
                  <p className="text-sm text-gray-600">
                    Haz clic en un marcador verde del mapa para ver los detalles
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-gradient-to-br from-sage-50 to-sage-100 p-6 rounded-lg border border-sage-200">
              <h3 className="font-serif text-lg mb-3 flex items-center">
                <span className="text-2xl mr-2">🎁</span>
                Paquete Premium Incluido
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2 font-bold">✓</span>
                  <span><strong>Acceso GPS exclusivo</strong> (valor €50)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2 font-bold">✓</span>
                  <span><strong>Galería privada VIP</strong> (valor €120)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2 font-bold">✓</span>
                  <span><strong>Pack gourmet premium</strong> (valor €80)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2 font-bold">✓</span>
                  <span><strong>Certificado de impacto</strong> (valor €40)</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-sage-200">
                <p className="text-xs text-gray-600"><strong>Valor total:</strong> €290 → <span className="text-sage-700 font-bold text-lg">Solo €100-120</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Trees Grid */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif text-gray-800 mb-8">
            Todos los árboles
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trees.map((tree) => (
              <div
                key={tree.id}
                onClick={() => {
                  if (tree.status === 'available') {
                    handleTreeSelect({
                      id: tree.id,
                      name: tree.name ?? undefined,
                      lat: tree.latitude,
                      lng: tree.longitude
                    });
                  }
                }}
                className={`border rounded-lg p-4 ${
                  tree.status === 'available'
                    ? 'border-sage-200 hover:border-sage-400 cursor-pointer'
                    : 'border-gray-200 opacity-60'
                } transition-colors`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">
                    {tree.type === 'olive' ? '🫒' : '🌸'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tree.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {tree.status === 'available' ? 'Disponible' : 'Adoptado'}
                  </span>
                </div>
                <p className="font-medium text-sm">
                  {tree.name || `Árbol #${tree.id.slice(0, 8)}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {tree.type === 'olive' ? 'Olivo' : 'Almendro'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
