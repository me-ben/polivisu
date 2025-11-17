import Papa from 'papaparse';
import { ChartData } from '@/lib/data/types';

interface CsvValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function parseEnhancedCsv(content: string): ChartData {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  
  const getSection = (tag: string) => {
    const index = lines.findIndex(l => l.startsWith(tag));
    if (index === -1) return null;
    const next = lines.findIndex((l, i) => i > index && l.startsWith('#'));
    return lines.slice(index + 1, next === -1 ? undefined : next);
  };

  const parseLine = (line: string): string[] => {
    const result = Papa.parse(line, { delimiter: ',' }).data[0] as string[];
    return result.map(s => s?.trim() || '');
  };

  // Validierung
  const validation: CsvValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  // ========== ERFORDERLICHE SEKTIONEN ==========
  
  // TITLE (erforderlich)
  const titleLines = getSection('#TITLE');
  if (!titleLines || titleLines.length === 0) {
    validation.errors.push('❌ Fehlende erforderliche Sektion: #TITLE');
    validation.valid = false;
  }
  const title = titleLines?.[0] ?? 'Unbenannter Datensatz';

  // DATA (erforderlich)
  const dataLines = getSection('#DATA');
  if (!dataLines || dataLines.length === 0) {
    validation.errors.push('❌ Fehlende erforderliche Sektion: #DATA');
    validation.valid = false;
  }

  // ========== OPTIONALE SEKTIONEN ==========
  
  // UNIT (optional, aber empfohlen)
  const unitLines = getSection('#UNIT');
  const unit = unitLines?.[0] ?? '';
  if (!unitLines) {
    validation.warnings.push('Optionale Sektion #UNIT nicht vorhanden (empfohlen für Y-Achsen-Beschriftung)');
  }

  // SOURCES (optional, aber empfohlen)
  const sourcesLines = getSection('#SOURCES');
  if (!sourcesLines) {
    validation.warnings.push('Optionale Sektion #SOURCES nicht vorhanden (empfohlen für Quellenangaben)');
  }
  
  const sources = sourcesLines?.map((line, index) => {
    const [title, url] = parseLine(line);
    
    if (!title || !url) {
      validation.warnings.push(`⚠️  Quelle ${index + 1}: Unvollständige Daten (Titel oder URL fehlt)`);
    }
    
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      validation.warnings.push(`⚠️  Quelle ${index + 1}: Ungültige URL "${url}" (muss mit http:// oder https:// beginnen)`);
    }
    
    return { 
      title: title || 'Quelle', 
      url: url || '#' 
    };
  }) ?? [];

  // COMMENTS (optional)
  const commentsLines = getSection('#COMMENTS');
  if (!commentsLines) {
    // Keine Warnung - Comments sind völlig optional
  }
  
  const comments = commentsLines?.map((line, index) => {
    const [title, text] = parseLine(line);
    
    if (!title || !text) {
      validation.warnings.push(`⚠️  Kommentar ${index + 1}: Unvollständige Daten (Titel oder Text fehlt)`);
    }
    
    return {
      title: title || 'Titel', 
      text: text || ''
    };
  }) ?? [];

  // ========== FEHLERBEHANDLUNG ==========

  // Fehler ausgeben falls vorhanden
  if (!validation.valid) {
    const errorMessage = [
      '═══════════════════════════════════════',
      '        CSV PARSING FEHLER',
      '═══════════════════════════════════════',
      '',
      ...validation.errors,
      '',
      'Erforderliche Sektionen: #TITLE, #DATA',
      'Optionale Sektionen: #UNIT, #SOURCES, #COMMENTS',
      '═══════════════════════════════════════'
    ].join('\n');
    
    throw new Error(errorMessage);
  }

  // Warnungen loggen (nur in Development)
  if (validation.warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('\n⚠️  CSV Parsing Warnungen:', validation.warnings.join('\n   '));
  }

  // ========== DATA PARSEN ==========

  const csvBlock = dataLines!.join('\n');
  const parsed = Papa.parse(csvBlock, { 
    header: true, 
    skipEmptyLines: true,
    dynamicTyping: false
  }).data as Record<string, string>[];

  if (parsed.length === 0) {
    throw new Error('❌ Keine Daten-Zeilen im CSV gefunden (mindestens 1 Zeile nach dem Header erforderlich)');
  }

  // Prüfe ob mindestens 2 Spalten vorhanden sind
  const headers = Object.keys(parsed[0]);
  if (headers.length < 2) {
    throw new Error('❌ CSV benötigt mindestens 2 Spalten (X-Achse + mindestens 1 Y-Wert)');
  }

  return {
    title,
    unit,
    sources,
    comments,
    data: parsed.map(row => {
      const converted: Record<string, string | number> = {};
      Object.entries(row).forEach(([key, value]) => {
        const trimmedKey = key.trim();
        converted[trimmedKey] = /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value;
      });
      return converted;
    })
  };
}