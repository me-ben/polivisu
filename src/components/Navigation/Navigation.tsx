'use client';
import React, { useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { routes } from '@/lib/routes';

interface NavigationProps {
  isHomepage?: boolean;
  isVisible?: boolean;
  onClose?: () => void;
}

export const Navigation = ({
  isHomepage = false,
  isVisible = true,
  onClose
}: NavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Filtere alle Nicht-Homepage-Routen heraus
  // und zusätzlich die aktuell aktive Route (außer auf der Homepage)
  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      if (route.isHomepage) return false;
      if (!isHomepage && route.path === pathname) return false; // aktuelle Seite ausblenden
      return true;
    });
  }, [pathname, isHomepage]);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose?.();
  };

  if (!isVisible && !isHomepage) return null;

  const navButtons = filteredRoutes.map((route) => (
    <button
      key={route.path}
      onClick={() => handleNavigate(route.path)}
      className="bg-white hover:bg-gradient-to-t hover:from-red-300 hover:to-white text-black font-base cursor-pointer px-2 rounded-lg transition-colors flex-shrink-0"
    >
      {route.name}
    </button>
  ));

  if (isHomepage) {
    return (
      <nav className="max-w-6xl mx-auto px-2 sm:px-4 pb-2 sm:pb-4 rounded-b-lg bg-zinc-700">
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-left">
          {navButtons}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed z-[999] inset-x-0 max-w-6xl mx-auto px-2 sm:px-4 pb-2 sm:pb-4 bg-zinc-700 rounded-b-lg">
      <div className="flex flex-wrap gap-2 sm:gap-4 justify-left">
        {navButtons}
      </div>
    </nav>
  );
};
