import { useId, type ReactNode } from 'react';
import { Maximize2, Video } from 'lucide-react';
import { Avatar, Badge, IconTile, Metric, SegBar, type Tone } from './Display';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

/** §5.23 KPI card. */
export function KpiCard({ label, value, icon, ball, delta, pressed, onToggle, className = '' }: {
  label: string; value: ReactNode; icon: ReactNode; ball?: 'success' | 'error'; delta?: { dir: 'up' | 'down'; text: string };
  pressed?: boolean; onToggle?: () => void; className?: string;
}) {
  const inner = (
    <>
      <div className="ds-kpi__icon" aria-hidden="true" data-part="icon">
        {icon}
        {ball && <span className={`ds-kpi__ball${ball === 'error' ? ' ds-kpi__ball--error' : ''}`} />}
      </div>
      <div className="ds-kpi__text" data-part="text">
        <p className="ds-kpi__label" data-part="label">{label}</p>
        <p className="ds-kpi__value" data-part="value">{value}</p>
        {delta && <p className={`ds-kpi__delta ds-kpi__delta--${delta.dir}`} data-part="delta">{delta.dir === 'up' ? '▲' : '▼'} {delta.text}</p>}
      </div>
    </>
  );
  return onToggle
    ? <button type="button" className={`ds-kpi ${className}`.trim()} aria-pressed={!!pressed} onClick={onToggle} data-part="container">{inner}</button>
    : <div className={`ds-kpi ${className}`.trim()} data-part="container">{inner}</div>;
}

/** §5.24 Entity card: the whole card is one link/button. */
export function EntityCard({ title, subtitle, icon, status, owner, role, when, whenCaption, metrics, inactive, href, onOpen, className = '' }: {
  title: string; subtitle: string; icon: ReactNode; status: { tone: Tone; label: string }; owner: string; role: string; when: string; whenCaption: string;
  metrics: { label: string; value: number; of?: number }[]; inactive?: boolean; href?: string; onOpen?: () => void; className?: string;
}) {
  const content = (
    <>
      <div className="ds-entity__section ds-entity__header" data-part="header">
        <div className="ds-entity__lead">
          <span aria-hidden="true">{icon}</span>
          <span className="ds-entity__titles">
            <span className="ds-text-card-title" data-part="title">{title}</span>
            <span className="ds-text-body-muted">{subtitle}</span>
          </span>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      <div className="ds-entity__section ds-entity__person" data-part="person">
        <span className="ds-entity__who">
          <Avatar name={owner} variant="neutral" />
          <span><b>{owner}</b><span className="ds-ts-caption ds-link-text">{role}</span></span>
        </span>
        <span className="ds-entity__when">{when}<span>{whenCaption}</span></span>
      </div>
      <div className="ds-entity__section ds-entity__metrics" data-part="metrics">
        {metrics.map(m => <div className="ds-entity__metric" key={m.label}><Metric label={m.label} value={m.value} of={m.of} /></div>)}
      </div>
    </>
  );
  const cls = `ds-entity${inactive ? ' ds-entity--inactive' : ''} ${className}`.trim();
  return href
    ? <a className={cls} href={href} data-part="container" onClick={e => { if (onOpen) { e.preventDefault(); onOpen(); } }}>{content}</a>
    : <button type="button" className={cls} onClick={onOpen} data-part="container">{content}</button>;
}

/** §5.25 Dashboard card. */
export function DashCard({ title, subtitle, right, children, flush, className = '', id }: {
  title: string; subtitle?: string; right?: ReactNode; children: ReactNode; flush?: boolean; className?: string; id?: string;
}) {
  const uid = useId();
  const tid = id ?? uid;
  return (
    <section className={`ds-dash-card${flush ? ' ds-dash-card--flush' : ''} ${className}`.trim()} aria-labelledby={tid} data-part="container">
      <div className="ds-dash-card__header" data-part="header">
        <div>
          <h2 className="ds-dash-card__title" id={tid} data-part="title">{title}</h2>
          {subtitle && <p className="ds-dash-card__subtitle" data-part="subtitle">{subtitle}</p>}
        </div>
        {right && <div className="ds-cluster ds-dash-card__right" data-part="controls">{right}</div>}
      </div>
      <div className="ds-dash-card__body" data-part="body">{children}</div>
    </section>
  );
}

