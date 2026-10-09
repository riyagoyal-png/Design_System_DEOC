import { useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, Briefcase, Pencil, Plus, SlidersHorizontal, Users, X } from 'lucide-react';
import { DocSection, Preview, Prov, SpecSource } from '../kit';
import { Button } from '../../components/ds/Button';
import { PageHeader, Pagination, Tabs, TabPanel } from '../../components/ds/Nav';
import { SearchInput, Field, TextInput, Textarea } from '../../components/ds/Field';
import { Select } from '../../components/ds/Select';
import { DateRangePicker } from '../../components/ds/Inputs2';
import { DashCard, KpiCard, SummaryStrip } from '../../components/ds/Cards';
import { IconTile, Metric, Status } from '../../components/ds/Display';
import { DataTable, TableCard } from '../../components/ds/Table';
import { ConfirmDialog, Modal, Popover, SlidePanel } from '../../components/ds/Overlay';
import { BarChart, Donut } from '../../charts/Charts';
import { Legend } from '../../charts/core';
import { toast } from '../../components/ds/Toast';
import { Icon } from '../../components/ds/Icon';
import { employeeColumns } from '../components/data';
import { employees, weekly } from '../../data/sample';
import { href } from '../../lib/router';

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return <div className="doc-frame" role="group" aria-label={label}><div className="ds-main doc-frame__main">{children}</div></div>;
}
function Page({ intro, refs, children }: { intro: string; refs: string[]; children: ReactNode }) {
  return (
    <div className="doc-page">
      <div className="doc-meta"><Prov tag="PRODUCT DECISION" /><span className="ds-text-small">Layer L3 (SHOULD) · Spec: {refs.map(r => `§${r}`).join(' · ')}</span></div>
      <p className="ds-text-body doc-lead">{intro}</p>
      {children}
      <div className="doc-stack">{refs.map(r => <SpecSource key={r} num={r} />)}</div>
    </div>
  );
}

export function ShellLayout() {
  return (
    <Page refs={['6.1', '6.0', '8.2']} intro="Default shell: a 76px sidebar rail and a main panel (bg-shell, radius 20, shadow-shell) inside a 16px-padded viewport with a 20px gap. Only the content scrolls; one h1 per page; overlays mount inside the main panel on desktop. Below 1024px the rail becomes a 56px top bar with a drawer.">
      <DocSection id="demo" title="Scaled shell">
        <div className="doc-shell-mini" aria-hidden="true">
          <div className="doc-shell-mini__rail">{[0, 1, 2, 3].map(i => <span key={i} className={i === 1 ? 'is-on' : ''} />)}</div>
          <div className="doc-shell-mini__main">
            <div className="doc-shell-mini__header"><span className="doc-shell-mini__title" /><span className="doc-shell-mini__btn" /></div>
            <div className="doc-shell-mini__content"><div className="doc-shell-mini__kpis">{[0, 1, 2, 3].map(i => <span key={i} />)}</div><span className="doc-shell-mini__card" /></div>
          </div>
        </div>
        <p className="ds-text-body">Every example application uses this shell. <a className="ds-link-action" href={href('/apps')}>Open the example applications</a></p>
      </DocSection>
    </Page>
  );
}

export function HeaderLayout() {
  const [q, setQ] = useState('');
  return (
    <Page refs={['6.2', '5.38']} intro="Title on the start side; page-scoped actions on the end side in the order search → filters → date → primary. Variants add a back button, a breadcrumb, a description line, or move many controls into a toolbar row.">
      <DocSection id="default" title="Default"><Frame label="Header default"><PageHeader title="Projects" actions={<><SearchInput value={q} onValueChange={setQ} label="Search projects" placeholder="Search projects" width="sm" /><Select variant="filter" label="Status" className="ds-select--160" value="all" onChange={() => {}} options={[{ value: 'all', label: 'All Status' }]} /><Button leading={Plus} minWidth>New Project</Button></>} /></Frame></DocSection>
      <DocSection id="toolbar" title="Variant: header + toolbar row (more than ~5 controls)">
        <Frame label="Header with toolbar"><PageHeader title="Reports" actions={<Button leading={Plus}>New Report</Button>} />
          <div className="doc-toolbar-row"><SearchInput value={q} onValueChange={setQ} label="Search reports" placeholder="Search reports" width="sm" />{['Owner', 'Team', 'Type', 'Status'].map(l => <Select key={l} variant="filter" label={l} className="ds-select--160" value="all" onChange={() => {}} options={[{ value: 'all', label: `All ${l}s` }]} />)}</div>
        </Frame>
      </DocSection>
    </Page>
  );
}

