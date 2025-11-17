'use client';
import React, { useState, useEffect } from 'react';
import { Arrow } from '@/components/Arrow/Arrow';
import Image from 'next/image';

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
  csvUrl?: string;
  defaultCollapsed?: boolean;
  className?: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
  title,
  children,
  className = ''
}) => (
  <div className={className}>
    <div className="text-sm pb-1 text-black font-semibold">{title}</div>
    <div className="flex flex-wrap gap-2 text-sm text-black">{children}</div>
  </div>
);

const SourceItem: React.FC<{ source: Source }> = ({ source }) => (
  <a
    href={source.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-200 font-base cursor-pointer px-2 py-1 rounded-lg"
  >
    {source.title}
  </a>
);

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="text-sm text-black">
    <div className="font-semibold">{comment.title}:</div>
    <div>{comment.text}</div>
  </div>
);

// Konstanten für wiederverwendete Klassen
const TRANSITION_CLASSES = 'transition-all duration-200 ease-in-out overflow-hidden';
const COLLAPSED_CLASSES = 'max-h-0';
const EXPANDED_CLASSES = 'max-h-none';

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  sources,
  comments,
  csvUrl,
  defaultCollapsed = false,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const checkInitialScreenSize = () => {
      const isMobile = window.innerWidth < 640;
      setIsCollapsed(isMobile || defaultCollapsed);
      setInitialLoad(false);
    };
    checkInitialScreenSize();
  }, [defaultCollapsed]);

  useEffect(() => {
    if (!initialLoad) return;
    const handleResize = () => {};
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialLoad]);

  return (
    <div className={`border-2 border-neutral-200 rounded-lg overflow-hidden ${className}`}>
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

      <div
        id="collapsible-content"
        className={`${TRANSITION_CLASSES} ${
          isCollapsed ? COLLAPSED_CLASSES : EXPANDED_CLASSES
        }`}
      >
        <div className="p-2">
          {sources && sources.length > 0 && (
            <Section title={sources.length > 1 ? 'Quellen:' : 'Quelle:'}>
              {sources.map((s, i) => (
                <SourceItem key={i} source={s} />
              ))}
            </Section>
          )}

          {csvUrl && (
            <Section title="Daten als CSV-Datei:" className="pt-2">
              <a
                href={csvUrl}
                download
                className="bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-200 font-base cursor-pointer px-2 py-1 rounded-lg inline-flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/download.svg"
                  alt="Download"
                  width={16}
                  height={16}
                  className="shrink-0"
                />
                <span className="whitespace-nowrap">Download</span>
              </a>
            </Section>
          )}

          {comments && comments.length > 0 && (
            <div className="flex flex-col gap-2 pt-2">
              {comments.map((c, i) => (
                <CommentItem key={i} comment={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
