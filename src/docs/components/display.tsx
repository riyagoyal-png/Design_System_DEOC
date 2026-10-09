import { useState } from 'react';
import { FolderOpen, Users } from 'lucide-react';
import { Avatar, Badge, Callout, Chip, CountPill, Dot, EmptyState, IconTile, InlineAlert, Metric, Progress, SegBar, Skeleton, Status, Stepper, Tag, TAG_ORDER } from '../../components/ds/Display';
import { Button, Spinner } from '../../components/ds/Button';
import { KpiCard } from '../../components/ds/Cards';
import { DataTable } from '../../components/ds/Table';
import { Cell, Grid } from '../kit';
import type { ComponentDoc } from '../ComponentPage';

export const badgeDoc: ComponentDoc = {
  path: '/components/badges', title: 'Badges', refs: ['5.27'], provenance: 'OBSERVED',
  summary: 'A labelled status for a single record. Text always names the state; the dot glows only at md. Badges are never interactive and never truncate.',
  preview: () => <div className="ds-cluster"><Badge tone="success">Active</Badge><Badge tone="warning">Pending</Badge><Badge tone="error">Failed</Badge><Badge tone="info">Scheduled</Badge><Badge tone="neutral">Draft</Badge></div>,
  variants: () => (
    <Grid min={160}>
      {(['success', 'warning', 'error', 'info', 'neutral'] as const).flatMap(t => [
        <Cell key={t} label={`${t} · md${t === 'info' || t === 'neutral' ? ' [EXT]' : ''}`}><Badge tone={t}>{t === 'success' ? 'Active' : t === 'warning' ? 'Pending' : t === 'error' ? 'Inactive' : t === 'info' ? 'Scheduled' : 'Draft'}</Badge></Cell>,
        <Cell key={t + 'sm'} label={`${t} · sm`}><Badge tone={t} size="sm">{t === 'success' ? 'Active' : t === 'warning' ? 'Pending' : t === 'error' ? 'Inactive' : t === 'info' ? 'Scheduled' : 'Draft'}</Badge></Cell>,
      ])}
    </Grid>
  ),
  unsupported: ['clickable / removable badges', 'count badges on icons'],
  anatomy: { render: () => <Badge tone="success">Active</Badge>, parts: [{ part: 'container', label: 'Pill', spec: 'padding 4 12 · 1px tone border · radius full · gap 6' }, { part: 'dot', label: 'Dot', spec: '6px, tone glow (md only)' }, { part: 'label', label: 'Label', spec: 'badge 14/20 600' }] },
  spec: [
    { property: 'Padding md', token: '--ds-space-1 + --ds-space-3' },
    { property: 'Padding sm', token: '--ds-space-0-5 + --ds-space-2' },
    { property: 'Dot', token: '--ds-size-badge-dot' },
    { property: 'Radius', token: '--ds-radius-full' },
    { property: 'Success bg / border / text', token: '--ds-color-success-bg + --ds-color-success-border + --ds-color-success-text' },
    { property: 'Success glow', token: '--ds-shadow-status-success' },
    { property: 'Error dot', token: '--ds-color-error' },
  ],
  playground: {
    controls: [{ kind: 'select', key: 'tone', label: 'Tone', options: ['success', 'warning', 'error', 'info', 'neutral'] }, { kind: 'select', key: 'size', label: 'Size', options: ['md', 'sm'] }, { kind: 'text', key: 'label', label: 'Label' }],
    initial: { tone: 'success', size: 'md', label: 'Active' },
    render: p => <Badge tone={p.tone as 'success'} size={p.size as 'md'}>{String(p.label)}</Badge>,
    code: p => `<Badge tone="${p.tone}"${p.size === 'sm' ? ' size="sm"' : ''}>${p.label}</Badge>`,
  },
  usage: `<Badge tone="success">Active</Badge>`,
};

