"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// SVG vetorial: formato da parcela inspirado na foto, sem imagem de fundo
const width = 800;
const height = 1200;

// Path SVG aproximado do formato da parcela (ajuste para máxima fidelidade)
const parcelaPath = "M 120 110 Q 400 10 700 200 Q 780 400 700 1000 Q 400 1180 180 1000 Q 40 700 120 110 Z";

// Pontos das árvores (exemplo, distribua conforme a foto)
const trees = [
  // Linha 1 (superior)
  { id: "olive-1", type: "olive", x: 0.13, y: 0.13 },
  { id: "almond-1", type: "almond", x: 0.20, y: 0.16 },
  { id: "olive-2", type: "olive", x: 0.28, y: 0.14 },
  { id: "almond-2", type: "almond", x: 0.36, y: 0.18 },
  { id: "olive-3", type: "olive", x: 0.44, y: 0.15 },
  { id: "almond-3", type: "almond", x: 0.52, y: 0.20 },
  { id: "olive-4", type: "olive", x: 0.60, y: 0.18 },
  { id: "almond-4", type: "almond", x: 0.68, y: 0.22 },
  { id: "olive-5", type: "olive", x: 0.76, y: 0.20 },
  // Linha 2
  { id: "almond-5", type: "almond", x: 0.18, y: 0.28 },
  { id: "olive-6", type: "olive", x: 0.26, y: 0.26 },
  { id: "almond-6", type: "almond", x: 0.34, y: 0.30 },
  { id: "olive-7", type: "olive", x: 0.42, y: 0.28 },
  { id: "almond-7", type: "almond", x: 0.50, y: 0.32 },
  { id: "olive-8", type: "olive", x: 0.58, y: 0.30 },
  { id: "almond-8", type: "almond", x: 0.66, y: 0.34 },
  { id: "olive-9", type: "olive", x: 0.74, y: 0.32 },
  // Linha 3
  { id: "olive-10", type: "olive", x: 0.22, y: 0.42 },
  { id: "almond-9", type: "almond", x: 0.30, y: 0.44 },
  { id: "olive-11", type: "olive", x: 0.38, y: 0.40 },
  { id: "almond-10", type: "almond", x: 0.46, y: 0.46 },
  { id: "olive-12", type: "olive", x: 0.54, y: 0.42 },
  { id: "almond-11", type: "almond", x: 0.62, y: 0.48 },
  { id: "olive-13", type: "olive", x: 0.70, y: 0.44 },
  // Linha 4 (meio)
  { id: "almond-12", type: "almond", x: 0.26, y: 0.58 },
  { id: "olive-14", type: "olive", x: 0.34, y: 0.54 },
  { id: "almond-13", type: "almond", x: 0.42, y: 0.60 },
  { id: "olive-15", type: "olive", x: 0.50, y: 0.56 },
  { id: "almond-14", type: "almond", x: 0.58, y: 0.62 },
  { id: "olive-16", type: "olive", x: 0.66, y: 0.58 },
  // Linha 5
  { id: "olive-17", type: "olive", x: 0.30, y: 0.70 },
  { id: "almond-15", type: "almond", x: 0.38, y: 0.74 },
  { id: "olive-18", type: "olive", x: 0.46, y: 0.70 },
  { id: "almond-16", type: "almond", x: 0.54, y: 0.76 },
  { id: "olive-19", type: "olive", x: 0.62, y: 0.72 },
  { id: "almond-17", type: "almond", x: 0.70, y: 0.78 },
  // Linha 6 (inferior)
  { id: "olive-20", type: "olive", x: 0.36, y: 0.88 },
  { id: "almond-18", type: "almond", x: 0.44, y: 0.92 },
  { id: "olive-21", type: "olive", x: 0.52, y: 0.88 },
  { id: "almond-19", type: "almond", x: 0.60, y: 0.94 },
  { id: "olive-22", type: "olive", x: 0.68, y: 0.90 },
];



export default function JoylandSVGMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        style={{ maxWidth: 400, background: "#f5f8f3", borderRadius: 24, boxShadow: "0 2px 12px #0001" }}
      >
        {/* Parcela desenhada */}
        <path d={parcelaPath} fill="#a8ca9c" stroke="#5a8c4a" strokeWidth={8} />
        {/* Árvores sobrepostas */}
        {trees.map(tree => {
          const cx = tree.x * width;
          const cy = tree.y * height;
          const isSelected = selected === tree.id;
          if (tree.type === "olive") {
            return (
              <g key={tree.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 18 : 14}
                  fill="#fff"
                  stroke="#5a8c4a"
                  strokeWidth={isSelected ? 5 : 3}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onClick={() => {
                    setSelected(tree.id);
                    router.push(`/tree/${tree.id}`);
                  }}
                />
              </g>
            );
          } else {
            // Amendoeira: X estilizado
            return (
              <g key={tree.id}>
                <g
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelected(tree.id);
                    router.push(`/tree/${tree.id}`);
                  }}
                >
                  <line x1={cx-12} y1={cy-12} x2={cx+12} y2={cy+12} stroke="#5a8c4a" strokeWidth={isSelected ? 5 : 3} />
                  <line x1={cx+12} y1={cy-12} x2={cx-12} y2={cy+12} stroke="#5a8c4a" strokeWidth={isSelected ? 5 : 3} />
                </g>
              </g>
            );
          }
        })}
      </svg>
      <div className="flex gap-4 mt-4">
        <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-white border border-[#5a8c4a]"></span> Olivo</span>
        <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 border-2 border-[#5a8c4a] relative"><span style={{position:'absolute',left:2,top:2,width:12,height:2,background:'#5a8c4a',transform:'rotate(45deg)'}}></span><span style={{position:'absolute',left:2,top:2,width:12,height:2,background:'#5a8c4a',transform:'rotate(-45deg)'}}></span></span> Almendro</span>
      </div>
    </div>
  );
}
