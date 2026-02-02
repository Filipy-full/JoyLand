'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './map-styles.css'
import Link from 'next/link'
import { useAdoptionCart } from '@/contexts/AdoptionCart'

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
}

export default function InteractiveGeoJsonMap() {
  const searchParams = useSearchParams()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markers = useRef<L.Marker[]>([])
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null)
  const [mapTrees, setMapTrees] = useState<TreeData[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null)
  const [filters, setFilters] = useState({
    adopted: false,
    oliva: true,
    almendra: true,
  })
  const [showMobileLegend, setShowMobileLegend] = useState(false)
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
        console.error('Error fetching prices:', err)
      }
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const filterParam = searchParams.get('filter')
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
      const treeType = tree.species === 'Oliveira' ? 'olivo' : 'almendro'
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
      console.error('Error adding tree:', err)
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

  // Función para actualizar estados de árboles desde API
  const updateTreeStates = async (geojsonData: GeoJSONData) => {
    try {
      const treesResponse = await fetch('/api/trees').then((res) => res.json())
      const statusMap = new Map<string, { status?: string; name?: string }>()
      ;(treesResponse.trees || []).forEach((t: any) => {
        statusMap.set(t.id, { status: t.status, name: t.name })
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
            year: feature.properties.year,
            area: feature.properties.area,
            latitude: coords[1],
            longitude: coords[0],
            adopted,
          }
          parsedTrees.push(tree)

          if (tree.species === 'Oliveira') {
            olivaCount++
          } else if (tree.species === 'Almendras') {
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
      console.error('Error updating tree states:', error)
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
      const isOliva = tree.species === 'Oliveira'
      const isAlmendra = tree.species === 'Almendras'
      const matchesSpecies = (isOliva && filters.oliva) || (isAlmendra && filters.almendra)
      const matchesAdopted = tree.adopted ? filters.adopted : true

      if (!matchesSpecies || !matchesAdopted) return

      // Encontrar la feature correspondiente en GeoJSON
      const feature = geojsonData.features.find((f) => f.id === tree.id && f.properties.type === 'tree') as GeoJSONFeature | undefined
      if (!feature) return

      const coords = feature.geometry.coordinates as number[]
      const color = tree.adopted ? '#9e9e9e' : feature.properties.species === 'Oliveira' ? '#1976d2' : '#d32f2f'

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
          // Solo permitir seleccionar si no está adoptado
          if (!tree.adopted) {
            setSelectedTree(tree)
          }
        })

      marker.bindPopup(
        `<strong>Árvore #${tree.name}</strong><br/>
         Espécie: ${feature.properties.species}<br/>
         Ano: ${feature.properties.year}<br/>
         Zona: ${feature.properties.area}<br/>
         Estado: ${tree.adopted ? 'Adoptada ✓' : 'Disponible'}`
      )

      markers.current.push(marker)
    })
  }

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
        .catch((error) => console.error('Error syncing adoptions:', error))
        .then(() => {
          // Luego cargar el GeoJSON
          return fetch('/geojson-map.json').then((res) => res.json())
        })
        .then((data) => {
          setGeoJsonData(data)
          // Actualizar estados de árboles e inicializar mapa
          return updateTreeStates(data).then((parsedTrees) => {
            renderMarkers(parsedTrees, data)
          })
        })
        .catch((error) => console.error('Error loading GeoJSON:', error))
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

        {/* Botón Filtros - Mobile */}
        <div className="sm:hidden absolute bottom-4 right-4 z-20">
          <button
            onClick={() => setShowMobileLegend((prev) => !prev)}
            className="bg-white/95 backdrop-blur border border-gray-200 shadow-md text-gray-700 text-[12px] font-semibold px-4 py-2 rounded-full"
          >
            {showMobileLegend ? 'Cerrar filtros' : 'Filtros'}
          </button>
        </div>

        {showMobileLegend && (
          <div className="sm:hidden absolute bottom-12 left-3 right-3 bg-white/95 backdrop-blur rounded-lg shadow-md border border-gray-200 z-20">
            <div className="px-3 py-2">
              <h3 className="font-semibold text-gray-800 text-xs">Leyenda</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: '#9e9e9e' }}></span>
                  Adoptado
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: '#d32f2f' }}></span>
                  Almendra
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: '#1976d2' }}></span>
                  Oliva
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200">
                <h4 className="font-semibold mb-1 text-gray-800 text-xs">Filtros</h4>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.adopted}
                      onChange={(e) => setFilters((prev) => ({ ...prev, adopted: e.target.checked }))}
                      className="accent-sage-600"
                    />
                    Adoptado
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.almendra}
                      onChange={(e) => setFilters((prev) => ({ ...prev, almendra: e.target.checked }))}
                      className="accent-sage-600"
                    />
                    Almendras
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.oliva}
                      onChange={(e) => setFilters((prev) => ({ ...prev, oliva: e.target.checked }))}
                      className="accent-sage-600"
                    />
                    Olivas
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legenda + Filtros - Responsive */}
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
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#9e9e9e' }}
                ></div>
                <span className="text-xs text-gray-700">Adoptado</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-800 text-xs">Filtros</h4>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.adopted}
                    onChange={(e) => setFilters((prev) => ({ ...prev, adopted: e.target.checked }))}
                    className="accent-sage-600"
                  />
                  Adoptado
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.almendra}
                    onChange={(e) => setFilters((prev) => ({ ...prev, almendra: e.target.checked }))}
                    className="accent-sage-600"
                  />
                  Almendras
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.oliva}
                    onChange={(e) => setFilters((prev) => ({ ...prev, oliva: e.target.checked }))}
                    className="accent-sage-600"
                  />
                  Olivas
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
              <div className="col-span-2 border-b border-gray-200 pb-2">
                <p className="text-gray-500 text-xs">Precio</p>
                <p className="font-bold text-lg text-green-600">
                  €{selectedTree.species === 'Oliveira' ? (olivePrice / 100).toFixed(2) : (almondPrice / 100).toFixed(2)}
                </p>
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
                {/* Botones condicionales basados en estado del carrito */}
                {!isTreeInCart ? (
                  // Botón para agregar al carrito (solo si no está en el carrito)
                  <button
                    onClick={() => handleAddToCart(selectedTree)}
                    disabled={addingToCart}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs md:text-sm font-bold py-1.5 md:py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    {addingToCart ? '⏳ Agregando...' : '✅ Agregar al Carrito'}
                  </button>
                ) : (
                  // Botón para ir al carrito (solo si el árbol está en el carrito)
                  <Link href="/adopt/checkout">
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm font-bold py-1.5 md:py-2 rounded transition flex items-center justify-center gap-2">
                      🛒 Carrito ({getTreeCount()})
                    </button>
                  </Link>
                )}
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
