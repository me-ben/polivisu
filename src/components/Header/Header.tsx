'use client';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation/Navigation';
import { Logo } from '@/components/Logo/Logo';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { Arrow } from '@/components/Arrow/Arrow';

const Header = () => {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const router = useRouter();

  // Determine current page title
  const currentPageTitle = useMemo(() => {
    const route = routes.find(r => r.path === pathname);
    return route?.name || 'Seite';
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-1000 bg-neutral-800">
        <div className="max-w-6xl mx-auto relative z-1000">
          <div className="flex items-center justify-between w-full gap-2 sm:gap-4 pr-2 sm:pr-4">
            <div
              onClick={() => router.push('/')}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="group flex items-center py-2 sm:py-4 flex-row text-left gap-2 sm:gap-4 flex-1 min-w-0 overflow-hidden cursor-pointer"
            >
              <div className="shrink-0">
                <Logo isHovered={isLogoHovered} />
              </div>
              <h1 className="text-xl font-bold text-white group-hover:underline overflow-hidden text-ellipsis whitespace-nowrap">
                Deutschland in Daten
              </h1>
            </div>

            {!isHomepage && (
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                aria-label={isNavOpen ? "Navigation schließen" : "Navigation öffnen"}
                aria-expanded={isNavOpen}
                className="h-8 sm:h-12 pl-2 sm:pl-4 pr-1 sm:pr-2 sm:gap-1 rounded-lg cursor-pointer flex items-center justify-center shrink-0 bg-white hover:bg-neutral-200"
              >
                <span className="sr-only">Navigation</span>
                <span className="font-bold text-base sm:text-lg">
                  {currentPageTitle}
                </span>
                <Arrow className="h-4 sm:h-6 px-1 sm:px-2 w-auto" isRotated={isNavOpen} />
              </button>
            )}
          </div>
        </div>
      </header>

      <Navigation
        isHomepage={isHomepage}
        isVisible={isNavOpen}
        onClose={() => setIsNavOpen(false)}
      />
    </>
  );
};

export default Header;