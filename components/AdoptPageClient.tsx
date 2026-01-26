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

  const handleTreeSelect = (tree: Tree) => {
    if (tree.status === 'available') {
      setSelectedTree(tree)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-serif text-gray-800 mb-4 text-center">
          Elige tu árbol
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Explora el mapa y selecciona el árbol que quieres adoptar. 
          Los marcadores verdes están disponibles, los rojos ya han sido adoptados.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <TreeMap trees={trees} onTreeSelect={handleTreeSelect} />
            
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
                    Árbol seleccionado
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-sm text-gray-500">Tipo:</span>
                      <p className="text-lg font-medium">
                        {selectedTree.type === 'olive' ? '🫒 Olivo' : '🌸 Almendro'}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Precio:</span>
                      <p className="text-2xl font-serif text-sage-700">
                        €{selectedTree.type === 'olive' ? '120' : '100'} / año
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Coordenadas:</span>
                      <p className="text-sm font-mono">
                        {selectedTree.latitude.toFixed(6)}, {selectedTree.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/adopt/${selectedTree.id}`}
                    className="block w-full bg-sage-600 text-white text-center px-6 py-3 rounded-full hover:bg-sage-700 transition-colors font-medium"
                  >
                    Continuar con la adopción
                  </Link>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Podrás nombrar tu árbol y completar el pago en el siguiente paso
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
            <div className="mt-6 bg-sage-50 p-6 rounded-lg border border-sage-100">
              <h3 className="font-serif text-lg mb-3">Qué incluye</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Adopción por 1 año</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Página privada del árbol</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Fotos y vídeos regulares</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Informe anual</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Giftbox de temporada</span>
                </li>
              </ul>
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
                onClick={() => tree.status === 'available' && handleTreeSelect(tree)}
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
