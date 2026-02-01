
"use client";
import dynamic from "next/dynamic";
const Real3DMap = dynamic(() => import("@/components/Real3DMap"), { ssr: false });

export default function AdoptMapPage() {
  return (
    <main className="min-h-screen bg-sage-50 flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-serif text-sage-700 mb-6 text-center">Choose Your Tree on the 3D Map</h1>
      <p className="mb-8 text-center text-gray-600 max-w-xl">
        Realistic map, centered on Joyland's parcel. 3D view and terrain activated.
      </p>
      <Real3DMap />
    </main>
  );
}
