import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TreeMap from '@/components/TreeMap'

export const dynamic = 'force-dynamic'

export default async function TreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const tree = await prisma.tree.findUnique({
    where: { id },
    include: {
      adoptions: {
        include: {
          user: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      },
    },
  })

  if (!tree) {
    notFound()
  }

  // Parse images and videos from JSON strings
  const images = tree.images ? JSON.parse(tree.images) : []
  const videos = tree.videos ? JSON.parse(tree.videos) : []

  const currentAdoption = tree.adoptions.find(
    (adoption: any) => new Date(adoption.endDate) > new Date()
  )

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/adopt"
            className="text-sage-600 hover:text-sage-700 mb-4 inline-block"
          >
            ← Volver al mapa
          </Link>
          
          <h1 className="text-5xl font-serif text-gray-800 mb-4">
            {tree.name || `Árbol #${tree.id.slice(0, 8)}`}
          </h1>
          
          <div className="flex items-center gap-4 text-gray-600">
            <span className="text-2xl">
              {tree.type === 'olive' ? '🫒' : '🌸'}
            </span>
            <span className="text-lg">
              {tree.type === 'olive' ? 'Olivo' : 'Almendro'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              tree.status === 'available'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {tree.status === 'available' ? 'Disponible para adopción' : 'Adoptado'}
            </span>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif mb-4 text-gray-800">
            Ubicación en el mapa
          </h2>
          <TreeMap trees={[tree]} />
        </div>

        {/* Description */}
        {tree.description && (
          <div className="mb-12 bg-sage-50 p-8 rounded-lg">
            <h2 className="text-2xl font-serif mb-4 text-gray-800">
              Sobre este árbol
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {tree.description}
            </p>
          </div>
        )}

        {/* Photos & Videos */}
        {(images.length > 0 || videos.length > 0) && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-6 text-gray-800">
              Galería
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image: string, index: number) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${tree.name || 'Árbol'} - foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              {videos.map((video: string, index: number) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <video
                    src={video}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yearly Report */}
        {tree.yearlyReport && (
          <div className="mb-12 bg-white border border-gray-200 p-8 rounded-lg">
            <h2 className="text-2xl font-serif mb-4 text-gray-800">
              Informe Anual
            </h2>
            <div className="prose max-w-none text-gray-700">
              <p className="whitespace-pre-line">{tree.yearlyReport}</p>
            </div>
          </div>
        )}

        {/* Adoption History */}
        {tree.adoptions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-6 text-gray-800">
              Historia de adopciones
            </h2>
            
            <div className="space-y-4">
              {tree.adoptions.map((adoption) => {
                const isActive = new Date(adoption.endDate) > new Date()
                return (
                  <div
                    key={adoption.id}
                    className={`p-6 rounded-lg border ${
                      isActive
                        ? 'border-sage-300 bg-sage-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {adoption.user.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(adoption.startDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}{' '}
                          -{' '}
                          {new Date(adoption.endDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {adoption.giftMessage && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            "{adoption.giftMessage}"
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <span className="px-3 py-1 bg-sage-600 text-white text-xs rounded-full">
                          Activo
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        {tree.status === 'available' && (
          <div className="bg-sage-100 p-8 rounded-lg text-center">
            <h2 className="text-3xl font-serif mb-4 text-gray-800">
              ¿Te gusta este árbol?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Adóptalo por un año y forma parte de su historia
            </p>
            <Link
              href={`/adopt/${tree.id}/checkout`}
              className="inline-block bg-sage-600 text-white px-10 py-4 rounded-full hover:bg-sage-700 transition-all transform hover:scale-105 text-lg font-medium"
            >
              Adoptar este {tree.type === 'olive' ? 'olivo' : 'almendro'} - €{tree.type === 'olive' ? '120' : '100'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
