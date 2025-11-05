import React from 'react';

interface ArrowProps {
  className?: string;
  isRotated?: boolean;
}

export const Arrow: React.FC<ArrowProps> = ({ className = '', isRotated = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-100 ${isRotated ? 'rotate-180' : 'rotate-0'} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 9l-7 7-7-7" />
  </svg>
);