import { useState } from 'react';
import { BarChart3, Plus, Settings, Users } from 'lucide-react';
import { Breadcrumb, NavItem, PageHeader, Pagination, Sidebar, TabPanel, Tabs } from '../../components/ds/Nav';
import { Button } from '../../components/ds/Button';
import { Illustration } from '../../components/ds/Display';
import { SearchInput } from '../../components/ds/Field';
import { Select } from '../../components/ds/Select';
import { Icon } from '../../components/ds/Icon';
import { Cell, Grid } from '../kit';
import type { ComponentDoc } from '../ComponentPage';
import { employees } from '../../data/sample';

const navSections = [
  { label: 'General', items: [
    { id: 'dash', label: 'Dashboard', icon: <Illustration name="illus.analytics-board" size={24} /> },
    { id: 'items', label: 'Catalog', icon: <Illustration name="illus.catalog-item" size={24} /> },
    { id: 'line', label: 'Pipelines', icon: <Illustration name="illus.conveyor-line" size={24} /> },
  ] },
  { label: 'Admin', items: [
    { id: 'users', label: 'Users', icon: <Illustration name="illus.user-group-admin" size={24} /> },
    { id: 'log', label: 'Activity Log', icon: <Illustration name="illus.activity-document" size={24} /> },
    { id: 'settings', label: 'Integrations & Device Configuration', icon: <Illustration name="illus.gear" size={24} /> },
  ] },
];

function SidebarDemo({ expanded }: { expanded?: boolean }) {
  const [cur, setCur] = useState('dash');
  return (
    <div className="doc-sidebar-frame">
      <Sidebar product="Northstar" tagline="Operations console" logo={<Icon icon={BarChart3} size={20} />} sections={navSections} current={cur} onSelect={setCur} user={{ name: 'Jane Cooper', role: 'Administrator' }} expanded={expanded} />
      <div className="doc-sidebar-content ds-text-body-muted">Hover or tab into the rail: it expands to 256px over the content without reflowing it. Current page: <b className="ds-text-body-strong">{navSections.flatMap(s => s.items).find(i => i.id === cur)?.label}</b></div>
    </div>
  );
}
export const navDoc: ComponentDoc = {
  path: '/components/navigation-items', title: 'Navigation Items & Sidebar', refs: ['5.37'], provenance: 'STANDARDIZED',
  summary: 'A 76px icon rail that expands to 256px over the content on hover or keyboard focus. The current item is a raised pill with label weight 600 (non-color cue, R-56) and aria-current="page". Labels truncate with a tooltip.',
  preview: () => <SidebarDemo />,
  variants: () => (
    <Grid min={340}>
      <Cell label="persistently expanded (§6.1 variant)"><SidebarDemo expanded /></Cell>
      <Cell label="top navigation [EXTENSION]" note="Horizontal items, 40px, radius 12">
        <nav className="ds-topnav" aria-label="Top navigation example"><span className="ds-sidebar__logo" aria-hidden="true"><Icon icon={BarChart3} size={20} /></span>
          {['Dashboard', 'Reports', 'Users'].map((l, i) => <a key={l} href="#" onClick={e => e.preventDefault()} className="ds-nav__item ds-topnav__item" aria-current={i === 0 ? 'page' : undefined}><span className="ds-nav__text">{l}</span></a>)}
        </nav>
      </Cell>
    </Grid>
  ),
  states: () => (
    <div className="doc-nav-states">
      {[['default', ''], ['hover', 'is-hover'], ['focus-visible', 'is-focus-visible']].map(([l, c]) => (
        <Cell key={l} label={l}><div className="doc-nav-item-frame"><NavItem item={{ id: l, label: 'Reports', icon: <Icon icon={BarChart3} size={24} /> }} className={c} /></div></Cell>
      ))}
      <Cell label="current"><div className="doc-nav-item-frame"><NavItem item={{ id: 'c', label: 'Users', icon: <Icon icon={Users} size={24} /> }} current /></div></Cell>
      <Cell label="long label truncates + tooltip"><div className="doc-nav-item-frame"><NavItem item={{ id: 'l', label: 'Integrations & Device Configuration', icon: <Icon icon={Settings} size={24} /> }} /></div></Cell>
    </div>
  ),
  spec: [
    { property: 'Rail / expanded width', token: '--ds-size-sidebar-collapsed + --ds-size-sidebar-expanded' },
    { property: 'Shell fill / shadow', token: '--ds-color-bg-shell + --ds-shadow-shell' },
    { property: 'Item min height', token: '--ds-size-nav-item' },
    { property: 'Item radius', token: '--ds-radius-nested' },
    { property: 'Item icon', token: '--ds-size-nav-icon' },
    { property: 'Inactive / hover', token: '--ds-color-text-muted + --ds-color-surface-hover' },
    { property: 'Current pill', token: '--ds-color-surface-card + --ds-shadow-card', note: ' + weight 600' },
    { property: 'Expand transition', token: '--ds-duration-slow + --ds-ease-emphasized' },
    { property: 'Z-index', token: '--ds-z-sidebar' },
  ],
  usage: `<Sidebar product="Northstar" tagline="Operations console" logo={…} sections={sections} current={route} onSelect={go} user={{ name, role }} />`,
};

