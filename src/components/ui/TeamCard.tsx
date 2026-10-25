import type { ReactElement, ReactNode } from 'react';
import { Globe, User } from 'lucide-react';
import type { TeamMember } from '../../data/team';

type IconProps = {
  size?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
  className?: string;
};
type IconComponent = (props: IconProps) => ReactElement;

function createIcon(children: ReactNode): IconComponent {
  return function BrandIcon({ size = 16, className, ...rest }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...rest}
      >
        {children}
      </svg>
    );
  };
}

const Linkedin = createIcon(
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </>
);

const Twitter = createIcon(
  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
);

const Facebook = createIcon(
  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
);

const Instagram = createIcon(
  <>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </>
);

const Github = createIcon(
  <>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </>
);

interface TeamCardProps {
  member: TeamMember;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

export function TeamCard({ member, headingLevel: H = 'h3', className = '' }: TeamCardProps) {
  const { name, role, bio, image, socials } = member;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <article className={`team-card ${className}`.trim()}>
      <div className="team-card__media">
        {image ? (
          <img src={image} alt={name} className="team-card__image" loading="lazy" />
        ) : (
          <div className="team-card__placeholder" aria-label={`Photo placeholder for ${name}`}>
            <div className="team-card__placeholder-glow" />
            <div className="team-card__placeholder-icon-wrap">
              <User size={46} className="team-card__placeholder-icon" aria-hidden="true" />
            </div>
            <span className="team-card__placeholder-initials">{initials}</span>
          </div>
        )}
      </div>

      <div className="team-card__content">
        <H className="team-card__name">{name}</H>
        <p className="team-card__role">{role}</p>
        <p className="team-card__bio">{bio}</p>

        {socials && (
          <div className="team-card__socials" aria-label={`${name}'s social profiles`}>
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card__social-link"
                aria-label={`${name}'s LinkedIn`}
              >
                <Linkedin size={16} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card__social-link"
                aria-label={`${name}'s Twitter`}
              >
                <Twitter size={16} />
              </a>
            )}
            {socials.website && (
              <a
                href={socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card__social-link"
                aria-label={`${name}'s Website`}
              >
                <Globe size={16} />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card__social-link"
                aria-label={`${name}'s Instagram`}
              >
                <Instagram size={16} />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card__social-link"
                aria-label={`${name}'s Facebook`}
              >
                <Facebook size={16} />
              </a>
            )}
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card__social-link"
                aria-label={`${name}'s GitHub`}
              >
                <Github size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
