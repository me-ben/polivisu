export interface ChartData {
  title: string;
  unit: string;
  sources: Array<{ title: string; url: string }>;
  comments: Array<{ title: string; text: string }>;
  data: Array<Record<string, string | number>>;
}