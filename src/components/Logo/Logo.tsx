import React, { useState, useEffect } from 'react';

type BarSegments = number[];
type BarData = Record<string, BarSegments>;


// Animation configuration - single source of truth for all transitions
const ANIMATION = {
  DURATION: 200,
  TIMING_FUNCTION: 'ease-in-out' as const,
} as const;

// Color definitions - converted to hex values for CSS transitions
const COLORS = {
  DEFAULT: [
    "#71717a", // bg-zinc-500
    "#a1a1aa", // bg-zinc-400
    "#d4d4d8", // bg-zinc-300
    "#ffffff", // bg-white
    "#3f3f46", // bg-zinc-700
    "#ffffff", // bg-white
    "#3f3f46", // bg-zinc-700
    "#3f3f46", // bg-zinc-700
    "#3f3f46", // bg-zinc-700
  ],
  HOVER: [
    "#3f3f46", // bg-zinc-700
    "#fee2e2", // bg-red-100
    "#fecaca", // bg-red-200
    "#fca5a5", // bg-red-300
    "#3f3f46", // bg-zinc-700
    "#fca5a5", // bg-red-300
    "#bd8385", // custom
    "#7e6166", // custom
    "#3f3f46", // bg-zinc-700
  ],
} as const;


  // Layout configuration
  const LAYOUT = {
  MOBILE_SCALE: 2 / 4,
  DESKTOP_SCALE: 2 / 3,
  BAR_HEIGHT: 4,
  BAR_GAP: 2,
  SEGMENT_DIVISOR: (10 / 3) * 2,
} as const;


// Animation states
const STATES = {
  START: {
    'bar_0': [200, 0, 0, 60, 0, 0, 60, 60, 200],
    'bar_1': [210, 0, 0, 90, 30, 100, 60, 60, 30],
    'bar_2': [130, 0, 0, 310, 0, 0, 60, 60, 20],
    'bar_3': [140, 0, 0, 300, 0, 0, 60, 60, 20],
    'bar_4': [130, 0, 0, 320, 0, 0, 60, 60, 10],
    'bar_5': [100, 0, 0, 360, 0, 0, 60, 60, 0],
    'bar_6': [90, 0, 0, 340, 0, 0, 60, 60, 30],
    'bar_7': [100, 0, 0, 260, 0, 0, 60, 60, 100],
    'bar_8': [110, 0, 0, 260, 0, 0, 60, 60, 90],
    'bar_9': [170, 0, 0, 220, 0, 0, 60, 60, 70],
    'bar_10': [150, 0, 0, 260, 0, 0, 60, 60, 50],
    'bar_11': [140, 0, 0, 250, 0, 0, 60, 60, 70],
  } as BarData,

  END: {
    'bar_0': [200, 60, 60, 60, 0, 0, 0, 0, 200],
    'bar_1': [210, 60, 60, 90, 30, 100, 0, 0, 30],
    'bar_2': [130, 60, 60, 310, 0, 0, 0, 0, 20],
    'bar_3': [140, 60, 60, 300, 0, 0, 0, 0, 20],
    'bar_4': [130, 60, 60, 320, 0, 0, 0, 0, 10],
    'bar_5': [100, 60, 60, 360, 0, 0, 0, 0, 0],
    'bar_6': [90, 60, 60, 340, 0, 0, 0, 0, 30],
    'bar_7': [100, 60, 60, 260, 0, 0, 0, 0, 100],
    'bar_8': [110, 60, 60, 260, 0, 0, 0, 0, 90],
    'bar_9': [170, 60, 60, 220, 0, 0, 0, 0, 70],
    'bar_10': [150, 60, 60, 260, 0, 0, 0, 0, 50],
    'bar_11': [140, 60, 60, 250, 0, 0, 0, 0, 70],
  } as BarData,
};

interface BarSegmentProps {
  length: number;
  color: string;
}

const BarSegment: React.FC<BarSegmentProps> = ({ length, color }) => (
  <div
    style={{
      height: `calc(${LAYOUT.BAR_HEIGHT}px * var(--logo-scale))`,
      width: `calc(${length / LAYOUT.SEGMENT_DIVISOR}px * var(--logo-scale))`,
      backgroundColor: color,
      transition: `width ${ANIMATION.DURATION}ms ${ANIMATION.TIMING_FUNCTION}, background-color ${ANIMATION.DURATION}ms ${ANIMATION.TIMING_FUNCTION}`,
    }}
  />
);

interface LogoBarProps {
  segments: BarSegments;
  isHovered: boolean;
}

const LogoBar: React.FC<LogoBarProps> = ({ segments, isHovered }) => (
  <div
    style={{
      display: 'flex',
      height: `calc(${LAYOUT.BAR_HEIGHT}px * var(--logo-scale))`,
      marginBottom: `calc(${LAYOUT.BAR_GAP}px * var(--logo-scale))`,
    }}
  >
    {segments.map((length, index) => (
      <BarSegment
        key={index}
        length={length}
        color={isHovered ? COLORS.HOVER[index] : COLORS.DEFAULT[index]}
      />
    ))}
  </div>
);

interface LogoProps {
  className?: string;
  isHovered?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  isHovered = false 
}) => {
  const [barData, setBarData] = useState<BarData>(STATES.START);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [scale, setScale] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Determine initial scale before rendering
  useEffect(() => {
    const getInitialScale = () => {
      if (typeof window === 'undefined') return null;
      return window.innerWidth >= 640 ? LAYOUT.DESKTOP_SCALE : LAYOUT.MOBILE_SCALE;
    };

    setScale(getInitialScale());
    setIsMounted(true);
  }, []);

  // Animation setup
  useEffect(() => {
    if (scale === null || hasAnimated || isHovered) return;

    const timer = setTimeout(() => {
      setBarData(STATES.END);
      setHasAnimated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [scale, hasAnimated, isHovered]);

  // Hover animation
  useEffect(() => {
    if (!hasAnimated || scale === null) return;
    setBarData(isHovered ? STATES.START : STATES.END);
  }, [isHovered, hasAnimated, scale]);

  // Responsive scaling
  useEffect(() => {
    if (scale === null) return;

    const handleResize = () => {
      setScale(window.innerWidth >= 640 ? LAYOUT.DESKTOP_SCALE : LAYOUT.MOBILE_SCALE);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scale]);

  // Don't render until scale is determined
  if (scale === null || !isMounted) return null;

  return (
    <div
      className={`cursor-pointer ${className}`}
      style={{ ['--logo-scale' as string]: scale }}
    >
      {Object.entries(barData).map(([id, segments]) => (
        <LogoBar key={id} segments={segments} isHovered={isHovered} />
      ))}
    </div>
  );
};
