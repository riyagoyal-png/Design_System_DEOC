import { useMemo, useState } from 'react';
import { Copy, Pencil, Plus, Trash2 } from 'lucide-react';
import { Collapsible, DataTable, sortRows, TableCard, type Column, type Sort } from '../../components/ds/Table';
import { Pagination } from '../../components/ds/Nav';
import { Button, IconButton } from '../../components/ds/Button';
import { ConfirmDialog } from '../../components/ds/Overlay';
import { Status, Tag, tagColorFor } from '../../components/ds/Display';
import { toast } from '../../components/ds/Toast';
import { Tooltip } from '../../components/ds/Tooltip';
import { Cell, Grid } from '../kit';
import type { ComponentDoc } from '../ComponentPage';
import { DEPARTMENTS, employees, type Employee } from '../../data/sample';

const tone = (s: Employee['status']) => (s === 'Active' ? 'success' : s === 'Away' ? 'warning' : 'error');

export function employeeColumns(opts: { onEdit?: (e: Employee) => void; onDelete?: (e: Employee) => void; open?: boolean } = {}): Column<Employee>[] {
  return [
    { key: 'name', header: 'Name', sortable: true, sortValue: e => e.name, minWidth: 200, render: e => (
      <span className="doc-two-line">
        {opts.open ? <Tooltip content={`Open ${e.name}`}><a className="ds-row-link" href="#/components/tables" onClick={ev => { ev.preventDefault(); toast(`Open ${e.name}`); }}>{e.name}</a></Tooltip> : e.name}
        <span className="ds-text-small">{e.email}</span>
      </span>
    ) },
    { key: 'department', header: 'Department', sortable: true, shrink: true, sortValue: e => e.department, render: e => <Tag color={tagColorFor(DEPARTMENTS, e.department)}>{e.department}</Tag> },
    { key: 'team', header: 'Team', shrink: true, sortable: true, sortValue: e => e.team },
    { key: 'status', header: 'Status', shrink: true, sortable: true, sortValue: e => e.status, render: e => <Status tone={tone(e.status)}>{e.status}</Status> },
    { key: 'openTasks', header: 'Open Tasks', align: 'num', shrink: true, sortable: true, sortValue: e => e.openTasks, render: e => <span className={e.openTasks > 20 ? 'ds-c-alert' : undefined}>{e.openTasks}</span> },
    { key: 'lastActive', header: 'Last Active', shrink: true, sortable: true, sortValue: e => e.lastActiveDays },
    ...(opts.onEdit ? [{ key: 'actions', header: 'Actions', hiddenHeader: true, shrink: true, align: 'end' as const, render: (e: Employee) => (
      <div className="ds-row-actions">
        <IconButton icon={Copy} label={`Copy ${e.name}'s email`} size="sm" onClick={() => { navigator.clipboard?.writeText(e.email).catch(() => {}); toast('Email copied'); }} />
        <IconButton icon={Pencil} label={`Edit ${e.name}`} size="sm" onClick={() => opts.onEdit?.(e)} />
        <IconButton icon={Trash2} label={`Delete ${e.name}`} size="sm" onClick={() => opts.onDelete?.(e)} />
      </div>
    ) }] : []),
  ];
}

function TableDemo() {
  const [rows, setRows] = useState(employees.slice(0, 24));
  const [sort, setSort] = useState<Sort>({ key: 'name', dir: 'ascending' });
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [del, setDel] = useState<Employee | null>(null);
  const size = 8;
  const sorted = useMemo(() => sortRows(rows, sort, employeeColumns()), [rows, sort]);
  const pageRows = sorted.slice((page - 1) * size, page * size);
  return (
    <TableCard title="Employees" titleId="tbl-demo-title" count={rows.length} actions={<Button variant="tonal" leading={Plus} onClick={() => toast('Add employee panel opens here')}>Add Employee</Button>}
      bulk={sel.size ? (
        <div className="ds-bulkbar">
          <span className="ds-text-body-strong" role="status">{sel.size} selected</span>
          <div className="ds-bulkbar__actions">
            <Button size="sm" variant="secondary" onClick={() => { setRows(r => r.filter(x => !sel.has(x.id))); toast(`${sel.size} employees removed`); setSel(new Set()); }}>Remove</Button>
            <Button size="sm" variant="ghost" onClick={() => setSel(new Set())}>Clear selection</Button>
          </div>
        </div>
      ) : undefined}>
      <DataTable caption="Employees" labelledBy="tbl-demo-title" rowHeader="name" columns={employeeColumns({ open: true, onEdit: e => toast(`Edit ${e.name}`), onDelete: setDel })}
        rows={pageRows} rowKey={e => e.id} sort={sort} onSort={s => { setSort(s); setPage(1); }} selectable selected={sel} onSelect={setSel} rowName={e => e.name} minWidth={860} />
      <Pagination page={page} pageSize={size} total={rows.length} noun="employees" onPage={setPage} />
      <ConfirmDialog open={!!del} title={`Delete ${del?.name}?`} message={`${del?.name} will lose access immediately. This can't be undone.`} confirmLabel="Delete Employee"
        onCancel={() => setDel(null)} onConfirm={() => { const n = del!.name; setRows(r => r.filter(x => x.id !== del!.id)); setDel(null); toast(`${n} deleted`); }}
        fallbackFocus={() => document.querySelector<HTMLElement>('#tbl-demo-title')?.closest('section')?.querySelector<HTMLElement>('.ds-row-link') ?? null} />
    </TableCard>
  );
}

