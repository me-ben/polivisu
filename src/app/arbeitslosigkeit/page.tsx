import { Content } from '@/components/Content/Content';
import { LineChart } from '@/components/Charts/LineChart';
import { loadCsvData } from '@/lib/data/loaders/csv-loader';

export default async function ArbeitslosenquotePage() {
  const chartData = await loadCsvData('data/arbeitslosenquote_de_bundeslaender_2024.csv');
  const chartData2 = await loadCsvData('data/bip_kopf_de_bundeslaender_2024.csv');
  const chartData3 = await loadCsvData('data/bundestagswahl_2025.csv')
  

  return (
    <Content>
      <h1 className="text-xl font-bold mb-2 sm:mb-4">Arbeitslosigkeit</h1>
      <p>Bla blabla bla bla blablabla. Bla blabla bla bla blablabla. Bla blabla bla bla blablabla. </p>
      <LineChart chartData={chartData}
        chartMargin={{ l: 23, r: 0, t: 0, b: 195 }}
        chartHeight="400px"
        xLabelAngle={90}
      />
      <p>Bla blabla bla bla blablabla. Bla blabla bla bla blablabla. Bla blabla bla bla blablabla. </p>
      <LineChart chartData={chartData2}
        chartMargin={{ l: 30, r: 0, t: 0, b: 195 }}
        chartHeight="300px"
        xLabelAngle={90}
      />
      <LineChart chartData={chartData3}
        chartMargin={{ l: 30, r: 0, t: 0, b: 195 }}
        chartHeight="300px"
        xLabelAngle={90}
      />

    </Content>
  );
}