function HeaderDemo() {
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('all');
  return (
    <div className="doc-header-frame">
      <PageHeader title="Employees" actions={<>
        <SearchInput value={q} onValueChange={setQ} label="Search employees" placeholder="Search by name or email" width="sm" />
        <Select variant="filter" label="Department" className="ds-select--180" value={dept} onChange={setDept} options={[{ value: 'all', label: 'All Departments' }, { value: 'eng', label: 'Engineering' }, { value: 'sales', label: 'Sales' }]} />
        <Button leading={Plus} minWidth>Add Employee</Button>
      </>} />
    </div>
  );
}
export const pageHeaderDoc: ComponentDoc = {
  path: '/components/page-headers', title: 'Page Header', refs: ['5.38'], provenance: 'OBSERVED',
  summary: 'Title on the start side, page-scoped actions on the end side in the order search → filters → date → primary. Min-height 76; actions wrap below at md. Gains a shadow while the content is scrolled.',
  preview: () => <HeaderDemo />,
  variants: () => (
    <div className="doc-stack">
      <Cell label="with back button"><div className="doc-header-frame"><PageHeader title="Website relaunch" back={{ label: 'Projects', onBack: () => {} }} actions={<Button variant="secondary">Edit Project</Button>} /></div></Cell>
      <Cell label="with breadcrumb [EXTENSION]"><div className="doc-header-frame"><PageHeader title="Billing migration" breadcrumb={[{ label: 'Clients', href: '#/components/page-headers' }, { label: 'Quartz Retail', href: '#/components/page-headers' }]} /></div></Cell>
      <Cell label="with description"><div className="doc-header-frame"><PageHeader title="Settings" description="Manage your workspace, notifications and security." /></div></Cell>
      <Cell label="scrolled state"><div className="doc-header-frame"><PageHeader title="Analytics" scrolled /></div></Cell>
    </div>
  ),
  spec: [{ property: 'Min height', token: '--ds-size-page-header' }, { property: 'Padding', token: '--ds-space-page-gutter' }, { property: 'Action gap', token: '--ds-space-header-actions' }, { property: 'Title', token: '--ds-color-text-primary', note: ' page-title 24/28 600' }, { property: 'Scrolled shadow', token: '--ds-shadow-header-scrolled' }],
  usage: `<PageHeader title="Employees" actions={<><SearchInput …/><Select variant="filter" …/><Button leading={Plus}>Add Employee</Button></>} />`,
};

