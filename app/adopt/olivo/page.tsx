'use client'

import { useState } from 'react';
import { HeroSection, AdoptionIncludes, PriceCTA } from '@/components/AdoptionUI';

export default function AdoptOlivoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdopt = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treeType: 'olivo' }),
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
        title="Adopt an Olive Tree 🫒"
        subtitle="An annual adoption that cares for the land and accompanies a real tree"
        backHref="/adopt"
      />
      <section className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        <h2 className="text-xl font-serif text-sage-900 mb-4">The Olive Tree at Joyland</h2>
        <p className="text-sage-700 mb-6 text-base sm:text-lg">
          The olive tree is a symbol of peace and longevity. Its fruits and shade have accompanied generations. Adopting an olive tree is honoring tradition and contributing to the regeneration of Mediterranean land.
        </p>
      </section>
      <AdoptionIncludes className="my-8" />
      <PriceCTA price={175} treeType="olivo" loading={loading} onAdopt={handleAdopt} />
      {error && <div className="text-center text-red-600 mt-4">Error: {error}</div>}
    </div>
  );
}
