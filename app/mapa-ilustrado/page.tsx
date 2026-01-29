import JoylandCustomMap from "@/components/JoylandCustomMap";

export default function MapaIlustradoPage() {
  return (
    <main className="min-h-screen bg-sage-50 flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-serif text-sage-700 mb-6 text-center">Mapa Ilustrado de Joyland</h1>
      <p className="mb-8 text-center text-gray-600 max-w-xl">
        Explora las plantaciones de Joyland. Haz clic en las áreas del mapa para ver los olivares y almendros.
      </p>
      <JoylandCustomMap />
    </main>
  );
}
