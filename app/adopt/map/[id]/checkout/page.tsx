'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import CheckoutForm from '@/components/CheckoutForm'

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
  const treeId = params.id as string
  const [tree, setTree] = useState<TreeData | null>(null)
  const [loading, setLoading] = useState(true)

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
            price: feature.properties.species === 'Oliveira' ? 2 : 2,
            status,
          }
          setTree(treeData)
        }
        setLoading(false)
      })
  }, [treeId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-amber-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!tree) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-amber-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-serif text-red-600 mb-4">Erro</h1>
          <p className="text-gray-600 mb-6">Árvore não encontrada</p>
          <Link href="/adopt/map">
            <button className="bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2 px-6 rounded-lg transition">
              Voltar ao Mapa
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/adopt/map" className="text-sage-600 hover:text-sage-700">
            Mapa
          </Link>
          {' / '}
          <Link href={`/adopt/map/${tree.id}`} className="text-sage-600 hover:text-sage-700">
            Árvore #{tree.name}
          </Link>
          {' / '}
          <span>Finalizar Adoção</span>
        </nav>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Resumo */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumo</h2>

              <div
                className="h-32 rounded-lg mb-6 flex items-end justify-center text-white font-bold text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${tree.species === 'Oliveira' ? '#1976d2' : '#d32f2f'} 0%, ${tree.species === 'Oliveira' ? '#0d47a1' : '#b71c1c'} 100%)`,
                }}
              >
                Árvore #{tree.name}
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
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

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Preço da Adoção:</span>
                  <span>€{tree.price}</span>
                </div>
                <div className="bg-sage-50 p-3 rounded-lg">
                  <div className="flex justify-between font-bold text-sage-700">
                    <span>Total:</span>
                    <span>€{tree.price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">✅ Incluso na Adoção:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Certificado Digital</li>
                  <li>Relatórios Anuais</li>
                  <li>Acesso ao Mapa</li>
                  <li>Impacto Ambiental</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Formulário */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Finalizar Adoção</h2>

              <div className="mb-8 p-6 bg-sage-50 rounded-lg">
                <p className="text-sage-800 mb-2">
                  <strong>🎉 Bem-vindo!</strong>
                </p>
                <p className="text-sm text-sage-700">
                  Complete os dados abaixo para finalizar a adoção. Você receberá o certificado digital por email.
                </p>
              </div>

              {tree.status !== 'available' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900">
                  <p className="font-semibold">⚠️ Esta árvore já foi adotada.</p>
                  <p className="text-sm">Escolha outra árvore disponível no mapa.</p>
                  <div className="mt-4">
                    <Link href="/adopt/map">
                      <button className="bg-sage-600 hover:bg-sage-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                        Ver Árvores Disponíveis
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <CheckoutForm
                  tree={{
                    id: tree.id,
                    name: tree.name,
                    type: tree.species === 'Oliveira' ? 'olive' : 'almond',
                    status: 'available',
                  }}
                />
              )}

              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
                <p className="font-semibold mb-2">🔒 Pagamento Seguro</p>
                <p>
                  Usamos Stripe para processar pagamentos de forma segura. Seus dados não são armazenados em nossos
                  servidores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
