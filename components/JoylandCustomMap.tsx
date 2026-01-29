"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Coordenadas dos pontos clicáveis (exemplo, ajustar conforme o mapa)
const clickableAreas = [
  {
    id: "olivares",
    left: "30%",
    top: "40%",
    width: "10%",
    height: "10%",
    label: "Olivares",
    link: "/adopt/olivo"
  },
  {
    id: "almendros",
    left: "60%",
    top: "55%",
    width: "10%",
    height: "10%",
    label: "Almendros",
    link: "/adopt/almendro"
  }
  // Adicione mais áreas conforme necessário
];

export default function JoylandCustomMap() {
  const router = useRouter();
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[16/9]">
      <Image
        src="/galeria/joyland-mapa.png"
        alt="Mapa ilustrado Joyland"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
      {clickableAreas.map(area => (
        <button
          key={area.id}
          style={{
            position: "absolute",
            left: area.left,
            top: area.top,
            width: area.width,
            height: area.height,
            background: "rgba(90,140,74,0.18)",
            border: "2px solid #5a8c4a",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "background 0.2s, border 0.2s"
          }}
          aria-label={area.label}
          onClick={() => router.push(area.link)}
        >
          <span className="sr-only">{area.label}</span>
        </button>
      ))}
    </div>
  );
}
