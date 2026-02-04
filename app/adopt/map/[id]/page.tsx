'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface TreeDetails {
  id: string
  name: string
  species: string
  year: number
  area: string
  latitude: number
  longitude: number
  adopted: boolean
  adoptionDate?: string
  price: number
}

export default function TreeDetailPage() {
  const params = useParams()
  const treeId = params.id as string
  const [tree, setTree] = useState<TreeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/geojson-map.json').then((res) => res.json()),
      fetch(`/api/trees?id=${treeId}`).then((res) => res.json()),
    ])
      .then(([data, dbData]) => {
        const feature = data.features.find(
          (f: any) => f.id === treeId && f.properties.type === 'tree'
        )

        if (!feature) {
          setError('Tree not found')
          setLoading(false)
          return
        }

        const coords = feature.geometry.coordinates
        const status = dbData?.tree?.status
        const adopted = status ? status !== 'available' : (feature.properties.adopted || false)

        const treeData: TreeDetails = {
          id: feature.id,
          name: dbData?.tree?.name || feature.properties.name,
          species: feature.properties.species,
          year: feature.properties.year,
          area: feature.properties.area,
          latitude: coords[1],
          longitude: coords[0],
          adopted,
          price: feature.properties.species === 'Oliveira' ? 2 : 2,
        }

        setTree(treeData)
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to load tree data')
        console.error(err)
        setLoading(false)
      })
  }, [treeId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-amber-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
          <p className="text-gray-600">Carregando dados da árvore...</p>
        </div>
      </div>
    )
  }

  if (error || !tree) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-amber-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-serif text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Tree not found'}</p>
          <Link href="/adopt/map">
            <button className="bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2 px-6 rounded-lg transition">
              Back to map
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <Link href="/adopt/map">
          <button className="mb-6 flex items-center gap-2 text-sage-600 hover:text-sage-700 font-semibold transition">
            ← Back to map
          </button>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header da Árvore */}
          <div
            className="h-48 bg-gradient-to-r from-sage-600 to-amber-600 p-8 text-white flex items-end"
            style={{
              backgroundImage: `linear-gradient(135deg, ${tree.species === 'Oliveira' ? '#1976d2' : '#d32f2f'} 0%, ${tree.species === 'Oliveira' ? '#0d47a1' : '#b71c1c'} 100%)`,
            }}
          >
            <div>
              <h1 className="text-5xl font-serif mb-2">Árvore #{tree.name}</h1>
              <p className="text-lg opacity-90">{tree.species}</p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            {tree.adopted ? (
              // Status Adoptada
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-2">🌳 Já foi adotada!</h2>
                <p className="text-amber-800">
                  Esta árvore já tem um proprietário. Veja as informações públicas abaixo.
                </p>
              </div>
            ) : (
              // Status Disponível
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-green-900 mb-2">✨ Disponível para Adoção</h2>
                <p className="text-green-800">
                  Você pode adotar esta árvore e fazer parte do nosso impacto ambiental!
                </p>
              </div>
            )}

            {/* Informações da Árvore */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Informações Gerais</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Espécie:</span>
                    <span className="font-semibold text-gray-800">{tree.species}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Ano de Plantio:</span>
                    <span className="font-semibold text-gray-800">{tree.year}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Zona:</span>
                    <span className="font-semibold text-gray-800">{tree.area}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-semibold px-3 py-1 rounded-full text-white ${
                        tree.adopted ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                    >
                      {tree.adopted ? 'Adotada' : 'Disponível'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Localização</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Coordenadas GPS:</p>
                  <p className="font-mono text-sm text-gray-800">
                    {tree.latitude.toFixed(6)}
                    <br />
                    {tree.longitude.toFixed(6)}
                  </p>
                </div>

                {!tree.adopted && (
                  <div className="bg-sage-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Preço de Adoção:</p>
                    <p className="text-3xl font-bold text-sage-700">€{tree.price}</p>
                    <p className="text-xs text-gray-500 mt-1">Inclui certificado digital</p>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Sobre esta Árvore</h3>
              <p className="text-gray-700 leading-relaxed">
                Esta {tree.species === 'Oliveira' ? 'oliveira' : 'amendoeira'} foi plantada em {tree.year} na zona {tree.area} da
                propriedade. Está localizada nas coordenadas{' '}
                <code className="bg-white px-2 py-1 rounded text-sm">
                  ({tree.latitude.toFixed(4)}, {tree.longitude.toFixed(4)})
                </code>
                . A árvore integra nosso programa de reflorestamento sustentável.
              </p>
            </div>

            {/* CTA */}
            {!tree.adopted && (
              <div className="flex gap-4">
                <Link href={`/adopt/map/${tree.id}/checkout`} className="flex-1">
                  <button className="w-full bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white font-bold py-4 rounded-lg transition duration-200 text-lg">
                    🌱 Adotar Esta Árvore
                  </button>
                </Link>
                <Link href="/adopt/map">
                  <button className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition">
                    Ver Outras
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
