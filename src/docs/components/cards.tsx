import { useState } from 'react';
import { Boxes, Briefcase, Users } from 'lucide-react';
import { DashCard, EntityCard, KpiCard, MediaCard, StatusCard, SummaryStrip } from '../../components/ds/Cards';
import { Badge, IconTile, Illustration, Status } from '../../components/ds/Display';
import { MediaViewer } from '../../components/ds/Overlay';
import { DataTable } from '../../components/ds/Table';
import { Select } from '../../components/ds/Select';
import { Tabs } from '../../components/ds/Nav';
import { toast } from '../../components/ds/Toast';
import { BarChart } from '../../charts/Charts';
import { Legend } from '../../charts/core';
import { Cell, Grid } from '../kit';
import type { ComponentDoc } from '../ComponentPage';

const asset = (f: string) => `${import.meta.env.BASE_URL}assets/${f}`;

function KpiRow() {
  const [active, setActive] = useState<string | null>(null);
  const items = [
    { k: 'total', label: 'Total Items', value: '1,284', illus: 'illus.items-total' },
    { k: 'active', label: 'Active Items', value: '1,107', illus: 'illus.items-active' },
    { k: 'inactive', label: 'Inactive Items', value: '177', illus: 'illus.items-inactive' },
    { k: 'rate', label: 'Error Rate', value: '3.42%', illus: 'illus.defect-rate' },
  ];
  return (
    <div className="ds-kpi-row doc-full">
      {items.map(i => <KpiCard key={i.k} label={i.label} value={i.value} icon={<Illustration name={i.illus} />} pressed={active === i.k} onToggle={() => setActive(a => (a === i.k ? null : i.k))} />)}
    </div>
  );
}

