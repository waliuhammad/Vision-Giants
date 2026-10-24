import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isFirebaseConfigured } from '../config/firebase';
import { defaultContent, type SiteContent } from './schema';

declare global {
  interface Window {
    /** Content the page was prerendered with; hydration must start from the same data. */
    __CONTENT__?: SiteContent;
  }
}

const ContentContext = createContext<SiteContent>(defaultContent);

/**
 * Provides managed content. Starts from the content the page was prerendered with, then refreshes
 * it from Firestore in the browser so dashboard edits show up before the next deploy.
 */
export function ContentProvider({ initial, children }: { initial: SiteContent; children: ReactNode }) {
  const [content, setContent] = useState(initial);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    import('./load')
      .then(({ loadContent }) => loadContent())
      .then((fresh) => {
        if (!cancelled) setContent(fresh);
      })
      .catch((err) => console.warn('Could not refresh content; showing prerendered content', err));
    return () => {
      cancelled = true;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
