'use client';

import React, { useState, useEffect } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import type { PathOptions } from "leaflet";

interface BundeslandProperties {
  id: string;
  name: string;
  type: string;
}

interface ChoroplethMapProps {
  regionData?: Record<string, number>;
}

const normalizeName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\./g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
};

const getStyle = (regionData: Record<string, number> = {}): ((feature?: Feature) => PathOptions) => {
  const getColor = (value: number): string => {
    return value > 10 
      ? "#08519c" 
      : value > 7 
        ? "#3182bd" 
        : value > 4 
          ? "#6baed6" 
          : "#bdd7e7";
  };

  return (feature?: Feature): PathOptions => {
    if (!feature?.properties) return {};

    const properties = feature.properties as BundeslandProperties;
    const normalizedBundesland = normalizeName(properties.name);
    const value = regionData[normalizedBundesland] ?? 0; // Nullish Coalescing für Typsicherheit

    return {
      fillColor: getColor(value),
      weight: 1,
      opacity: 1,
      color: "#fff",
      fillOpacity: 0.9,
    };
  };
};

export default function ChoroplethMap({ regionData = {} }: ChoroplethMapProps) {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch('/maps/germany_bundeslaender.geojson')
      .then(response => {
        if (!response.ok) throw new Error('GeoJSON nicht gefunden');
        return response.json();
      })
      .then(data => setGeoJsonData(data))
      .catch(console.error);
  }, []);

  if (!geoJsonData) {
    return <div className="h-[300px] w-full bg-red-500 flex items-center justify-center">
      Karte lädt...
    </div>;
  }

  return (
    <MapContainer
      center={[51.1657, 10.4515]}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
      zoomControl={true}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      touchZoom={false}
    >

      <GeoJSON
        data={geoJsonData}
        style={getStyle(regionData)}
        onEachFeature={(feature, layer) => {
          if (!feature.properties) return;

          const properties = feature.properties as BundeslandProperties;
          const normalizedBundesland = normalizeName(properties.name);
          const rawValue = regionData[normalizedBundesland];

          // TYPGESICHERE WERTANZEIGE
          const displayValue = rawValue !== undefined
            ? rawValue.toFixed(1)  // Nur Zahlen formatieren
            : "Nicht verfügbar";

          layer.bindPopup(
            `<strong>${properties.name}</strong><br>Wert: ${displayValue}`
          );
        }}
      />
    </MapContainer>
  );
}
