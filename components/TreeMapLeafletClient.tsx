"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";

export type Tree = {
  id: string;
  name?: string;
  type?: string;
  status?: string;
  latitude: number;
  longitude: number;
};

type Props = {
  trees: Tree[];
  center?: [number, number];
};

export default function TreeMapLeafletClient({ trees, center }: Props) {
  const router = useRouter();

  // Custom icons
  const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const grayIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer center={center} zoom={17} minZoom={16} maxZoom={18} style={{ height: "500px", width: "100%" }} scrollWheelZoom={false} zoomControl={false} dragging={true} doubleClickZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {trees.map((tree) => {
        const isAvailable = tree.status === "available";
        const markerIcon = isAvailable ? greenIcon : grayIcon;
        const treeCode = tree.name || (tree.type ? `${tree.type.charAt(0).toUpperCase() + tree.type.slice(1)} #${tree.id.slice(-2)}` : `Tree #${tree.id}`);
        const statusLabel = isAvailable ? "Available" : "Adopted";
        const link = isAvailable
          ? `/adopt/${tree.type || 'tree'}/${tree.id}`
          : `/tree/${tree.id}`;
        return (
          <Marker
            key={tree.id}
            position={[tree.latitude, tree.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () => router.push(link),
            }}
          >
            <Popup>
              <div className="text-center">
                <div className="font-bold text-sage-700">{treeCode}</div>
                <div className="text-xs mb-1">{statusLabel}</div>
                <button
                  className={`mt-2 px-4 py-2 rounded-full text-white ${isAvailable ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                  onClick={() => router.push(link)}
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'Adopt this tree' : 'View tree'}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

