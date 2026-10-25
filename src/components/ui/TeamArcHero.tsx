import { useState } from 'react';
import { User } from 'lucide-react';
import { heroArcMembers } from '../../data/team';

export function TeamArcHero() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="team-arc-wrapper" aria-label="Team member showcase fan">
      <div className="team-arc-glow" aria-hidden="true" />

      <div className="team-arc-stage">
        {heroArcMembers.map((member) => {
          const isHovered = hoveredId === member.id;
          const initials = member.name
            .split(' ')
            .map((n) => n[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('');

          // Base transform based on its arc position
          const transform = `rotate(${member.rotation}deg) translateY(${member.offsetY}px)${
            isHovered ? ' scale(1.08) translateY(-10px)' : ''
          }`;

          return (
            <div
              key={member.id}
              className={`team-arc-card ${isHovered ? 'is-hovered' : ''}`}
              style={{
                transform,
                zIndex: isHovered ? 20 : 10 - Math.abs(member.rotation) / 5,
              }}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="team-arc-card__inner">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="team-arc-card__image" loading="lazy" />
                ) : (
                  <div className="team-arc-card__placeholder">
                    <div className="team-arc-card__placeholder-glow" />
                    <div className="team-arc-card__placeholder-avatar">
                      <User size={38} className="team-arc-card__placeholder-icon" aria-hidden="true" />
                    </div>
                    <span className="team-arc-card__initials">{initials}</span>
                  </div>
                )}

                <div className="team-arc-card__meta">
                  <span className="team-arc-card__name">{member.name}</span>
                  <span className="team-arc-card__role">{member.role}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