export const tagDoc: ComponentDoc = {
  path: '/components/tags', title: 'Tags', refs: ['5.29'], provenance: 'STANDARDIZED',
  summary: 'Categorical labels (role, module, department) in five muted fills, all ≥ 4.5:1 with white text. Map each category to one fill once per product and keep it stable. Never use tags for status.',
  preview: () => <div className="ds-cluster">{['Engineering', 'Sales', 'Design', 'Operations', 'Finance'].map((d, i) => <Tag key={d} color={TAG_ORDER[i]}>{d}</Tag>)}</div>,
  variants: () => <Grid min={150}>{TAG_ORDER.map(c => <Cell key={c} label={c}><Tag color={c}>Category</Tag></Cell>)}<Cell label="raised (busy surfaces)"><Tag color="blue" raised>Category</Tag></Cell></Grid>,
  unsupported: ['outlined tags', 'status-colored tags'],
  spec: TAG_ORDER.map(c => ({ property: `Fill · ${c}`, token: `--ds-tag-${c}` })).concat([{ property: 'Padding', token: '--ds-space-1-5 + --ds-space-3' }, { property: 'Radius', token: '--ds-radius-xs' }]),
  usage: `<Tag color={tagColorFor(DEPARTMENTS, employee.department)}>{employee.department}</Tag>`,
};

export const statusDoc: ComponentDoc = {
  path: '/components/status-indicators', title: 'Status Indicators', refs: ['5.28'], provenance: 'STANDARDIZED',
  summary: 'Small glowing dots, always paired with a visible label (default) or, when density forbids a label, given role="img", an aria-label and a legend.',
  preview: () => <div className="ds-cluster"><Status tone="success">Online</Status><Status tone="warning">Idle</Status><Status tone="error">Offline</Status></div>,
  variants: () => (
    <Grid min={160}>
      {(['success', 'warning', 'error'] as const).flatMap(t => [
        <Cell key={t} label={`${t} · md 10px`}><Dot tone={t} label={t} /></Cell>,
        <Cell key={t + 's'} label={`${t} · sm 8px + label`}><Status tone={t}>{t === 'success' ? 'Active' : t === 'warning' ? 'Idle' : 'Inactive'}</Status></Cell>,
      ])}
    </Grid>
  ),
  spec: [
    { property: 'Size md / sm', token: '--ds-size-status-dot + --ds-size-status-dot-sm' },
    { property: 'Success core / glow', token: '--ds-color-success-text + --ds-shadow-status-success' },
    { property: 'Warning core / glow', token: '--ds-color-warning-text + --ds-shadow-status-warning' },
    { property: 'Error core / glow', token: '--ds-color-error + --ds-shadow-status-error' },
    { property: 'Dot → label gap', token: '--ds-space-2' },
  ],
  usage: `<Status tone="success">Online</Status>\n<Dot tone="error" label="Offline" /> {/* standalone: role="img" */}`,
};

export const countDoc: ComponentDoc = {
  path: '/components/count-pill', title: 'Count Pill', refs: ['5.30'], provenance: 'OBSERVED',
  summary: 'A number next to a group or section title (14px gap). Not interactive.',
  preview: () => <div className="ds-cluster"><span className="ds-text-group-title">Open items</span><CountPill>12</CountPill></div>,
  spec: [{ property: 'Fill / border', token: '--ds-color-surface-pill + --ds-color-border-subtle' }, { property: 'Text', token: '--ds-color-text-secondary', note: ' 14/18 700' }, { property: 'Padding', value: '3px 13px', note: ' (spec literal)' }],
  usage: `<CountPill>12</CountPill>`,
};

export const chipDoc: ComponentDoc = {
  path: '/components/info-chip', title: 'Info Chip', refs: ['5.31'], provenance: 'OBSERVED',
  summary: 'A compact identifier next to a name (an employee ID or code).',
  preview: () => <div className="ds-cluster"><span className="ds-text-body-strong">Jane Cooper</span><Chip>EMP-2041</Chip></div>,
  spec: [{ property: 'Fill / border', token: '--ds-color-brand-tint-10 + --ds-color-brand-tint-20' }, { property: 'Text', token: '--ds-color-brand-text', note: ' 10/15' }, { property: 'Radius', token: '--ds-radius-xs' }],
  usage: `<Chip>EMP-2041</Chip>`,
};

