import { Link } from 'react-router';
import { company } from '../../data/company';

/** Brand logo: the eye mark plus the company name and "PVT LTD" line. */
export function Logo({ onClick }: { onClick?: () => void }) {
  const suffix = company.legalName.slice(company.name.length).trim();
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label={`${company.legalName}, home`}>
      <span className="logo__mark" aria-hidden="true">
        <img src="/logo-mark.png" alt="" width="148" height="98" />
      </span>
      <span className="logo__text">
        <span className="logo__name">{company.name}</span>
        {suffix && <span className="logo__suffix">{suffix}</span>}
      </span>
    </Link>
  );
}
