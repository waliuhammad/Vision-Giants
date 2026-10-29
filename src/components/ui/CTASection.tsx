import { ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from '../animations/Reveal';

interface CTASectionProps {
  title?: string;
  text?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
}

export function CTASection({
  title = 'Have a project in mind? Let’s talk.',
  text = 'Tell us what you want to build. We’ll help you shape the scope, choose the right technology and plan a clear path to launch.',
  primary = { label: 'Start a Project', to: '/contact/' },
  secondary = { label: 'Explore Our Work', to: '/services/website-development/' },
}: CTASectionProps) {
  return (
    <section className="section section--tight" aria-labelledby="cta-title">
      <div className="container">
        <Reveal className="cta">
          <div>
            <h2 id="cta-title">{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta__actions">
            <Button to={primary.to} icon={<ArrowRight size={18} />}>
              {primary.label}
            </Button>
            <Button to={secondary.to} variant="outline">
              {secondary.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