export const tableDoc: ComponentDoc = {
  path: '/components/tables', title: 'Tables', refs: ['5.41'], provenance: 'STANDARDIZED',
  summary: 'The core component: semantic HTML (caption, th scope, row headers), no spacer columns, numbers right-aligned with tabular numerals, status as dot + label, a labelled keyboard-scrollable region, accessible sorting, selection and row actions.',
  preview: () => <div className="doc-full"><TableDemo /></div>,
  variants: () => (
    <div className="doc-stack">
      <Cell label="plain"><section className="ds-table-card"><DataTable caption="Plain table" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 3)} columns={employeeColumns().slice(0, 4)} /></section></Cell>
      <Cell label="capped with sticky header (266px ≈ header + 5 rows)"><section className="ds-table-card"><DataTable caption="Capped table" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 12)} columns={employeeColumns().slice(0, 5)} maxHeight={266} /></section></Cell>
      <Cell label="status tints (warning / critical rows)"><section className="ds-table-card"><DataTable caption="Tinted rows" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 4)} columns={employeeColumns().slice(0, 4)} rowTone={e => (e.status === 'Away' ? 'warning' : e.status === 'Inactive' ? 'critical' : undefined)} /></section></Cell>
      <Cell label="clickable rows (row link is the keyboard target)"><section className="ds-table-card"><DataTable caption="Clickable rows" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 3)} columns={employeeColumns({ open: true }).slice(0, 4)} onRowActivate={e => toast(`Open ${e.name}`)} /></section></Cell>
      <Cell label="loading"><section className="ds-table-card"><DataTable caption="Loading" rowHeader="name" rowKey={e => e.id} rows={[]} loading columns={employeeColumns().slice(0, 4)} /></section></Cell>
      <Cell label="empty"><section className="ds-table-card"><DataTable caption="Empty" rowHeader="name" rowKey={e => e.id} rows={[]} columns={employeeColumns().slice(0, 4)} /></section></Cell>
    </div>
  ),
  unsupported: ['spreadsheet-style cell navigation (ARIA grid) — a product decision for editable grids only', 'row borders', 'spacer columns'],
  states: () => (
    <section className="ds-table-card">
      <DataTable caption="Row states" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 4)} columns={employeeColumns().slice(0, 4)} selectable selected={new Set([employees[3].id])} onSelect={() => {}}
        forceRowClass={(_, i) => (i === 1 ? 'is-hover' : '')} />
      <p className="ds-text-small doc-pad">Row 1 default · row 2 hover (forced) · row 2/4 stripe · row 4 selected (checked checkbox is the non-color cue).</p>
    </section>
  ),
  spec: [
    { property: 'Cell padding', token: '--ds-space-cell-y + --ds-space-cell-x' },
    { property: 'Row min height', token: '--ds-size-table-row' },
    { property: 'Header fill / pinned fill', token: '--ds-color-surface-table-header + --ds-color-surface-table-header-pinned' },
    { property: 'Header text', token: '--ds-color-text-muted', note: ' 12/16 600 uppercase' },
    { property: 'Header tracking', token: '--ds-tracking-table-header' },
    { property: 'Stripe / hover', token: '--ds-color-surface-row-stripe + --ds-color-surface-row-hover' },
    { property: 'Clickable row hover', token: '--ds-color-surface-hover' },
    { property: 'Selected row', token: '--ds-color-brand-tint-10' },
    { property: 'Row tints', token: '--ds-color-warning-row-tint + --ds-color-critical-row-tint' },
    { property: 'Scrolled header shadow', token: '--ds-shadow-header-scrolled' },
  ],
  behavior: <ul className="doc-list"><li>Sorting: header buttons; <code>aria-sort</code> only on the sorted column; text sorts ascending first, numbers descending first; changes are announced ("Sorted by Name, ascending").</li><li>Selection: header checkbox is unchecked / indeterminate / checked; the bulk bar announces "N selected".</li><li>Delete asks for confirmation, then focus moves to the next row link (§5.55).</li><li>Click anywhere on a clickable row activates its link, except on interactive elements or while selecting text.</li></ul>,
  usage: `<DataTable caption="Employees" labelledBy="emp-title" rowHeader="name" columns={columns} rows={rows} rowKey={e => e.id}\n  sort={sort} onSort={setSort} selectable selected={selected} onSelect={setSelected} />`,
};

