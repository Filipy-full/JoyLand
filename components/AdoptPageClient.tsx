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
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const router = typeof window !== 'undefined' ? require('next/router').useRouter() : null;
  const supabase = require('@/lib/supabase').supabase;

  const handleTreeSelect = async (tree: import('./TreeMapLeafletClient').Tree) => {
    const original = trees.find(t => t.id === tree.id);
    if (original && original.status === 'available') {
      // Check session before allowing adoption
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login with returnUrl
        if (router) {
          router.push(`/login?returnUrl=/adopt/${original.id}`);
        } else {
          window.location.href = `/login?returnUrl=/adopt/${original.id}`;
        }
        return;
      }
      setSelectedTree(original);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-serif text-gray-800 mb-4 text-center">
          Choose Your Tree Now
        </h1>
        <p className="text-xl text-amber-600 font-semibold mb-2 text-center">
          ⚡ Only 15 trees available
        </p>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Select your tree on the map and complete your adoption in 3 minutes.
          <span className="text-sage-600 font-semibold">100% Satisfaction Guarantee</span>
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <TreeMap
              trees={trees.map(tree => ({
                id: tree.id,
                name: tree.name ?? undefined,
                latitude: tree.latitude ?? 0,
                longitude: tree.longitude ?? 0,
                type: tree.type,
                status: tree.status,
              }))}
              onTreeSelect={handleTreeSelect}
            />
            
            <div className="mt-6 flex items-center gap-6 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Adopted</span>
              </div>
            </div>
          </div>

          {/* Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
              {selectedTree ? (
                <>
                  <h2 className="text-2xl font-serif mb-4 text-gray-800">
                    🎉 Perfect!
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-sm text-gray-500">Package:</span>
                      <p className="text-lg font-medium">
                        {selectedTree.type === 'olive' ? '🫒 Premium Olive' : '🌸 Spring Almond'}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Investment:</span>
                      <p className="text-3xl font-bold text-sage-700">
                        €{selectedTree.type === 'olive' ? '175' : '125'}
                      </p>
                      <p className="text-xs text-gray-500 line-through">Value: €{selectedTree.type === 'olive' ? '290' : '240'}</p>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <p className="text-sm text-amber-800 font-semibold">
                        ⚡ Only {selectedTree.type === 'olive' ? '8' : '7'} {selectedTree.type === 'olive' ? 'olive trees' : 'almond trees'} left
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/adopt/${selectedTree.id}`}
                    className="block w-full bg-gradient-to-r from-sage-600 to-sage-700 text-white text-center px-6 py-4 rounded-full hover:shadow-xl transition-all font-bold text-lg"
                  >
                    ADOPT NOW →
                  </Link>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    ✓ 100% secure payment · ✓ Satisfaction guaranteed
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h3 className="text-lg font-serif mb-2 text-gray-800">
                    Select a tree
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click on a green marker on the map to see details
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-gradient-to-br from-sage-50 to-sage-100 p-6 rounded-lg border border-sage-200">
              <h3 className="font-serif text-lg mb-3 flex items-center">
                <span className="text-2xl mr-2">🎁</span>
                Premium Package Included
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2 font-bold">✓</span>
                  <span><strong>Exclusive GPS access</strong> (value €50)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2 font-bold">✓</span>
                  <span><strong>VIP private gallery</strong> (value €120)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2 font-bold">✓</span>
                  <span><strong>Premium gourmet pack</strong> (value €80)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sage-600 mr-2 font-bold">✓</span>
                  <span><strong>Impact certificate</strong> (value €40)</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-sage-200">
                <p className="text-xs text-gray-600"><strong>Total value:</strong> €290 → <span className="text-sage-700 font-bold text-lg">Only €125-175</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Trees Grid */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif text-gray-800 mb-8">
            All Trees
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
                      latitude: tree.latitude ?? 0,
                      longitude: tree.longitude ?? 0,
                      type: tree.type,
                      status: tree.status,
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
                    {tree.status === 'available' ? 'Available' : 'Adopted'}
                  </span>
                </div>
                <p className="font-medium text-sm">
                  {tree.name || `Tree #${tree.id.slice(0, 8)}`}
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