export const breadcrumbDoc: ComponentDoc = {
  path: '/components/breadcrumbs', title: 'Breadcrumbs', refs: ['5.38'], provenance: 'EXTENSION', derivedCss: true,
  summary: 'For two or more levels of hierarchy, placed above the title in the page header. Links in text-muted, separators "/" in text-faint (decorative, aria-hidden); the current page is omitted because it is the h1.',
  preview: () => <Breadcrumb items={[{ label: 'Clients', href: '#/components/breadcrumbs' }, { label: 'Quartz Retail', href: '#/components/breadcrumbs' }, { label: 'Projects', href: '#/components/breadcrumbs' }]} />,
  states: () => (
    <Grid min={220}>
      <Cell label="link · hover"><nav className="ds-breadcrumb" aria-label="Example"><ol><li><a href="#/components/breadcrumbs" className="is-hover">Clients</a></li></ol></nav></Cell>
      <Cell label="link · focus-visible"><nav className="ds-breadcrumb" aria-label="Example 2"><ol><li><a href="#/components/breadcrumbs" className="is-focus-visible">Clients</a></li></ol></nav></Cell>
    </Grid>
  ),
  spec: [{ property: 'Text', token: '--ds-color-text-muted', note: ' small 12/16' }, { property: 'Hover', token: '--ds-color-text-primary' }, { property: 'Separator', token: '--ds-color-text-faint' }, { property: 'Separator spacing', token: '--ds-space-1-5' }],
  usage: `<PageHeader title="Billing migration" breadcrumb={[{ label: 'Clients', href: '/clients' }, { label: 'Quartz Retail', href: '/clients/42' }]} />`,
};

function TabsDemo({ variant }: { variant: 'raised' | 'accent' }) {
  const [v, setV] = useState('all');
  const counts = { all: employees.length, active: employees.filter(e => e.status === 'Active').length, inactive: employees.filter(e => e.status === 'Inactive').length };
  const id = `tabs-${variant}`;
  return (
    <div className="doc-stack">
      <Tabs idBase={id} controls variant={variant} label="Filter employees" value={v} onChange={setV} tabs={[{ value: 'all', label: 'All', count: counts.all }, { value: 'active', label: 'Active', count: counts.active }, { value: 'inactive', label: 'Inactive', count: counts.inactive }]} />
      <TabPanel idBase={id} value={v}><p className="ds-text-body">Showing {counts[v as 'all']} {v === 'all' ? '' : v} employees.</p></TabPanel>
    </div>
  );
}
export const tabsDoc: ComponentDoc = {
  path: '/components/tabs', title: 'Tabs & Segmented Controls', refs: ['5.39', '5.14'], provenance: 'STANDARDIZED',
  summary: 'Raised tabs filter a page\'s main list (with counts); accent tabs switch a chart or table view inside a card. Tablist pattern: one tab stop, arrows move and activate. The selected raised tab adds weight 600 (R-56) without shifting its neighbours.',
  preview: () => <TabsDemo variant="raised" />,
  variants: () => (
    <Grid min={340}>
      <Cell label="raised (page level)"><TabsDemo variant="raised" /></Cell>
      <Cell label="accent (in a card)"><TabsDemo variant="accent" /></Cell>
    </Grid>
  ),
  unsupported: ['underline tabs (explicitly excluded by §5.39)', 'vertical tabs'],
  states: () => (
    <Grid min={340}>
      <Cell label="raised: selected · hover · focus"><Tabs idBase="st1" label="States" value="a" onChange={() => {}} forceClass={{ b: 'is-hover', c: 'is-focus-visible' }} tabs={[{ value: 'a', label: 'Selected', count: 12 }, { value: 'b', label: 'Hover', count: 4 }, { value: 'c', label: 'Focus', count: 8 }]} /></Cell>
      <Cell label="accent: selected · hover · focus"><Tabs idBase="st2" variant="accent" label="States accent" value="a" onChange={() => {}} forceClass={{ b: 'is-hover', c: 'is-focus-visible' }} tabs={[{ value: 'a', label: 'Selected' }, { value: 'b', label: 'Hover' }, { value: 'c', label: 'Focus' }]} /></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Raised track fill / shadow', token: '--ds-color-surface-sunken-deep + --ds-shadow-sunken-track' },
    { property: 'Track radius', token: '--ds-radius-track' },
    { property: 'Tab radius', token: '--ds-radius-sm' },
    { property: 'Raised selected pill', token: '--ds-color-surface-card + --ds-shadow-card', note: ' + weight 600' },
    { property: 'Accent track / border', token: '--ds-color-surface-sunken-alt + --ds-color-border-track' },
    { property: 'Accent selected fill', token: '--ds-color-brand-strong' },
    { property: 'Inactive hover', token: '--ds-color-surface-hover-subtle' },
    { property: 'Count (inactive / active)', token: '--ds-color-text-tertiary + --ds-color-text-muted' },
  ],
  playground: {
    controls: [{ kind: 'select', key: 'variant', label: 'Variant', options: ['raised', 'accent'] }, { kind: 'bool', key: 'counts', label: 'Counts (raised)' }, { kind: 'select', key: 'n', label: 'Tabs', options: ['2', '3', '5'] }],
    initial: { variant: 'raised', counts: true, n: '3' },
    render: p => <PlayTabs {...p} />,
    code: p => `<Tabs idBase="filter" variant="${p.variant}" label="Filter" value={tab} onChange={setTab} tabs={[${['All', 'Open', 'Closed', 'Archived', 'Draft'].slice(0, +p.n).map((l, i) => `{ value: '${l.toLowerCase()}', label: '${l}'${p.counts && p.variant === 'raised' ? `, count: ${(i + 1) * 7}` : ''} }`).join(', ')}]} />`,
  },
  usage: `<Tabs idBase="emp" label="Filter employees" value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All', count: 248 }, …]} />\n<TabPanel idBase="emp" value={tab}>…</TabPanel>`,
};
function PlayTabs(p: Record<string, string | boolean>) {
  const tabs = ['All', 'Open', 'Closed', 'Archived', 'Draft'].slice(0, +p.n).map((l, i) => ({ value: l.toLowerCase(), label: l, count: p.counts ? (i + 1) * 7 : undefined }));
  const [v, setV] = useState('all');
  return <Tabs idBase="play" variant={p.variant as 'raised'} label="Playground tabs" value={tabs.some(t => t.value === v) ? v : 'all'} onChange={setV} tabs={tabs} />;
}