export const kpiDoc: ComponentDoc = {
  path: '/components/kpi-cards', title: 'KPI Cards', refs: ['5.23'], provenance: 'STANDARDIZED',
  summary: 'One page-level headline number with its label, in a row of 3–5. Labels are complete (R-31) and both label and value wrap instead of truncating (R-53). Interactive KPI cards are buttons with aria-pressed.',
  preview: () => <KpiRow />,
  variants: () => (
    <Grid min={250}>
      <Cell label="static · 3D illustration"><KpiCard label="Total Users" value="1,284" icon={<Illustration name="illus.user-group-admin" />} /></Cell>
      <Cell label="static · icon-tile fallback" note="Used when an illustration is unavailable"><KpiCard label="Open Projects" value="36" icon={<IconTile icon={Briefcase} />} /></Cell>
      <Cell label="status ball · success"><KpiCard label="Active Sites" value="18" icon={<Illustration name="illus.facility-set" frames={4} frame={0} />} ball="success" /></Cell>
      <Cell label="status ball · error"><KpiCard label="Inactive Sites" value="3" icon={<Illustration name="illus.facility-set" frames={4} frame={0} />} ball="error" /></Cell>
      <Cell label="supporting info [EXTENSION]" note="Every card in the row must then show one"><KpiCard label="Win Rate" value="32.10%" icon={<IconTile icon={Users} />} delta={{ dir: 'up', text: '4.2% vs last week' }} /></Cell>
      <Cell label="interactive · pressed"><KpiCard label="Inactive Items" value="177" icon={<Illustration name="illus.items-inactive" />} pressed onToggle={() => {}} /></Cell>
    </Grid>
  ),
  states: () => (
    <Grid min={250}>
      <Cell label="interactive · hover"><KpiCard label="Total Items" value="1,284" icon={<Illustration name="illus.items-total" />} onToggle={() => {}} className="is-hover" /></Cell>
      <Cell label="interactive · focus-visible"><KpiCard label="Total Items" value="1,284" icon={<Illustration name="illus.items-total" />} onToggle={() => {}} className="is-focus-visible" /></Cell>
      <Cell label="long label and value wrap (R-53)"><div className="doc-narrow"><KpiCard label="Average Resolution Time" value="12 h 45 min" icon={<IconTile icon={Boxes} />} /></div></Cell>
    </Grid>
  ),
  anatomy: {
    render: () => <div className="doc-narrow-xl"><KpiCard label="Total Items" value="1,284" icon={<Illustration name="illus.items-total" />} delta={{ dir: 'up', text: '4.2% vs last week' }} /></div>,
    parts: [
      { part: 'container', label: 'Container', spec: 'min-height 76 · padding 16 (space-card) · radius 20 · shadow-card · gap 12' },
      { part: 'icon', label: 'Icon area', spec: '40×40 fixed, decorative; 3D illustration or icon tile' },
      { part: 'label', label: 'Label', spec: 'kpi-label 12/16 700 UPPERCASE +0.55 text-muted; wraps' },
      { part: 'value', label: 'Value', spec: 'kpi-value 20/28 700 -0.65 white, tabular numerals; 0px gap to the label' },
      { part: 'delta', label: 'Supporting information [EXT]', spec: 'small 12/16 success/error text; card grows to 92' },
    ],
  },
  spec: [
    { property: 'Background', token: '--ds-color-surface-card' },
    { property: 'Radius', token: '--ds-radius-card' },
    { property: 'Padding', token: '--ds-space-card' },
    { property: 'Icon → text gap', token: '--ds-space-icon-text-lg' },
    { property: 'Shadow', token: '--ds-shadow-card' },
    { property: 'Min height', token: '--ds-size-kpi-card' },
    { property: 'Icon', token: '--ds-size-kpi-icon' },
    { property: 'Label', token: '--ds-color-text-muted', note: ' 12/16 700, +0.55px, uppercase' },
    { property: 'Value', token: '--ds-color-text-primary', note: ' 20/28 700, -0.65px' },
    { property: 'Row gap', token: '--ds-space-grid' },
    { property: 'Pressed ring', token: '--ds-color-brand', note: ' inset 1px' },
  ],
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label' }, { kind: 'text', key: 'value', label: 'Value' },
      { kind: 'select', key: 'icon', label: 'Icon', options: ['3D illustration', 'icon tile (fallback)'] },
      { kind: 'select', key: 'ball', label: 'Status ball', options: ['none', 'success', 'error'] },
      { kind: 'bool', key: 'interactive', label: 'Interactive (button)' }, { kind: 'bool', key: 'delta', label: 'Supporting info' },
      { kind: 'select', key: 'width', label: 'Width', options: ['auto', 'narrow 200px'] },
    ],
    initial: { label: 'Total Items', value: '1,284', icon: '3D illustration', ball: 'none', interactive: false, delta: false, width: 'auto' },
    render: p => <PlayKpi {...p} />,
    code: p => `<KpiCard label="${p.label}" value="${p.value}" icon={${p.icon === '3D illustration' ? '<Illustration name="illus.items-total" />' : '<IconTile icon={Boxes} />'}}${p.ball !== 'none' ? ` ball="${p.ball}"` : ''}${p.delta ? ` delta={{ dir: 'up', text: '4.2% vs last week' }}` : ''}${p.interactive ? ' pressed={on} onToggle={toggle}' : ''} />`,
  },
  usage: `<div className="ds-kpi-row">\n  <KpiCard label="Total Items" value="1,284" icon={<Illustration name="illus.items-total" />} />\n</div>`,
};
function PlayKpi(p: Record<string, string | boolean>) {
  const [on, setOn] = useState(false);
  return (
    <div className={p.width === 'narrow 200px' ? 'doc-narrow' : 'doc-narrow-xl'}>
      <KpiCard label={String(p.label)} value={String(p.value)} icon={p.icon === '3D illustration' ? <Illustration name="illus.items-total" /> : <IconTile icon={Boxes} />}
        ball={p.ball === 'none' ? undefined : p.ball as 'success'} delta={p.delta ? { dir: 'up', text: '4.2% vs last week' } : undefined}
        pressed={on} onToggle={p.interactive ? () => setOn(o => !o) : undefined} />
    </div>
  );
}

