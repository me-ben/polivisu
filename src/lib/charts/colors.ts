/**
 * Standard color palette for charts
 * Provides consistent colors across all chart components
 */
export const CHART_COLORS = [
  '#1f77b4', // blue
  '#ff7f0e', // orange
  '#2ca02c', // green
  '#d62728', // red
  '#9467bd', // purple
  '#8c564b', // brown
  '#e377c2', // pink
  '#7f7f7f', // gray
  '#bcbd22', // olive
  '#17becf', // cyan
  '#aec7e8', // light blue
  '#ffbb78', // light orange
  '#98df8a', // light green
  '#ff9896', // light red
  '#c5b0d5', // light purple
  '#c49c94', // light brown
  '#f7b6d2', // light pink
  '#c7c7c7', // light gray
  '#dbdb8d', // light olive
  '#9edae5', // light cyan
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