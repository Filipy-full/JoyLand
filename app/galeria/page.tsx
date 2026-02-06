'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ...existing code...

export default function GaleriaPage() {
  const [galleryItems, setGalleryItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<number|null>(null);
  const [visibleCount, setVisibleCount] = useState(28);
  // Touch state for swipe
  const [touchStartX, setTouchStartX] = useState<number|null>(null);
  const [touchEndX, setTouchEndX] = useState<number|null>(null);

  useEffect(() => {
    async function fetchGallery() {
      // Busca imagens do Supabase (tabela gallery), ordenadas
      const { data, error } = await supabase
        .from('gallery')
        .select('url')
        .order('order', { ascending: true });
      if (error) {
        console.error('Erro ao buscar galeria:', error.message);
        return;
      }
      setGalleryItems(data.map((item: { url: string }) => item.url));
    }
    fetchGallery();
  }, []);

  const showMore = () => setVisibleCount((prev) => Math.min(prev + 28, galleryItems.length));

  // Handle swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      if (diff > 50) {
        // Swipe left: next
        setSelected((prev) => prev === galleryItems.length - 1 ? 0 : (prev ?? 0) + 1);
      } else if (diff < -50) {
        // Swipe right: previous
        setSelected((prev) => prev === 0 ? galleryItems.length - 1 : (prev ?? 0) - 1);
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="min-h-screen bg-sage-50 py-10 px-2">
      <h1 className="text-3xl sm:text-4xl font-serif text-sage-800 mb-8 text-center">Joyland Gallery</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto pb-6">
        {galleryItems.slice(0, visibleCount).map((src, i) => (
          <button
            key={src}
            className="group relative rounded-2xl overflow-hidden border-2 border-sage-200 hover:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-400 transition-all shadow-lg bg-white"
            style={{ aspectRatio: '4/3' }}
            onClick={() => setSelected(i)}
          >
            {src.endsWith('.mp4') ? (
              <video src={src} controls className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <img src={src} alt={`Joyland photo ${i+1}`} width={480} height={360} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            )}
            <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        ))}
        {visibleCount < galleryItems.length && (
          <button
            className="col-span-full flex justify-center items-center py-8"
            onClick={showMore}
            aria-label="Show more images"
          >
            <span className="text-4xl text-sage-400">…</span>
          </button>
        )}
      </div>
      {selected !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div
            className="relative max-w-4xl w-full mx-4 flex items-center"
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Previous Button */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 z-20 text-2xl focus:outline-none focus:ring-2 focus:ring-sage-400"
              style={{ left: '-2.5rem' }}
              onClick={() => setSelected((prev) => prev === 0 ? galleryItems.length - 1 : (prev ?? 0) - 1)}
              aria-label="Previous image"
              tabIndex={0}
            >&#8592;</button>
            {/* Large image or video */}
            {galleryItems[selected].endsWith('.mp4') ? (
              <video src={galleryItems[selected]} controls autoPlay className="rounded-2xl w-full h-auto max-h-[80vh] object-contain shadow-2xl" />
            ) : (
              <img src={galleryItems[selected]} alt={`Large Joyland gallery photo number ${selected+1}`} width={1400} height={1000} className="rounded-2xl w-full h-auto max-h-[80vh] object-contain shadow-2xl" loading="lazy" />
            )}
            {/* Next Button */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 z-20 text-2xl focus:outline-none focus:ring-2 focus:ring-sage-400"
              style={{ right: '-2.5rem' }}
              onClick={() => setSelected((prev) => prev === galleryItems.length - 1 ? 0 : (prev ?? 0) + 1)}
              aria-label="Next image"
              tabIndex={0}
            >&#8594;</button>
            {/* Close Button */}
            <button className="absolute top-2 right-2 text-white text-3xl font-bold z-30 bg-black/40 hover:bg-black/70 rounded-full px-3 py-1" onClick={() => setSelected(null)} aria-label="Close">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}
