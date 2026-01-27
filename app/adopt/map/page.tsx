"use client";
import dynamic from 'next/dynamic';

const TreeMap = dynamic(() => import('@/components/TreeMap'), {
  ssr: false,
  loading: () => <div className="text-center py-20">Cargando mapa...</div>,
});

export default function AdoptMapPage() {
  return (
    <main className="min-h-screen bg-sage-50">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-serif text-sage-700 mb-6 text-center">Mapa de adopción de árboles</h1>
        <TreeMap />
      </div>
    </main>
  );
}
