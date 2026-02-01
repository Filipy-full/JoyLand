import JoylandSVGMap from "@/components/JoylandSVGMap";

export default function MapaSVGPage() {
  return (
    <main className="min-h-screen bg-sage-50 flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-serif text-sage-700 mb-6 text-center">Joyland Interactive Parcel Map</h1>
      <p className="mb-8 text-center text-gray-600 max-w-xl">
        Click on the points to select a tree. The shape and colors represent your real plantation.
      </p>
      <JoylandSVGMap />
    </main>
  );
}
