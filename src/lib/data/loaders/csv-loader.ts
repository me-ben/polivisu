import { promises as fs } from 'fs';
import path from 'path';
import { parseEnhancedCsv } from '@/lib/data/sources/csv-parser';

export async function loadCsvData(filePath: string) {
  const fullPath = path.join(process.cwd(), 'public', filePath);
  const content = await fs.readFile(fullPath, 'utf8');
  return parseEnhancedCsv(content);
}