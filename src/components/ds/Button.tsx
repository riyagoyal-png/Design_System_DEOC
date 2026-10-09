import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

export type ButtonVariant = 'primary' | 'secondary' | 'tonal' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

/** §5.1 spinner: 16px, 3px stroke, currentColor, 1s linear. */
export function Spinner({ label }: { label?: string }) {
  return (
    <svg className="ds-spinner" viewBox="0 0 24 24" fill="none" aria-hidden={label ? undefined : 'true'} role={label ? 'img' : undefined} aria-label={label}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  );
}

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leading?: LucideIcon;
  trailing?: LucideIcon;
  loading?: boolean;
  /** aria-disabled: stays focusable so a reason can be attached (§5 disabled rules). */
  softDisabled?: boolean;
  minWidth?: boolean;
  children: ReactNode;
}

/** §5.1 Button. */
export function Button({ variant = 'primary', size = 'md', leading, trailing, loading, softDisabled, minWidth, className = '', children, onClick, type = 'button', ...rest }: ButtonProps) {
  const leadSize = leading && (leading.displayName === 'ArrowLeft' || size === 'lg') ? 20 : 14;
  return (
    <button
      type={type}
      className={`ds-btn ds-btn--${variant}${size !== 'md' ? ` ds-btn--${size}` : ''}${minWidth ? ' ds-btn--minw' : ''} ${className}`.trim()}
      aria-disabled={softDisabled || loading ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      onClick={e => { if (softDisabled || loading) { e.preventDefault(); return; } onClick?.(e); }}
      data-part="container"
      {...rest}
    >
      {loading ? <Spinner /> : leading ? <span data-part="leading" style={{ display: 'contents' }}><Icon icon={leading} size={leadSize} dir={leading.displayName?.startsWith('Arrow')} /></span> : null}
      <span data-part="label">{children}</span>
      {!loading && trailing && <span data-part="trailing" style={{ display: 'contents' }}><Icon icon={trailing} size={14} dir={trailing.displayName?.startsWith('Chevron')} /></span>}
    </button>
  );
}

/** §5.2 Icon button: aria-label + tooltip on hover and focus. */
export function IconButton({ icon, label, size = 'md', variant, className = '', tooltip = true, iconSize, ...rest }: {
  icon: LucideIcon; label: string; size?: 'sm' | 'md'; variant?: 'close'; tooltip?: boolean; iconSize?: number;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  const btn = (
    <button type="button" aria-label={label} data-part="container"
      className={`ds-icon-btn${size === 'sm' ? ' ds-icon-btn--sm' : ''}${variant === 'close' ? ' ds-icon-btn--close' : ''} ${className}`.trim()} {...rest}>
      <Icon icon={icon} size={iconSize ?? (variant === 'close' ? 12 : 20)} strokeWidth={variant === 'close' ? 2 : 1.5} dir={icon.displayName?.startsWith('Arrow') || icon.displayName?.startsWith('Chevron')} />
    </button>
  );
  return tooltip ? <Tooltip content={label} describe={false}>{btn}</Tooltip> : btn;
}

/** §5.3 Link action. */
export function LinkAction({ icon, children, className = '', ...rest }: { icon?: LucideIcon; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`ds-link-action ${className}`.trim()} data-part="container" {...rest}>
      {icon && <span data-part="icon" className="ds-contents"><Icon icon={icon} size={14} /></span>}
      <span data-part="label">{children}</span>
    </button>
  );
}
