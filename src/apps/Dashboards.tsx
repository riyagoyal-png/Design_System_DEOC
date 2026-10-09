import { useMemo, useState } from 'react';
import { BarChart3, Building2, Contact, Gauge, Globe, LineChart as LineIcon, MousePointerClick, Percent, Plug, Timer, TrendingUp, Trophy, Users, Wallet } from 'lucide-react';
import { AppShell } from './AppShell';
import { BarChart, BubbleMatrix, Donut, HBarChart, Heatmap, LineChart } from '../charts/Charts';
import { ChartData, fmtInt, fmtPct, Legend } from '../charts/core';
import { DashCard, KpiCard, StatusCard } from '../components/ds/Cards';
import { IconTile, Skeleton, Status, Tag, tagColorFor } from '../components/ds/Display';
import { Select } from '../components/ds/Select';
import { DateRangePicker } from '../components/ds/Inputs2';
import { SearchInput } from '../components/ds/Field';
import { Tabs } from '../components/ds/Nav';
import { DataTable, sortRows, type Column, type Sort } from '../components/ds/Table';
import { Pagination } from '../components/ds/Nav';
import { Button } from '../components/ds/Button';
import { Icon } from '../components/ds/Icon';
import { toast } from '../components/ds/Toast';
import { accounts, INDUSTRIES, months, STAGES, weekly, type Account } from '../data/sample';

const CAT = ['var(--ds-chart-cat-1)', 'var(--ds-chart-cat-2)', 'var(--ds-chart-cat-3)', 'var(--ds-chart-cat-4)'];
const user = { name: 'Jane Cooper', role: 'Administrator' };