const entityProps = {
  title: 'Website relaunch', subtitle: 'Northwind Labs · London', icon: <IconTile icon={Briefcase} />, status: { tone: 'success' as const, label: 'Active' },
  owner: 'Jane Cooper', role: 'Project lead', when: '12 May', whenCaption: 'Updated on',
  metrics: [{ label: 'Open items', value: 8, of: 12 }, { label: 'Members', value: 30, of: 36 }, { label: 'Alerts', value: 11, of: 12 }],
};
export const entityDoc: ComponentDoc = {
  path: '/components/standard-cards', title: 'Standard Cards (Entity Card)', refs: ['5.24'], provenance: 'OBSERVED',
  summary: 'A summary tile for one record in a browsable grid. The whole card is one link or button with a meaningful accessible name; no nested interactive elements.',
  preview: () => <div className="ds-entity-grid doc-full"><EntityCard {...entityProps} onOpen={() => toast('Opens the detail page')} /><EntityCard {...entityProps} title="Partner portal" subtitle="Atlas Mobility · Berlin" status={{ tone: 'error', label: 'Inactive' }} whenCaption="Inactive since" inactive onOpen={() => {}} /></div>,
  variants: () => <Grid min={340}><Cell label="active"><EntityCard {...entityProps} onOpen={() => {}} /></Cell><Cell label="inactive (opacity 0.75)"><EntityCard {...entityProps} status={{ tone: 'error', label: 'Inactive' }} whenCaption="Inactive since" inactive onOpen={() => {}} /></Cell></Grid>,
  states: () => <Grid min={340}><Cell label="hover (brightness 1.1)"><EntityCard {...entityProps} className="is-hover" onOpen={() => {}} /></Cell><Cell label="focus-visible"><EntityCard {...entityProps} className="is-focus-visible" onOpen={() => {}} /></Cell></Grid>,
  anatomy: {
    render: () => <div className="doc-narrow-xl"><EntityCard {...entityProps} onOpen={() => {}} /></div>,
    parts: [
      { part: 'container', label: 'Container', spec: 'padding 20 · radius 20 · shadow-card' },
      { part: 'header', label: 'Header', spec: '40px icon + 12 + title (card-title) / subtitle; badge md' },
      { part: 'person', label: 'Person row', spec: '36px neutral avatar + name 14/22 500 + role caption (link); timestamp right' },
      { part: 'metrics', label: 'Metric row', spec: '2–4 equal columns, 1px internal dividers' },
    ],
  },
  spec: [
    { property: 'Padding', token: '--ds-space-card-lg' }, { property: 'Radius', token: '--ds-radius-card' }, { property: 'Shadow', token: '--ds-shadow-card' },
    { property: 'Section divider', token: '--ds-color-border-card-internal' }, { property: 'Section gap', token: '--ds-space-card-gap' }, { property: 'Grid gap', token: '--ds-space-grid' },
  ],
  usage: `<div className="ds-entity-grid">\n  <EntityCard title="Website relaunch" … onOpen={() => navigate(id)} />\n</div>`,
};

