import JoylandSVGMap from "@/components/JoylandSVGMap";

export default function MapaIlustradoPage() {
  return (
    <main className="min-h-screen bg-sage-50 flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-serif text-sage-700 mb-6 text-center">Joyland Illustrated Map</h1>
      <p className="mb-8 text-center text-gray-600 max-w-xl">
        Explore Joyland's plantations. Click on the map areas to see the olive and almond groves.
      </p>
      <JoylandSVGMap />
    </main>
  );
}
