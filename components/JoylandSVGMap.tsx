"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// SVG vetorial: formato da parcela inspirado na foto, sem imagem de fundo
const width = 800;
const height = 1200;

// Path SVG aproximado do formato da parcela (ajuste para máxima fidelidade)
const parcelaPath = "M 120 110 Q 400 10 700 200 Q 780 400 700 1000 Q 400 1180 180 1000 Q 40 700 120 110 Z";


// Normalización de coordenadas para SVG
function normalizeCoords(lon: number, lat: number) {
  // Ajusta estos valores según el rango real de tu parcela
  const minLat = 41.78898599619048;
  const maxLat = 41.8025;
  const minLng = 1.743518474452779;
  const maxLng = 1.744527724330069;
  const x = (lon - minLng) / (maxLng - minLng);
  const y = (lat - minLat) / (maxLat - minLat);
  return { x, y };
}




export default function JoylandSVGMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [trees, setTrees] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/trees-with-adoptions')
      .then(res => res.json())
      .then(data => setTrees(data.trees || []));
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        style={{ maxWidth: 400, background: "#f5f8f3", borderRadius: 24, boxShadow: "0 2px 12px #0001" }}
      >
        <path d={parcelaPath} fill="#a8ca9c" stroke="#5a8c4a" strokeWidth={8} />
        {trees.map(tree => {
          if (!tree.latitude || !tree.longitude) return null;
          const { x, y } = normalizeCoords(tree.longitude, tree.latitude);
          const cx = x * width;
          const cy = y * height;
          const isSelected = selected === tree.id;
          const isAdopted = tree.status === 'adopted';
          if (tree.type === "olive") {
            return (
              <g key={tree.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 18 : 14}
                  fill={isAdopted ? "#ff0000" : "#fff"}
                  stroke={isAdopted ? "#ff0000" : "#5a8c4a"}
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
            // Almendro: X estilizado
            return (
              <g key={tree.id}>
                <g
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelected(tree.id);
                    router.push(`/tree/${tree.id}`);
                  }}
                >
                  <line x1={cx-12} y1={cy-12} x2={cx+12} y2={cy+12} stroke={isAdopted ? "#ff0000" : "#5a8c4a"} strokeWidth={isSelected ? 5 : 3} />
                  <line x1={cx+12} y1={cy-12} x2={cx-12} y2={cy+12} stroke={isAdopted ? "#ff0000" : "#5a8c4a"} strokeWidth={isSelected ? 5 : 3} />
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
