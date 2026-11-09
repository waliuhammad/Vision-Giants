import type { ReactNode } from 'react';

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
  return (
    <div
      className={`section-heading${align === 'center' ? ' section-heading--center' : ''}${aside ? ' section-heading--split' : ''}`}
    >
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {aside}
    </div>
  );
}
