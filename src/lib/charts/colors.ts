/**
 * Standard color palette for charts
 * Provides consistent colors across all chart components
 */
export const CHART_COLORS = [
  '#ffa2a2',
  '#fb2c36',
  '#c10007',
  '#ffb900',
  '#fe9a00',
  '#bb4d00',
  '#bbf451',
  '#7ccf00',
  '#497d00',
  '#46ecd5',
  '#00bba7',
  '#00786f',
  '#8ec5ff',
  '#2b7fff',
  '#1447e6',
  '#dab2ff',
  '#ad46ff',
  '#8200db'
] as const;

/**
 * Get a color for a trace by index
 * @param index - The index of the trace
 * @returns The color hex string
 */
export function getTraceColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Get colors for multiple traces
 * @param count - Number of traces
 * @returns Array of color hex strings
 */
export function getTraceColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getTraceColor(i));
}