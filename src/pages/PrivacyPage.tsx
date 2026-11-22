import { FileText } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <PageHero
        crumb="Privacy Policy"
        eyebrow="Legal"
        title="Privacy Policy"
        lead="How Vision Giants collects, uses, and protects your personal information."
        visual={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <FileText size={100} style={{ color: 'var(--color-primary)', opacity: 0.2 }} />
          </div>
        }
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="prose" style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
            <p><strong>Last updated:</strong> November 2026</p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly when you fill out a contact form, apply for
              a job, or enrol in a course — such as your name, email address, phone number, and any
              project details you share with us.
            </p>
            <p>
              We may also collect limited usage data (pages visited, browser type, referral source)
              via standard web analytics to help us improve our website.
            </p>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To respond to your enquiries and provide our services.</li>
              <li>To process job applications and course enrolments.</li>
              <li>To send service-related communications (never unsolicited marketing without consent).</li>
              <li>To analyse and improve our website and offerings.</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell, rent, or trade your personal information. We may share it only with
              trusted service providers (e.g. email platforms, payment processors) who help us
              operate our business, under strict confidentiality obligations.
            </p>

            <h2>4. Data Retention</h2>
            <p>
              We retain your data only as long as necessary to fulfil the purpose for which it was
              collected, or as required by applicable law.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Our website may use functional cookies to maintain session state. We do not use
              third-party advertising cookies. You can disable cookies in your browser settings.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, correct, or request deletion of your personal data at
              any time. To exercise these rights, contact us at{' '}
              <a href="mailto:info@vgiants.com">info@vgiants.com</a>.
            </p>

            <h2>7. Security</h2>
            <p>
              We implement industry-standard security measures to protect your information from
              unauthorised access, disclosure, or loss. No transmission over the internet is
              100% secure, so we cannot guarantee absolute security.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. The "Last updated" date at the top
              reflects the most recent revision. Continued use of our website after changes
              constitutes acceptance of the revised policy.
            </p>

            <h2>9. Contact Us</h2>
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
