"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

export interface Tree {
  id: string;
  latitude: number;
  longitude: number;
  status: string;
  type: string;
}

export default function TreeMapLeafletClient({
  trees,
  onTreeSelect,
}: {
  trees: Tree[];
  onTreeSelect?: (tree: Tree) => void;
}) {
  const center: LatLngTuple = [42.8005, -2.7005];

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-sage-200">
      <MapContainer
        center={center}
        zoom={17}
        minZoom={16}
        maxZoom={18}
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={false}
        dragging={true}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            position={[tree.latitude, tree.longitude] as LatLngTuple}
            icon={tree.status === "available" ? greenIcon : grayIcon}
            eventHandlers={{
              click: () => onTreeSelect?.(tree),
            }}
          >
            <Popup>
              <div>
                <strong>{tree.type}</strong>
                <br />
                Estado: {tree.status}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
