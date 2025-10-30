'use client';
import React from 'react';

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Content = ({ children, className = '' }: ContentProps) => {
  return (
    <div
      className={`max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-4 bg-white text-black ${className}`}
    >
      {children}
    </div>
  );
};
