import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backHref: string;
}

export function HeroSection({ title, subtitle, backHref }: HeroSectionProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-10 sm:pb-14">
      <div className="max-w-3xl mx-auto text-center">
        <a href={backHref} className="inline-block mb-6 text-sage-600 hover:text-sage-800 text-sm transition-colors">← Volver a adoptar</a>
        <h1 className="text-4xl sm:text-5xl font-serif text-sage-900 mb-4 leading-tight">{title}</h1>
        <p className="text-lg sm:text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      </div>
    </section>
  );
}

interface AdoptionIncludesProps {
  className?: string;
}

export function AdoptionIncludes({ className = '' }: AdoptionIncludesProps) {
  return (
    <section className={`max-w-2xl mx-auto ${className}`}>
      <div className="glass-card p-6 sm:p-8 rounded-3xl text-center">
        <h2 className="text-xl sm:text-2xl font-serif text-sage-900 mb-6">¿Qué incluye tu adopción?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🏷️</span>
            <span className="text-xs text-sage-700 font-medium">Árbol con nombre</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">📊</span>
            <span className="text-xs text-sage-700 font-medium">Informe anual</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🎁</span>
            <span className="text-xs text-sage-700 font-medium">Giftbox Joyland</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🗓️</span>
            <span className="text-xs text-sage-700 font-medium">1 año de adopción</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PriceCTAProps {
  price: number;
  treeType: 'almendro' | 'olivo';
  loading: boolean;
  onAdopt: () => void;
}

export function PriceCTA({ price, treeType, loading, onAdopt }: PriceCTAProps) {
  return (
    <div className="max-w-xl mx-auto mt-10 text-center">
      <div className="mb-6">
        <span className="text-4xl font-bold text-sage-800">{price}€</span>
        <span className="text-sage-600"> / año</span>
      </div>
      <button
        onClick={onAdopt}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Procesando...</span>
          </>
        ) : (
          'Adoptar este árbol'
        )}
      </button>
    </div>
  );
}