function DashDemo() {
  const [view, setView] = useState<'time' | 'region'>('time');
  return (
    <DashCard title="Deals Won vs Lost" subtitle="Last 7 days · count of deals" right={<><Legend items={[{ label: 'Won', color: 'var(--ds-chart-positive)' }, { label: 'Lost', color: 'var(--ds-chart-negative)' }]} /><Tabs idBase="dashdemo" variant="accent" label="View" value={view} onChange={setView} tabs={[{ value: 'time', label: 'Time Series' }, { value: 'region', label: 'By Region' }]} /></>}>
      <BarChart label="Deals won vs lost per day" series={[{ key: 'won', label: 'Won', color: 'var(--ds-chart-positive)' }, { key: 'lost', label: 'Lost', color: 'var(--ds-chart-negative)' }]}
        data={(view === 'time' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['North', 'South', 'East', 'West']).map((x, i) => ({ x, values: { won: 30 + ((i * 17) % 40), lost: 6 + ((i * 7) % 12) } }))} height={220} />
    </DashCard>
  );
}
export const dashCardDoc: ComponentDoc = {
  path: '/components/dashboard-card', title: 'Dashboard Card', refs: ['5.25'], provenance: 'OBSERVED',
  summary: 'The container for a chart, matrix, heatmap or embedded table. Padded (24px) for charts, flush for tables and heatmaps. Header min-height 40px so side-by-side titles align.',
  preview: () => <div className="doc-full"><DashDemo /></div>,
  variants: () => (
    <Grid min={360}>
      <Cell label="padded (charts)"><DashCard title="Chart card" subtitle="Subtitle in chart-subtle"><div className="doc-placeholder">Chart area</div></DashCard></Cell>
      <Cell label="flush (tables / heatmaps)"><DashCard flush title="Top Accounts" right={<Select variant="filter" label="Product" value="all" onChange={() => {}} options={[{ value: 'all', label: 'All Products' }]} className="ds-select--220" />}>
        <DataTable caption="Top accounts" rowHeader="n" rowKey={r => r.n} rows={[{ n: 'Northwind Labs', v: 48200 }, { n: 'Kestrel Systems', v: 36100 }]} columns={[{ key: 'n', header: 'Account' }, { key: 'v', header: 'Value', align: 'num', shrink: true, render: r => `£${r.v.toLocaleString('en-GB')}` }]} />
      </DashCard></Cell>
    </Grid>
  ),
  spec: [{ property: 'Padding', token: '--ds-space-card-xl' }, { property: 'Header ↔ content gap', token: '--ds-space-chart-gap' }, { property: 'Flush divider', token: '--ds-color-border-divider' }, { property: 'Subtitle', token: '--ds-color-text-chart-subtle' }, { property: 'Side-by-side gap', token: '--ds-space-grid-lg' }],
  usage: `<DashCard title="Deals Won vs Lost" subtitle="Last 7 days" right={<Legend items={…} />}>\n  <BarChart … />\n</DashCard>`,
};

export const statusCardDoc: ComponentDoc = {
  path: '/components/status-card', title: 'Status Card', refs: ['5.26'], provenance: 'OBSERVED',
  summary: 'The live up/down state of a set of units: dot legend, segmented status bar, and a capped table (266px, pinned header) sorted worst-first.',
  preview: () => (
    <div className="doc-narrow-xxl">
      <StatusCard title="Integrations" running={9} stopped={3}>
        <DataTable caption="Integrations" rowHeader="name" maxHeight={266} rowKey={r => r.name} rowTone={r => (r.s === 'Stopped' ? 'critical' : undefined)}
          rows={[['CRM sync', 'Stopped', '3 h 12 min'], ['Billing export', 'Stopped', '48 min'], ['Mail relay', 'Stopped', '6 min'], ['Search index', 'Running', '—'], ['Webhooks', 'Running', '—'], ['SSO', 'Running', '—'], ['Analytics', 'Running', '—']].map(([name, s, d]) => ({ name, s, d }))}
          columns={[{ key: 'name', header: 'Integration' }, { key: 's', header: 'Status', render: r => <Status tone={r.s === 'Running' ? 'success' : 'error'}>{r.s}</Status> }, { key: 'd', header: 'Down for', shrink: true, align: 'num' }]} />
      </StatusCard>
    </div>
  ),
  spec: [{ property: 'Card gap', token: '--ds-space-4' }, { property: 'Running / stopped', token: '--ds-chart-running + --ds-chart-stopped' }, { property: 'Row tint (stopped)', token: '--ds-color-critical-row-tint' }],
  usage: `<StatusCard title="Integrations" running={9} stopped={3}>\n  <DataTable maxHeight={266} … />\n</StatusCard>`,
};

