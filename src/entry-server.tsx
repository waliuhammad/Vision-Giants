import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './app/App';
import type { SiteContent } from './content/schema';

/** Renders a route to static HTML. Used by scripts/prerender.mjs at build time. */
export function render(url: string, content: SiteContent): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App content={content} />
      </StaticRouter>
    </StrictMode>,
  );
}

export { pages, notFoundMeta, adminMeta, renderHeadTags, SITE_URL } from './config/seo';
export { loadContent } from './content/load';
export { isFirebaseConfigured } from './config/firebase';