export const avatarDoc: ComponentDoc = {
  path: '/components/avatar', title: 'Avatar', refs: ['5.32'], provenance: 'OBSERVED',
  summary: 'Photo (32px with a gradient ring), brand initials (40px) or neutral initials (36px). Decorative when the name is shown beside it.',
  preview: () => <div className="ds-cluster"><Avatar name="Jane Cooper" variant="photo" /><Avatar name="Jane Cooper" /><Avatar name="Jane Cooper" variant="neutral" /></div>,
  variants: () => <Grid min={160}><Cell label="photo 32 (initials fallback)"><Avatar name="Arjun Mehta" variant="photo" /></Cell><Cell label="initials · brand 40"><Avatar name="Arjun Mehta" /></Cell><Cell label="initials · neutral 36"><Avatar name="Arjun Mehta" variant="neutral" /></Cell></Grid>,
  spec: [{ property: 'Sizes', token: '--ds-size-avatar-sm + --ds-size-avatar-md + --ds-size-avatar-lg' }, { property: 'Brand gradient', token: '--ds-gradient-brand-avatar' }, { property: 'Photo ring', token: '--ds-gradient-brand-ring' }, { property: 'Neutral fill / border', token: '--ds-color-surface-avatar + --ds-color-border-avatar' }],
  notes: <p className="ds-text-body-muted">No photos are bundled; the photo variant shows initials inside the ring. Supply an image with <code>src</code>.</p>,
  usage: `<Avatar name="Jane Cooper" variant="neutral" />`,
};

export const metricDoc: ComponentDoc = {
  path: '/components/metric-cards', title: 'Metric Indicators & Metric Cards', refs: ['5.33', '6.4'], provenance: 'OBSERVED',
  summary: 'Inline metrics (value + optional denominator) for cards and strips, and the §6.4 prominent-metric dashboard card [EXTENSION]. Not every number needs a KPI card.',
  preview: () => (
    <div className="doc-stack">
      <div className="ds-entity__metrics doc-metric-row">{[['Open items', 8, 12], ['Members', 30, 36], ['Alerts', 11, 12]].map(([l, v, o]) => <div key={l as string} className="ds-entity__metric"><Metric label={l as string} value={v as number} of={o as number} /></div>)}</div>
      <section className="ds-dash-card doc-narrow-xl" aria-label="Prominent metric">
        <span className="ds-text-kpi-label">Monthly recurring revenue</span>
        <span className="ds-text-page-title">£482,300</span>
        <span className="ds-text-small ds-c-success">▲ 4.2% vs last month</span>
      </section>
    </div>
  ),
  variants: () => (
    <Grid min={160}>
      <Cell label="with denominator"><Metric label="Members" value={30} of={36} /></Cell>
      <Cell label="no denominator"><Metric label="Projects" value={14} /></Cell>
      <Cell label="target met (success)"><Metric label="Done" value={12} of={12} tone="success" /></Cell>
      <Cell label="below target (warning)"><Metric label="Done" value={7} of={12} tone="warning" /></Cell>
      <Cell label="non-zero alerts"><Metric label="Alerts" value={3} tone="alert" /></Cell>
    </Grid>
  ),
  unsupported: ['sparkline metric cards', 'KPI deltas inside the KPI card (the spec puts deltas in tooltips or dashboard cards)'],
  spec: [{ property: 'Value', token: '--ds-color-text-primary', note: ' 16/24 700' }, { property: 'Denominator', token: '--ds-color-text-tertiary' }, { property: 'Label → value gap', token: '--ds-space-1' }, { property: 'Alert count', token: '--ds-color-alert-count' }],
  usage: `<Metric label="Members" value={30} of={36} />`,
};

export const progressDoc: ComponentDoc = {
  path: '/components/progress', title: 'Progress & Status Bars', refs: ['5.34'], provenance: 'OBSERVED',
  summary: 'A segmented status bar (counts inside segments, 2px card-colored gaps, 28px minimum per non-empty segment) and a single-value progress bar [EXTENSION].',
  preview: () => <ProgressDemo />,
  variants: () => (
    <Grid min={260}>
      <Cell label="segmented"><SegBar segments={[{ value: 18, color: 'var(--ds-chart-running)', label: 'running' }, { value: 3, color: 'var(--ds-chart-stopped)', label: 'stopped' }]} /></Cell>
      {(['brand', 'success', 'warning', 'error'] as const).map(t => <Cell key={t} label={`progress · ${t}`}><Progress value={t === 'error' ? 18 : t === 'warning' ? 46 : t === 'success' ? 92 : 64} tone={t} label={`Completion (${t})`} /></Cell>)}
    </Grid>
  ),
  spec: [{ property: 'Segment colors', token: '--ds-chart-running + --ds-chart-stopped' }, { property: 'Segment text', token: '--ds-color-text-on-bright' }, { property: 'Track', token: '--ds-chart-track' }, { property: 'Radius', token: '--ds-radius-chip' }, { property: 'Motion', token: '--ds-duration-chart' }],
  usage: `<SegBar segments={[{ value: 18, color: 'var(--ds-chart-running)', label: 'running' }, { value: 3, color: 'var(--ds-chart-stopped)', label: 'stopped' }]} />\n<Progress value={64} label="Completion" />`,
};
function ProgressDemo() {
  const [v, setV] = useState(64);
  return (
    <div className="doc-stack doc-narrow-xl">
      <Progress value={v} label="Project completion" />
      <div className="ds-cluster"><Button size="sm" variant="secondary" onClick={() => setV(x => Math.max(0, x - 10))}>−10%</Button><Button size="sm" variant="secondary" onClick={() => setV(x => Math.min(100, x + 10))}>+10%</Button></div>
      <SegBar segments={[{ value: Math.round(v / 4), color: 'var(--ds-chart-running)', label: 'running' }, { value: 25 - Math.round(v / 4), color: 'var(--ds-chart-stopped)', label: 'stopped' }]} />
    </div>
  );
}