export const stripDoc: ComponentDoc = {
  path: '/components/summary-strip', title: 'Summary Strip', refs: ['5.35'], provenance: 'STANDARDIZED',
  summary: 'A single-row summary of the record in context. The title clamps to 2 lines and is focusable, so the full text is available in a tooltip (R-23).',
  preview: () => <div className="doc-full"><SummaryStrip eyebrow="Project" title="Website relaunch for Northwind Labs — phase two, international markets and accessibility review" fields={[{ label: 'Project code', value: 'PRJ-100' }, { label: 'Client', value: 'Northwind Labs' }, { label: 'Due', value: '12 May 2026' }]} statuses={[{ label: 'Build', tone: 'success', value: 'Passing' }, { label: 'Budget', tone: 'warning', value: 'At risk' }]} /></div>,
  anatomy: {
    render: () => <div className="doc-full"><SummaryStrip eyebrow="Project" title="Website relaunch" fields={[{ label: 'Code', value: 'PRJ-100' }, { label: 'Client', value: 'Northwind Labs' }]} statuses={[{ label: 'Build', tone: 'success', value: 'Passing' }]} /></div>,
    parts: [{ part: 'container', label: 'Container', spec: 'padding 12 16 · radius 20 · shadow-card · gap 20' }, { part: 'lead', label: 'Lead block', spec: 'eyebrow (brand dot + brand-text) + summary-title 18/24, 2-line clamp' }, { part: 'divider', label: 'Divider', spec: '1px border-vertical' }, { part: 'fields', label: 'Fields', spec: 'field-label 14/20 + field-value 16/24 +0.55' }],
  },
  spec: [{ property: 'Padding', token: '--ds-space-3 + --ds-space-4' }, { property: 'Title size (exception)', token: '--ds-font-size-subheading' }, { property: 'Divider', token: '--ds-color-border-vertical' }, { property: 'Eyebrow', token: '--ds-color-brand-text' }],
  usage: `<SummaryStrip eyebrow="Project" title={project.name} fields={[{ label: 'Code', value: project.code }]} />`,
};

function MediaDemo() {
  const [open, setOpen] = useState<string | null>(null);
  const items = [{ t: 'Loading dock', s: 'Source 1', f: '1a86e.png' }, { t: 'Packing line', s: 'Source 2', f: '2cc30.png' }, { t: 'Storage aisle', s: 'Source 3', f: '839eb.png' }];
  return (
    <>
      <div className="ds-media-grid doc-full">
        {items.map(i => <MediaCard key={i.t} title={i.t} sub={i.s} src={asset(i.f)} detail="Detected: ABC-123" badge={<Badge tone="success">Matched</Badge>} onOpen={() => setOpen(i.t)} />)}
      </div>
      <MediaViewer open={!!open} onClose={() => setOpen(null)} title={open ?? ''} sub="Source 2" id="SRC-002" badge={<Badge tone="success">Matched</Badge>} context={<>Detected: <b className="ds-text-body-strong">ABC-123</b></>} src={asset(items.find(i => i.t === open)?.f ?? '1a86e.png')} />
    </>
  );
}
export const mediaDoc: ComponentDoc = {
  path: '/components/media-card', title: 'Media Card & Viewer', refs: ['5.36'], provenance: 'OBSERVED',
  summary: 'A media preview (feed, image, document) as one button opening a full viewer modal. Media sits on surface-media at 50% opacity. Sample frames are copied from the source asset folder.',
  preview: () => <MediaDemo />,
  spec: [{ property: 'Card fill / border / shadow', token: '--ds-color-surface-overlay + --ds-color-border-media + --ds-shadow-float' }, { property: 'Hover border', token: '--ds-color-brand-border-hover' }, { property: 'Media well', token: '--ds-color-surface-media' }, { property: 'Viewer shadow', token: '--ds-shadow-modal' }, { property: 'Detection frame', token: '--ds-color-detect-positive' }],
  notes: <p className="ds-text-body-muted">The three frames (1a86e.png, 2cc30.png, 839eb.png) are not in the §2.11 illustration registry; they are sample media copied from the source project's public assets to demonstrate the media well.</p>,
  usage: `<MediaCard title="Loading dock" sub="Source 1" src={url} detail="Detected: ABC-123" badge={<Badge tone="success">Matched</Badge>} onOpen={open} />`,
};
