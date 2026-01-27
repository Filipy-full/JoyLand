
'use client'
import Image from "next/image";
import { useState } from "react";

const images = Array.from({ length: 18 }, (_, i) => `/galeria/joyland-${String(i+1).padStart(2, '0')}.jpeg`);

export default function GaleriaPage() {
  const [selected, setSelected] = useState<number|null>(null);

  return (
    <div className="min-h-screen bg-sage-50 py-10 px-2">
      <h1 className="text-3xl sm:text-4xl font-serif text-sage-800 mb-8 text-center">Galería Joyland</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto pb-6">
        {images.map((src, i) => (
          <button
            key={src}
            className="group relative rounded-2xl overflow-hidden border-2 border-sage-200 hover:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-400 transition-all shadow-lg bg-white"
            style={{ aspectRatio: '4/3' }}
            onClick={() => setSelected(i)}
          >
            <Image src={src} alt={`Foto Joyland ${i+1}`} width={480} height={360} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
            <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="relative max-w-4xl w-full mx-4 flex items-center" onClick={e => e.stopPropagation()}>
            {/* Botón Anterior */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 z-20 text-2xl"
              style={{ left: '-2.5rem' }}
              onClick={() => setSelected((prev) => prev === 0 ? images.length - 1 : (prev ?? 0) - 1)}
              aria-label="Anterior"
            >&#8592;</button>
            {/* Imagen grande */}
            <Image src={images[selected]} alt={`Foto Joyland ${selected+1}`} width={1400} height={1000} className="rounded-2xl w-full h-auto max-h-[80vh] object-contain shadow-2xl" />
            {/* Botón Siguiente */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 z-20 text-2xl"
              style={{ right: '-2.5rem' }}
              onClick={() => setSelected((prev) => prev === images.length - 1 ? 0 : (prev ?? 0) + 1)}
              aria-label="Siguiente"
            >&#8594;</button>
            {/* Botón Cerrar */}
            <button className="absolute top-2 right-2 text-white text-3xl font-bold z-30 bg-black/40 hover:bg-black/70 rounded-full px-3 py-1" onClick={() => setSelected(null)} aria-label="Cerrar">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}
