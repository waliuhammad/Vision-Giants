import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container not-found">
        <div>
          <p className="not-found__code text-gradient">404</p>
          <h1 style={{ marginTop: 'var(--space-4)' }}>Page not found</h1>
          <p className="lead" style={{ marginTop: 'var(--space-4)' }}>
            The page you’re looking for doesn’t exist or may have moved.
          </p>
          <div className="page-hero__actions">
            <Button to="/" icon={<ArrowRight size={18} />}>
              Back to Home
            </Button>
            <Button to="/contact/" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
