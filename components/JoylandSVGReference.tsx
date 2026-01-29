import Image from "next/image";

export default function JoylandSVGReference() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/galeria/joyland-mapa.png"
        alt="Mapa referência Joyland"
        width={600}
        height={400}
        style={{ border: "2px solid #5a8c4a", borderRadius: 16, marginBottom: 24 }}
        priority
      />
      <p className="text-center text-gray-600 max-w-xl">
        Referência visual da parcela: área verde = terreno, círculos brancos = oliveiras, X/asterisco = amendoeiras.
      </p>
    </div>
  );
}
