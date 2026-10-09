import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Mail, X } from 'lucide-react';
import { Icon } from './Icon';
import { spec } from '../../lib/spec';

export type Tone = 'success' | 'warning' | 'error';

/** §5.27 Badge. */
export function Badge({ tone, size = 'md', children }: { tone: Tone | 'info' | 'neutral'; size?: 'md' | 'sm'; children: ReactNode }) {
  return (
    <span className={`ds-badge ds-badge--${tone}${size === 'sm' ? ' ds-badge--sm' : ''}`} data-part="container">
      <span className="ds-badge__dot" aria-hidden="true" data-part="dot" />
      <span data-part="label">{children}</span>
    </span>
  );
}

/** §5.28 Status dot with a visible label (a), or standalone with role="img" (b). */
export function Status({ tone, children, size = 'sm' }: { tone: Tone; children: ReactNode; size?: 'sm' | 'md' }) {
  return (
    <span className="ds-status" data-part="container">
      <span className={`ds-dot ds-dot--${tone}${size === 'sm' ? ' ds-dot--sm' : ''}`} aria-hidden="true" data-part="dot" />
      <span data-part="label">{children}</span>
    </span>
  );
}
export function Dot({ tone, size = 'md', label }: { tone: Tone; size?: 'sm' | 'md'; label?: string }) {
  return <span className={`ds-dot ds-dot--${tone}${size === 'sm' ? ' ds-dot--sm' : ''}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'} />;
}

export type TagColor = 'purple' | 'blue' | 'green' | 'amber' | 'rose';
export const TAG_ORDER: TagColor[] = ['purple', 'blue', 'green', 'amber', 'rose'];
/** §5.29 Tag (solid category). */
export function Tag({ color, raised, children }: { color: TagColor; raised?: boolean; children: ReactNode }) {
  return <span className={`ds-tag ds-tag--${color}${raised ? ' ds-tag--raised' : ''}`} data-part="container">{children}</span>;
}
/** Stable category → color mapping, assigned once per product (§5.29). */
export function tagColorFor(categories: string[], cat: string): TagColor {
  return TAG_ORDER[Math.max(0, categories.indexOf(cat)) % TAG_ORDER.length];
}

export function CountPill({ children, label }: { children: ReactNode; label?: string }) {
  return <span className="ds-count" aria-label={label} data-part="container">{children}</span>;
}
export function Chip({ children }: { children: ReactNode }) {
  return <span className="ds-chip" data-part="container">{children}</span>;
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
}
/** §5.32 Avatar: photo 32, initials brand 40, initials neutral 36. */
export function Avatar({ name, variant = 'brand', src, decorative = true }: { name: string; variant?: 'brand' | 'neutral' | 'photo'; src?: string; decorative?: boolean }) {
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': name };
  if (variant === 'photo') return <span className="ds-avatar ds-avatar--photo" data-part="container" {...a11y}><span>{src ? <img src={src} alt="" /> : initials(name)}</span></span>;
  return <span className={`ds-avatar${variant === 'neutral' ? ' ds-avatar--neutral' : ''}`} data-part="container" {...a11y}>{initials(name)}</span>;
}

/** §5.33 Metric indicator. */
export function Metric({ label, value, of, tone }: { label: string; value: number | string; of?: number; tone?: 'success' | 'warning' | 'alert' }) {
  const color = tone === 'success' ? 'ds-c-success' : tone === 'warning' ? 'ds-c-warning' : tone === 'alert' ? 'ds-c-alert' : '';
  return (
    <div className="ds-metric" data-part="container">
      <span className="ds-text-metric-label" data-part="label">{label}</span>
      <span className="ds-metric__value" aria-label={of !== undefined ? `${value} of ${of}` : undefined} data-part="value">
        <b className={color}>{value}</b>{of !== undefined && <span data-part="denominator">/{of}</span>}
      </span>
    </div>
  );
}

/** §5.34 Segmented status bar (2px card-colored gaps, min 28px per non-empty segment). */
export function SegBar({ segments, label }: { segments: { value: number; color: string; label: string }[]; label?: string }) {
  const nonEmpty = segments.filter(s => s.value > 0);
  return (
    <div className="ds-segbar" data-part="track" role="img" aria-label={label ?? segments.map(s => `${s.value} ${s.label}`).join(', ')}>
      {nonEmpty.map(s => (
        <span key={s.label} data-part="segment" className="ds-segbar__seg" style={{ flexGrow: s.value, background: s.color }}>{s.value}</span>
      ))}
    </div>
  );
}

/** §5.34 Progress bar [EXTENSION]. */
export function Progress({ value, tone = 'brand', label, showValue = true }: { value: number; tone?: 'brand' | 'success' | 'warning' | 'error'; label: string; showValue?: boolean }) {
  return (
    <div className="ds-progress-row" data-part="container">
      <div data-part="track" className={`ds-progress ds-progress--${tone}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <span data-part="fill" style={{ width: `${value}%` }} />
      </div>
      {showValue && <b aria-hidden="true" data-part="value">{value}%</b>}
    </div>
  );
}

