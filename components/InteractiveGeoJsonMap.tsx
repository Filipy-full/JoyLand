'use client'

import { useEffect, useRef, useState } from 'react'
// Modal simples para exibir imagem ampliada
function ImageModal({ src, alt, onClose }: { src: string, alt: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'transparent' }} onClick={onClose}>
      <div
        className="relative flex items-center justify-center"
        style={{ maxWidth: '180vw', maxHeight: '180vh' }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="rounded-lg shadow-2xl object-contain border-4 border-white"
          style={{
            background: '#fff',
            maxHeight: '180vh',
            maxWidth: '180vw',
            width: 'auto',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full px-4 py-2 text-2xl font-bold shadow-lg focus:outline-none"
          style={{ zIndex: 10 }}
          aria-label="Close image modal"
        >
          ×
        </button>
      </div>
    </div>
  )
}
// Imagens de exemplo para cada espécie
const treeImages: Record<string, string> = {
  Olive: '/rama-oliva.png',
  Almond: '/about/aceitunas-rama.jpeg', // Substitua por uma imagem de amêndoa se houver
}
import { useSearchParams } from 'next/navigation'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './map-styles.css'
import Link from 'next/link'
import { useAdoptionCart } from '@/contexts/AdoptionCart'

// Importar ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
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
    status?: string
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
  width?: number
  height?: number
  root_zone?: string
  orientation?: string
  description?: string
  image_url?: string // url da imagem na supabase
  tree_name?: string
}

