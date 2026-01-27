"use client";
import React, { useState, useEffect } from 'react';
import { AdoptionIncludes, PriceCTA, HeroSection } from '@/components/AdoptionUI';
import { prisma } from '@/lib/prisma';

import { notFound, useParams } from 'next/navigation';

export default function AlmendroTreePage(props: any) {
  const params = typeof window === 'undefined' ? props.params : useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tree, setTree] = useState<any>(props.tree || null);

  // SSR fallback: fetch tree if not provided
  useEffect(() => {
    if (!tree && params?.treeId) {
      fetch(`/api/trees?id=${params.treeId}`)
        .then(res => res.json())
        .then(data => setTree(data.tree))
        .catch(() => setError('No se pudo cargar el árbol.'));
    }
  }, [params, tree]);

  if (!tree) return <div className="text-center py-20">Cargando árbol...</div>;

  const handleAdopt = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treeId: tree.id }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Error desconocido');
        setLoading(false);
      }
    } catch (err) {
      setError('Error de red o servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50 pb-20">
      <HeroSection
        title={`Adopta este almendro 🌳`}
        subtitle={`Adopta el árbol “${tree.name || 'Almendro'}” y acompáñalo durante un año.`}
        backHref="/adopt/almendro"
      />
      <section className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        <h2 className="text-xl font-serif text-sage-900 mb-4">{tree.name || 'Almendro'}</h2>
        <p className="text-sage-700 mb-6 text-base sm:text-lg">{tree.description || 'Almendro joven y saludable.'}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${tree.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{tree.status === 'available' ? 'Disponible' : 'Adoptado'}</span>
      </section>
      <AdoptionIncludes className="my-8" />
      <PriceCTA price={96} treeType="almendro" loading={loading} onAdopt={handleAdopt} />
      {error && <div className="text-center text-red-600 mt-4">{error}</div>}
    </div>
  );
}
