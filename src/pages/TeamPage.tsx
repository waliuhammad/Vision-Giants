import { teamMembers } from '../data/team';
import { TeamCard } from '../components/ui/TeamCard';
import { TeamArcHero } from '../components/ui/TeamArcHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';

export default function TeamPage() {
  return (
    <div className="team-page">
      {/* Hero Section with Title and Arc Showcase */}
      <section className="team-hero" aria-labelledby="team-hero-title">
        <div className="container text-center">
          <Reveal>
            <h1 id="team-hero-title" className="team-hero__title">
              Meet our Team
            </h1>
            <p className="team-hero__lead">
              A diverse team of passionate professionals with unique skills driving innovation and excellence in
              every project.
            </p>
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
            title="Team"
            lead="A diverse group of passionate professionals, each bringing unique skills and experiences to drive innovation and excellence in every project we undertake."
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
        title="Want to build the future with us? Join our team."
        text="We are always looking for passionate engineers, designers and strategists who care about craftsmanship and solving hard problems."
        primary={{ label: 'Explore Careers', to: '/careers/' }}
        secondary={{ label: 'Get in Touch', to: '/contact/' }}
      />
    </div>
  );
}
