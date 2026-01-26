import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import CheckoutForm from '@/components/CheckoutForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const tree = await prisma.tree.findUnique({
    where: { id },
  })

  if (!tree) {
    notFound()
  }

  // Redirect if tree is already adopted
  if (tree.status !== 'available') {
    redirect(`/tree/${tree.id}`)
  }

  const price = tree.type === 'olive' ? 120 : 100

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/tree/${tree.id}`}
          className="text-sage-600 hover:text-sage-700 mb-4 inline-block"
        >
          ← Volver
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Tree Info */}
          <div>
            <h1 className="text-4xl font-serif text-gray-800 mb-6">
              Adoptar árbol
            </h1>

            <div className="bg-gradient-to-br from-sage-50 to-sage-100 p-6 rounded-lg mb-6 border-2 border-sage-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">
                  {tree.type === 'olive' ? '🫒' : '🌸'}
                </span>
                <div>
                  <h2 className="text-xl font-serif text-gray-800">
                    {tree.type === 'olive' ? '🏆 Paquete Olivo Premium' : '🌟 Paquete Almendro Primavera'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {tree.name || `Árbol #${tree.id.slice(0, 8)}`}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4">
                <p className="text-sm text-amber-800 font-semibold text-center">
                  ⚡ Solo quedan {tree.type === 'olive' ? '8' : '7'} disponibles
                </p>
              </div>

              <div className="border-t border-sage-200 pt-4">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600">Paquete Premium (12 meses)</span>
                  <span className="font-medium">€{price}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm text-green-600">
                  <span>Envío</span>
                  <span className="font-semibold">GRATIS</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 line-through mb-2">
                  <span>Valor real</span>
                  <span>€{tree.type === 'olive' ? '290' : '240'}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-sage-700 pt-2 border-t-2 border-sage-300">
                  <span>Total hoy</span>
                  <span>€{price}</span>
                </div>
                <p className="text-xs text-center text-green-600 font-semibold mt-2">
                  Ahorras €{tree.type === 'olive' ? '170' : '140'}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-serif text-lg mb-4">Qué incluye tu adopción</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2">✓</span>
                  <span>Acceso a la página privada del árbol</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2">✓</span>
                  <span>Ubicación exacta en el mapa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2">✓</span>
                  <span>Fotos y vídeos actualizados durante el año</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2">✓</span>
                  <span>Informe anual sobre el árbol y la tierra</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2">✓</span>
                  <span>Giftbox de temporada con productos de la tierra</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2">✓</span>
                  <span>Apoyo a prácticas regenerativas</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div>
            <div className="bg-white border border-gray-200 p-8 rounded-lg sticky top-24">
              <h2 className="text-2xl font-serif mb-6 text-gray-800">
                Completa tu adopción
              </h2>
              
              <CheckoutForm tree={tree} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
