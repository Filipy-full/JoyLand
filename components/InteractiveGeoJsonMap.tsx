'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './map-styles.css'
import Link from 'next/link'

// Importar ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
})

L.Marker.prototype.options.icon = DefaultIcon

interface GeoJSONFeature {
  type: string
  geometry: {
    type: string
    coordinates: number[] | number[][]
  }
  properties: {
    name: string
    type: string
    species: string
    year: number
    area: string
    adopted?: boolean
  }
  id: string
}

interface GeoJSONData {
  type: string
  features: GeoJSONFeature[]
}

interface TreeData {
  id: string
  name: string
  species: string
  year: number
  area: string
  latitude: number
  longitude: number
  adopted: boolean
}

export default function InteractiveGeoJsonMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null)
  const [trees, setTrees] = useState<TreeData[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    oliva: 0,
    almendras: 0,
    adopted: 0,
  })

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return

    // Inicializar mapa
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([41.7895, 1.7435], 18)
      map.current.setMaxBounds(L.latLngBounds([41.78, 1.74], [41.80, 1.75]))

      // Diferentes capas base
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 22,
      })

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 21,
      })

      const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap',
        maxZoom: 20,
      })

      // Agregar capa satélite por defecto
      satelliteLayer.addTo(map.current)

      // Control de capas
      const baseLayers = {
        'OpenStreetMap': osmLayer,
        'Satélite': satelliteLayer,
        'Topográfico': topoLayer,
      }

      L.control.layers(baseLayers).addTo(map.current)
    }

    // Carregar GeoJSON e estados de Supabase
    Promise.all([
      fetch('/geojson-map.json').then((res) => res.json()),
      fetch('/api/trees').then((res) => res.json()),
    ])
      .then(([data, treesResponse]: [GeoJSONData, { trees?: Array<{ id: string; status?: string; name?: string }> }]) => {
        const statusMap = new Map<string, { status?: string; name?: string }>()
        ;(treesResponse.trees || []).forEach((t) => {
          statusMap.set(t.id, { status: t.status, name: t.name })
        })

        const parsedTrees: TreeData[] = []
        let olivaCount = 0
        let almendrasCount = 0
        let adoptedCount = 0

        data.features.forEach((feature) => {
          if (feature.properties.type === 'tree') {
            const coords = feature.geometry.coordinates as number[]
            const dbInfo = statusMap.get(feature.id)
            const adopted = dbInfo?.status ? dbInfo.status !== 'available' : (feature.properties.adopted || false)

            const tree: TreeData = {
              id: feature.id,
              name: dbInfo?.name || feature.properties.name,
              species: feature.properties.species,
              year: feature.properties.year,
              area: feature.properties.area,
              latitude: coords[1],
              longitude: coords[0],
              adopted,
            }
            parsedTrees.push(tree)

            // Contar estadísticas
            if (tree.species === 'Oliveira') {
              olivaCount++
            } else if (tree.species === 'Almendras') {
              almendrasCount++
            }

            if (tree.adopted) {
              adoptedCount++
            }

            // Determinar cor con base no status
            const color = tree.adopted
              ? '#9e9e9e'
              : feature.properties.species === 'Oliveira'
              ? '#1976d2'
              : '#d32f2f'
            
            // Tamaño responsivo: 10px en móvil, 14px en tablet, 16px en desktop
            let markerSize = 16
            let fontSize = '10px'
            let borderWidth = 2
            
            if (typeof window !== 'undefined') {
              if (window.innerWidth < 480) {
                markerSize = 10
                fontSize = '8px'
                borderWidth = 1.5
              } else if (window.innerWidth < 768) {
                markerSize = 12
                fontSize = '9px'
                borderWidth = 1.5
              }
            }
            
            const icon = L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  width: ${markerSize}px;
                  height: ${markerSize}px;
                  background-color: ${color};
                  border: ${borderWidth}px solid white;
                  border-radius: 50%;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                ">
                  <span style="color: white; font-size: ${fontSize}; font-weight: bold; position: absolute; white-space: nowrap;">${tree.name}</span>
                </div>
              `,
              iconSize: [markerSize, markerSize],
              iconAnchor: [markerSize / 2, markerSize / 2],
              popupAnchor: [0, -(markerSize / 2)],
            })

            const marker = L.marker([coords[1], coords[0]], { icon })
              .addTo(map.current!)
              .on('click', () => {
                setSelectedTree(tree)
              })

            // Adicionar popup no hover
            marker.bindPopup(
              `<strong>Árvore #${tree.name}</strong><br/>
               Espécie: ${feature.properties.species}<br/>
               Ano: ${feature.properties.year}<br/>
               Zona: ${feature.properties.area}<br/>
               Estado: ${tree.adopted ? 'Adoptada' : 'Disponible'}`
            )
          }
        })

        setTrees(parsedTrees)
        setStats({
          total: parsedTrees.length,
          oliva: olivaCount,
          almendras: almendrasCount,
          adopted: adoptedCount,
        })
      })
      .catch((error) => console.error('Erro ao carregar dados do mapa:', error))

    return () => {
      // Limpeza se necessário
    }
  }, [])

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-0 overflow-hidden bg-white relative z-0">
      {/* Mapa - Responsive */}
      <div className="w-full md:flex-1 relative order-2 md:order-1 flex-1 z-0">
        <div
          ref={mapContainer}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 0,
          }}
        />

        {/* Legenda - Responsive */}
        <div className="hidden sm:block absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-gray-200 z-20 overflow-hidden">
          <div className="px-4 py-3">
            <h3 className="font-semibold mb-2 text-gray-800 text-xs">Leyenda</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#1976d2' }}
                ></div>
                <span className="text-xs text-gray-700">Oliveira</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#d32f2f' }}
                ></div>
                <span className="text-xs text-gray-700">Almendras</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel de Detalhes - Responsive */}
      {selectedTree ? (
        <div className="w-full md:w-96 bg-white shadow-lg md:shadow-none md:border-l border-gray-200 flex flex-col overflow-hidden order-1 md:order-2 h-auto md:h-full">
          {/* Header */}
          <div
            className="px-3 md:px-4 py-3 md:py-4 text-white flex items-end h-16 md:h-20"
            style={{
              background: `linear-gradient(135deg, ${selectedTree.species === 'Oliveira' ? '#1976d2' : '#d32f2f'} 0%, ${selectedTree.species === 'Oliveira' ? '#0d47a1' : '#b71c1c'} 100%)`,
            }}
          >
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold">#{selectedTree.name}</h2>
              <p className="text-xs opacity-90">{selectedTree.species}</p>
            </div>
            <button
              onClick={() => setSelectedTree(null)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-7 h-7 flex items-center justify-center transition text-sm"
            >
              ✕
            </button>
          </div>

          {/* Conteúdo Compacto */}
          <div className="flex-1 overflow-hidden p-3 md:p-4">
            {selectedTree.adopted ? (
              <div className="bg-amber-50 border border-amber-300 rounded p-2 mb-3 text-xs">
                <p className="font-semibold text-amber-900">⚠️ Adotada</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-300 rounded p-2 mb-3 text-xs">
                <p className="font-semibold text-green-900">✨ Disponível</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="border-b border-gray-200 pb-2">
                <p className="text-gray-500 text-xs">Espécie</p>
                <p className="font-semibold text-gray-800">{selectedTree.species}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-gray-500 text-xs">Año</p>
                <p className="font-semibold text-gray-800">{selectedTree.year}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-gray-500 text-xs">Zona</p>
                <p className="font-semibold text-gray-800">{selectedTree.area}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-gray-500 text-xs">Lat</p>
                <p className="font-mono text-gray-800 text-xs">{selectedTree.latitude.toFixed(4)}</p>
              </div>
              <div className="col-span-2 border-b border-gray-200 pb-2">
                <p className="text-gray-500 text-xs">Lon</p>
                <p className="font-mono text-gray-800 text-xs">{selectedTree.longitude.toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* Footer com Ações */}
          <div className="border-t border-gray-200 p-2 md:p-3 space-y-1.5 md:space-y-2 bg-gray-50">
            {selectedTree.adopted ? (
              <Link href={`/tree/${selectedTree.id}`}>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 rounded transition duration-200">
                  Ver Detalles
                </button>
              </Link>
            ) : (
              <>
                <Link href={`/adopt/map/${selectedTree.id}`}>
                  <button className="w-full bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white text-xs md:text-sm font-bold py-1.5 md:py-2 rounded transition duration-200">
                    🌱 Adoptar
                  </button>
                </Link>
              </>
            )}
            <button
              onClick={() => setSelectedTree(null)}
              className="w-full bg-white border border-gray-300 text-gray-700 text-xs md:text-sm font-semibold py-1.5 rounded hover:border-gray-400 hover:bg-gray-50 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full md:w-96 bg-white shadow-lg md:shadow-none md:border-l border-gray-200 flex flex-col overflow-hidden order-1 md:order-2 h-auto md:h-full">
          {/* Header de Estadísticas */}
          <div className="bg-gradient-to-r from-sage-600 to-amber-600 text-white p-3 md:p-4">
            <h2 className="text-base md:text-lg font-bold mb-0">📍 Información</h2>
            <p className="text-xs opacity-90">Estadísticas</p>
          </div>

          {/* Contenido de Estadísticas - Compact Grid */}
          <div className="flex-1 p-3 md:p-4 overflow-hidden">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {/* Total */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-md p-2 md:p-3 border border-blue-200">
                <div className="flex flex-col items-center text-center">
                  <p className="text-xs text-gray-600 font-medium">Total</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-xs text-gray-500">🌳</p>
                </div>
              </div>

              {/* Oliva */}
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-md p-2 md:p-3 border border-sky-300">
                <div className="flex flex-col items-center text-center">
                  <p className="text-xs text-gray-600 font-medium">Oliva</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.oliva}</p>
                  <p className="text-xs text-gray-500">({((stats.oliva / stats.total) * 100).toFixed(1)}%)</p>
                </div>
              </div>

              {/* Almendras */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-md p-2 md:p-3 border border-red-300">
                <div className="flex flex-col items-center text-center">
                  <p className="text-xs text-gray-600 font-medium">Almendras</p>
                  <p className="text-2xl md:text-3xl font-bold text-red-600">{stats.almendras}</p>
                  <p className="text-xs text-gray-500">({((stats.almendras / stats.total) * 100).toFixed(1)}%)</p>
                </div>
              </div>

              {/* Adoptadas */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-md p-2 md:p-3 border border-amber-300">
                <div className="flex flex-col items-center text-center">
                  <p className="text-xs text-gray-600 font-medium">Adoptadas</p>
                  <p className="text-2xl md:text-3xl font-bold text-amber-600">{stats.adopted}</p>
                  <p className="text-xs text-gray-500">✅</p>
                </div>
              </div>

              {/* Disponibles */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-md p-2 md:p-3 border border-green-300 col-span-2">
                <div className="flex flex-col items-center text-center">
                  <p className="text-xs text-gray-600 font-medium">Disponibles</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.total - stats.adopted}</p>
                  <p className="text-xs text-gray-500">({(((stats.total - stats.adopted) / stats.total) * 100).toFixed(1)}%) 💚</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-2 md:p-3 bg-gray-50 text-center text-xs text-gray-500">
            <p>Toca o clica en un árbol</p>
          </div>
        </div>
      )}
    </div>
  )
}
