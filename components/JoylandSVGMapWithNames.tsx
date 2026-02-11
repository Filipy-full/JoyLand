"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdoptionIncludes } from "./AdoptionUI";



const width = 800;
const height = 1200;
const parcelaPath = "M 120 110 Q 400 10 700 200 Q 780 400 700 1000 Q 400 1180 180 1000 Q 40 700 120 110 Z";

// Função para converter latitude/longitude para coordenadas SVG (ajuste conforme necessário)
function latLonToSvg(lat: number, lon: number) {
  // Limites do terreno (ajuste conforme necessário)
  const minLat = 41.7885;
  const maxLat = 41.7905;
  const minLon = 1.7435;
  const maxLon = 1.7450;
  // Inverter Y porque SVG cresce para baixo
  const x = ((lon - minLon) / (maxLon - minLon)) * width;
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
  return { x, y };
}

export default function JoylandSVGMapWithNames() {
  const [trees, setTrees] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trees-with-adoptions")
      .then(res => res.json())
      .then(data => setTrees(data.trees || []));
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Lista de debug removida para produção */}
      {/* ...SVG MAPA... */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        style={{ maxWidth: 400, background: "#f5f8f3", borderRadius: 24, boxShadow: "0 2px 12px #0001" }}
      >
        <path d={parcelaPath} fill="#a8ca9c" stroke="#5a8c4a" strokeWidth={8} />
        {trees.map(tree => {
          const lat = Number(tree.latitude);
          const lon = Number(tree.longitude);
          if (isNaN(lat) || isNaN(lon)) return null;
          const { x: cx, y: cy } = latLonToSvg(lat, lon);
          const isSelected = selected === tree.id;
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
              <text x={cx} y={cy + 36} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1a3a1a" stroke="#fff" strokeWidth="2" paintOrder="stroke" style={{dominantBaseline:'middle'}}>
                {`#${tree.name}`}
                {tree.tree_name ? ` · ${tree.tree_name}` : ''}
                <tspan x={cx} dy="1.2em">{tree.type === 'olive' ? 'Olive' : tree.type === 'almond' ? 'Almond' : ''}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex gap-4 mt-4">
        <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-white border border-[#5a8c4a]"></span> Olivo</span>
        <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 border-2 border-[#5a8c4a] relative"><span style={{position:'absolute',left:2,top:2,width:12,height:2,background:'#5a8c4a',transform:'rotate(45deg)'}}></span><span style={{position:'absolute',left:2,top:2,width:12,height:2,background:'#5a8c4a',transform:'rotate(-45deg)'}}></span></span> Almendro</span>
      </div>
    </div>
  );
}