/** §5.26 Status card: header + dot legend, segmented bar, capped table. */
export function StatusCard({ title, running, stopped, children }: { title: string; running: number; stopped: number; children: ReactNode }) {
  const tid = useId();
  return (
    <section className="ds-dash-card ds-dash-card--flush ds-status-card" aria-labelledby={tid} data-part="container">
      <div className="ds-dash-card__header" data-part="header">
        <h2 className="ds-dash-card__title" id={tid}>{title}</h2>
        <div className="ds-legend-dots" data-part="legend">
          <span className="ds-legend-dot"><i style={{ background: 'var(--ds-chart-running)' }} />Running</span>
          <span className="ds-legend-dot"><i style={{ background: 'var(--ds-chart-stopped)' }} />Stopped</span>
        </div>
      </div>
      <div className="ds-status-card__bar" data-part="bar">
        <SegBar segments={[{ value: running, color: 'var(--ds-chart-running)', label: 'running' }, { value: stopped, color: 'var(--ds-chart-stopped)', label: 'stopped' }]} />
      </div>
      <div className="ds-dash-card__body" data-part="table">{children}</div>
    </section>
  );
}

/** §5.35 Summary strip. */
export function SummaryStrip({ eyebrow, title, fields, statuses }: {
  eyebrow: string; title: string; fields: { label: string; value: string }[]; statuses?: { label: string; tone: Tone; value: string }[];
}) {
  const tid = useId();
  return (
    <section className="ds-strip" aria-labelledby={tid} data-part="container">
      <div className="ds-strip__lead" data-part="lead">
        <p className="ds-strip__eyebrow"><span className="ds-dot ds-dot--sm" aria-hidden="true" />{eyebrow}</p>
        <Tooltip content={title} onlyWhenTruncated>
          <h2 className="ds-strip__title ds-clamp-2" id={tid} tabIndex={0} data-truncate="">{title}</h2>
        </Tooltip>
      </div>
      <span className="ds-strip__divider" aria-hidden="true" data-part="divider" />
      <dl className="ds-strip__fields" data-part="fields">
        {fields.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
        {statuses?.map(s => (
          <div key={s.label}><dt>{s.label}</dt><dd><span className="ds-status"><span className={`ds-dot ds-dot--${s.tone}`} aria-hidden="true" />{s.value}</span></dd></div>
        ))}
      </dl>
    </section>
  );
}

/** §5.36 Media card (a single button). */
export function MediaCard({ title, sub, src, detail, badge, onOpen }: { title: string; sub: string; src: string; detail: string; badge: ReactNode; onOpen: () => void }) {
  return (
    <button type="button" className="ds-media-card" onClick={onOpen} data-part="container">
      <span className="ds-media-card__head" data-part="header">
        <IconTile icon={Video} size={28} />
        <span><span className="ds-text-card-title ds-truncate">{title}</span><span className="ds-text-body-muted">{sub}</span></span>
        <span className="ds-media-card__expand" aria-hidden="true"><Icon icon={Maximize2} size={16} /></span>
      </span>
      <span className="ds-media-card__media" data-part="media"><img src={src} alt="" /></span>
      <span className="ds-media-card__foot" data-part="footer">
        <span className="ds-media-card__detail ds-truncate">{detail.split(':')[0]}: <em>{detail.split(':').slice(1).join(':').trim()}</em></span>
        {badge}
      </span>
      <span className="ds-sr-only">Open full view</span>
    </button>
  );
}
