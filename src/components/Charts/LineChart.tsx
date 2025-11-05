'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Data } from 'plotly.js';
import { TraceToggler } from '@/components/Charts/TraceToggler';
import { CollapsibleSection } from '@/components/Charts/CollapsibleSection';
import { ChartData } from '@/lib/data/types';
import { getTraceColor } from '@/lib/charts/colors';

interface ChartMargin {
  l: number;
  r: number;
  t: number;
  b: number;
}

interface LineChartProps {
  chartData: ChartData;
  chartMargin: ChartMargin;
  chartHeight: string | number;
  xLabelAngle?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  chartData,
  chartMargin,
  chartHeight,
  xLabelAngle = 90
}) => {
  const Plot = useMemo(() => dynamic(() => import('react-plotly.js'), {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center border border-dashed rounded-lg"
        style={{
          height: typeof chartHeight === 'number' ? `${chartHeight}px` : chartHeight,
          width: '100%'
        }}
      >
        Lädt Diagramm...
      </div>
    )
  }), [chartHeight]);

  const { title, unit, sources, data, comment } = chartData;

  const plotData = useMemo((): Data[] => {
    if (!data.length || Object.keys(data[0]).length < 2) return [];

    const headers = Object.keys(data[0]);
    const xCol = headers[0];
    const yCols = headers.slice(1);

    return yCols.map((yCol, index) => ({
      x: data.map(d => d[xCol]),
      y: data.map(d => Number(d[yCol])),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: yCol,
      marker: {
        size: 2,
        symbol: 'circle',
        color: getTraceColor(index)
      },
      line: {
        width: 3,
        color: getTraceColor(index)
      },
      hovertemplate: `${yCol}: %{y}${unit ? unit : ''}<extra></extra>`
    }));
  }, [data, unit]);

  const traces = useMemo(() =>
    plotData.map((trace, index) => ({
      id: trace.name as string,
      name: trace.name as string,
      color: getTraceColor(index)
    })),
    [plotData]
  );

  const [visibleTraces, setVisibleTraces] = React.useState<Record<string, boolean>>(
    Object.fromEntries(traces.map(t => [t.id, true]))
  );

  const filteredPlotData = useMemo(() => {
    return plotData.filter(trace => visibleTraces[trace.name as string]);
  }, [plotData, visibleTraces]);

  const handleToggleTrace = (traceId: string) => {
    setVisibleTraces(prev => ({
      ...prev,
      [traceId]: !prev[traceId]
    }));
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-2 text-black">{title}</h2>
      <TraceToggler
        traces={traces}
        visibleTraces={visibleTraces}
        onToggle={handleToggleTrace}
        className="mb-2"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <Plot
            data={filteredPlotData}
            layout={{
              autosize: true,
              margin: chartMargin,
              xaxis: {
                linecolor: 'black',
                gridcolor: '#dfdfdf',
                gridwidth: 1,
                tickfont: { size: 16, color: 'black' },
                tickangle: xLabelAngle,
              },
              yaxis: {
                linecolor: 'black',
                gridcolor: '#dfdfdf',
                gridwidth: 1,
                tickfont: { size: 16, color: 'black' }
              },
              paper_bgcolor: 'white',
              plot_bgcolor: 'white',
              showlegend: false,
              hovermode: 'x unified',
              hoverlabel: {
                bgcolor: 'white',
                bordercolor: 'black',
                font: { size: 16, color: 'black' },
                align: 'right'
              },
            }}
            config={{
              displayModeBar: false,
              responsive: false
            }}
            useResizeHandler
            style={{
              width: '100%',
              height: typeof chartHeight === 'number' ? `${chartHeight}px` : chartHeight
            }}
          />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {(sources.length > 0 || comment) && (
            <CollapsibleSection
              title="Details"
              sources={sources}
              comment={comment}
              defaultCollapsed={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

LineChart.displayName = 'LineChart';
export default LineChart;
