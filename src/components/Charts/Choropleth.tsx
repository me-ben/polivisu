// https://claude.ai/share/9202ab18-a7b0-4a6e-b6f7-d35102d4fe12

import React, { useState } from 'react';

// Diese Pfade würdest du mit dem generate-paths.mjs Script generieren
// Hier als Beispiel mit vereinfachten Formen
import { BUNDESLAENDER } from 'public/maps/bundeslaender-paths.js';

// Farbskala für Choropleth Map
const getColor = (value: number) => {
  if (value === null || value === undefined) return '#e0e0e0';
  if (value < 20) return '#fee5d9';
  if (value < 40) return '#fcae91';
  if (value < 60) return '#fb6a4a';
  if (value < 80) return '#de2d26';
  return '#a50f15';
};

type DataMap = Record<string, number>;

const GermanyChoroplethMap = () => {
  const [data, setData] = useState<DataMap>({
    'DE-BW': 45,
    'DE-BY': 72,
    'DE-BE': 88,
    'DE-BB': 34,
    'DE-HB': 56,
    'DE-HH': 91,
    'DE-HE': 67,
    'DE-MV': 23,
    'DE-NI': 41,
    'DE-NW': 78,
    'DE-RP': 52,
    'DE-SL': 38,
    'DE-SN': 63,
    'DE-ST': 29,
    'DE-SH': 85,
    'DE-TH': 47
  });

  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const generateRandomData = () => {
    const newData: DataMap = {};
    BUNDESLAENDER.forEach(land => {
      newData[land.id] = Math.floor(Math.random() * 100);
    });
    setData(newData);
  };
}

  return (
    <div className="w-full h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Deutschland Choropleth Karte
            </h1>
            <p className="text-gray-600">
              Interaktive Visualisierung von regionalen Daten
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Karte */}
            <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
              <svg
                viewBox="0 0 700 700"
                className="w-full h-auto"
                style={{ maxHeight: '600px' }}
                preserveAspectRatio="xMidYMid meet"
              >
                {BUNDESLAENDER.map(land => (
                  <path
                    key={land.id}
                    d={land.path}
                    fill={getColor(data[land.id])}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-200 cursor-pointer"
                    style={{
                      filter: hoveredState === land.id ? 'brightness(0.9)' : 'none',
                      opacity: hoveredState && hoveredState !== land.id ? 0.7 : 1
                    }}
                    onMouseEnter={() => setHoveredState(land.id)}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                ))}
              </svg>

              {/* Hover-Info */}
              {hoveredState && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-semibold text-lg text-gray-800">
                    {BUNDESLAENDER.find(l => l.id === hoveredState)?.name}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {data[hoveredState]}%
                  </div>
                </div>
              )}
            </div>

            {/* Legende und Steuerung */}
            <div className="space-y-6">
              {/* Farbskala */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Legende</h3>
                <div className="space-y-2">
                  {[
                    { range: '80-100%', color: '#a50f15' },
                    { range: '60-80%', color: '#de2d26' },
                    { range: '40-60%', color: '#fb6a4a' },
                    { range: '20-40%', color: '#fcae91' },
                    { range: '0-20%', color: '#fee5d9' }
                  ].map(item => (
                    <div key={item.range} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700">{item.range}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button */}
              <button
                onClick={generateRandomData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Neue Zufallsdaten
              </button>

              {/* Bundesländer-Liste */}
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-gray-800 mb-3">Alle Bundesländer</h3>
                <div className="space-y-2">
                  {BUNDESLAENDER.map(land => (
                    <div
                      key={land.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-white transition-colors cursor-pointer"
                      onMouseEnter={() => setHoveredState(land.id)}
                      onMouseLeave={() => setHoveredState(null)}
                    >
                      <span className="text-sm text-gray-700">{land.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {data[land.id]}%
                        </span>
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: getColor(data[land.id]) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GermanyChoroplethMap;