function PaginationDemo() {
  const [page, setPage] = useState(1);
  const size = 6;
  const rows = employees.slice((page - 1) * size, page * size);
  return (
    <section className="ds-table-card doc-full">
      <ul className="doc-page-list">{rows.map(e => <li key={e.id} className="ds-text-body">{e.name} <span className="ds-muted">· {e.department}</span></li>)}</ul>
      <Pagination page={page} pageSize={size} total={employees.length} noun="employees" onPage={setPage} />
    </section>
  );
}
export const paginationDoc: ComponentDoc = {
  path: '/components/pagination', title: 'Pagination', refs: ['5.40'], provenance: 'OBSERVED',
  summary: 'The bar at the bottom of a table card: summary on the start side, page buttons on the end side. More than 7 pages adds an ellipsis; at xs it collapses to "Page 2 of 5".',
  preview: () => <PaginationDemo />,
  variants: () => (
    <div className="doc-stack">
      <Cell label="few pages"><section className="ds-table-card"><Pagination page={2} pageSize={8} total={24} noun="users" onPage={() => {}} /></section></Cell>
      <Cell label="many pages (ellipsis) [EXTENSION]"><section className="ds-table-card"><Pagination page={7} pageSize={8} total={248} noun="employees" onPage={() => {}} /></section></Cell>
    </div>
  ),
  states: () => (
    <Grid min={140}>
      <Cell label="inactive"><button type="button" className="ds-page-btn">3</button></Cell>
      <Cell label="hover"><button type="button" className="ds-page-btn is-hover">3</button></Cell>
      <Cell label="focus-visible"><button type="button" className="ds-page-btn is-focus-visible">3</button></Cell>
      <Cell label="current"><button type="button" className="ds-page-btn" aria-current="page">3</button></Cell>
      <Cell label="disabled (ends)"><button type="button" className="ds-page-btn" disabled aria-label="Previous page">‹</button></Cell>
    </Grid>
  ),
  spec: [{ property: 'Button min size', token: '--ds-size-pagination-button' }, { property: 'Radius', token: '--ds-radius-chip' }, { property: 'Current fill / border', token: '--ds-color-brand-strong + --ds-color-border-on-brand' }, { property: 'Current shadow', token: '--ds-shadow-elevated' }, { property: 'Bar padding', token: '--ds-space-3 + --ds-space-4' }, { property: 'Gap', token: '--ds-space-1-5' }],
  usage: `<Pagination page={page} pageSize={8} total={rows.length} noun="employees" onPage={setPage} />`,
};
