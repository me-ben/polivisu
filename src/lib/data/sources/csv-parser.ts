import { headers } from 'next/headers';
import Papa from 'papaparse';
import { ChartData } from '@/lib/data/types';


export function parseEnhancedCsv(content: string): ChartData {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

  const getSection = (tag: string) => {
    const index = lines.findIndex(l => l.startsWith(tag));
    if (index === -1) return null;
    const next = lines.findIndex((l, i) => i > index && l.startsWith('#'));
    return lines.slice(index + 1, next === -1 ? undefined : next);
  };

  const title = getSection('#TITLE')?.[0] ?? 'Unbenannter Datensatz';
  const dataLines = getSection('#DATA') ?? [];
  const unit = getSection('#UNIT')?.[0] ?? '';
  const sources = getSection('#SOURCES')?.map(line => {
    const [name, url] = line.split(',');
    return { 
      name: name?.trim() || 'Quelle', 
      url: url?.trim() || '#' 
    };
  }) ?? [];

  const csvBlock = dataLines.join('\n');
  const parsed = Papa.parse(csvBlock, { 
    header: true, 
    skipEmptyLines: true 
  }).data as Record<string, string>[];

  return {
    title,
    unit,
    sources,
    data: parsed.map(row => {
      const converted: Record<string, string | number> = {};
      Object.entries(row).forEach(([key, value]) => {
        converted[key] = /^\d+(\.\d+)?$/.test(value) ? Number(value) : value;
      });
      return converted;
    })
  };
}


export async function loadChartData(csvPath: string): Promise<ChartData> {
  const host = headers().get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}${csvPath}`);

  if (!response.ok) {
    throw new Error(`CSV-Lade Fehler: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return parseEnhancedCsv(text);
}