export const calloutDoc: ComponentDoc = {
  path: '/components/callout', title: 'Inline Callout', refs: ['5.20'], provenance: 'OBSERVED', previewSurface: 'card',
  summary: 'An informational note placed directly under the fields it explains.',
  preview: () => <div className="doc-narrow-xl"><Callout title="How billing works">Hours are billed monthly against the estimate. Overruns need approval from the project lead.</Callout></div>,
  spec: [{ property: 'Fill / border', token: '--ds-color-surface-callout + --ds-color-border-callout' }, { property: 'Padding', token: '--ds-space-3-5' }, { property: 'Radius', token: '--ds-radius-sm' }],
  usage: `<Callout title="How billing works">Hours are billed monthly…</Callout>`,
};

export const alertDoc: ComponentDoc = {
  path: '/components/alerts', title: 'Alerts', refs: ['5.21'], provenance: 'EXTENSION', previewSurface: 'card',
  summary: 'Page- or form-level messages built from the callout with status tints. Errors use role="alert", others role="status". Toasts are documented with Overlays → Toasts.',
  preview: () => <AlertDemo />,
  variants: () => (
    <div className="doc-stack">
      <InlineAlert tone="info" title="Scheduled maintenance">Reports will be read-only on Sunday 02:00–04:00.</InlineAlert>
      <InlineAlert tone="success" title="Import complete">248 records were added.</InlineAlert>
      <InlineAlert tone="warning" title="Approaching limit">You have used 92% of your storage.</InlineAlert>
      <InlineAlert tone="error" title="Couldn't save">Check your connection and try again.</InlineAlert>
    </div>
  ),
  spec: [{ property: 'Info', token: '--ds-color-info-bg + --ds-color-info-border + --ds-color-info-text' }, { property: 'Error', token: '--ds-color-error-bg + --ds-color-error-border + --ds-color-error-text' }, { property: 'Padding', token: '--ds-space-3 + --ds-space-3-5' }],
  usage: `<InlineAlert tone="error" title="Couldn't save" onDismiss={dismiss}>Check your connection and try again.</InlineAlert>`,
};
function AlertDemo() {
  const [shown, setShown] = useState(true);
  return shown ? <div className="doc-narrow-xl"><InlineAlert tone="warning" title="Approaching limit" onDismiss={() => setShown(false)}>You have used 92% of your storage.</InlineAlert></div>
    : <Button variant="secondary" onClick={() => setShown(true)}>Show alert again</Button>;
}

export const stepperDoc: ComponentDoc = {
  path: '/components/stepper', title: 'Stepper', refs: ['5.22'], provenance: 'STANDARDIZED',
  summary: 'Progress through a multi-step form, in a slide-panel subheader. Upcoming steps stay at full opacity; hierarchy comes from color.',
  preview: () => <StepDemo />,
  variants: () => <Grid min={420}><Cell label="first step current"><Stepper current={0} steps={STEPS} /></Cell><Cell label="completed steps [EXTENSION]"><Stepper current={2} steps={STEPS} /></Cell></Grid>,
  spec: [{ property: 'Index size', token: '--ds-size-pagination-button' }, { property: 'Current fill / border / shadow', token: '--ds-color-brand-strong + --ds-color-stepper-active-border + --ds-shadow-stepper-active' }, { property: 'Other fill', token: '--ds-color-surface-sunken-button' }, { property: 'Connector', token: '--ds-color-stepper-track + --ds-gradient-stepper-active' }],
  usage: `<Stepper current={1} steps={[{ title: 'Basics', sub: 'In progress' }, …]} />`,
};
const STEPS = [{ title: 'Basics', sub: 'In progress' }, { title: 'Team', sub: 'Members & roles' }, { title: 'Review', sub: 'Summary' }];
function StepDemo() {
  const [c, setC] = useState(0);
  return (
    <div className="doc-stack">
      <Stepper current={c} steps={STEPS.map((s, i) => ({ ...s, sub: i === c ? 'In progress' : s.sub }))} />
      <div className="ds-cluster"><Button variant="secondary" size="sm" disabled={c === 0} onClick={() => setC(c - 1)}>Back</Button><Button size="sm" disabled={c === 2} onClick={() => setC(c + 1)}>Next</Button></div>
    </div>
  );
}