function DatePreset({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [r, setR] = useState({ from: '2026-04-01', to: '2026-04-30' });
  return (
    <>
      <Select variant="filter" label="Date range" className="ds-select--180" value={value} onChange={onChange}
        options={[['today', 'Today'], ['7', 'Last 7 Days'], ['30', 'Last 30 Days'], ['custom', 'Custom Range']].map(([v, l]) => ({ value: v, label: l }))} />
      {value === 'custom' && <DateRangePicker from={r.from} to={r.to} onChange={(from, to) => setR({ from, to })} />}
    </>
  );
}

/* ── Analytics dashboard (§12.4) ─────────────────────────────────── */
export function AnalyticsApp() {
  const [view, setView] = useState('overview');
  const [property, setProperty] = useState('all');
  const [channel, setChannel] = useState('all');
  const [preset, setPreset] = useState('30');
  const [loading, setLoading] = useState(false);
  const factor = (property === 'all' ? 1 : 0.42) * (preset === 'today' ? 0.04 : preset === '7' ? 0.25 : 1);
  const refresh = (f: () => void) => { f(); setLoading(true); window.setTimeout(() => setLoading(false), 700); };
  const series = [
    { key: 'organic', label: 'Organic', color: CAT[0], values: [1200, 1350, 1280, 1500, 1620, 1580, 1710, 1820, 1760, 1900, 2050, 2120] },
    { key: 'paid', label: 'Paid', color: CAT[1], values: [800, 760, 900, 950, 870, 1020, 1100, 1060, 1180, 1250, 1210, 1330] },
    { key: 'referral', label: 'Referral', color: CAT[2], values: [300, 340, 320, 410, 450, 430, 480, 520, 500, 560, 590, 640] },
  ].filter(s => channel === 'all' || s.key === channel).map(s => ({ ...s, values: s.values.map(v => Math.round(v * factor * 10)) }));
  const total = series.reduce((t, s) => t + s.values.reduce((a, b) => a + b, 0), 0);
  const kv = (v: string) => (loading ? <Skeleton w={72} h={20} /> : v);
  const sections = [{ label: 'General', items: [
    { id: 'overview', label: 'Overview', icon: <Icon icon={Gauge} size={24} /> },
    { id: 'sources', label: 'Traffic Sources', icon: <Icon icon={Globe} size={24} /> },
  ] }, { label: 'Admin', items: [{ id: 'integrations', label: 'Integrations', icon: <Icon icon={Plug} size={24} /> }] }];

  return (
    <AppShell product="Lumen" tagline="Product analytics" logo={<Icon icon={LineIcon} size={20} />} sections={sections} current={view} onNavigate={setView} user={user}
      title={view === 'overview' ? 'Analytics' : view === 'sources' ? 'Traffic Sources' : 'Integrations'}
      actions={view !== 'integrations' && <>
        <Select variant="filter" label="Property" className="ds-select--180" value={property} onChange={v => refresh(() => setProperty(v))} options={[['all', 'All Properties'], ['web', 'Marketing site'], ['app', 'Web app']].map(([v, l]) => ({ value: v, label: l }))} />
        <Select variant="filter" label="Channel" className="ds-select--160" value={channel} onChange={v => refresh(() => setChannel(v))} options={[['all', 'All Channels'], ['organic', 'Organic'], ['paid', 'Paid'], ['referral', 'Referral']].map(([v, l]) => ({ value: v, label: l }))} />
        <DatePreset value={preset} onChange={v => refresh(() => setPreset(v))} />
      </>}>
      {view === 'overview' && <>
        <div className="ds-kpi-row app-kpis">
          <KpiCard label="Sessions" value={kv(fmtInt(total))} icon={<Illus icon={MousePointerClick} />} />
          <KpiCard label="Users" value={kv(fmtInt(Math.round(total * 0.62)))} icon={<Illus icon={Users} />} />
          <KpiCard label="Conversion %" value={kv('3.42%')} icon={<Illus icon={Percent} />} />
          <KpiCard label="Bounce %" value={kv('41.80%')} icon={<Illus icon={TrendingUp} />} />
          <KpiCard label="Avg. Session" value={kv('4 min 12 s')} icon={<Illus icon={Timer} />} />
        </div>
        <DashCard title="Traffic Over Time" subtitle="Sessions per month, by channel" right={<Legend items={series.map(s => ({ label: s.label, color: s.color }))} />}>
          <LineChart label="Sessions per month by channel" x={months} series={series} />
          <ChartData caption="Sessions per month" head={['Month', ...series.map(s => s.label)]} rows={months.map((m, i) => [m, ...series.map(s => s.values[i])])} />
        </DashCard>
        <div className="ds-dash-row app-row">
          <DashCard title="Traffic by Source" className="app-col-fixed"><Donut label="Traffic by source" data={series.map(s => ({ label: s.label, value: s.values.reduce((a, b) => a + b, 0), color: s.color }))} /></DashCard>
          <DashCard title="Top Pages" subtitle="Sessions" className="app-col-grow"><HBarChart label="Top pages by sessions" data={[['Pricing page', '/pricing', 18420], ['Home', '/', 15210], ['Launch post', '/blog/launch', 9320], ['Getting started', '/docs/start', 7410], ['Sign up', '/signup', 5120]].map(([label, sub, v]) => ({ label: label as string, sub: sub as string, value: Math.round((v as number) * factor) }))} /></DashCard>
        </div>
        <DashCard flush title="Channel × Landing Page Conversion" subtitle="Size = sessions · color = conversion (heat scale reversed: high = good)">
          <BubbleMatrix label="Channel by landing page conversion" reversed rateLabel="Conversion" volumeLabel="Sessions"
            rows={[{ label: 'Organic search', sub: 'google, bing' }, { label: 'Paid social', sub: '3 campaigns' }, { label: 'Email', sub: 'newsletter' }, { label: 'Referral', sub: 'partners' }]}
            cols={['Home', 'Pricing', 'Blog post', 'Docs', 'Sign up']}
            volume={[0, 1, 2, 3].map(i => [0, 1, 2, 3, 4].map(j => 200 + ((i * 37 + j * 53) % 9) * 410))} rate={[0, 1, 2, 3].map(i => [0, 1, 2, 3, 4].map(j => 0.8 + ((i * 3 + j * 7) % 10) * 0.55))} />
        </DashCard>
      </>}
      {view === 'sources' && <SourcesView factor={factor} />}
      {view === 'integrations' && <IntegrationsView />}
    </AppShell>
  );
}
function Illus({ icon }: { icon: typeof Users }) { return <IconTile icon={icon} />; }

function SourcesView({ factor }: { factor: number }) {
  const rows = ['Google', 'Newsletter', 'LinkedIn', 'Partner blog', 'Direct', 'Product Hunt'].map((s, i) => ({ s, sessions: Math.round((12000 - i * 1700) * factor), conv: 1.2 + ((i * 7) % 5) * 0.6, bounce: 30 + ((i * 11) % 25) }));
  const [sort, setSort] = useState<Sort>({ key: 'sessions', dir: 'descending' });
  const cols: Column<typeof rows[0]>[] = [
    { key: 's', header: 'Source', sortable: true, sortValue: r => r.s },
    { key: 'sessions', header: 'Sessions', align: 'num', shrink: true, sortable: true, sortValue: r => r.sessions, render: r => fmtInt(r.sessions) },
    { key: 'conv', header: 'Conversion', align: 'num', shrink: true, sortable: true, sortValue: r => r.conv, render: r => <span className={r.conv >= 2.5 ? 'ds-c-success' : r.conv < 1.5 ? 'ds-c-warning' : undefined}>{fmtPct(r.conv)}</span> },
    { key: 'bounce', header: 'Bounce', align: 'num', shrink: true, sortable: true, sortValue: r => r.bounce, render: r => fmtPct(r.bounce) },
  ];
  return (
    <section className="ds-table-card">
      <div className="ds-table-card__header"><div className="ds-table-card__title"><h2 className="ds-text-group-title" id="src-t">Sources</h2><span className="ds-count">{rows.length}</span></div></div>
      <DataTable caption="Traffic sources" labelledBy="src-t" rowHeader="s" columns={cols} rows={sortRows(rows, sort, cols)} rowKey={r => r.s} sort={sort} onSort={setSort} />
    </section>
  );
}

function IntegrationsView() {
  const items = [['CRM sync', 'Stopped', 192], ['Billing export', 'Stopped', 48], ['Mail relay', 'Running', 0], ['Search index', 'Running', 0], ['Webhooks', 'Running', 0], ['SSO', 'Running', 0], ['Warehouse loader', 'Running', 0]] as const;
  const fmtDown = (m: number) => (m ? `${Math.floor(m / 60) ? `${Math.floor(m / 60)} h ` : ''}${m % 60} min` : '—');
  const table = (rows: typeof items[number][]) => (
    <DataTable caption="Integrations" rowHeader="name" maxHeight={266} rowKey={r => r.name} rowTone={r => (r.s === 'Stopped' ? 'critical' : undefined)} onRowActivate={r => toast(`Open ${r.name}`)}
      rows={[...rows].map(([name, s, d]) => ({ name, s, d })).sort((a, b) => b.d - a.d)}
      columns={[{ key: 'name', header: 'Integration', render: r => <a href="#/apps/analytics" className="ds-row-link" onClick={e => { e.preventDefault(); toast(`Open ${r.name}`); }}>{r.name}</a> }, { key: 's', header: 'Status', render: r => <Status tone={r.s === 'Running' ? 'success' : 'error'}>{r.s}</Status> }, { key: 'd', header: 'Down for', shrink: true, align: 'num', render: r => fmtDown(r.d) }]} />
  );
  return (
    <div className="ds-dash-row app-row">
      <div className="app-col-grow"><StatusCard title="Data Pipelines" running={5} stopped={2}>{table([...items])}</StatusCard></div>
      <div className="app-col-grow"><StatusCard title="Destinations" running={7} stopped={0}>{table(items.filter(i => i[1] === 'Running'))}</StatusCard></div>
    </div>
  );
}

/* ── CRM dashboard (§12.1) ───────────────────────────────────────── */
export function CrmApp() {
  const [view, setView] = useState('dashboard');
  const [owner, setOwner] = useState('all');
  const [region, setRegion] = useState('all');
  const [preset, setPreset] = useState('7');
  const [chartView, setChartView] = useState<'time' | 'region'>('time');
  const sections = [{ label: 'General', items: [
    { id: 'dashboard', label: 'Dashboard', icon: <Icon icon={BarChart3} size={24} /> },
    { id: 'accounts', label: 'Accounts', icon: <Icon icon={Building2} size={24} /> },
  ] }, { label: 'Admin', items: [{ id: 'contacts', label: 'Contacts', icon: <Icon icon={Contact} size={24} /> }] }];
  const scale = owner === 'all' ? 1 : 0.35;
  const bars = (chartView === 'time' ? weekly : ['North', 'South', 'East', 'West']).map((x, i) => ({ x, values: { won: Math.round([42, 55, 38, 61, 47, 22, 18][i % 7] * scale), lost: Math.round([8, 12, 6, 14, 9, 3, 2][i % 7] * scale) } }));
  const owners = [...new Set(accounts.map(a => a.owner))];
  return (
    <AppShell product="Harbor" tagline="Sales CRM" logo={<Icon icon={Trophy} size={20} />} sections={sections} current={view} onNavigate={setView} user={user}
      title={view === 'dashboard' ? 'Dashboard' : view === 'accounts' ? 'Accounts' : 'Contacts'}
      actions={view === 'dashboard' ? <>
        <Select variant="filter" label="Owner" className="ds-select--200" value={owner} onChange={setOwner} options={[{ value: 'all', label: 'All Owners' }, ...owners.map(o => ({ value: o, label: o }))]} />
        <Select variant="filter" label="Region" className="ds-select--180" value={region} onChange={setRegion} options={[['all', 'All Regions'], ['emea', 'EMEA'], ['amer', 'Americas'], ['apac', 'APAC']].map(([v, l]) => ({ value: v, label: l }))} />
        <DatePreset value={preset} onChange={setPreset} />
      </> : undefined}>
      {view === 'dashboard' && <>
        <div className="ds-kpi-row app-kpis">
          <KpiCard label="Open Deals" value={fmtInt(Math.round(148 * scale))} icon={<IconTile icon={Wallet} />} />
          <KpiCard label="Pipeline Value" value={`£${fmtInt(Math.round(2483000 * scale))}`} icon={<IconTile icon={TrendingUp} />} />
          <KpiCard label="Won This Period" value={fmtInt(Math.round(283 * scale))} icon={<IconTile icon={Trophy} />} ball="success" />
          <KpiCard label="Win Rate (%)" value="84.10%" icon={<IconTile icon={Percent} />} />
          <KpiCard label="Avg. Deal Size" value="£18,420" icon={<IconTile icon={Wallet} />} />
        </div>
        <DashCard title="Deals Won vs Lost" subtitle={chartView === 'time' ? 'Per day' : 'Per region'} right={<>
          <Legend items={[{ label: 'Won', color: 'var(--ds-chart-positive)' }, { label: 'Lost', color: 'var(--ds-chart-negative)' }, { label: 'Win rate', color: 'var(--ds-chart-trend)', dashed: true }]} />
          <Tabs idBase="crmv" variant="accent" label="Chart view" value={chartView} onChange={setChartView} tabs={[{ value: 'time', label: 'Time Series' }, { value: 'region', label: 'By Region' }]} /></>}>
          <BarChart label="Deals won vs lost" series={[{ key: 'won', label: 'Won', color: 'var(--ds-chart-positive)' }, { key: 'lost', label: 'Lost', color: 'var(--ds-chart-negative)' }]} data={bars}
            trend={{ label: 'Win rate', values: bars.map(b => (b.values.won / Math.max(1, b.values.won + b.values.lost)) * 100), format: fmtPct }} />
        </DashCard>
        <div className="ds-dash-row app-row">
          <DashCard title="Pipeline by Stage" className="app-col-fixed"><Donut label="Pipeline by stage" data={STAGES.slice(0, 4).map((s, i) => ({ label: s, value: [1240, 860, 540, 320][i], color: CAT[i] }))} /></DashCard>
          <DashCard flush title="Win Rate by Rep & Segment" subtitle="Relative scale · high = good (stops reversed)" className="app-col-grow">
            <Heatmap label="Win rate by rep and segment" reversed rowLabel="Rep" rows={owners.slice(0, 5)} cols={['SMB', 'Mid-market', 'Enterprise', 'Public']}
              values={owners.slice(0, 5).map((_, i) => [0, 1, 2, 3].map(j => 18 + ((i * 13 + j * 17) % 40)))} />
          </DashCard>
        </div>
        <TopAccounts />
      </>}
      {view === 'accounts' && <TopAccounts full />}
      {view === 'contacts' && <section className="ds-table-card"><div className="ds-empty ds-empty--first-use"><IconTile icon={Contact} /><p className="ds-text-card-title">No contacts imported yet</p><p className="ds-text-body-muted">Import a CSV or connect your mailbox to add contacts.</p><Button onClick={() => toast('Import dialog opens here')}>Import Contacts</Button></div></section>}
    </AppShell>
  );
}

function TopAccounts({ full }: { full?: boolean }) {
  const [q, setQ] = useState('');
  const [ind, setInd] = useState('all');
  const [tab, setTab] = useState<'all' | 'risk'>('all');
  const [sort, setSort] = useState<Sort>({ key: 'value', dir: 'descending' });
  const [page, setPage] = useState(1);
  const cols: Column<Account>[] = [
    { key: 'name', header: 'Account', sortable: true, sortValue: a => a.name, render: a => <span className="doc-two-line"><a href="#/apps/crm" className="ds-row-link" onClick={e => { e.preventDefault(); toast(`Open ${a.name}`); }}>{a.name}</a><span className="ds-text-small">{a.id}</span></span> },
    { key: 'industry', header: 'Industry', shrink: true, render: a => <Tag color={tagColorFor(INDUSTRIES, a.industry)}>{a.industry}</Tag> },
    { key: 'owner', header: 'Owner', shrink: true, sortable: true, sortValue: a => a.owner },
    { key: 'stage', header: 'Stage', shrink: true, sortable: true, sortValue: a => STAGES.indexOf(a.stage), render: a => a.stage },
    { key: 'health', header: 'Health', shrink: true, render: a => <Status tone={a.health === 'Healthy' ? 'success' : a.health === 'At risk' ? 'warning' : 'error'}>{a.health}</Status> },
    { key: 'value', header: 'Value', align: 'num', shrink: true, sortable: true, sortValue: a => a.value, render: a => `£${fmtInt(a.value)}` },
    { key: 'lastContact', header: 'Last Contact', shrink: true },
  ];
  const rows = useMemo(() => sortRows(accounts.filter(a => (ind === 'all' || a.industry === ind) && (tab === 'all' || a.health !== 'Healthy') && `${a.name} ${a.owner} ${a.id}`.toLowerCase().includes(q.toLowerCase())), sort, cols), [q, ind, tab, sort]); // eslint-disable-line react-hooks/exhaustive-deps
  const size = full ? 8 : 6;
  const shown = rows.slice((page - 1) * size, page * size);
  return (
    <DashCard flush title={full ? 'All Accounts' : 'Top Accounts'} right={<>
      <SearchInput value={q} onValueChange={v => { setQ(v); setPage(1); }} label="Search accounts" placeholder="Search accounts" width="sm" />
      <Select variant="filter" label="Industry" className="ds-select--180" value={ind} onChange={v => { setInd(v); setPage(1); }} options={[{ value: 'all', label: 'All Industries' }, ...INDUSTRIES.map(i => ({ value: i, label: i }))]} />
      <Tabs idBase="acc" variant="accent" label="Account filter" value={tab} onChange={v => { setTab(v); setPage(1); }} tabs={[{ value: 'all', label: 'All' }, { value: 'risk', label: 'Needs attention' }]} />
    </>}>
      <DataTable caption="Accounts" rowHeader="name" columns={cols} rows={shown} rowKey={a => a.id} sort={sort} onSort={s => { setSort(s); setPage(1); }} minWidth={860}
        rowTone={a => (a.health === 'At risk' ? 'warning' : a.health === 'Churned' ? 'critical' : undefined)} />
      <Pagination page={page} pageSize={size} total={rows.length} noun="accounts" onPage={setPage} />
    </DashCard>
  );
}
