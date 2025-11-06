'use client';
import React, { useState, useEffect } from 'react';
import { Arrow } from '@/components/Arrow/Arrow';

interface Source {
  title: string;
  url: string;
}

interface Comment {
  title: string;
  text: string;
}

interface CollapsibleSectionProps {
  title: string;
  sources?: Source[];
  comments?: Comment[];
  defaultCollapsed?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  sources,
  comments,
  defaultCollapsed = false,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const checkInitialScreenSize = () => {
      const isMobile = window.innerWidth < 640; // sm breakpoint
      setIsCollapsed(isMobile || defaultCollapsed);
      setInitialLoad(false);
    };
    checkInitialScreenSize();
  }, [defaultCollapsed]);

  useEffect(() => {
    if (!initialLoad) return;
    const handleResize = () => {
      // Nach dem ersten Render kontrolliert der Benutzer den Zustand
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialLoad]);

  return (
    <div className={`border-2 border-neutral-200 rounded-lg overflow-hidden ${className}`}>
      {/* TOGGLE BUTTON */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full h-8 px-2 flex items-center justify-between cursor-pointer bg-neutral-100 hover:bg-neutral-200"
        aria-expanded={!isCollapsed}
        aria-controls="collapsible-content"
      >
        <span className="text-black text-base">{title}</span>
        <Arrow className="h-4 w-auto text-black" isRotated={!isCollapsed} />
      </button>

      {/* CONTENT */}
      <div
        id="collapsible-content"
        className={`transition-all duration-200 ease-in-out overflow-hidden
          ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}
        `}
      >
        <div className="p-2">
          {/* SOURCES */}
          {sources && sources.length > 0 && (
            <div className="mb-2 block">
              <span className="text-sm mb-1 block text-black font-semibold">
                {sources.length > 1 ? 'Quellen:' : 'Quelle:'}
              </span>
              <div className="flex flex-wrap gap-2 text-sm text-black">
                {sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-200 font-base cursor-pointer px-2 rounded-lg"
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* COMMENTS */}
          {comments && comments.length > 0 && (
            <div className="mb-2 block">
              <div className="flex flex-col gap-3">
                {comments.map((c, i) => (
                  <div key={i} className="text-sm text-black">
                    <div className="font-semibold mb-1">{c.title}</div>
                    <div>{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};