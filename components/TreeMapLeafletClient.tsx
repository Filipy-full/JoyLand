
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type Tree = {
  id: string;
  lat: number;
  lng: number;
};

type Props = {
  trees: Tree[];
  onTreeSelect?: (tree: Tree) => void;
};

  // Centrado en la finca de JoyLand (ejemplo: norte de España)
  const center = [42.8005, -2.7005];

  // Icono personalizado para los árboles
  const treeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [30, 48],
    iconAnchor: [15, 48],
    popupAnchor: [0, -40],
    shadowSize: [48, 48],
  });

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-sage-200 bg-sage-50" style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={17}
        minZoom={16}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        dragging={true}
        doubleClickZoom={false}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trees.map(tree => (
          <Marker
            key={tree.id}
            position={[tree.lat, tree.lng]}
            icon={treeIcon}
            eventHandlers={{ click: () => onTreeSelect?.(tree) }}
          >
            <Popup>
              <div className="text-sage-700 font-serif">
                <strong>Árbol:</strong> {tree.id}<br />
                <span>Lat: {tree.lat}, Lng: {tree.lng}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
