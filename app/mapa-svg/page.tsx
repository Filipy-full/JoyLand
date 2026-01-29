import JoylandSVGMap from "@/components/JoylandSVGMap";

export default function MapaSVGPage() {
  return (
    <main className="min-h-screen bg-sage-50 flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-serif text-sage-700 mb-6 text-center">Mapa Interativo da Parcela Joyland</h1>
      <p className="mb-8 text-center text-gray-600 max-w-xl">
        Clique nos pontos para selecionar uma árvore. O formato e as cores representam a sua plantação real.
      </p>
      <JoylandSVGMap />
    </main>
  );
}
