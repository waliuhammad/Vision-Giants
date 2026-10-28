import { useState, type FormEvent } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function BlogNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    setStatus('loading');

    // Simulate clean client-side submission with clear message regarding backend integration
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setErrorMessage('');
    }, 450);
  };

  return (
    <section className="blog-newsletter" aria-labelledby="newsletter-heading">
      <div className="blog-newsletter__inner">
        <div className="blog-newsletter__glow" aria-hidden="true" />
        <div className="blog-newsletter__content">
          <div className="icon-wrap blog-newsletter__icon" aria-hidden="true">
            <Mail size={22} />
          </div>
          <div>
            <span className="eyebrow">STAY INFORMED</span>
            <h2 id="newsletter-heading" className="blog-newsletter__title">
              Software Architecture & Tech Insights, Delivered Monthly
            </h2>
            <p className="blog-newsletter__desc">
              Join 2,400+ engineers, product managers, and technology leaders. Zero spam, just deep-dive engineering
              guides and actionable digital strategy.
            </p>
          </div>
        </div>

        <div className="blog-newsletter__form-wrap">
          {status === 'success' ? (
            <div className="blog-newsletter__feedback blog-newsletter__feedback--success" role="status">
              <CheckCircle2 size={20} className="blog-newsletter__feedback-icon" />
              <div>
                <strong>Thank you for subscribing!</strong>
                <p>
                  We have noted your subscription. (Note: In production, this connects to your newsletter provider like
                  Resend or Mailchimp).
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="blog-newsletter__form" noValidate>
              <div className="blog-newsletter__input-group">
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address"
                  className="blog-newsletter__input"
                  aria-label="Email address for monthly insights newsletter"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={status === 'loading'}
                  icon={<ArrowRight size={16} />}
                  className="blog-newsletter__button"
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </div>

              {status === 'error' && (
                <p className="blog-newsletter__feedback blog-newsletter__feedback--error" role="alert">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </p>
              )}

              <p className="blog-newsletter__notice">
                We respect your privacy. Unsubscribe anytime with a single click.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
