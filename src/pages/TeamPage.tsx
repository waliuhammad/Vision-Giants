import { teamMembers } from '../data/team';
import { TeamCard } from '../components/ui/TeamCard';
import { TeamArcHero } from '../components/ui/TeamArcHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { usePageText } from '../content/ContentContext';
import { Highlight } from '../components/ui/Highlight';

export default function TeamPage() {
  const t = usePageText('team');
  return (
    <div className="team-page">
      {/* Hero Section with Title and Arc Showcase */}
      <section className="team-hero" aria-labelledby="team-hero-title">
        <div className="container text-center">
          <Reveal>
            <h1 id="team-hero-title" className="team-hero__title">
              <Highlight text={t('heroTitle')} />
            </h1>
            <p className="team-hero__lead">{t('heroLead')}</p>
          </Reveal>

          <Reveal delay={150}>
            <TeamArcHero />
          </Reveal>
        </div>
      </section>

      {/* Main Team Grid Section */}
      <section className="section team-grid-section" aria-labelledby="team-section-title">
        <div className="container">
          <SectionHeading
            id="team-section-title"
            title={t('gridTitle')}
            lead={t('gridLead')}
            align="center"
          />

          <div className="grid grid--4 team-members-grid">
            {teamMembers.map((member, i) => (
              <Reveal key={member.id} delay={(i % 4) * 80 + 50}>
                <TeamCard member={member} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t('ctaTitle')}
        text={t('ctaText')}
        primary={{ label: 'Explore Careers', to: '/careers/' }}
        secondary={{ label: 'Get in Touch', to: '/contact/' }}
      />
    </div>
  );
}