export const tableCardDoc: ComponentDoc = {
  path: '/components/table-card', title: 'Table Card', refs: ['5.42'], provenance: 'OBSERVED',
  summary: 'A table never sits directly on the page: it lives in a card with an optional section header (group-title + count pill + actions) and pagination.',
  preview: () => <div className="doc-full"><TableCard title="Open Tasks" titleId="tc-title" count={12} actions={<Button variant="tonal" size="sm" leading={Plus}>Add Task</Button>}><DataTable caption="Open tasks" labelledBy="tc-title" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 3)} columns={employeeColumns().slice(0, 3)} /></TableCard></div>,
  spec: [{ property: 'Radius', token: '--ds-radius-card' }, { property: 'Header padding', token: '--ds-space-4' }, { property: 'Header divider', token: '--ds-color-border-faint' }, { property: 'Title → count', token: '--ds-space-3-5' }],
  usage: `<TableCard title="Open Tasks" titleId="tasks-title" count={12} actions={…}>\n  <DataTable labelledBy="tasks-title" … />\n  <Pagination … />\n</TableCard>`,
};

function GroupDemo() {
  const [open, setOpen] = useState<Record<string, boolean>>({ Engineering: true });
  return (
    <div className="ds-section-stack doc-full">
      {DEPARTMENTS.slice(0, 3).map(d => {
        const rows = employees.filter(e => e.department === d).slice(0, 4);
        return (
          <Collapsible key={d} title={d} count={rows.length} open={!!open[d]} onToggle={() => setOpen(o => ({ ...o, [d]: !o[d] }))}
            action={<Button variant="tonal" leading={Plus} minWidth onClick={() => toast(`Add to ${d}`)}>Add Member</Button>}>
            <DataTable caption={`${d} members`} rowHeader="name" rowKey={e => e.id} rows={rows} columns={employeeColumns().slice(0, 4)} />
          </Collapsible>
        );
      })}
    </div>
  );
}
export const collapsibleDoc: ComponentDoc = {
  path: '/components/collapsible-section', title: 'Collapsible Section', refs: ['5.43'], provenance: 'STANDARDIZED',
  summary: 'Groups tables or lists by a parent. The header is a button with aria-expanded inside a heading; min-height 60px; titles wrap. While filtering, sections with matches are forced open.',
  preview: () => <GroupDemo />,
  variants: () => (
    <Grid min={360}>
      <Cell label="top level (32px chevron after the title)"><Collapsible title="North Region" count={12} open={false} onToggle={() => {}}><p /></Collapsible></Cell>
      <Cell label="nested (24px chevron before the title, radius 16)"><Collapsible nested title="Team A" count={4} open={false} onToggle={() => {}} headingLevel={3}><p /></Collapsible></Cell>
    </Grid>
  ),
  states: () => (
    <Grid min={360}>
      <Cell label="collapsed · hover"><Collapsible title="Hover" count={3} open={false} onToggle={() => {}} forceClass="is-hover"><p /></Collapsible></Cell>
      <Cell label="focus-visible"><Collapsible title="Focus" count={3} open={false} onToggle={() => {}} forceClass="is-focus-visible"><p /></Collapsible></Cell>
      <Cell label="expanded (divider under header)"><Collapsible title="Expanded" count={1} open onToggle={() => {}}><p className="ds-text-body doc-pad">Content</p></Collapsible></Cell>
    </Grid>
  ),
  spec: [{ property: 'Header min height', token: '--ds-size-section-header' }, { property: 'Radius (top / nested)', token: '--ds-radius-card + --ds-radius-nested' }, { property: 'Chevron', token: '--ds-color-icon-chevron' }, { property: 'Stack gap', token: '--ds-space-stack' }],
  usage: `<Collapsible title="Engineering" count={12} open={open} onToggle={toggle} action={<Button variant="tonal">Add Member</Button>}>\n  <DataTable … />\n</Collapsible>`,
};
