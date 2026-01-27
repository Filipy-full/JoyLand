
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export type Tree = {
  id: string;
  lat: number;
  lng: number;
};

  trees,
  onTreeSelect,
}: {
  trees: Tree[];
  onTreeSelect?: (tree: Tree) => void;
}) {
  return (
    <MapContainer center={[0, 0]} zoom={13} style={{ height: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trees.map(tree => (
        <Marker key={tree.id} position={[tree.lat, tree.lng]} eventHandlers={{ click: () => onTreeSelect?.(tree) }}>
          <Popup>
            <div>
              <strong>ID:</strong> {tree.id}<br />
              <strong>Lat:</strong> {tree.lat}<br />
              <strong>Lng:</strong> {tree.lng}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
