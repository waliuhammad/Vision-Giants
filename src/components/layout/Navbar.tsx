import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { AnimatePresence, m } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { mainNav as fallbackMainNav, primaryCta as fallbackCta } from '../../data/navigation';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { useNavigation, useHeaderFooter } from '../../content/ContentContext';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const navSettings = useNavigation();
  const headerFooter = useHeaderFooter();

  const activeNav = (navSettings?.headerNav && navSettings.headerNav.length > 0
    ? navSettings.headerNav
    : fallbackMainNav
  ).filter((item) => item.active !== false);

  const activeCta = navSettings?.primaryCta || fallbackCta;

  // Slide the pill indicator under the active link (hidden when no main link is active).
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const place = () => {
      const active = nav.querySelector<HTMLElement>('.nav__link.active');
      if (!active) {
        indicator.classList.remove('is-ready');
        return;
      }
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
      indicator.classList.add('is-ready');
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [pathname, activeNav]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 1080 && setOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        {headerFooter?.header?.noticeBarEnabled && headerFooter.header.noticeBarText && (
          <div
            style={{
              background: 'linear-gradient(90deg, #1e40af, #2563eb, #38bdf8)',
              color: '#ffffff',
              padding: '6px 1rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
              pointerEvents: 'auto',
              width: '100%',
            }}
          >
            {headerFooter.header.noticeBarText}
          </div>
        )}

        <div className="container site-header__inner">
          <Logo onClick={close} />

          <nav ref={navRef} className="nav" aria-label="Main">
            <span ref={indicatorRef} className="nav__indicator" aria-hidden="true" />
            {activeNav.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav__link">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {headerFooter?.header?.showCta !== false && (
              <Button to={activeCta.to} size="sm" className="header-cta">
                {headerFooter?.header?.ctaText || activeCta.label}
              </Button>
            )}
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <m.div
              id="mobile-nav"
              ref={panelRef}
              className="mobile-nav"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav aria-label="Mobile">
                <ul>
                  {activeNav.map((item, i) => (
                    <m.li
                      key={item.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i + 0.05, duration: 0.25 }}
                    >
                      <NavLink to={item.to} className="mobile-nav__link" onClick={close}>
                        {item.label}
                      </NavLink>
                    </m.li>
                  ))}
                </ul>
                {headerFooter?.header?.showCta !== false && (
                  <Button to={activeCta.to} className="header-cta" icon={<ArrowRight size={18} />} onClick={close}>
                    {headerFooter?.header?.ctaText || activeCta.label}
                  </Button>
                )}
              </nav>
            </m.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
