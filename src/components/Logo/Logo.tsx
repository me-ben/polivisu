'use client';
import React, { useState, useEffect } from 'react';


const START_BARS = [
  [170, 0, 0, 0, 60, 0, 0, 180],
  [180, 0, 0, 0, 90, 30, 100, 180],
  [100, 0, 0, 0, 310, 0, 0, 180],
  [110, 0, 0, 0, 300, 0, 0, 180],
  [100, 0, 0, 0, 320, 0, 0, 180],
  [70, 0, 0, 0, 360, 0, 0, 180],
  [60, 0, 0, 0, 340, 0, 0, 180],
  [70, 0, 0, 0, 260, 0, 0, 180],
  [80, 0, 0, 0, 260, 0, 0, 180],
  [140, 0, 0, 0, 220, 0, 0, 180],
  [120, 0, 0, 0, 260, 0, 0, 180],
  [110, 0, 0, 0, 250, 0, 0, 180],
];

const END_BARS = [
  [170, 60, 60, 60, 60, 0, 0, 0],
  [180, 60, 60, 60, 90, 30, 100, 0],
  [100, 60, 60, 60, 310, 0, 0, 0],
  [110, 60, 60, 60, 300, 0, 0, 0],
  [100, 60, 60, 60, 320, 0, 0, 0],
  [70, 60, 60, 60, 360, 0, 0, 0],
  [60, 60, 60, 60, 340, 0, 0, 0],
  [70, 60, 60, 60, 260, 0, 0, 0],
  [80, 60, 60, 60, 260, 0, 0, 0],
  [140, 60, 60, 60, 220, 0, 0, 0],
  [120, 60, 60, 60, 260, 0, 0, 0],
  [110, 60, 60, 60, 250, 0, 0, 0],
];

const DEFAULT_COLORS = [
  "#525252", // bg-neutral-600
  "#737373", // bg-neutral-500
  "#a3a3a3", // bg-neutral-400
  "#d4d4d4", // bg-neutral-300
  "#ffffff", // bg-white
  "#262626", // bg-neutral-800
  "#ffffff", // bg-white
  "#262626", // bg-neutral-800
];

const HOVER_COLORS = [
  "#dc2626", // bg-red-600
  "#f97316", // bg-orange-500
  "#fbbf24", // bg-amber-400
  "#fde047", // bg-yellow-300
  "#ffffff", // bg-white
  "#262626", // bg-neutral-800
  "#ffffff", // bg-white
  "#262626", // bg-neutral-800
];

interface LogoProps {
  isHovered?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ isHovered = false }) => {
  const [bars, setBars] = useState(START_BARS);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [scale, setScale] = useState<number | null>(null);

  // Initial scale setup
  useEffect(() => {
    setScale(window.innerWidth >= 640 ? 2/3 : 2/4);
  }, []);

  // Trigger animation once
  useEffect(() => {
    if (scale === null || hasAnimated || isHovered) return;
    
    const timer = setTimeout(() => {
      setBars(END_BARS);
      setHasAnimated(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [scale, hasAnimated, isHovered]);

  // Handle resize
  useEffect(() => {
    if (scale === null) return;
    
    const handleResize = () => setScale(window.innerWidth >= 640 ? 2/3 : 2/4);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scale]);

  // Loading state: placeholder without layout shift
  if (scale === null) {
    return <div className="h-8 sm:h-12 w-[45.75px] sm:w-[61px]" />;
  }

  const colors = isHovered ? HOVER_COLORS : DEFAULT_COLORS;

  return (
    <div 
      className="h-8 sm:h-12 cursor-pointer" 
      style={{ ['--logo-scale' as string]: scale }}
    >
      {bars.map((segments, barIndex) => (
        <div
          key={barIndex}
          style={{
            display: 'flex',
            height: `calc(4px * var(--logo-scale))`,
            marginBottom: `calc(2px * var(--logo-scale))`,
          }}
        >
          {segments.map((length, segIndex) => (
            <div
              key={segIndex}
              style={{
                height: `calc(4px * var(--logo-scale))`,
                width: `calc(${length / ((10/3) * 2)}px * var(--logo-scale))`,
                backgroundColor: colors[segIndex],
                transition: 'width 200ms ease-in-out, background-color 200ms ease-in-out',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};