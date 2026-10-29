import type { CSSProperties } from 'react';
import type { Project } from '../../data/portfolio';

/**
 * Homepage hero visual built from real project screenshots: a desktop browser frame with one
 * project, overlapped by a phone frame showing another project's mobile view. Falls back to
 * nothing when no project has screenshots, so the hero never shows a placeholder.
 */
export function HeroShowcase({ projects }: { projects: Project[] }) {
  const withShots = projects.filter((p) => p.images?.some((src) => !src.includes('mobile')));
  const desktop = withShots[0];
  const phone = withShots.find((p) => p.id !== desktop?.id && p.images?.some((src) => src.includes('mobile')));
  if (!desktop) return null;

  const desktopSrc = desktop.images!.find((src) => !src.includes('mobile'))!;
  const phoneSrc = phone?.images!.find((src) => src.includes('mobile'));
  const host = desktop.url ? new URL(desktop.url).host.replace(/^www\./, '') : desktop.title;

  return (
    <figure className="showcase enter" style={{ '--delay': '150ms' } as CSSProperties}>
      <div className="showcase__browser">
        <div className="showcase__bar" aria-hidden="true">
          <span className="showcase__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="showcase__url">{host}</span>
        </div>
        <img src={desktopSrc} alt={`${desktop.title} website, built by our team`} width={1280} height={800} fetchPriority="high" />
      </div>
      {phone && phoneSrc && (
        <div className="showcase__phone">
          <img src={phoneSrc} alt={`${phone.title} on mobile`} width={390} height={844} loading="lazy" />
        </div>
      )}
      <figcaption className="visually-hidden">Recent projects: {desktop.title}{phone ? ` and ${phone.title}` : ''}</figcaption>
    </figure>
  );
}
