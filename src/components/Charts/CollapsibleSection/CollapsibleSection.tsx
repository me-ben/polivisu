'use client';

import React, { useState, useEffect } from 'react';
import { Arrow } from '@/components/Arrow/Arrow';

interface Source {
  name: string;
  url: string;
}

interface Comment {
  title?: string;
  text: string;
}

interface CollapsibleSectionProps {
  title: string;
  sources?: Source[];
  comments?: Comment;
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
      {/* Toggle Button */}
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

      {/* Inhalt */}
      <div
        id="collapsible-content"
        className={`transition-all duration-200 ease-in-out overflow-hidden
          ${isCollapsed ? 'max-h-0' : 'max-h-[500px]'}
        `}
      >
        <div className="p-2">
          {/* Quellenabschnitt */}
          {sources && sources.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold mb-2">
                {sources.length > 1 ? 'Quellen' : 'Quelle'}
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-black">
                {sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-200 font-base cursor-pointer px-2 rounded-lg"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Kommentarabschnitt */}
          {comments && (
            <div>
              <h3 className="text-sm font-bold mb-2">
                {comments.title || 'Kommentar'}
              </h3>
              <p className="text-sm text-black whitespace-pre-line">{comments.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
