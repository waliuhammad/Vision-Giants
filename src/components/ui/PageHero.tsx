import type { ReactNode, CSSProperties } from 'react';
import { Link } from 'react-router';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  /** Breadcrumb label for the current page. */
  crumb: string;
  actions?: ReactNode;
  visual: ReactNode;
}

/** Shared hero for inner pages: breadcrumbs, heading, copy, actions and a decorative visual. */
export function PageHero({ eyebrow, title, lead, crumb, actions, visual }: PageHeroProps) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="bg-grid" aria-hidden="true" />
      <div className="container page-hero__grid">
        <div>
          <nav className="breadcrumbs enter" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li aria-current="page">{crumb}</li>
            </ol>
          </nav>
          <p className="eyebrow enter" style={delay(60)}>
            {eyebrow}
          </p>
          <h1 id="page-title" className="enter" style={delay(120)}>
            {title}
          </h1>
          <p className="lead enter" style={delay(200)}>
            {lead}
          </p>
          {actions && (
            <div className="page-hero__actions enter" style={delay(280)}>
              {actions}
            </div>
          )}
        </div>
        <div className="page-hero__visual enter" style={delay(150)} aria-hidden="true">
          {visual}
        </div>
      </div>
    </section>
  );
}