export function FilterLayout() {
  const [open, setOpen] = useState(false);
  const [chips, setChips] = useState(['Region: Europe', 'Owner: Jane Cooper']);
  const ref = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState('all');
  return (
    <Page refs={['6.3']} intro="Place a filter where its scope is. Global filters go in the page header; local filters in the card header; categorical filters with counts as raised tabs; many filters behind a Filters button with applied-filter chips. Changing a filter resets pagination; offer Clear filters once any is active.">
      <DocSection id="global" title="Global (page header)"><Frame label="Global filters"><PageHeader title="Dashboard" actions={<><Select variant="filter" label="Region" className="ds-select--180" value="all" onChange={() => {}} options={[{ value: 'all', label: 'All Regions' }]} /><DateRangePicker from="2026-04-01" to="2026-04-30" onChange={() => {}} /></>} /></Frame></DocSection>
      <DocSection id="local" title="Local (card header)"><DashCard title="Revenue" right={<Select variant="filter" label="Product" className="ds-select--220" value="all" onChange={() => {}} options={[{ value: 'all', label: 'All Products' }]} />}><div className="doc-placeholder">Chart</div></DashCard></DocSection>
      <DocSection id="categorical" title="Categorical with counts"><Tabs idBase="lf" label="Status" value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All', count: 248 }, { value: 'open', label: 'Open', count: 31 }, { value: 'closed', label: 'Closed', count: 217 }]} /></DocSection>
      <DocSection id="advanced" title="Many filters [EXTENSION]">
        <div className="doc-stack">
          <div className="ds-select">
            <Button ref={ref} variant="secondary" leading={SlidersHorizontal} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(o => !o)}>Filters</Button>
            <Popover open={open} onClose={() => setOpen(false)} label="Filters" anchorRef={ref} align="start" width="sm" footer={<><Button variant="ghost" size="sm" onClick={() => { setChips([]); setOpen(false); }}>Clear</Button><Button size="sm" onClick={() => { setChips(['Region: Europe', 'Owner: Jane Cooper', 'Status: Open']); setOpen(false); ref.current?.focus(); }}>Apply</Button></>}>
              <Field label="Status"><Select options={[{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }]} value={null} onChange={() => {}} placeholder="Any status" /></Field>
            </Popover>
          </div>
          <div className="ds-cluster" aria-label="Applied filters" role="group">
            {chips.map(c => <span key={c} className="doc-chip-remove">{c}<button type="button" className="ds-icon-btn ds-icon-btn--sm" aria-label={`Remove filter ${c}`} onClick={() => setChips(chips.filter(x => x !== c))}><Icon icon={X} size={14} /></button></span>)}
            {chips.length > 0 && <Button variant="ghost" size="sm" onClick={() => setChips([])}>Clear filters</Button>}
          </div>
        </div>
      </DocSection>
    </Page>
  );
}

export function KpiLayout() {
  return (
    <Page refs={['6.4', '8.4']} intro="Page-level headline numbers appear as a KPI row (3–5 cards). Numbers that belong to a chart, record or row use the variants instead: a metric in the card header, inline metric indicators, a summary strip, a table cell, or one prominent metric card.">
      <DocSection id="row" title="KPI row (responsive: 5 → 3 → 2 columns)">
        <div className="ds-kpi-row app-kpis">{['Open Deals', 'Pipeline Value', 'Won This Period', 'Win Rate (%)', 'Avg. Deal Size'].map((l, i) => <KpiCard key={l} label={l} value={['148', '£2,483,000', '283', '84.10%', '£18,420'][i]} icon={<IconTile icon={Briefcase} />} />)}</div>
      </DocSection>
      <DocSection id="variants" title="Variants">
        <div className="doc-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))' }}>
          <DashCard title="Metric in a card header" right={<span className="doc-header-metric"><span className="ds-text-kpi-value">1,240</span><span className="ds-text-small">sessions today</span></span>}><div className="doc-placeholder">Chart</div></DashCard>
          <section className="ds-dash-card" aria-label="Inline metrics"><span className="ds-text-card-title">Inline indicators</span><div className="ds-entity__metrics">{[['Open', 8, 12], ['Members', 30, 36]].map(([l, v, o]) => <div key={l as string} className="ds-entity__metric"><Metric label={l as string} value={v as number} of={o as number} /></div>)}</div></section>
          <section className="ds-dash-card" aria-label="Prominent metric"><span className="ds-text-kpi-label">Monthly revenue</span><span className="ds-text-page-title">£482,300</span><span className="ds-text-small ds-c-success">▲ 4.2% vs last month</span></section>
        </div>
      </DocSection>
    </Page>
  );
}

