'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import ThemeToggle from './theme-toggle';
import { SearchTrigger } from './search/search-provider';

const NAV_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/contact', label: 'Contact' },
];

const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
];

const getIsActive = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/';
  }

  if (href === '/blog') {
    return (
      pathname === '/' || pathname === '/blog' || pathname.startsWith('/blog/')
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Navigation() {
  const pathname = usePathname();
  const [menuState, setMenuState] = useState<{
    open: boolean;
    anchoredPath: string;
  }>(() => ({ open: false, anchoredPath: pathname }));

  const isMenuOpen = menuState.open && menuState.anchoredPath === pathname;
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navItems = useMemo(() => NAV_LINKS, []);

  const closeMenu = useCallback(() => {
    setMenuState({ open: false, anchoredPath: pathname });
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const element = menuRef.current;
    const focusable = element?.querySelectorAll<HTMLElement>(
      focusableSelectors.join(', ')
    );

    focusable?.[0]?.focus();
    document.body.style.setProperty('overflow', 'hidden');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === 'Tab' && focusable && focusable.length > 0) {
        const focusableItems = Array.from(focusable);
        const first = focusableItems[0];
        const last = focusableItems[focusableItems.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.removeProperty('overflow');
    };
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const element = menuRef.current;
    if (!element) {
      return undefined;
    }

    let startX = 0;
    let hasPointer = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;
      hasPointer = true;
      startX = event.clientX;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!hasPointer || event.pointerType !== 'touch') return;
      const delta = event.clientX - startX;
      if (delta > 80) {
        hasPointer = false;
        closeMenu();
      }
    };

    const onPointerUp = () => {
      hasPointer = false;
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);

    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <nav aria-label="Primary" className="relative flex items-center gap-3">
      <div className="hidden items-center gap-5 md:flex">
        <ul className="flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = getIsActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative inline-flex items-center gap-1 transition-colors duration-200',
                    isActive
                      ? 'text-[var(--color-text)]'
                      : 'text-[var(--color-text-muted)] hover:text-accent'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-[var(--color-accent)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <SearchTrigger />
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <SearchTrigger variant="icon" />
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-surface text-[var(--color-text)] shadow-soft transition hover:bg-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          onClick={() =>
            setMenuState((state) => {
              const currentlyOpen =
                state.open && state.anchoredPath === pathname;
              return { open: !currentlyOpen, anchoredPath: pathname };
            })
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            tabIndex={-1}
          />
          <div
            ref={menuRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-40 flex w-72 max-w-[calc(100%-3rem)] flex-col gap-6 overflow-y-auto border-l border-subtle bg-surface px-6 pt-8 pb-[calc(env(safe-area-inset-bottom)+2rem)] shadow-soft md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                Navigation
              </span>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-elevated text-[var(--color-text)] transition hover:bg-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                onClick={closeMenu}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SearchTrigger variant="mobile" />

            <ul className="flex flex-col gap-4 text-base">
              {navItems.map((item) => {
                const isActive = getIsActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        'inline-flex items-center justify-between rounded-lg px-3 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
                        isActive
                          ? 'text-[var(--color-text)]'
                          : 'text-[var(--color-text-muted)] hover:bg-elevated'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="h-2 w-2 rounded-full bg-[var(--color-accent)]"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex items-center justify-between gap-4 rounded-lg border border-subtle px-3 py-3">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
