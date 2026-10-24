import { Link } from 'react-router';
import { CodeXml } from 'lucide-react';
import { company } from '../../data/company';

/**
 * Temporary logo: icon mark + company name from config.
 * Replace the mark with the real logo (e.g. an <img src="/logo.svg">) when supplied.
 */
export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label={`${company.name}, home`}>
      <span className="logo__mark" aria-hidden="true">
        <CodeXml size={20} strokeWidth={2.2} />
      </span>
      <span>{company.name}</span>
    </Link>
  );
}
