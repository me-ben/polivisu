'use client';

import React, { useState, useEffect } from 'react';
import { geoMercator, geoPath } from 'd3-geo';

interface BundeslandFeature {
  type: string;
  id: number;
  properties: {
    NAME_1: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][][] | number[][][];
  };
}

interface Bundesland {
  id: string;
  name: string;
  path: string;
  value: number;
}

const STATE_ID_MAP: Record<string, string> = {
  'Baden-Württemberg': 'DE-BW',
  'Bayern': 'DE-BY',
  'Berlin': 'DE-BE',
  'Brandenburg': 'DE-BB',
  'Bremen': 'DE-HB',
  'Hamburg': 'DE-HH',
  'Hessen': 'DE-HE',
  'Mecklenburg-Vorpommern': 'DE-MV',
  'Niedersachsen': 'DE-NI',
  'Nordrhein-Westfalen': 'DE-NW',
  'Rheinland-Pfalz': 'DE-RP',
  'Saarland': 'DE-SL',
  'Sachsen': 'DE-SN',
  'Sachsen-Anhalt': 'DE-ST',
  'Schleswig-Holstein': 'DE-SH',
  'Thüringen': 'DE-TH'
};

const COLOR_SCALE = [
  '#ff0000',
  '#ff4b00',
  '#ff7100',
  '#ff9100',
  '#ffae00',
  '#ffca00',
  '#fde500',
  '#f4ff00'
];

function ChoroplethMap(): React.JSX.Element {
  const [bundeslaender, setBundeslaender] = useState<Bundesland[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colorRanges, setColorRanges] = useState<
    Array<{ start: number; end: number; color: string }>
  >([]);

  useEffect(() => {
    const loadGeoJSON = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/maps/de_bundeslaender.geojson');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const geojsonData = await response.json();
        const projection = geoMercator().center([10, 51.5]).scale(4100).translate([300, 430]);
        const pathGenerator = geoPath().projection(projection);

        const dataWithValues = geojsonData.features.map((feature: BundeslandFeature) => ({
          id: STATE_ID_MAP[feature.properties.NAME_1] || `DE-${feature.id}`,
          name: feature.properties.NAME_1,
          path: pathGenerator(feature),
          value: getValue(feature.properties.NAME_1)
        }));

        const values = dataWithValues.map(item => item.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        const numSteps = COLOR_SCALE.length;
        const step = range / numSteps;
        const ranges = [];

        for (let i = 0; i < numSteps; i++) {
          const start = min + i * step;
          const end = i === numSteps - 1 ? max : min + (i + 1) * step;
          ranges.push({ start, end, color: COLOR_SCALE[i] });
        }

        setColorRanges(ranges);
        setBundeslaender(dataWithValues);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map data');
      } finally {
        setIsLoading(false);
      }
    };

    void loadGeoJSON();
  }, []);

  const getValue = (name: string): number => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 100);
  };

  const getColor = (value: number): string => {
    for (const range of colorRanges) {
      if (value >= range.start && value <= range.end) {
        return range.color;
      }
    }
    return COLOR_SCALE[0];
  };

  if (error) {
    return <div className="error" style={{ color: '#d32f2f', padding: '1rem' }}>{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>
        Karte wird geladen...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '50%', overflow: 'auto' }}>
      <svg viewBox="0 0 665 900" style={{ width: '100%', height: 'auto'}}>
        {bundeslaender.map(({ id, name, path, value }) => (
          <g key={id}>
            <path
              d={path}
              fill={getColor(value)}
              stroke="black"
              strokeWidth="0.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              onMouseEnter={e => (e.currentTarget.style.fill = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.fill = getColor(value))}
            >
              <title>{`${name}: ${value.toFixed(1)}`}</title>
            </path>
          </g>
        ))}
      </svg>
    </div>
  );
}

ChoroplethMap.displayName = 'ChoroplethMap';

export default ChoroplethMap;
