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

  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => {
    if (tree?.id) {
      fetch(`/api/reports?tree_id=${tree.id}`)
        .then(res => res.json())
        .then(data => setReports(data.reports || []))
        .catch(() => setReports([]));
    }
  }, [tree?.id]);

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
        <h2 className="text-xl font-serif text-sage-900 mb-4">{tree.name || `Tree #${tree.id}`}</h2>
        <div className="bg-white border border-sage-200 rounded-xl p-4 mb-4 text-sage-800 text-sm flex flex-col gap-1">
          <div><strong>Tree #{tree.id}</strong></div>
          <div>Species: {tree.type === 'olive' || tree.type === 'olivo' ? 'Oliveira' : tree.type}</div>
          <div>Year: {tree.year?.toString().padStart(4, '0') || '0000'}</div>
          <div>Zone: {tree.area || 'Unknown'}</div>
          <div>Status: <span className={tree.status === 'available' ? 'text-green-700' : 'text-red-700'}>{tree.status === 'available' ? 'Available' : 'Adopted'}</span></div>
          {typeof tree.latitude === 'number' && typeof tree.longitude === 'number' && (
            <div>Location: {tree.latitude}, {tree.longitude}</div>
          )}
          {typeof tree.width === 'number' && (
            <div>Ancho: {tree.width} m</div>
          )}
          {typeof tree.height === 'number' && (
            <div>Altura: {tree.height} m</div>
          )}
        </div>
        {tree.description && (
          <p className="text-sage-700 mb-4 text-base sm:text-lg">{tree.description}</p>
        )}
        {tree.yearly_report && (
          <p className="text-sage-700 mb-4 text-sm">{tree.yearly_report}</p>
        )}
        {tree.videos && (
          <div className="mb-4">
            <strong>Videos:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(tree.videos)
                ? tree.videos.map((url: string, idx: number) => (
                    <video key={idx} src={url} controls className="w-40 h-28 rounded" />
                  ))
                : <span>{tree.videos}</span>}
            </div>
          </div>
        )}
        {/* Imagens do relatório ou do próprio tree */}
        {reports && reports.length > 0 && (
          <div className="mb-4">
            <strong>Fotos:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {reports.flatMap((report) =>
                Array.isArray(report.photo_urls)
                  ? report.photo_urls.map((url: string, idx: number) => (
                      <img key={url + idx} src={url} alt={`Foto ${idx + 1}`} className="w-32 h-32 object-cover rounded" />
                    ))
                  : []
              )}
            </div>
          </div>
        )}
      </section>
      {/* Relatórios do árvore */}
      <section className="container mx-auto px-4 sm:px-6 py-4 max-w-2xl">
        <div className="bg-white border border-sage-200 rounded-xl p-4 mb-4 text-sage-800 text-sm">
          <h3 className="font-semibold mb-2">Relatórios do Árbol</h3>
          {reports && reports.length > 0 ? (
            <ul className="space-y-2">
              {reports.map((report) => (
                <li key={report.id} className="border-b border-sage-100 pb-2 mb-2">
                  <div className="font-medium">{report.title}</div>
                  <div className="text-xs text-sage-500">{new Date(report.created_at).toLocaleDateString()}</div>
                  {report.body && <div className="text-xs mt-1">{report.body}</div>}
                  {report.pdf_url && (
                    <a href={report.pdf_url} target="_blank" rel="noreferrer" className="text-xs text-blue-700 underline">Ver PDF</a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-sage-500">Aún no hay reportes para este árbol.</div>
          )}
        </div>
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