/** §5.50 skeleton bar. */
export function Skeleton({ w = '100%', h = 12 }: { w?: string | number; h?: number }) {
  return <span className="ds-skeleton ds-skeleton--bar" style={{ width: w, height: h }} aria-hidden="true" />;
}

/** §5.51 empty state. */
export function EmptyState({ title, message, action, icon, variant = 'inline' }: { title?: string; message: string; action?: ReactNode; icon?: ReactNode; variant?: 'inline' | 'first-use' | 'chart' }) {
  return (
    <div className={`ds-empty ds-empty--${variant}`} data-part="container">
      {icon && <span data-part="icon" className="ds-contents">{icon}</span>}
      {title && <p className="ds-text-card-title" data-part="title">{title}</p>}
      <p className="ds-text-body-muted" data-part="message">{message}</p>
      {action && <span data-part="action" className="ds-contents">{action}</span>}
    </div>
  );
}

/** §5.20 callout, §5.21 inline alert [EXTENSION]. */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return <div className="ds-callout" data-part="container"><p className="ds-callout__title" data-part="title">{title}</p><p className="ds-callout__body" data-part="body">{children}</p></div>;
}
const ALERT_ICON: Record<string, LucideIcon> = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: AlertCircle };
export function InlineAlert({ tone, title, children, onDismiss }: { tone: 'info' | 'success' | 'warning' | 'error'; title?: string; children: ReactNode; onDismiss?: () => void }) {
  return (
    <div className={`ds-callout ds-callout--${tone}`} role={tone === 'error' ? 'alert' : 'status'} data-part="container">
      <Icon icon={ALERT_ICON[tone]} size={16} color={tone === 'info' ? 'var(--ds-color-brand)' : undefined} data-part="icon" />
      <div className="ds-callout__content" data-part="content">
        {title && <p className="ds-callout__title">{title}</p>}
        <p className="ds-callout__body">{children}</p>
      </div>
      {onDismiss && <button type="button" data-part="dismiss" className="ds-icon-btn ds-icon-btn--sm ds-callout__dismiss" aria-label="Dismiss" onClick={onDismiss}><Icon icon={X} size={14} /></button>}
    </div>
  );
}

/** §2.11-D icon tile fallback. */
export function IconTile({ icon, size = 40, tone, label }: { icon: LucideIcon; size?: 40 | 32 | 28; tone?: Tone; label?: string }) {
  const cls = `ds-icon-tile${size === 32 ? ' ds-icon-tile--32' : size === 28 ? ' ds-icon-tile--sm' : ''}${tone ? ` ds-icon-tile--${tone}` : ''}`;
  return <span className={cls} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}><Icon icon={icon} size={size === 40 ? 20 : 16} /></span>;
}

/** §2.11-B registry illustration (copied asset), decorative. Sprite frames via overflow + offset. */
export function Illustration({ name, size = 40, frame, frames }: { name: string; size?: number; frame?: number; frames?: number }) {
  const entry = spec.registry.find(r => r.name === name);
  if (!entry) return null;
  const src = `${import.meta.env.BASE_URL}assets/${entry.file}`;
  if (frames && frame !== undefined) {
    return (
      <span className="ds-sprite" style={{ width: size, height: size }} aria-hidden="true">
        <img src={src} alt="" style={{ width: `${frames * 100}%`, left: `-${frame * 100}%` }} />
      </span>
    );
  }
  return <img className="ds-illus" src={src} alt="" aria-hidden="true" width={size} height={size} />;
}

/** §5.22 Stepper. */
export function Stepper({ steps, current }: { steps: { title: string; sub: string }[]; current: number }) {
  return (
    <ol className="ds-stepper" aria-label="Progress" data-part="list">
      {steps.map((s, i) => (
        <li key={s.title} className={`ds-step${i < current ? ' ds-step--done' : ''}`} aria-current={i === current ? 'step' : undefined} data-part={i === current + 1 ? 'upcoming' : undefined}>
          <span className="ds-step__index" data-part={i === current ? 'index' : undefined}>{i < current ? <Icon icon={CheckCircle2} size={16} /> : i + 1}</span>
          <span className="ds-step__text" data-part={i === current ? 'text' : undefined}>
            <span className="ds-step__title">{s.title}{i < current && <span className="ds-sr-only"> (completed)</span>}</span>
            <span className="ds-step__sub">{s.sub}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function EmailLine({ email }: { email: string }) {
  return <span className="ds-picker-row__line2"><Icon icon={Mail} size={11} /><span className="ds-truncate">{email}</span></span>;
}
