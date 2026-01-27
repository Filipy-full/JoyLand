import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const grayIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function TreeMapLeaflet({ trees, onTreeSelect }: { trees: any[], onTreeSelect?: (tree: any) => void }) {
  const center = [42.8005, -2.7005];

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-sage-200">
      <MapContainer
        center={center}
        zoom={17}
        minZoom={16}
        maxZoom={18}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={false}
        dragging={true}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trees.map(tree => (
          <Marker
            key={tree.id}
            position={[tree.latitude, tree.longitude]}
            icon={tree.status === 'available' ? greenIcon : grayIcon}
            eventHandlers={{
              click: () => {
                if (onTreeSelect) {
                  onTreeSelect(tree);
                } else {
                  window.location.href = `/tree/${tree.id}`;
                }
              },
            }}
          >
            <Popup>
              <div className="text-center">
                <div className="font-bold text-sage-700 text-lg mb-1">
                  {tree.type === 'olive' ? 'Olivo' : 'Almendro'} #{tree.id.replace(/[^0-9]/g, '')}
                </div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${tree.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {tree.status === 'available' ? 'Disponible' : 'Adoptado'}
                </div>
                <a
                  href={`/tree/${tree.id}`}
                  className="mt-3 inline-block bg-sage-600 text-white px-4 py-2 rounded-full hover:bg-sage-700 transition-all text-sm font-medium"
                  style={{ textDecoration: 'none' }}
                >
                  Ver árbol
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