export function TableLayout() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('all');
  const rows = employees.filter(e => tab === 'all' || e.status === 'Active');
  return (
    <Page refs={['6.6', '6.7']} intro="List / management page: header (search, filters, primary) → optional tabs with counts → optional KPI row → table card with section header, table and pagination. Variants: grouped list (collapsible sections), card grid, load more.">
      <Frame label="List page">
        <PageHeader title="Employees" actions={<Button leading={Plus} minWidth>Add Employee</Button>} />
        <div className="ds-page-content doc-frame__content">
          <Tabs idBase="tl" controls label="Filter" value={tab} onChange={v => { setTab(v); setPage(1); }} tabs={[{ value: 'all', label: 'All', count: employees.length }, { value: 'active', label: 'Active', count: employees.filter(e => e.status === 'Active').length }]} />
          <TabPanel idBase="tl" value={tab}>
            <TableCard title="Directory" titleId="tl-t" count={rows.length}>
              <DataTable caption="Directory" labelledBy="tl-t" rowHeader="name" rowKey={e => e.id} rows={rows.slice((page - 1) * 5, page * 5)} columns={employeeColumns().slice(0, 5)} minWidth={720} />
              <Pagination page={page} pageSize={5} total={rows.length} noun="employees" onPage={setPage} />
            </TableCard>
          </TabPanel>
        </div>
      </Frame>
    </Page>
  );
}

export function DashboardLayout() {
  return (
    <Page refs={['6.9', '6.5']} intro="Global filters in the header → KPI row → the most decision-relevant chart full width → supporting charts in rows (gap 20) → detail tables → live status. One color mapping per series across the page; side-by-side cards share a 40px header height.">
      <div className="doc-stack">
        <div className="ds-kpi-row app-kpis">{['Sessions', 'Users', 'Conversion %'].map((l, i) => <KpiCard key={l} label={l} value={['48,210', '29,870', '3.42%'][i]} icon={<IconTile icon={Users} />} />)}</div>
        <DashCard title="Deals Won vs Lost" right={<Legend items={[{ label: 'Won', color: 'var(--ds-chart-positive)' }, { label: 'Lost', color: 'var(--ds-chart-negative)' }]} />}>
          <BarChart height={200} label="Deals" series={[{ key: 'w', label: 'Won', color: 'var(--ds-chart-positive)' }, { key: 'l', label: 'Lost', color: 'var(--ds-chart-negative)' }]} data={weekly.map((x, i) => ({ x, values: { w: 30 + i * 4, l: 5 + (i % 3) * 3 } }))} />
        </DashCard>
        <div className="ds-dash-row app-row">
          <DashCard title="By Stage" className="app-col-fixed"><Donut label="By stage" data={[['A', 40], ['B', 30], ['C', 20]].map(([l, v], i) => ({ label: l as string, value: v as number, color: `var(--ds-chart-cat-${i + 1})` }))} /></DashCard>
          <DashCard title="Notes" className="app-col-grow"><p className="ds-text-body-muted">Supporting cards share a row with a 20px gap and stack at ≤ md.</p></DashCard>
        </div>
      </div>
    </Page>
  );
}

export function FormsLayout() {
  const [panel, setPanel] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('Website relaunch');
  const [draft, setDraft] = useState(title);
  return (
    <Page refs={['6.10', '5.8']} intro="There is no single required form container. Choose by size: slide panel (default for record create/edit, 3–20 fields), full page (long forms, settings), centered modal (1–3 fields), inline edit (one field), wizard (ordered steps). Invariants: labels above fields, 20px column gap, 24px row gap, 40px between topics, footer secondary-start / primary-end.">
      <DocSection id="containers" title="Containers">
        <div className="ds-cluster">
          <Button leading={Plus} onClick={() => setPanel(true)}>Slide panel form</Button>
          <Button variant="secondary" onClick={() => setModal(true)}>Modal form</Button>
          <a className="ds-btn ds-btn--secondary" href={href('/apps/settings')}>Full-page form (Settings app)</a>
        </div>
      </DocSection>
      <DocSection id="inline" title="Inline edit [EXTENSION]" description="Enter saves, Escape cancels.">
        <Preview surface="card">
          {editing
            ? <TextInput autoFocus aria-label="Project title" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setTitle(draft); setEditing(false); toast('Title updated'); } if (e.key === 'Escape') { setDraft(title); setEditing(false); } }} />
            : <span className="ds-cluster"><span className="ds-text-card-title">{title}</span><Button variant="ghost" size="sm" leading={Pencil} onClick={() => { setDraft(title); setEditing(true); }}>Edit title</Button></span>}
        </Preview>
      </DocSection>
      <DocSection id="fullpage" title="Full-page sections">
        <section className="ds-dash-card doc-narrow-form"><div><h3 className="ds-text-card-title">Profile</h3><p className="ds-text-body-muted">Shown to your team.</p></div>
          <div className="ds-form-grid"><Field label="First name" required><TextInput /></Field><Field label="Last name" required><TextInput /></Field><Field label="About" className="ds-span-2"><Textarea /></Field></div>
          <div className="app-form-actions"><Button size="sm">Save</Button></div></section>
      </DocSection>
      <SlidePanel open={panel} onClose={() => setPanel(false)} title="Add Item" size="md" footer={<><Button variant="secondary" onClick={() => setPanel(false)}>Cancel</Button><Button onClick={() => { setPanel(false); toast('Item added'); }}>Save</Button></>}>
        <div className="ds-form-grid ds-form-grid--single"><Field label="Name" required className="ds-span-2"><TextInput /></Field><Field label="Notes" className="ds-span-2"><Textarea /></Field></div>
      </SlidePanel>
      <Modal open={modal} onClose={() => setModal(false)} title="Add a note" footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={() => { setModal(false); toast('Note added'); }}>Add Note</Button></>}>
        <Field label="Note"><Textarea /></Field>
      </Modal>
    </Page>
  );
}

