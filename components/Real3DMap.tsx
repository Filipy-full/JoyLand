"use client";
import React, { useRef, useEffect } from "react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const CENTER: [number, number] = [1.744050, 41.790297]; // [lng, lat]

export default function Real3DMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      // eslint-disable-next-line no-console
      console.error("Mapbox token não definido");
      return;
    }
    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = MAPBOX_TOKEN;
      const map = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: CENTER,
        zoom: 16.5,
        pitch: 60, // inclinação para 3D
        bearing: 0,
        interactive: false, // mapa fixo
        antialias: true,
      });
      mapRef.current = map;
      map.on("load", () => {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.terrain-rgb",
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.3 });
        map.addControl(new mapboxgl.default.NavigationControl(), "top-right");
      });
    });
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: 500, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px #0002" }}
    />
  );
}
