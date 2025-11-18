import { geoPath, geoMercator } from 'd3-geo';
import { readFileSync, writeFileSync } from 'fs';

// 1. GeoJSON laden
const geojson = JSON.parse(readFileSync('germany_bundeslaender.geo.json', 'utf-8'));

// 2. Projektion konfigurieren
// Diese verwandelt Längen-/Breitengrade in x/y-Pixel-Koordinaten
const projection = geoMercator()
  .center([10.4515, 51.1657])  // Deutschland Mittelpunkt (Länge, Breite)
  .scale(4000)                  // Zoom-Level (höher = größer)
  .translate([350, 350]);       // Verschiebung im SVG (Zentrierung)

// 3. Path-Generator erstellen
// Dieser nimmt GeoJSON-Geometrie und macht daraus SVG-Pfade
const pathGenerator = geoPath().projection(projection);

// 4. Für jedes Bundesland einen SVG-Pfad generieren
const paths = geojson.features.map(feature => {
  return {
    id: feature.properties.iso || feature.properties.id,  // z.B. "DE-BY"
    name: feature.properties.name,                         // z.B. "Bayern"
    path: pathGenerator(feature)                           // SVG-Pfad-String
  };
});

// 5. Als JavaScript-Datei speichern
const output = `// Automatisch generiert aus GeoJSON
export const BUNDESLAENDER = ${JSON.stringify(paths, null, 2)};
`;

writeFileSync('bundeslaender-paths.js', output, 'utf-8');
console.log('✅ SVG-Pfade erfolgreich generiert!');
console.log(`📄 Siehe: bundeslaender-paths.js`);