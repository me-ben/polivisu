'use client';

import React, { useState } from 'react';

export interface Trace {
  id: string;
  name: string;
  color?: string;
}

interface TraceTogglerProps {
  traces: Trace[];
  visibleTraces: Record<string, boolean>;
  onToggle: (traceId: string) => void;
  className?: string;
}

export const TraceToggler: React.FC<TraceTogglerProps> = ({
  traces,
  visibleTraces,
  onToggle,
  className = ''
}) => {
  const [hoveredTrace, setHoveredTrace] = useState<string | null>(null);
  
  if (traces.length > 1) {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {traces.map(trace => {
          const isVisible = visibleTraces[trace.id] ?? true;
          const bgColor = trace.color || 'black';
          
          return (
            <button
              key={trace.id}
              onClick={() => onToggle(trace.id)}
              onMouseEnter={() => setHoveredTrace(trace.id)}
              onMouseLeave={() => setHoveredTrace(null)}
              className="px-1 rounded-full text-xs font-medium"
              style={{
                border: `solid 2px ${bgColor}`,
                backgroundColor: hoveredTrace === trace.id
                  ? (isVisible ? 'white' : bgColor)
                  : (isVisible ? bgColor : 'white'),
                color: hoveredTrace === trace.id
                  ? (isVisible ? bgColor : 'white')
                  : (isVisible ? 'white' : bgColor)
              }}
            >
              {trace.name}
            </button>
          );
        })}
      </div>
    );
  }
  
};

TraceToggler.displayName = 'TraceToggler';