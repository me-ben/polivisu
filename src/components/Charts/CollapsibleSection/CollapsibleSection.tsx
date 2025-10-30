'use client';

import React, { useState, useEffect } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
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
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`border-solid 1px border-black w-full h-10 pl-3 pr-2 sm:pr-3 flex items-center justify-between cursor-pointer transition-colors
          ${isCollapsed 
            ? 'bg-zinc-700 hover:bg-gradient-to-t hover:from-zinc-300 hover:to-zinc-700' 
            : 'bg-zinc-300 hover:bg-gradient-to-t hover:from-zinc-300 hover:to-zinc-700'
          }`}
        aria-expanded={!isCollapsed}
        aria-controls="collapsible-content"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <span className={`ml-2 transform transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Inhalt */}
      <div 
        id="collapsible-content"
        className={`transition-all duration-200 ease-in-out overflow-hidden
          ${isCollapsed ? 'max-h-0' : 'max-h-[500px]'}
        `}
      >
        <div className="p-3 sm:p-4 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};
