import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { m } from 'motion/react';
import { getPageMeta, canonicalUrl } from '../../config/seo';

/** Keeps document title/description/canonical in sync during client-side navigation. */
function syncHead(pathname: string) {
  const meta = getPageMeta(pathname);
  document.title = meta.title;
  const set = (selector: string, attr: string, value: string) =>
    document.head.querySelector(selector)?.setAttribute(attr, value);
  set('meta[name="description"]', 'content', meta.description);
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[property="og:url"]', 'content', canonicalUrl(meta.path));
  set('link[rel="canonical"]', 'href', canonicalUrl(meta.path));
}

/**
 * Wraps route content with a short fade/slide on client navigations, handles scroll position
 * (top of page, or the #hash target) and head updates. The first, prerendered paint is not animated.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const isFirst = useRef(true);
  const first = isFirst.current;

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      // Dev server serves an un-prerendered shell without a <title>
      if (!document.title) syncHead(pathname);
    } else {
      syncHead(pathname);
    }
    if (hash) {
      // Wait a frame so the new page is in the DOM
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <m.main
      id="main"
      key={pathname}
      tabIndex={-1}
      initial={first ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ outline: 'none' }}
    >
      {children}
    </m.main>
  );
}
