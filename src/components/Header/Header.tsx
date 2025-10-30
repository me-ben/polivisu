'use client';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation/Navigation';
import { Logo } from '@/components/Logo/Logo';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';

const Header = () => {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isNavOpen, setIsNavOpen] = useState(false);
  const router = useRouter();

  // Finde den aktuellen Seitentitel
  const currentPageTitle = useMemo(() => {
    const route = routes.find(r => r.path === pathname);
    return route?.name || 'Seite';
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-zinc-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-top justify-between w-full gap-2 sm:gap-4">
            <div className="flex items-center py-2 sm:py-4 flex-row text-left gap-2 sm:gap-4 min-w-0 flex-1">
              <Logo
                className="cursor-pointer"
                onClick={() => router.push('/')}
              />
              <h1
                onClick={() => router.push('/')}
                className={`text-xl font-bold text-white hover:text-red-300 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap
                  ${!isHomepage ? 'hidden sm:block' : ''}`}
              >
                Deutschland in Daten
              </h1>
            </div>
            {!isHomepage && (
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                aria-label={isNavOpen ? "Navigation schließen" : "Navigation öffnen"}
                aria-expanded={isNavOpen}
                className={`h-8 sm:h-12 pl-2 sm:pl-4 pr-1 mb-2 sm:mb-4 sm:pr-2 sm:gap-1 rounded-b-lg cursor-pointer flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap
                  ${isNavOpen
                    ? 'bg-red-300 hover:bg-gradient-to-t hover:from-red-300 hover:to-white'
                    : 'bg-white hover:bg-gradient-to-t hover:from-red-300 hover:to-white'
                  }`}
              >
                <span className="sr-only">
                  Navigation
                </span>
                <span className="font-bold text-black text-base sm:text-lg overflow-hidden text-ellipsis whitespace-nowrap pl-1]">
                  {currentPageTitle}
                </span>
                <img
                  src="icons/arrow.svg"
                  alt=""
                  aria-hidden="true"
                  className={`h-6 sm:h-8 w-auto transition-transform duration-100
                    ${isNavOpen
                      ? 'rotate-180'
                      : 'rotate-0'
                    }`}
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