
"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type Tree = {
  id: string;
  lat: number;
  lng: number;
  name?: string;
};

type Props = {
  trees: Tree[];
  center?: [number, number];
};

export default function TreeMapLeafletClient({ trees, center = [37.7749, -3.7896] }: Props) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {trees.map((tree) => (
        <Marker key={tree.id} position={[tree.lat, tree.lng]}>
          <Popup>
            <strong>ID:</strong> {tree.id}
            <br />
            <span>Lat: {tree.lat}, Lng: {tree.lng}</span>
            {tree.name && <div><strong>Nome:</strong> {tree.name}</div>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export type Tree = {
  id: string;
  lat: number;
  lng: number;
  name?: string;
};

type Props = {
  trees: Tree[];
  center?: [number, number];

export default function TreeMapLeafletClient({ trees, center = [37.7749, -3.7896] }: Props) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {trees.map((tree) => (
        <Marker key={tree.id} position={[tree.lat, tree.lng]}>
          <Popup>
            <strong>ID:</strong> {tree.id}
            <br />
            <span>Lat: {tree.lat}, Lng: {tree.lng}</span>
            {tree.name && <div><strong>Nome:</strong> {tree.name}</div>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
*** End Patch
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {trees.map(tree => (
            <Marker key={tree.id} position={[tree.lat, tree.lng]}>
              <Popup>
                <div>
                  <strong>ID:</strong> {tree.id}<br />
                  <span>Lat: {tree.lat}, Lng: {tree.lng}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  }
              eventHandlers={{ click: () => onTreeSelect?.(tree) }}
