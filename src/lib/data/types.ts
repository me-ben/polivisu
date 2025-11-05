export interface ChartData {
  title: string;
  unit: string;
  sources: Array<{ name: string; url: string }>;
  comments: Array<{ name: string; text: string }>;
  data: Array<Record<string, string | number>>;
}