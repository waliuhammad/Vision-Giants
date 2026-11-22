import { Scale } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';

export default function TermsPage() {
  return (
    <div className="terms-page">
      <PageHero
        crumb="Terms of Service"
        eyebrow="Legal"
        title="Terms of Service"
        lead="The terms that govern your use of Vision Giants' website and services."
        visual={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Scale size={100} style={{ color: 'var(--color-primary)', opacity: 0.2 }} />
          </div>
        }
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="prose" style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
            <p><strong>Last updated:</strong> November 2026</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Vision Giants website (vgiants.com) or engaging our
              services, you agree to be bound by these Terms of Service. If you do not agree,
              please do not use our website or services.
            </p>

            <h2>2. Services</h2>
            <p>
              Vision Giants provides custom software development, web and mobile application
              development, digital marketing, graphic design, video editing, and technology
              training services. Specific terms for each engagement are agreed in writing
              before work begins.
            </p>

            <h2>3. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos, and code — is owned
              by or licensed to Vision Giants and protected by applicable intellectual property laws.
              Work product delivered to clients is governed by the terms of their individual
              service agreement.
            </p>

            <h2>4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our website for any unlawful purpose.</li>
              <li>Attempt to gain unauthorised access to our systems.</li>
              <li>Upload malicious code or interfere with the website's operation.</li>
              <li>Misrepresent yourself or your affiliation.</li>
            </ul>

            <h2>5. Disclaimer of Warranties</h2>
            <p>
              This website and its content are provided "as is" without warranties of any kind,
              either express or implied. We do not warrant that the website will be uninterrupted
              or error-free.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Vision Giants shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of
              our website or services.
            </p>

            <h2>7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the content or privacy practices of those sites.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. The "Last updated" date
              indicates the most recent revision. Continued use after changes constitutes
              acceptance.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Pakistan. Any disputes shall be resolved
              in the courts of Multan, Punjab, Pakistan.
            </p>

            <h2>10. Contact</h2>
            <p>
              Vision Giants, Multan, Pakistan<br />
              Email: <a href="mailto:info@vgiants.com">info@vgiants.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
