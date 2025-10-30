export interface ChartData {
  title: string;
  unit: string;
  sources: Array<{ name: string; url: string }>;
  data: Array<Record<string, string | number>>;
}
