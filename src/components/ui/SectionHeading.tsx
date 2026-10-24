import type { ReactNode } from 'react';
import { Reveal } from '../animations/Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  /** Optional element shown to the right of the heading (e.g. a "view all" link). */
  aside?: ReactNode;
  id?: string;
}

export function SectionHeading({ eyebrow, title, lead, align = 'left', aside, id }: SectionHeadingProps) {
  const text = (
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
  return (
    <Reveal
      className={`section-heading${align === 'center' ? ' section-heading--center' : ''}${aside ? ' section-heading--split' : ''}`}
    >
      {text}
      {aside}
    </Reveal>
  );
}