export function DetailLayout() {
  return (
    <Page refs={['6.8']} intro="Back button + record name in the header, record actions on the end side, then a KPI row or summary strip, then child records. Variants: raised tabs between sections; a two-column layout with a 320–360px properties card on wide screens [EXTENSION].">
      <Frame label="Detail page">
        <PageHeader title="Website relaunch" back={{ label: 'Projects', onBack: () => {} }} actions={<Button variant="secondary" leading={Pencil}>Edit Project</Button>} />
        <div className="ds-page-content doc-frame__content">
          <SummaryStrip eyebrow="Project" title="Website relaunch" fields={[{ label: 'Code', value: 'PRJ-100' }, { label: 'Client', value: 'Northwind Labs' }]} statuses={[{ label: 'Health', tone: 'success', value: 'On track' }]} />
          <div className="doc-detail-cols">
            <TableCard title="Tasks" titleId="dl-t" count={3}><DataTable caption="Tasks" labelledBy="dl-t" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 3)} columns={employeeColumns().slice(0, 3)} /></TableCard>
            <section className="ds-dash-card doc-props" aria-label="Properties"><span className="ds-text-card-title">Properties</span>
              <dl className="app-review">{[['Lead', 'Jane Cooper'], ['Start', '01 Feb 2026'], ['Budget', '£25,000']].map(([k, v]) => <div key={k}><dt className="ds-field__label">{k}</dt><dd className="ds-text-body">{v}</dd></div>)}</dl>
              <Status tone="success">On track</Status></section>
          </div>
        </div>
      </Frame>
    </Page>
  );
}

export function ModalWorkflowLayout() {
  const [step, setStep] = useState<'idle' | 'panel' | 'confirm'>('idle');
  const [name, setName] = useState('');
  return (
    <Page refs={['5.44', '5.45', '5.55']} intro="A complete create → edit → delete workflow showing the overlay contract: focus moves in, the rest is inert, Escape asks before discarding edits, destructive actions confirm with Cancel focused, success shows a toast (with Undo when reversible), and focus returns to the opener.">
      <Preview surface="card">
        <div className="ds-cluster">
          <Button leading={Plus} onClick={() => setStep('panel')}>Create Record</Button>
          <Button variant="danger" onClick={() => setStep('confirm')}>Delete Record</Button>
        </div>
      </Preview>
      <SlidePanel open={step === 'panel'} onClose={() => { setStep('idle'); setName(''); }} title="Create Record" size="sm" dirty={!!name} icon={<IconTile icon={Plus} size={32} />}
        footer={<><Button variant="secondary" leading={ArrowLeft} onClick={() => { setStep('idle'); setName(''); }}>Cancel</Button><Button onClick={() => { setStep('idle'); toast(`${name || 'Record'} created`, { action: { label: 'Undo', onAction: () => toast('Creation undone') } }); setName(''); }}>Create</Button></>}>
        <Field label="Name" required><TextInput value={name} onChange={e => setName(e.target.value)} placeholder="Type, then press Escape" /></Field>
      </SlidePanel>
      <ConfirmDialog open={step === 'confirm'} title="Delete this record?" message="It will be removed for everyone. This can't be undone." confirmLabel="Delete Record" onCancel={() => setStep('idle')} onConfirm={() => { setStep('idle'); toast('Record deleted'); }} />
    </Page>
  );
}
