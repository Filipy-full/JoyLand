'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface Tree {
  id: string
  name: string | null
  type: string
  latitude: number
  longitude: number
  status: string
}

interface TreeMapProps {
  trees: Tree[]
  onTreeSelect?: (tree: Tree) => void
}

export default function TreeMap({ trees, onTreeSelect }: TreeMapProps) {
  const [mounted, setMounted] = useState(false)
  const [customIcon, setCustomIcon] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      
      // Fix for default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      // Custom icons
      const availableIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      const adoptedIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      setCustomIcon({ available: availableIcon, adopted: adoptedIcon })
    }
  }, [])

  if (!mounted || !customIcon) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    )
  }

  // Default center (northern Spain coordinates - adjust to your actual location)
  const center: [number, number] = [42.8, -5.5]
  const zoom = 15

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            position={[tree.latitude, tree.longitude]}
            icon={tree.status === 'available' ? customIcon.available : customIcon.adopted}
            eventHandlers={{
              click: () => {
                if (onTreeSelect) {
                  onTreeSelect(tree)
                }
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-serif text-lg mb-2">
                  {tree.name || `Árbol #${tree.id.slice(0, 8)}`}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Tipo: {tree.type === 'olive' ? 'Olivo' : 'Almendro'}
                </p>
                <p className="text-sm mb-3">
                  Estado: <span className={tree.status === 'available' ? 'text-green-600 font-semibold' : 'text-red-600'}>
                    {tree.status === 'available' ? 'Disponible' : 'Adoptado'}
                  </span>
                </p>
                {tree.status === 'available' && (
                  <button
                    onClick={() => onTreeSelect && onTreeSelect(tree)}
                    className="w-full bg-sage-600 text-white px-4 py-2 rounded-full hover:bg-sage-700 transition-colors text-sm"
                  >
                    Adoptar este árbol
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
