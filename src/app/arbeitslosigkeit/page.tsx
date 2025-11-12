// page.tsx
import { Content } from '@/components/Content/Content';
import { LineChart } from '@/components/Charts/LineChart';
import ChoroplethMap from '@/components/Charts/ChoroplethMapWrapper';
import { loadCsvData } from '@/lib/data/loaders/csv-loader';
import type { ChartData } from '@/lib/data/types';

async function getData() {
  const [chartData, chartData2, chartData3] = await Promise.all([
    loadCsvData('data/arbeitslosenquote_de_bundeslaender_2024.csv'),
    loadCsvData('data/bip_kopf_de_bundeslaender_2024.csv'),
    loadCsvData('data/bundestagswahl_2025.csv')
  ]);

  return { chartData, chartData2, chartData3 };
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

const extractRegionData = (chartData: ChartData, column: string) => {
  return Object.fromEntries(
    chartData.data
      .filter(row => 
        row.Bundesland != null && 
        (typeof row[column] === 'string' || typeof row[column] === 'number')
      )
      .map(row => {
        const bundeslandName = String(row.Bundesland);
        const numericValue = 
          typeof row[column] === 'number' 
            ? row[column] 
            : parseFloat(row[column]);

        return [
          normalizeName(bundeslandName),
          isNaN(numericValue) ? 0 : numericValue
        ];
      })
  );
};

export default async function ArbeitslosenquotePage() {
  const { chartData, chartData2, chartData3 } = await getData();
  const unemploymentData = extractRegionData(chartData, 'Gesamt');

  return (
    <Content>
      <h1 className="text-xl font-bold mb-2 sm:mb-4">Arbeitslosigkeit</h1>
      <p>Bla blabla bla bla blablabla. Bla blabla bla bla blablabla. Bla blabla bla bla blablabla.</p>

      <LineChart 
        chartData={chartData}
        chartMargin={{ l: 23, r: 0, t: 0, b: 195 }}
        chartHeight="400px"
        xLabelAngle={90}
      />

      <p>Bla blabla bla bla blablabla. Bla blabla bla bla blablabla. Bla blabla bla bla blablabla.</p>

      <LineChart 
        chartData={chartData2}
        chartMargin={{ l: 30, r: 0, t: 0, b: 195 }}
        chartHeight="300px"
        xLabelAngle={90}
      />

      <LineChart 
        chartData={chartData3}
        chartMargin={{ l: 30, r: 0, t: 0, b: 195 }}
        chartHeight="300px"
        xLabelAngle={90}
      />

      <ChoroplethMap regionData={unemploymentData} />
    </Content>
  );
}
