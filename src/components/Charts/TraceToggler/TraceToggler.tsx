'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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
    const allHidden = traces.every(trace => visibleTraces[trace.id] === false);
    const buttonText = allHidden ? 'alle' : 'keine';
    const buttonAction = allHidden 
      ? () => onToggleAll(true) 
      : () => onToggleAll(false);

    const onToggleAll = (visible: boolean) => {
      traces.forEach(trace => {
        const isCurrentlyVisible = visibleTraces[trace.id] !== false;
        if (isCurrentlyVisible !== visible) {
          onToggle(trace.id);
        }
      });
    };

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
              className="cursor-pointer px-1 rounded-lg text-xs font-medium"
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

        <button
          key="toggle-button"
          onClick={buttonAction}
          onMouseEnter={() => setHoveredTrace('toggle-button')}
          onMouseLeave={() => setHoveredTrace(null)}
          className="cursor-pointer px-2 rounded-lg text-xs font-medium flex items-center"
          style={{
            border: 'solid 2px black',
            backgroundColor: allHidden
              ? (hoveredTrace === 'toggle-button' ? 'white' : 'black')
              : (hoveredTrace === 'toggle-button' ? 'black' : 'white'),
            color: 'white'
          }}
        >
          <Image 
            src="/icons/eye.svg" 
            alt={buttonText} 
            width={18} 
            height={18}
            style={{
              filter: allHidden
                ? (hoveredTrace === 'toggle-button'
                    ? 'invert(0)'
                    : 'invert(1)')
                : (hoveredTrace === 'toggle-button'
                    ? 'invert(1)'
                    : 'invert(0)')
            }}
          />
        </button>
      </div>
    );
  }
};

TraceToggler.displayName = 'TraceToggler';
