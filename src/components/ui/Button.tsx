import type { ReactNode, MouseEventHandler } from 'react';
import { Link } from 'react-router';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'md' | 'sm';
  icon?: ReactNode;
  /** Internal route. Renders a router <Link>. */
  to?: string;
  /** External/anchor URL. Renders an <a>. */
  href?: string;
  /** For `href`: "_blank" opens a new tab (with rel="noopener noreferrer"). */
  target?: '_blank';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  to,
  href,
  target,
  type = 'button',
  disabled,
  className = '',
  onClick,
}: ButtonProps) {
  const cls = `btn btn--${variant}${size === 'sm' ? ' btn--sm' : ''} ${className}`.trim();
  const content =
    variant === 'ghost' ? (
      <>
        {children}
        {icon && (
          <span className="btn__circle" aria-hidden="true">
            {icon}
          </span>
        )}
      </>
    ) : (
      <>
        {children}
        {icon && <span aria-hidden="true">{icon}</span>}
      </>
    );

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} target={target} rel={target ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  );
}