export default function InteractiveGeoJsonMap() {
  const [showImageModal, setShowImageModal] = useState(false)
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markers = useRef<L.Marker[]>([])
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null)
  const [mapTrees, setMapTrees] = useState<TreeData[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null)
  const [filters, setFilters] = useState({
    adopted: true,
    oliva: true,
    almendra: true,
  })
  const [showMobileLegend, setShowMobileLegend] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    oliva: 0,
    almendras: 0,
    adopted: 0,
  })
  const [addingToCart, setAddingToCart] = useState(false)
  const [almondPrice, setAlmondPrice] = useState<number>(20000)
  const [olivePrice, setOlivePrice] = useState<number>(20000)
  const { addTree, trees, getTreeCount } = useAdoptionCart()

  // Obtener precios dinámicos
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/admin/pricing')
        if (res.ok) {
          const data = await res.json()
          setAlmondPrice(Math.round(data.almondPrice * 100))
          setOlivePrice(Math.round(data.olivePrice * 100))
        }
      } catch (err) {
        // ...existing code...
      }
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const filterParam = searchParams?.get('filter') ?? ''
    if (filterParam === 'almond') {
      setFilters((prev) => ({ ...prev, almendra: true, oliva: false }))
    } else if (filterParam === 'olive') {
      setFilters((prev) => ({ ...prev, oliva: true, almendra: false }))
    }
  }, [searchParams])

  // Verificar si el árbol seleccionado está en el carrito
  const isTreeInCart = selectedTree ? trees.some(t => t.id === selectedTree.id) : false
  const handleAddToCart = (tree: TreeData) => {
    setAddingToCart(true)
    try {
      const treeType = tree.species === 'Olive' ? 'olivo' : 'almendro'
      const price = treeType === 'olivo' ? olivePrice : almondPrice
      addTree({
        id: tree.id,
        name: tree.name,
        species: tree.species,
        type: treeType,
        price: price,
        area: tree.area,
        year: tree.year,
      })
      // NO cerrar el panel, dejar que aparezca el botón del carrito
    } catch (err) {
      // ...existing code...
    } finally {
      setAddingToCart(false)
    }
  }

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
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement
      setIsFullscreen(Boolean(fullscreenElement))
      if (map.current) {
        setTimeout(() => map.current?.invalidateSize(), 150)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (isPseudoFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    if (map.current) {
      setTimeout(() => map.current?.invalidateSize(), 150)
    }
  }, [isPseudoFullscreen])

  // Función para actualizar estados de árboles desde API
  const updateTreeStates = async (geojsonData: GeoJSONData) => {
    try {
      const treesResponse = await fetch('/api/trees-with-adoptions').then((res) => res.json())
      const statusMap = new Map<string, { status?: string; name?: string; year?: number; width?: number; height?: number; root_zone?: string; orientation?: string; description?: string; image_url?: string; tree_name?: string }>()
      interface ApiTree {
        id: string
        status?: string
        name?: string
        year?: number
        width?: number
        height?: number
        root_zone?: string
        orientation?: string
        description?: string
        images?: string | string[]
        tree_name?: string
      }
      ;(treesResponse.trees || []).forEach((t: ApiTree) => {
        let imageUrl = ''
        if (t.images) {
          try {
            const imgs = typeof t.images === 'string' ? JSON.parse(t.images) : t.images
            if (Array.isArray(imgs) && imgs.length > 0) {
              imageUrl = imgs[0]
            }
          } catch (e) {
            if (typeof t.images === 'string') imageUrl = t.images
          }
        }
        statusMap.set(t.id, {
          status: t.status,
          name: t.name,
          year: t.year,
          width: t.width,
          height: t.height,
          root_zone: t.root_zone,
          orientation: t.orientation,
          description: t.description,
          image_url: imageUrl,
          tree_name: t.tree_name,
        })
      })

      const parsedTrees: TreeData[] = []
      let olivaCount = 0
      let almendrasCount = 0
      let adoptedCount = 0

      geojsonData.features.forEach((feature) => {
        if (feature.properties.type === 'tree') {
          const coords = feature.geometry.coordinates as number[]
          const dbInfo = statusMap.get(feature.id)
          // Si está en DB, usar su status; si no, chequear GeoJSON
          const treeStatus = dbInfo?.status || feature.properties.status || 'available'
          const adopted = treeStatus !== 'available'

          const tree: TreeData = {
            id: feature.id,
            name: dbInfo?.name || feature.properties.name,
            species: feature.properties.species,
            year: dbInfo?.year || 'Unknown',
            area: feature.properties.area,
            latitude: coords[1],
            longitude: coords[0],
            adopted,
            width: typeof dbInfo?.width === 'number' ? dbInfo.width : undefined,
            height: typeof dbInfo?.height === 'number' ? dbInfo.height : undefined,
            root_zone: dbInfo?.root_zone || '',
            orientation: dbInfo?.orientation || '',
            description: dbInfo?.description || '',
            image_url: dbInfo?.image_url || '',
            tree_name: dbInfo?.tree_name || '',
          }
          parsedTrees.push(tree)

          if (tree.species === 'Olive') {
            olivaCount++
          } else if (tree.species === 'Almond') {
            almendrasCount++
          }

          if (tree.adopted) {
            adoptedCount++
          }
        }
      })

      setMapTrees(parsedTrees)
      setStats({
        total: parsedTrees.length,
        oliva: olivaCount,
        almendras: almendrasCount,
        adopted: adoptedCount,
      })

      return parsedTrees
    } catch (error) {
      // ...existing code...
      return []
    }
  }

  // Función para renderizar marcadores en el mapa
  const renderMarkers = (parsedTrees: TreeData[], geojsonData: GeoJSONData) => {
    // Limpiar marcadores anteriores
    markers.current.forEach((marker) => {
      if (map.current) {
        map.current.removeLayer(marker)
      }
    })
    markers.current = []

    parsedTrees.forEach((tree) => {
      const isOliva = tree.species === 'Olive'
      const isAlmendra = tree.species === 'Almond'
      const isSpecialTree = tree.id === 'treeid001'
      
      // Si ningún filtro está activo, no mostrar nada
      if (!filters.oliva && !filters.almendra && !filters.adopted) return
      
      // Lógica independiente: cada filtro muestra lo que corresponde
      let shouldShow = false
      
      // Si es adoptado y el filtro adoptados está activo
      if (tree.adopted && filters.adopted) {
        shouldShow = true
      }
      
      // Si es disponible y coincide con filtro de especie
      if (!tree.adopted) {
        if ((isOliva && filters.oliva) || (isAlmendra && filters.almendra)) {
          shouldShow = true
        }
      }

      if (!shouldShow) return

      // Encontrar la feature correspondiente en GeoJSON
      const feature = geojsonData.features.find((f) => f.id === tree.id && f.properties.type === 'tree') as GeoJSONFeature | undefined
      if (!feature) return

      const coords = feature.geometry.coordinates as number[]
      if (!Array.isArray(coords) || coords.length < 2 || typeof coords[0] !== 'number' || typeof coords[1] !== 'number' || isNaN(coords[0]) || isNaN(coords[1])) {
        // ...existing code...
        return
      }
      // Si es el árbol especial, color verde igual que los demás
      // Si es el árbol especial, usar la misma lógica de color que los demás
      const color = tree.adopted ? '#f44336' : feature.properties.species === 'Olive' ? '#4caf50' : '#8d6e63'

      // Tamaño responsivo
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
            transition: all 0.3s ease;
          ">
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
        popupAnchor: [0, -(markerSize / 2)],
      })

      try {
        const marker = L.marker([coords[1], coords[0]], { icon })
          .addTo(map.current!)
          .on('click', () => {
            // Permitir abrir painel para qualquer árvore
            setSelectedTree(tree)
          })
        marker.bindPopup(
          `<strong>Tree #${tree.name}</strong><br/>
           Species: ${feature.properties.species}<br/>
           Area: ${feature.properties.area}`
        )
        markers.current.push(marker)
      } catch (e) {
        // ...existing code...
      }
    })
  }

  useEffect(() => {
    if (!mapContainer.current) return

    // Inicializar mapa
    if (!map.current) {
      map.current = L.map(mapContainer.current, {
        minZoom: 16,
      }).setView([41.79003211212408, 1.744052942308192], 18)

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

      satelliteLayer.addTo(map.current)

      const baseLayers = {
        'OpenStreetMap': osmLayer,
        'Satélite': satelliteLayer,
        'Topográfico': topoLayer,
      }

      L.control.layers(baseLayers).addTo(map.current)
    }

    // Carregar GeoJSON una sola vez
    if (!geoJsonData) {
      // Primero, sincronizar las adopciones con la BD
      fetch('/api/trees?sync=true')
        .then((res) => res.json())
        .catch(() => {})
        .then(() => {
          // Luego cargar el GeoJSON
          console.log('[MAPA] Usando archivo /mapa/mapa-main.json para cargar el mapa');
          return fetch('/mapa/mapa-main.json').then((res) => res.json())
        })
        .then((data) => {
          setGeoJsonData(data)
          // Actualizar estados de árboles e inicializar mapa
          return updateTreeStates(data).then((parsedTrees) => {
            renderMarkers(parsedTrees, data)
          })
        })
        .catch(() => {})
    }
  }, [geoJsonData])

  // Actualizar marcadores cada 30 segundos
  useEffect(() => {
    if (!geoJsonData) return

    const interval = setInterval(() => {
      updateTreeStates(geoJsonData).then((parsedTrees) => {
        renderMarkers(parsedTrees, geoJsonData)
      })
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [geoJsonData])

  useEffect(() => {
    if (!geoJsonData) return
    renderMarkers(mapTrees, geoJsonData)
  }, [filters, geoJsonData, mapTrees])

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }

      if (document.fullscreenEnabled && containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen()
        return
      }

      setIsPseudoFullscreen((prev) => !prev)
    } catch (error) {
      // ...existing code...
      setIsPseudoFullscreen((prev) => !prev)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col md:flex-row w-full h-full gap-0 overflow-hidden bg-white relative z-0 ${
        isPseudoFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Mapa - Responsive */}
      <div className="w-full md:flex-1 relative order-2 md:order-1 flex-1 z-0">
        {/* Botón Fullscreen */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2 z-20">
          <button
            onClick={toggleFullscreen}
            className="bg-white/95 backdrop-blur border border-gray-200 shadow-md text-gray-700 p-2 rounded-full"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 3H5a2 2 0 0 0-2 2v4" />
                <path d="M15 3h4a2 2 0 0 1 2 2v4" />
                <path d="M9 21H5a2 2 0 0 1-2-2v-4" />
                <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9V5a2 2 0 0 1 2-2h4" />
                <path d="M21 9V5a2 2 0 0 0-2-2h-4" />
                <path d="M3 15v4a2 2 0 0 0 2 2h4" />
                <path d="M21 15v4a2 2 0 0 1-2 2h-4" />
              </svg>
            )}
          </button>
        </div>

        <div
          ref={mapContainer}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 0,
          }}
        />

        {/* Botón Filtros - Mobile */}
        <div className="sm:hidden absolute bottom-4 right-4 z-20">
          <button
            onClick={() => setShowMobileLegend((prev) => !prev)}
            className="bg-white/95 backdrop-blur border border-gray-200 shadow-md text-gray-700 text-[12px] font-semibold px-4 py-2 rounded-full"
          >
            {showMobileLegend ? 'Close filters' : 'Filters'}
          </button>
        </div>

        {showMobileLegend && (
          <div className="sm:hidden absolute bottom-12 left-3 right-3 bg-white/95 backdrop-blur rounded-lg shadow-md border border-gray-200 z-20">
            <div className="px-3 py-2">
              <h3 className="font-semibold text-gray-800 text-xs">Legend</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: '#f44336' }}></span>
                  Adopted
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: '#8d6e63' }}></span>
                  Almond
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: '#4caf50' }}></span>
                  Olive
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200">
                <h4 className="font-semibold mb-1 text-gray-800 text-xs">Filters</h4>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.adopted}
                      onChange={(e) => setFilters((prev) => ({ ...prev, adopted: e.target.checked }))}
                      className="accent-sage-600"
                    />
                    Adopted
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.almendra}
                      onChange={(e) => setFilters((prev) => ({ ...prev, almendra: e.target.checked }))}
                      className="accent-sage-600"
                    />
                    Almonds
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.oliva}
                      onChange={(e) => setFilters((prev) => ({ ...prev, oliva: e.target.checked }))}
                      className="accent-sage-600"
                    />
                    Olives
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend + Filters - Responsive */}
        <div className="hidden sm:block absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-gray-200 z-20 overflow-hidden">
          <div className="px-4 py-3">
            <h3 className="font-semibold mb-2 text-gray-800 text-xs">Legend</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#4caf50' }}
                ></div>
                <span className="text-xs text-gray-700">Olive</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#8d6e63' }}
                ></div>
                <span className="text-xs text-gray-700">Almond</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#f44336' }}
                ></div>
                <span className="text-xs text-gray-700">Adopted</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-800 text-xs">Filters</h4>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.adopted}
                    onChange={(e) => setFilters((prev) => ({ ...prev, adopted: e.target.checked }))}
                    className="accent-sage-600"
                  />
                  Adopted
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.almendra}
                    onChange={(e) => setFilters((prev) => ({ ...prev, almendra: e.target.checked }))}
                    className="accent-sage-600"
                  />
                  Almonds
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.oliva}
                    onChange={(e) => setFilters((prev) => ({ ...prev, oliva: e.target.checked }))}
                    className="accent-sage-600"
                  />
                  Olives
                </label>
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
              background: `linear-gradient(135deg, ${selectedTree.species === 'Olive' ? '#4caf50' : '#8d6e63'} 0%, ${selectedTree.species === 'Olive' ? '#2e7d32' : '#5d4037'} 100%)`,
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {/* Nome personalizado central */}
              <h2 className="text-lg md:text-xl font-bold text-center w-full">
                {selectedTree.adopted && selectedTree.tree_name ? selectedTree.tree_name : ''}
              </h2>
              {/* Número e espécie no canto inferior esquerdo */}
              <div className="absolute left-0 bottom-0 flex items-center gap-2 pl-2 pb-1">
                <span className="text-base md:text-lg font-bold">#{selectedTree.name}</span>
                <span className="text-xs opacity-90">{selectedTree.species}</span>
              </div>
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
                <p className="font-semibold text-amber-900"> Adopted</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-300 rounded p-2 mb-3 text-xs">
                <p className="font-semibold text-green-900"> Available</p>
              </div>
            )}

              <div className="grid grid-cols-2 gap-2 text-xs">
        
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 text-xs">Specie</p>
                  <p className="font-semibold text-gray-800">{selectedTree.species}</p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 text-xs">Year</p>
                  <p className="font-semibold text-gray-800">{selectedTree.year || 'Unknown'}</p>
                </div>
                {selectedTree.description && (
                  <div className="border-b border-gray-200 pb-2 col-span-2">
                    <p className="text-gray-500 text-xs">Description</p>
                    <p className="font-semibold text-gray-800 whitespace-pre-line">{selectedTree.description}</p>
                  </div>
                )}
              <div className="border-b border-gray-200 pb-2 col-span-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">Zone</p>
                  <p className="font-semibold text-gray-800">{selectedTree.area}</p>
                </div>
                {selectedTree.root_zone && (
                  <div>
                    <p className="text-gray-500 text-xs">Root Zone</p>
                    <p className="font-semibold text-gray-800">{selectedTree.root_zone}</p>
                  </div>
                )}
              </div>
              {selectedTree.orientation && (
                <div className="border-b border-gray-200 pb-2 col-span-2">
                  <p className="text-gray-500 text-xs">Orientation</p>
                  <p className="font-semibold text-gray-800">{selectedTree.orientation}</p>
                </div>
              )}
              <div className="border-b border-gray-200 pb-2 col-span-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">Lat</p>
                  <p className="font-mono text-gray-800 text-xs">{selectedTree.latitude.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Lon</p>
                  <p className="font-mono text-gray-800 text-xs">{selectedTree.longitude.toFixed(4)}</p>
                </div>
              </div>
              {(typeof selectedTree.width === 'number' || typeof selectedTree.height === 'number') && (
                <div className="col-span-2 border-b border-gray-200 pb-2">
                  <p className="text-gray-500 text-xs">Size</p>
                  <p className="font-mono text-gray-800 text-xs">
                    {typeof selectedTree.width === 'number' ? `Width: ${selectedTree.width} m` : ''}
                    {typeof selectedTree.width === 'number' && typeof selectedTree.height === 'number' ? ' · ' : ''}
                    {typeof selectedTree.height === 'number' ? `Height: ${selectedTree.height} m` : ''}
                  </p>
                </div>
              )}

              <div className="col-span-2 border-b border-gray-200 pb-2">
                <p className="text-gray-500 text-xs">Price</p>
                <p className="font-bold text-lg text-green-600">
                  €{selectedTree.species === 'Olive' ? (olivePrice / 100).toFixed(2) : (almondPrice / 100).toFixed(2)}
                </p>
                {/* Foto da árvore */}
                <div className="w-full flex flex-col items-center mt-2">
                  <img
                    src={selectedTree.image_url || treeImages[selectedTree.species] || '/logo.jpeg'}
                    alt={selectedTree.species + ' tree'}
                    className="rounded-lg shadow-md object-cover cursor-pointer transition hover:scale-105"
                    style={{ maxWidth: '120px', maxHeight: '180px', width: 'auto', height: '240px', border: '2px solid #e5e7eb', objectFit: 'cover' }}
                    onClick={() => setShowImageModal(true)}
                  />
                  <span className="text-xs text-gray-500 mt-1">Click to enlarge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer com Ações */}
          <div className="border-t border-gray-200 p-2 md:p-3 space-y-1.5 md:space-y-2 bg-gray-50">
            {!selectedTree.adopted ? (
              <>
                {/* Botones condicionales basados en estado del carrito */}
                {!isTreeInCart ? (
                  // Button to add to cart (only if not in cart)
                  <button
                    onClick={() => handleAddToCart(selectedTree)}
                    disabled={addingToCart}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs md:text-sm font-bold py-1.5 md:py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    {addingToCart ? '⏳ Adding...' : '✅ Add to Cart'}
                  </button>
                ) : (
                  // Button to go to cart (only if tree is in cart)
                  <Link href="/adopt/checkout">
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm font-bold py-1.5 md:py-2 rounded transition flex items-center justify-center gap-2">
                      🛒 Cart ({getTreeCount()})
                    </button>
                  </Link>
                )}
              </>
            ) : null}
            <button
              onClick={() => setSelectedTree(null)}
              className="w-full bg-white border border-gray-300 text-gray-700 text-xs md:text-sm font-semibold py-1.5 rounded hover:border-gray-400 hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        {/* Modal de imagem ampliada */}
        {showImageModal && (
          <ImageModal
            src={selectedTree.image_url || treeImages[selectedTree.species] || '/logo.jpeg'}
            alt={selectedTree.species + ' tree'}
            onClose={() => setShowImageModal(false)}
          />
        )}
        </div>
      ) : (
        <div className="w-full md:w-96 bg-white shadow-lg md:shadow-none md:border-l border-gray-200 flex flex-col overflow-hidden order-1 md:order-2 h-auto md:h-full">
          {/* Statistics Header */}
          <div className="bg-gradient-to-r from-sage-600 to-amber-600 text-white p-3 md:p-4">
            <h2 className="text-base md:text-lg font-bold mb-0">📍 Information</h2>
            <p className="text-xs opacity-90">Statistics</p>
          </div>

          {/* Statistics Content - Compact Grid */}
          <div className="flex-1 p-3 md:p-4 overflow-hidden">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {/* Total */}
              <div className="bg-gray-100 rounded-md p-2 md:p-3 border border-gray-300">
                <div className="flex flex-col items-center text-center">
                  <p className="text-[11px] md:text-xs text-gray-600 font-medium">Total</p>
                  <p className="text-xl md:text-3xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-[10px] md:text-xs text-gray-500">🌳</p>
                </div>
              </div>

              {/* Olive */}
              <div className="bg-green-100 rounded-md p-2 md:p-3 border-2 border-[#5a8c4a]">
                <div className="flex flex-col items-center text-center">
                  <p className="text-[11px] md:text-xs text-gray-600 font-medium">Olive</p>
                  <p className="text-xl md:text-3xl font-bold text-blue-600">{stats.oliva}</p>
                  <p className="text-[10px] md:text-xs text-gray-500">({((stats.oliva / stats.total) * 100).toFixed(1)}%)</p>
                </div>
              </div>

              {/* Almonds */}
              <div className="bg-amber-200 rounded-md p-2 md:p-3 border-2 border-[#8B5C2A] relative" style={{backgroundColor:'#e2c6a7'}}>
                <div className="flex flex-col items-center text-center">
                  <p className="text-[11px] md:text-xs text-gray-600 font-medium">Almonds</p>
                  <p className="text-xl md:text-3xl font-bold text-[#8B5C2A]">{stats.almendras}</p>
                  <p className="text-[10px] md:text-xs text-gray-500">({((stats.almendras / stats.total) * 100).toFixed(1)}%)</p>
                </div>
              </div>

              {/* Adopted */}
              <div className="bg-red-100 rounded-md p-2 md:p-3 border border-red-300">
                <div className="flex flex-col items-center text-center">
                  <p className="text-[11px] md:text-xs text-gray-600 font-medium">Adopted</p>
                  <p className="text-xl md:text-3xl font-bold text-amber-600">{stats.adopted}</p>
                  <p className="text-[10px] md:text-xs text-gray-500">✅</p>
                </div>
              </div>

              {/* Available */}
              <div className="bg-green-50 rounded-md p-2 md:p-3 border border-green-300 col-span-2">
                <div className="flex flex-col items-center text-center">
                  <p className="text-[11px] md:text-xs text-gray-600 font-medium">Available</p>
                  <p className="text-xl md:text-3xl font-bold text-green-600">{stats.total - stats.adopted}</p>
                  <p className="text-[10px] md:text-xs text-gray-500">({(((stats.total - stats.adopted) / stats.total) * 100).toFixed(1)}%) 💚</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-2 md:p-3 bg-gray-50 text-center text-[10px] md:text-xs text-gray-500">
            <p>Click on a tree</p>
          </div>
        </div>
      )}
    </div>
  )
}
