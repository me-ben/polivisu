'use client';
import { usePathname } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Navigation } from '@/components/Navigation/Navigation';
import { Logo } from '@/components/Logo/Logo';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';

const Header = () => {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Determine current page title
  const currentPageTitle = useMemo(() => {
    const route = routes.find(r => r.path === pathname);
    return route?.name || 'Seite';
  }, [pathname]);

  // Prevent FOUC by delaying render until mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-[1000] bg-zinc-700">
        <div className="max-w-6xl mx-auto h-16" />
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-zinc-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-top justify-between w-full gap-2 sm:gap-4">
            {/* Logo und Titel Container - nimmt verfügbaren Platz ein und ermöglicht Titel-Überlauf */}
            <div 
              onClick={() => router.push('/')}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="group flex items-center py-2 sm:py-4 flex-row text-left gap-2 sm:gap-4 flex-1 min-w-0 overflow-hidden cursor-pointer"
            >
              <Logo isHovered={isLogoHovered} />
              <h1 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors duration-200 ease-in-out overflow-hidden text-ellipsis whitespace-nowrap">
                Deutschland in Daten
              </h1>
            </div>

            {/* Navigation Button - nimmt immer benötigten Platz ein (flex-shrink-0) */}
            {!isHomepage && (
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                aria-label={isNavOpen ? "Navigation schließen" : "Navigation öffnen"}
                aria-expanded={isNavOpen}
                className={`h-8 sm:h-12 pl-2 sm:pl-4 pr-1 mb-2 sm:mb-4 sm:pr-2 sm:gap-1 rounded-b-lg cursor-pointer flex items-center justify-center flex-shrink-0
                  ${isNavOpen
                    ? 'bg-red-300 hover:bg-gradient-to-t hover:from-red-300 hover:to-white'
                    : 'bg-white hover:bg-gradient-to-t hover:from-red-300 hover:to-white'
                  }`}
              >
                <span className="sr-only">Navigation</span>
                <span className="font-bold text-black text-base sm:text-lg pl-1">
                  {currentPageTitle}
                </span>
                <img
                  src="icons/arrow.svg"
                  alt=""
                  aria-hidden="true"
                  className={`h-6 sm:h-8 w-auto transition-transform duration-100
                    ${isNavOpen ? 'rotate-180' : 'rotate-0'}`}
                />
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
