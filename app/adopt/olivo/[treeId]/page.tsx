"use client";
import { useState, useEffect } from 'react';
import { AdoptionIncludes, PriceCTA, HeroSection } from '@/components/AdoptionUI';
import { notFound, useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAdoptionCart } from '@/contexts/AdoptionCart';
import Link from 'next/link';

export default function OlivoTreePage(props: any) {
  const params = typeof window === 'undefined' ? props.params : useParams();
  const router = useRouter();
  const { addTree, getTreeCount } = useAdoptionCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tree, setTree] = useState<any>(props.tree || null);
  const [olivePrice, setOlivePrice] = useState<number>(20000); // 200 EUR en centavos

  // SSR fallback: fetch tree if not provided
  useEffect(() => {
    if (!tree && params?.treeId) {
      fetch(`/api/trees?id=${params.treeId}`)
        .then(res => res.json())
        .then(data => setTree(data.tree))
        .catch(() => setError('Could not load tree.'));
    }
  }, [params, tree]);

  // Obtener precio dinámico
  useEffect(() => {
    fetch('/api/admin/pricing')
      .then(res => res.json())
      .then(data => {
        setOlivePrice(Math.round(data.olivePrice * 100)); // Convertir a centavos
      })
      .catch(() => setOlivePrice(20000)); // Fallback
  }, []);

  if (!tree) return <div className="text-center py-20">Loading tree...</div>;

  const handleAddToCart = async () => {
    if (tree.status === 'adopted') {
      setError('This tree has already been adopted');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      addTree({
        id: tree.id,
        name: tree.name || 'Olive Tree',
        species: 'Oliveira',
        type: 'olivo',
        price: olivePrice, // Precio en centavos
        area: tree.area || 'Unknown',
        year: tree.year || 0,
      });
      
      setAdded(true);
      setLoading(false);
      
      // Ofrecer opción de continuar agregando o ir a checkout
      setTimeout(() => {
        setAdded(false);
      }, 3000);
    } catch (err) {
      setError('Failed to add tree');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50 pb-20">
      <HeroSection
        title={`Adoptar este Olivo 🫒`}
        subtitle={`Olivo "${tree.name || 'Olive Tree'}" - Sigue el árbol durante un año`}
        backHref="/adopt/olivo"
      />
      <section className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        <h2 className="text-xl font-serif text-sage-900 mb-4">{tree.name || 'Olivo'}</h2>
        <p className="text-sage-700 mb-6 text-base sm:text-lg">{tree.description || 'Olivo robusto y longevo.'}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${tree.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {tree.status === 'available' ? 'Disponible' : 'Adoptado'}
        </span>
      </section>
      <AdoptionIncludes className="my-8" />
      
      {/* Botones */}
      <section className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={handleAddToCart}
            disabled={loading || tree.status !== 'available'}
            className="flex-1 bg-sage-600 hover:bg-sage-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            {loading ? 'Agregando...' : `✅ Agregar al Carrito - €${(olivePrice / 100).toFixed(2)}`}
          </button>
          {getTreeCount() > 0 && (
            <Link href="/adopt/checkout" className="flex-1">
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                🛒 Ir al Carrito ({getTreeCount()})
              </button>
            </Link>
          )}
        </div>
        
        {added && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <p className="font-semibold">✓ Árbol agregado al carrito</p>
            <p className="text-sm">Puedes continuar agregando más árboles o ir al carrito.</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}
      </section>
    </div>
  );
}
