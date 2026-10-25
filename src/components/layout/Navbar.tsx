import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, m } from 'motion/react';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { mainNav, primaryCta, servicesMenuExtras, type NavItem } from '../../data/navigation';
import { useContent } from '../../content/ContentContext';
import { Logo } from './Logo';
import { Button } from '../ui/Button';

const SERVICES_PATH = '/services/';

/** Desktop "Services" item: the link goes to /services/, the chevron (or hover) opens the menu. */
function ServicesMenu({ label, to }: NavItem) {
  const { services } = useContent();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className={`nav__menu${open ? ' is-open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <NavLink to={to} className="nav__link">
        {label}
      </NavLink>
      <button
        type="button"
        className="nav__menu-toggle"
        aria-expanded={open}
        aria-controls="services-menu"
        aria-label={`${label} menu`}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div id="services-menu" className="nav__dropdown" hidden={!open}>
        <div className="nav__dropdown-panel">
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <Link to={`/services/${s.id}/`} className="nav__dropdown-link">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="nav__dropdown-extras">
            {servicesMenuExtras.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end className="nav__dropdown-link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Mobile menu: the main items, with Technologies (in the Services menu on desktop) right after Services. */
const mobileNav = mainNav.flatMap((item) => (item.to === SERVICES_PATH ? [item, servicesMenuExtras[1]] : [item]));

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container site-header__inner">
        <Logo onClick={close} />

        <nav className="nav" aria-label="Main">
          {mainNav.map((item) =>
            item.to === SERVICES_PATH ? (
              <ServicesMenu key={item.to} {...item} />
            ) : (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav__link">
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="header-actions">
          <Button to={primaryCta.to} size="sm" className="header-cta">
            {primaryCta.label}
          </Button>
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
                {mobileNav.map((item, i) => (
                  <m.li
                    key={item.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i + 0.05, duration: 0.25 }}
                  >
                    <NavLink to={item.to} end={item.to === '/'} className="mobile-nav__link" onClick={close}>
                      {item.label}
                    </NavLink>
                  </m.li>
                ))}
              </ul>
              <Button to={primaryCta.to} icon={<ArrowRight size={18} />} onClick={close}>
                {primaryCta.label}
              </Button>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
