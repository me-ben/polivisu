import React, { useState, useEffect } from 'react';

// Typen
type BarSegments = number[];
type BarData = Record<string, BarSegments>;

// Konstanten - Jetzt mit Tailwind-Klassen statt Farbcodes
const DEFAULT_COLORS = [
  "bg-zinc-500", 
  "bg-zinc-400", 
  "bg-zinc-300", 
  "bg-white", 
  "bg-zinc-700", 
  "bg-white"
];

const HOVER_COLORS = [
  "bg-white", 
  "bg-red-100", 
  "bg-red-200", 
  "bg-red-300", 
  "bg-zinc-700", 
  "bg-red-300"
];

const SCALE = {
  MOBILE: 2/4,
  DESKTOP: 2/3,
  BAR_HEIGHT: 4,
  BAR_GAP: 2,
  SEGMENT_DIVISOR: (10/3)*2,
} as const;

const ANIMATION_CONFIG = {
  enabled: true,
  speed: 100,
  maxAmplitude: 80,
  stepSize: 20,
  gapBars: 30,
} as const;

const BASE_BAR_DATA: BarData = {
  'bar_0': [200, 60, 60, 60],
  'bar_1': [210, 60, 60, 90, 30, 100],
  'bar_2': [130, 60, 60, 310],
  'bar_3': [140, 60, 60, 300],
  'bar_4': [130, 60, 60, 320],
  'bar_5': [100, 60, 60, 360],
  'bar_6': [90, 60, 60, 340],
  'bar_7': [100, 60, 60, 260],
  'bar_8': [110, 60, 60, 260],
  'bar_9': [170, 60, 60, 220],
  'bar_10': [150, 60, 60, 260],
  'bar_11': [140, 60, 60, 250],
};

const isDesktop = (): boolean => typeof window !== 'undefined' && window.innerWidth >= 640;

const calculateBarExtension = (barIndex: number, iteration: number): number => {
  const { maxAmplitude, stepSize, gapBars } = ANIMATION_CONFIG;
  const stepsToMax = maxAmplitude / stepSize;
  const waveLength = stepsToMax * 2;
  const totalCycleLength = waveLength + gapBars;
  const positionInCycle = (iteration - barIndex + totalCycleLength * 100) % totalCycleLength;

  if (positionInCycle >= waveLength) return 0;
  if (positionInCycle <= stepsToMax) return positionInCycle * stepSize;
  if (positionInCycle < waveLength) return maxAmplitude - ((positionInCycle - stepsToMax) * stepSize);

  return 0;
};

const getAnimatedBarData = (iteration: number): BarData => {
  const animatedData: BarData = {};

  Object.entries(BASE_BAR_DATA).forEach(([barId, segments], index) => {
    const extension = calculateBarExtension(index, iteration);
    const animatedSegments = [...segments];
    animatedSegments[0] = segments[0] + extension;
    animatedData[barId] = animatedSegments;
  });

  return animatedData;
};

interface BarSegmentProps {
  length: number;
  className: string;
}

const BarSegment: React.FC<BarSegmentProps> = ({ length, className }) => {
  return (
    <div
      className={className}
      style={{
        height: `calc(${SCALE.BAR_HEIGHT}px * var(--logo-scale))`,
        width: `calc(${length / SCALE.SEGMENT_DIVISOR}px * var(--logo-scale))`,
        transition: 'width 0.1s ease-out',
      }}
    />
  );
};

interface LogoBarProps {
  segments: BarSegments;
  isHovered: boolean;
}

const LogoBar: React.FC<LogoBarProps> = ({ segments, isHovered }) => {
  return (
    <div
      style={{
        display: 'flex',
        height: `calc(${SCALE.BAR_HEIGHT}px * var(--logo-scale))`,
        marginBottom: `calc(${SCALE.BAR_GAP}px * var(--logo-scale))`,
      }}
    >
      {segments.map((segmentLength, index) => (
        <BarSegment
          key={index}
          length={segmentLength}
          className={`${isHovered ? HOVER_COLORS[index] : DEFAULT_COLORS[index]} 
                     transition-colors duration-300`}
        />
      ))}
    </div>
  );
};

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = "", onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [scale, setScale] = useState<number>(SCALE.MOBILE);

  useEffect(() => {
    const updateScale = () => {
      setScale(isDesktop() ? SCALE.DESKTOP : SCALE.MOBILE);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!ANIMATION_CONFIG.enabled) return;

    const interval = setInterval(() => {
      setIteration(prev => prev + 1);
    }, ANIMATION_CONFIG.speed);

    return () => clearInterval(interval);
  }, []);

  const currentBarData = ANIMATION_CONFIG.enabled 
    ? getAnimatedBarData(iteration)
    : BASE_BAR_DATA;

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ['--logo-scale' as string]: scale,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div>
        {Object.entries(currentBarData).map(([barId, segments]) => (
          <LogoBar
            key={barId}
            segments={segments}
            isHovered={isHovered}
          />
        ))}
      </div>
    </div>
  );
};