export const loadingDoc: ComponentDoc = {
  path: '/components/loading', title: 'Loading & Skeleton States', refs: ['5.50'], provenance: 'EXTENSION',
  summary: 'Keep the frame, replace the content: a spinner in buttons, a "Loading…" placeholder in fields, skeleton rows in tables, a skeleton value in KPI cards, a spinner in chart areas. Never blank the shell.',
  preview: () => <LoadingDemo />,
  variants: () => (
    <Grid min={260}>
      <Cell label="button"><Button loading>Saving</Button></Cell>
      <Cell label="spinner (chart area)"><span className="ds-muted"><Spinner label="Loading chart" /></span></Cell>
      <Cell label="KPI value skeleton"><KpiCard label="Total Users" value={<Skeleton w={72} h={20} />} icon={<IconTile icon={Users} />} /></Cell>
      <Cell label="skeleton bars"><div className="doc-stack-sm"><Skeleton w="80%" /><Skeleton w="60%" /><Skeleton w="70%" /></div></Cell>
    </Grid>
  ),
  spec: [{ property: 'Skeleton fill', token: '--ds-color-skeleton' }, { property: 'Skeleton radius', token: '--ds-radius-chip' }, { property: 'Row height', token: '--ds-size-table-row' }],
  usage: `<DataTable loading … />  // renders 5 skeleton rows with aria-busy\n<Button loading>Saving</Button>`,
};
function LoadingDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="doc-stack doc-full">
      <Button variant="secondary" size="sm" onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 1500); }}>Reload table</Button>
      <section className="ds-table-card"><DataTable caption="Projects" rowHeader="name" loading={loading} rowKey={r => r.name} rows={[{ name: 'Website relaunch', owner: 'Jane Cooper', tasks: 24 }, { name: 'Data warehouse', owner: 'Arjun Mehta', tasks: 31 }]}
        columns={[{ key: 'name', header: 'Name' }, { key: 'owner', header: 'Owner' }, { key: 'tasks', header: 'Tasks', align: 'num', shrink: true }]} /></section>
    </div>
  );
}

export const emptyDoc: ComponentDoc = {
  path: '/components/empty-states', title: 'Empty States', refs: ['5.51'], provenance: 'OBSERVED', derivedCss: true,
  summary: 'One sentence stating why there is nothing to show, in body-muted. First-use pages add an illustration (or icon tile), a title and a primary action.',
  preview: () => <section className="ds-table-card doc-full"><EmptyState variant="first-use" icon={<IconTile icon={FolderOpen} />} title="No projects yet" message="Create your first project to start tracking work." action={<Button>Add Project</Button>} /></section>,
  variants: () => (
    <Grid min={280}>
      <Cell label="table with no rows"><section className="ds-table-card doc-full"><DataTable caption="Users" rowHeader="name" rows={[]} rowKey={() => ''} columns={[{ key: 'name', header: 'Name' }, { key: 'role', header: 'Role' }]} empty="No users match your filters." /></section></Cell>
      <Cell label="chart with no data"><EmptyState variant="chart" message="No data in this range." /></Cell>
      <Cell label="menu search"><div className="ds-select doc-static-menu"><div className="ds-menu"><p className="ds-menu__empty">No matches</p></div></div></Cell>
    </Grid>
  ),
  spec: [{ property: 'Text', token: '--ds-color-text-muted' }, { property: 'Padding (table / chart)', token: '--ds-space-12 + --ds-space-16' }],
  usage: `<EmptyState variant="first-use" icon={<IconTile icon={FolderOpen} />} title="No projects yet" message="…" action={<Button>Add Project</Button>} />`,
};
