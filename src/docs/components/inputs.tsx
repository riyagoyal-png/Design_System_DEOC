import { useState } from 'react';
import { Field, SearchInput, Textarea, TextInput } from '../../components/ds/Field';
import { MultiSelect, Select, type Option } from '../../components/ds/Select';
import { BinaryToggle, Checkbox, RadioCards, Switch } from '../../components/ds/Choice';
import { AttachField, DateRangePicker, FileUpload, RichPicker } from '../../components/ds/Inputs2';
import { toast } from '../../components/ds/Toast';
import { Cell, Grid } from '../kit';
import type { ComponentDoc } from '../ComponentPage';
import { DEPARTMENTS, people } from '../../data/sample';

const statusOpts: Option[] = [{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active', dot: 'success' }, { value: 'away', label: 'Away', dot: 'warning' }, { value: 'inactive', label: 'Inactive', dot: 'error' }];
const deptOpts: Option[] = DEPARTMENTS.map(d => ({ value: d, label: d }));
const regionOpts: Option[] = ['All Regions', 'North America', 'South America', 'Europe', 'Middle East', 'Africa', 'Asia Pacific', 'Oceania'].map(r => ({ value: r, label: r }));

/* ── Text input ─────────────────────────────────────────────────── */
function TextInputDemo() {
  const [v, setV] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const err = submitted && !/^\S+@\S+\.\S+$/.test(v) ? 'Enter a valid email address.' : undefined;
  return (
    <form className="doc-form" noValidate onSubmit={e => { e.preventDefault(); setSubmitted(true); if (/^\S+@\S+\.\S+$/.test(v)) toast('Invitation sent'); }}>
      <Field label="Email" required error={err} help="We'll send the invitation here."><TextInput type="email" value={v} onChange={e => setV(e.target.value)} placeholder="name@example.com" autoComplete="email" /></Field>
      <button type="submit" className="ds-btn ds-btn--primary">Send Invite</button>
    </form>
  );
}

export const textInputDoc: ComponentDoc = {
  path: '/components/text-inputs', title: 'Text Inputs', refs: ['5.5', '5.8'], provenance: 'STANDARDIZED', previewSurface: 'card',
  summary: 'Single-line entry on a recessed surface: dark fill and an inset shadow, no default border (R-58). Errors add the 1px red ring and a linked validation message after the first submit. The edge stays below 3:1, documented as exception A-1; boundary mode (Contrast menu above) adds a 3:1 border.',
  preview: () => <TextInputDemo />,
  variants: () => (
    <Grid min={240}>
      <Cell label="plain"><TextInput placeholder="E.g. Website relaunch" aria-label="Project name" /></Cell>
      <Cell label="with suffix unit"><TextInput suffix="ms" inputMode="numeric" placeholder="E.g. 500" aria-label="Pulse length" /></Cell>
      <Cell label="password (trailing toggle)"><TextInput type="password" defaultValue="hunter2!" aria-label="Password" /></Cell>
      <Cell label="with helper text"><Field label="Project code" help="Shown on invoices."><TextInput placeholder="PRJ-000" /></Field></Cell>
      <Cell label="with validation"><Field label="Budget" required error="Enter a budget of at least 1,000."><TextInput suffix="USD" defaultValue="250" /></Field></Cell>
    </Grid>
  ),
  unsupported: ['leading-icon text inputs other than search', 'floating labels', 'underline-only fields'],
  states: () => (
    <Grid min={220}>
      <Cell label="default (placeholder)"><TextInput placeholder="Placeholder" aria-label="Default" /></Cell>
      <Cell label="filled"><TextInput defaultValue="Typed value" aria-label="Filled" /></Cell>
      <Cell label="hover" note="No change by spec"><TextInput className="is-hover" defaultValue="Hover" aria-label="Hover" /></Cell>
      <Cell label="focus-visible" note="focus-ring-tight"><TextInput className="is-focus-visible" defaultValue="Focused" aria-label="Focus" /></Cell>
      <Cell label="error"><TextInput aria-invalid="true" defaultValue="not-an-email" aria-label="Error" /></Cell>
      <Cell label="disabled"><TextInput disabled defaultValue="Disabled" aria-label="Disabled" /></Cell>
      <Cell label="read-only"><TextInput readOnly defaultValue="Read only" aria-label="Read only" /></Cell>
    </Grid>
  ),
  anatomy: {
    surface: 'card',
    render: () => <Field label="Email" required help="We'll send the invitation here."><TextInput placeholder="name@example.com" /></Field>,
    parts: [
      { part: 'container', label: 'Form field', spec: 'flex column, gap 6 (space-form-label)' },
      { part: 'label', label: 'Label + required marker', spec: 'form-label 12/16 500 text-muted; * in error-text' },
      { part: 'message', label: 'Helper / validation', spec: 'small 12/16 text-muted, or validation 12/16 error-text (role=alert)' },
    ],
  },
  spec: [
    { property: 'Min height', token: '--ds-size-control' },
    { property: 'Padding', token: '--ds-space-4', note: ' 0 16px' },
    { property: 'Background', token: '--ds-color-surface-sunken' },
    { property: 'Default border', value: 'none (depth only, R-58)' },
    { property: 'Boundary mode border (§9.3, opt-in)', token: '--ds-color-border-control-strong' },
    { property: 'Shadow', token: '--ds-shadow-sunken' },
    { property: 'Radius', token: '--ds-radius-control' },
    { property: 'Text / placeholder', token: '--ds-color-text-primary + --ds-color-text-placeholder' },
    { property: 'Error border', token: '--ds-color-error' },
    { property: 'Focus', token: '--ds-color-focus-ring + --ds-focus-offset-tight' },
    { property: 'Label → control gap', token: '--ds-space-form-label' },
  ],
  playground: {
    surface: 'card',
    controls: [
      { kind: 'text', key: 'label', label: 'Label' },
      { kind: 'text', key: 'placeholder', label: 'Placeholder' },
      { kind: 'select', key: 'type', label: 'Type', options: ['text', 'password', 'with suffix'] },
      { kind: 'bool', key: 'required', label: 'Required' },
      { kind: 'bool', key: 'help', label: 'Helper text' },
      { kind: 'bool', key: 'error', label: 'Error' },
      { kind: 'bool', key: 'disabled', label: 'Disabled' },
    ],
    initial: { label: 'Project name', placeholder: 'E.g. Website relaunch', type: 'text', required: true, help: false, error: false, disabled: false },
    render: p => (
      <div className="doc-narrow-lg">
        <Field label={String(p.label)} required={!!p.required} help={p.help ? 'Visible to your whole team.' : undefined} error={p.error ? 'Enter a project name.' : undefined}>
          <TextInput placeholder={String(p.placeholder)} type={p.type === 'password' ? 'password' : 'text'} suffix={p.type === 'with suffix' ? 'h' : undefined} disabled={!!p.disabled} />
        </Field>
      </div>
    ),
    code: p => `<Field label="${p.label}"${p.required ? ' required' : ''}${p.help ? ' help="Visible to your whole team."' : ''}${p.error ? ' error="Enter a project name."' : ''}>\n  <TextInput placeholder="${p.placeholder}"${p.type === 'password' ? ' type="password"' : ''}${p.type === 'with suffix' ? ' suffix="h"' : ''}${p.disabled ? ' disabled' : ''} />\n</Field>`,
  },
  usage: `<Field label="Email" required error={emailError}>\n  <TextInput type="email" value={email} onChange={e => setEmail(e.target.value)} />\n</Field>`,
  behavior: <ul className="doc-list"><li>No errors before the first submit; on submit every error shows and focus moves to the first invalid field; afterwards errors update live (§5.8, §5.55).</li><li>The message is linked with <code>aria-describedby</code> and the control gets <code>aria-invalid</code>.</li></ul>,
};

function SearchDemo({ width }: { width?: 'sm' | 'md' | 'lg' }) {
  const [q, setQ] = useState('');
  const hits = people.filter(p => `${p.name} ${p.email} ${p.role}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="doc-stack">
      <SearchInput value={q} onValueChange={setQ} label="Search people" placeholder="Search by name, email or role" width={width} />
      <p className="ds-text-small" role="status">{q ? `${hits.length} result${hits.length === 1 ? '' : 's'}` : `${people.length} people`}</p>
      {q && <ul className="doc-results">{hits.slice(0, 4).map(h => <li key={h.id} className="ds-text-body">{h.name} <span className="ds-muted">· {h.role}</span></li>)}</ul>}
    </div>
  );
}
export const searchDoc: ComponentDoc = {
  path: '/components/search-fields', title: 'Search Fields', refs: ['5.6'], provenance: 'OBSERVED',
  summary: 'The text input plus an 18px search icon. type="search"; clearable with the × button or Escape; results count announced via role="status".',
  preview: () => <SearchDemo width="md" />,
  variants: () => (
    <Grid min={300}>
      <Cell label="header · 288 (standard)"><SearchInput value="" onValueChange={() => {}} label="Search" placeholder="Search projects" width="sm" /></Cell>
      <Cell label="header · 320"><SearchInput value="" onValueChange={() => {}} label="Search" placeholder="Search by name or email" width="md" /></Cell>
      <Cell label="header · 366"><SearchInput value="" onValueChange={() => {}} label="Search" placeholder="Search by name, email, team or role" width="lg" /></Cell>
      <Cell label="in-menu search band" note="Appears in menus with more than 5 options"><div className="ds-menu__search ds-menu-band-demo"><SearchInput value="" onValueChange={() => {}} label="Search options" placeholder="Search…" /></div></Cell>
    </Grid>
  ),
  states: () => (
    <Grid min={260}>
      <Cell label="empty"><SearchInput value="" onValueChange={() => {}} label="Search" placeholder="Search" /></Cell>
      <Cell label="with text (clear button)"><SearchInput value="Jane" onValueChange={() => {}} label="Search" /></Cell>
      <Cell label="focus-visible"><SearchInput value="" onValueChange={() => {}} label="Search" placeholder="Search" className="is-focus-visible" /></Cell>
      <Cell label="disabled"><SearchInput value="" onValueChange={() => {}} label="Search" placeholder="Search" disabled /></Cell>
    </Grid>
  ),
  anatomy: {
    render: () => <SearchInput value="Jane" onValueChange={() => {}} label="Search" width="md" />,
    parts: [
      { part: 'container', label: 'Search field', spec: 'width min(320px, 100%) in headers' },
      { part: 'icon', label: 'Search icon', spec: '18px, 14px from the start edge, text-muted' },
      { part: 'field', label: 'Input', spec: '§5.5 input with 40px start padding' },
    ],
  },
  spec: [
    { property: 'Header widths (defaults)', token: '--ds-size-search-sm + --ds-size-search-md + --ds-size-search-lg' },
    { property: 'Icon box', token: '--ds-size-search-icon' },
    { property: 'Start padding', token: '--ds-space-10' },
    { property: 'Icon color', token: '--ds-color-text-muted' },
  ],
  playground: {
    controls: [{ kind: 'select', key: 'width', label: 'Width', options: ['sm', 'md', 'lg'] }, { kind: 'text', key: 'placeholder', label: 'Placeholder' }, { kind: 'bool', key: 'disabled', label: 'Disabled' }],
    initial: { width: 'sm', placeholder: 'Search by name, email or role', disabled: false },
    render: p => <PlaySearch width={p.width as 'sm'} placeholder={String(p.placeholder)} disabled={!!p.disabled} />,
    code: p => `<SearchInput value={q} onValueChange={setQ} label="Search people" placeholder="${p.placeholder}" width="${p.width}"${p.disabled ? ' disabled' : ''} />`,
  },
  usage: `const [q, setQ] = useState('');\n<SearchInput value={q} onValueChange={setQ} label="Search people" placeholder="Search by name, email or role" width="sm" />`,
};
function PlaySearch(p: { width: 'sm'; placeholder: string; disabled: boolean }) {
  const [q, setQ] = useState('');
  return <SearchInput value={q} onValueChange={setQ} label="Search" {...p} />;
}

export const textareaDoc: ComponentDoc = {
  path: '/components/textareas', title: 'Textareas', refs: ['5.7'], provenance: 'EXTENSION', previewSurface: 'card',
  summary: 'Same tokens as the text input with auto height, min-height 80px (3 rows) and vertical resize.',
  preview: () => <div className="doc-narrow-lg"><Field label="Description" help="Visible to the whole project team."><Textarea placeholder="What is this project about?" /></Field></div>,
  states: () => (
    <Grid min={240}>
      <Cell label="default"><Textarea placeholder="Placeholder" aria-label="Default" /></Cell>
      <Cell label="focus-visible"><Textarea className="is-focus-visible" aria-label="Focus" defaultValue="Focused" /></Cell>
      <Cell label="error"><Field label="Notes" error="Keep notes under 500 characters."><Textarea defaultValue="Too long…" /></Field></Cell>
      <Cell label="disabled"><Textarea disabled defaultValue="Disabled" aria-label="Disabled" /></Cell>
    </Grid>
  ),
  spec: [{ property: 'Min height', value: '80px', note: ' (3 rows)' }, { property: 'Padding', token: '--ds-space-2-5 + --ds-space-4' }, { property: 'Fill / shadow', token: '--ds-color-surface-sunken + --ds-shadow-sunken' }, { property: 'Default border', value: 'none (R-58)' }],
  usage: `<Field label="Description"><Textarea value={text} onChange={e => setText(e.target.value)} /></Field>`,
};

/* ── Labels / form field ───────────────────────────────────────── */
export const fieldDoc: ComponentDoc = {
  path: '/components/labels', title: 'Labels & Form Fields', refs: ['5.8'], provenance: 'STANDARDIZED', previewSurface: 'card',
  summary: 'Label above the control (6px), optional helper text, and a validation message that replaces the helper. Required fields use an aria-hidden asterisk plus required / aria-required.',
  preview: () => (
    <div className="ds-form-grid doc-form-max">
      <Field label="Full name" required><TextInput placeholder="Jane Cooper" /></Field>
      <Field label="Department"><Select options={deptOpts} value={null} onChange={() => {}} placeholder="Choose department" /></Field>
      <Field label="Work email" required error="Enter a valid email address." className="ds-span-2"><TextInput defaultValue="jane@" /></Field>
    </div>
  ),
  variants: () => (
    <Grid min={240}>
      <Cell label="required"><Field label="Name" required><TextInput /></Field></Cell>
      <Cell label="optional"><Field label="Nickname"><TextInput /></Field></Cell>
      <Cell label="with helper"><Field label="Code" help="Letters and numbers only."><TextInput /></Field></Cell>
      <Cell label="with error"><Field label="Code" error="Use letters and numbers only."><TextInput defaultValue="A-1!" /></Field></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Label', token: '--ds-color-text-muted', note: ' 12/16 500' },
    { property: 'Required marker', token: '--ds-color-error-text' },
    { property: 'Label → control', token: '--ds-space-form-label' },
    { property: 'Message offset', token: '--ds-space-0-5' },
    { property: 'Form columns / rows / sections', token: '--ds-space-form-col + --ds-space-form-row + --ds-space-form-section' },
  ],
  usage: `<Field label="Full name" required error={errors.name}>\n  <TextInput value={name} onChange={e => setName(e.target.value)} />\n</Field>`,
};

/* ── Select ─────────────────────────────────────────────────────── */
function SelectDemo() {
  const [status, setStatus] = useState('all');
  const [region, setRegion] = useState('All Regions');
  const [dept, setDept] = useState<string | null>(null);
  return (
    <div className="doc-stack">
      <div className="ds-cluster">
        <Select variant="filter" label="Status" options={statusOpts} value={status} onChange={setStatus} className="ds-select--160" />
        <Select variant="filter" label="Region" options={regionOpts} value={region} onChange={setRegion} className="ds-select--200" />
      </div>
      <div className="doc-narrow-lg"><Field label="Department" required><Select options={deptOpts} value={dept} onChange={setDept} placeholder="Choose department" action={{ label: 'Add New Department', onAction: () => toast('Add department form opened') }} /></Field></div>
    </div>
  );
}
export const selectDoc: ComponentDoc = {
  path: '/components/dropdowns', title: 'Dropdowns & Selects', refs: ['5.9', '5.10'], provenance: 'STANDARDIZED',
  summary: 'Two trigger styles chosen by context: raised in toolbars, sunken in forms. The menu is a select-only combobox + listbox: focus stays on the trigger, options are tracked with aria-activedescendant, more than 5 options adds a search band.',
  preview: () => <SelectDemo />,
  variants: () => (
    <Grid min={240}>
      <Cell label="raised · filter"><Select variant="filter" label="Status" options={statusOpts} value="all" onChange={() => {}} /></Cell>
      <Cell label="sunken · form field"><Select label="Department" options={deptOpts} value="Design" onChange={() => {}} /></Cell>
      <Cell label="placeholder"><Select label="Department" options={deptOpts} value={null} onChange={() => {}} placeholder="Choose department" /></Cell>
      <Cell label="with status dots"><Select variant="filter" label="Status" options={statusOpts} value="active" onChange={() => {}} /></Cell>
      <Cell label="searchable (> 5 options)"><Select variant="filter" label="Region" options={regionOpts} value="Europe" onChange={() => {}} /></Cell>
      <Cell label="with action row"><Select label="Team" options={deptOpts} value={null} onChange={() => {}} action={{ label: 'Add New Team', onAction: () => {} }} /></Cell>
    </Grid>
  ),
  unsupported: ['chips inside the trigger', 'native <select> styling', 'nested sub-menus'],
  states: () => (
    <Grid min={240}>
      <Cell label="raised · default"><Select variant="filter" label="Status" options={statusOpts} value="all" onChange={() => {}} /></Cell>
      <Cell label="raised · hover"><Select variant="filter" label="Status" options={statusOpts} value="all" onChange={() => {}} triggerClassName="is-hover" /></Cell>
      <Cell label="focus-visible"><Select variant="filter" label="Status" options={statusOpts} value="all" onChange={() => {}} triggerClassName="is-focus-visible" /></Cell>
      <Cell label="sunken · error"><Select label="Department" options={deptOpts} value={null} onChange={() => {}} aria-invalid="true" /></Cell>
      <Cell label="disabled"><Select label="Department" options={deptOpts} value="Sales" onChange={() => {}} disabled /></Cell>
      <Cell label="open menu (static)" note="Option states: hover/active, selected (check glyph), disabled">
        <div className="ds-select doc-static-menu">
          <div className="ds-menu" role="presentation">
            <ul className="ds-menu__list" role="listbox" aria-label="Static example of option states">
              <li className="ds-menu__option is-active" role="option" aria-selected="false">Active descendant</li>
              <li className="ds-menu__option" role="option" aria-selected="true">Selected<span className="ds-menu__check">✓</span></li>
              <li className="ds-menu__option" role="option" aria-selected="false" aria-disabled="true">Disabled option</li>
            </ul>
            <p className="ds-menu__empty">No matches</p>
          </div>
        </div>
      </Cell>
    </Grid>
  ),
  anatomy: {
    render: () => <Select variant="filter" label="Status" options={statusOpts} value="active" onChange={() => {}} />,
    parts: [{ part: 'trigger', label: 'Trigger', spec: 'role=combobox · min-height 40 · padding 0 12 0 16 · radius 10 · shadow-trigger' }],
  },
  spec: [
    { property: 'Trigger min height', token: '--ds-size-control' },
    { property: 'Raised fill / hover / shadow', token: '--ds-color-surface-card + --ds-color-surface-card-hover + --ds-shadow-trigger' },
    { property: 'Sunken fill / shadow (no border)', token: '--ds-color-surface-sunken + --ds-shadow-sunken' },
    { property: 'Error ring', token: '--ds-error-ring' },
    { property: 'Chevron', token: '--ds-color-icon-chevron', note: ' 18px box' },
    { property: 'Menu fill / radius / shadow', token: '--ds-color-surface-card + --ds-radius-control + --ds-shadow-menu' },
    { property: 'Menu offset', token: '--ds-space-1' },
    { property: 'Menu max height', token: '--ds-size-menu-max-height' },
    { property: 'Option hover / selected', token: '--ds-color-surface-hover + --ds-color-surface-selected' },
    { property: 'Action row text', token: '--ds-color-brand-text' },
    { property: 'Z-index', token: '--ds-z-menu' },
  ],
  playground: {
    controls: [
      { kind: 'select', key: 'variant', label: 'Trigger style', options: ['filter', 'field'] },
      { kind: 'select', key: 'set', label: 'Options', options: ['status (dots)', 'departments', 'regions (searchable)'] },
      { kind: 'bool', key: 'action', label: 'Action row' },
      { kind: 'bool', key: 'error', label: 'Error (field only)' },
      { kind: 'bool', key: 'disabled', label: 'Disabled' },
    ],
    initial: { variant: 'filter', set: 'status (dots)', action: false, error: false, disabled: false },
    render: p => <PlaySelect {...p} />,
    code: p => `<Select variant="${p.variant}" label="…" options={options} value={value} onChange={setValue}${p.action ? ` action={{ label: 'Add New…', onAction }}` : ''}${p.error && p.variant === 'field' ? ' aria-invalid="true"' : ''}${p.disabled ? ' disabled' : ''} />`,
  },
  usage: `<Select variant="filter" label="Status" options={statusOptions} value={status} onChange={setStatus} />\n<Field label="Department"><Select options={departments} value={dept} onChange={setDept} placeholder="Choose department" /></Field>`,
  behavior: (
    <div className="ds-table-region doc-table" role="region" aria-label="Keyboard" tabIndex={0}>
      <table className="ds-table"><caption className="ds-sr-only">Keyboard behavior</caption>
        <thead><tr><th scope="col">Key</th><th scope="col">Action</th></tr></thead>
        <tbody>
          {[['Enter / Space / ↓ on the trigger', 'Open; active option = selected (or first)'], ['↑ on the closed trigger', 'Open at the selected (or last) option'], ['↓ / ↑', 'Move the active option (no wrap, disabled skipped)'], ['Home / End', 'First / last option (without a search band)'], ['Characters', 'Type-ahead (without a search band) or filter (with one)'], ['Enter', 'Select and close (single) / toggle (multi)'], ['Escape', 'Close without changing; focus returns to the trigger'], ['Tab', 'With an action row: move to it. Otherwise close without changing']].map(([k, a]) => <tr key={k}><th scope="row">{k}</th><td>{a}</td></tr>)}
        </tbody>
      </table>
    </div>
  ),
};
function PlaySelect(p: Record<string, string | boolean>) {
  const opts = p.set === 'departments' ? deptOpts : p.set === 'regions (searchable)' ? regionOpts : statusOpts;
  const [v, setV] = useState<string | null>(null);
  return (
    <div className="doc-narrow-lg">
      <Select variant={p.variant as 'filter'} label="Example" options={opts} value={v ?? (p.variant === 'filter' ? opts[0].value : null)} onChange={setV}
        action={p.action ? { label: 'Add New Item', onAction: () => toast('Add form opened') } : undefined}
        aria-invalid={p.error && p.variant === 'field' ? 'true' : undefined} disabled={!!p.disabled} />
    </div>
  );
}

/* ── Multi-select ───────────────────────────────────────────────── */
function MultiDemo({ initial = ['Design', 'Sales'] }: { initial?: string[] }) {
  const [v, setV] = useState<string[]>(initial);
  return (
    <div className="doc-narrow-lg doc-stack">
      <Field label="Departments" help="Choose every department this project involves."><MultiSelect options={deptOpts} value={v} onChange={setV} action={{ label: 'Add New Department', onAction: () => toast('Add form opened') }} /></Field>
      <div className="ds-cluster">{v.map(d => (
        <span key={d} className="doc-chip-remove">{d}<button type="button" className="ds-icon-btn ds-icon-btn--sm" aria-label={`Remove ${d}`} onClick={() => setV(v.filter(x => x !== d))}>×</button></span>
      ))}</div>
    </div>
  );
}
export const multiSelectDoc: ComponentDoc = {
  path: '/components/multi-selects', title: 'Multi-selects', refs: ['5.11'], provenance: 'OBSERVED', previewSurface: 'card',
  summary: 'Choose several options. Always a sunken form control. The trigger shows the joined labels when they fit, otherwise "N selected"; options toggle without closing the menu.',
  preview: () => <MultiDemo />,
  variants: () => (
    <Grid min={260}>
      <Cell label="empty (placeholder)"><MultiSelect label="Tags" options={deptOpts} value={[]} onChange={() => {}} /></Cell>
      <Cell label="labels fit"><MultiSelect label="Tags" options={deptOpts} value={['Design']} onChange={() => {}} /></Cell>
      <Cell label="too long → N selected"><div className="doc-narrow"><MultiSelect label="Tags" options={deptOpts} value={DEPARTMENTS} onChange={() => {}} /></div></Cell>
      <Cell label="error"><MultiSelect label="Tags" options={deptOpts} value={[]} onChange={() => {}} aria-invalid="true" /></Cell>
    </Grid>
  ),
  unsupported: ['chips inside the trigger (the spec keeps the value as text)'],
  notes: <p className="ds-text-body-muted">The removable chips under the preview are a demonstration of removing selections outside the trigger (§6.3 applied-filter chips). They are not part of the trigger.</p>,
  spec: [
    { property: 'Trigger (recessed, no border)', token: '--ds-color-surface-sunken + --ds-shadow-sunken' },
    { property: 'Option gap (checkbox → label)', token: '--ds-space-3' },
    { property: 'Checkbox unchecked border', token: '--ds-color-border-control-strong' },
    { property: 'Checkbox checked', token: '--ds-color-brand-strong + --ds-color-brand' },
  ],
  usage: `<MultiSelect options={departments} value={selected} onChange={setSelected} />`,
};

/* ── Date range ─────────────────────────────────────────────────── */
function DateDemo() {
  const [r, setR] = useState({ from: '2026-04-10', to: '2026-04-20' });
  const [preset, setPreset] = useState('custom');
  return (
    <div className="ds-cluster">
      <Select variant="filter" label="Date preset" className="ds-select--180" value={preset} onChange={setPreset}
        options={[{ value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: '7', label: 'Last 7 Days' }, { value: '30', label: 'Last 30 Days' }, { value: 'custom', label: 'Custom Range' }]} />
      {preset === 'custom' && <DateRangePicker from={r.from} to={r.to} onChange={(from, to) => setR({ from, to })} />}
    </div>
  );
}
export const dateDoc: ComponentDoc = {
  path: '/components/date-pickers', title: 'Date Pickers', refs: ['5.16'], provenance: 'STANDARDIZED',
  summary: 'A raised trigger (240px default min-width) opening a non-modal popover with native date inputs. Apply validates From ≤ To; Escape or an outside click discards the draft.',
  preview: () => <DateDemo />,
  variants: () => (
    <Grid min={260}>
      <Cell label="range"><DateRangePicker from="2026-04-10" to="2026-04-20" onChange={() => {}} /></Cell>
      <Cell label="open-ended (from)"><DateRangePicker from="2026-04-10" to="" onChange={() => {}} /></Cell>
      <Cell label="no value"><DateRangePicker from="" to="" onChange={() => {}} /></Cell>
    </Grid>
  ),
  unsupported: ['inline calendar grid (the spec uses native date inputs)', 'single-date picker component (use a §5.5 input type="date")'],
  states: () => <Grid min={380}><Cell label="invalid draft · Apply aria-disabled" note="Set From after To to see the message"><DateRangePicker from="2026-04-20" to="2026-04-10" onChange={() => {}} /></Cell></Grid>,
  spec: [
    { property: 'Trigger min width', token: '--ds-size-filter-date' },
    { property: 'Popover width (max)', token: '--ds-size-popover-date' },
    { property: 'Popover radius (R-51)', token: '--ds-radius-control' },
    { property: 'Popover shadow', token: '--ds-shadow-menu' },
    { property: 'Padding / gap', token: '--ds-space-4' },
  ],
  usage: `<DateRangePicker from={from} to={to} onChange={(f, t) => setRange({ from: f, to: t })} />`,
};

/* ── Checkbox ───────────────────────────────────────────────────── */
function CheckDemo() {
  const items = ['Email', 'SMS', 'Push'];
  const [on, setOn] = useState<string[]>(['Email']);
  const all = on.length === items.length, some = on.length > 0 && !all;
  return (
    <fieldset className="doc-fieldset">
      <legend className="ds-field__label">Notify me by</legend>
      <Checkbox checked={all} indeterminate={some} onChange={v => setOn(v ? items : [])}>All channels</Checkbox>
      <div className="doc-indent">{items.map(i => <Checkbox key={i} checked={on.includes(i)} onChange={v => setOn(v ? [...on, i] : on.filter(x => x !== i))}>{i}</Checkbox>)}</div>
    </fieldset>
  );
}
export const checkboxDoc: ComponentDoc = {
  path: '/components/checkboxes', title: 'Checkboxes', refs: ['5.12'], provenance: 'EXTENSION', previewSurface: 'card',
  summary: 'A native checkbox visually hidden behind a 16px box. The unchecked border (#6b7280) meets 3:1; checked uses brand-strong with a white check; indeterminate shows a bar.',
  preview: () => <CheckDemo />,
  states: () => (
    <Grid min={180}>
      <Cell label="unchecked"><Checkbox checked={false} onChange={() => {}}>Label</Checkbox></Cell>
      <Cell label="checked"><Checkbox checked onChange={() => {}}>Label</Checkbox></Cell>
      <Cell label="indeterminate"><Checkbox checked={false} indeterminate onChange={() => {}}>Label</Checkbox></Cell>
      <Cell label="focus-visible"><Checkbox checked={false} onChange={() => {}} className="is-focus-visible">Label</Checkbox></Cell>
      <Cell label="disabled"><Checkbox checked onChange={() => {}} disabled>Label</Checkbox></Cell>
      <Cell label="long label wraps"><div className="doc-narrow"><Checkbox checked={false} onChange={() => {}}>Send me a weekly summary of every project I follow</Checkbox></div></Cell>
    </Grid>
  ),
  anatomy: {
    surface: 'card',
    render: () => <Checkbox checked onChange={() => {}}>Remember this device</Checkbox>,
    parts: [{ part: 'container', label: 'Row', spec: 'inline-flex, gap 12, 14/20 text-secondary' }, { part: 'box', label: 'Box', spec: '16×16, radius 4, 1px border-control-strong' }, { part: 'label', label: 'Label', spec: 'wraps; clicking it toggles' }],
  },
  spec: [
    { property: 'Box', token: '--ds-size-checkbox' },
    { property: 'Radius', token: '--ds-radius-xs' },
    { property: 'Unchecked border', token: '--ds-color-border-control-strong' },
    { property: 'Checked fill / border', token: '--ds-color-brand-strong + --ds-color-brand' },
    { property: 'Gap', token: '--ds-space-3' },
  ],
  playground: {
    surface: 'card',
    controls: [{ kind: 'text', key: 'label', label: 'Label' }, { kind: 'bool', key: 'indeterminate', label: 'Indeterminate' }, { kind: 'bool', key: 'disabled', label: 'Disabled' }],
    initial: { label: 'Remember this device', indeterminate: false, disabled: false },
    render: p => <PlayCheck {...p} />,
    code: p => `<Checkbox checked={checked} onChange={setChecked}${p.indeterminate ? ' indeterminate' : ''}${p.disabled ? ' disabled' : ''}>${p.label}</Checkbox>`,
  },
  usage: `<Checkbox checked={agree} onChange={setAgree}>I agree to the terms</Checkbox>`,
};
function PlayCheck(p: Record<string, string | boolean>) {
  const [c, setC] = useState(false);
  return <Checkbox checked={c} onChange={setC} indeterminate={!!p.indeterminate} disabled={!!p.disabled}>{String(p.label)}</Checkbox>;
}

/* ── Radio cards ────────────────────────────────────────────────── */
function RadioDemo({ vertical }: { vertical?: boolean }) {
  const [v, setV] = useState<'low' | 'medium' | 'high'>('medium');
  return (
    <div className="ds-field doc-narrow-lg">
      <span className="ds-field__label" id={`prio${vertical ? 'v' : ''}`}>Priority</span>
      <RadioCards labelId={`prio${vertical ? 'v' : ''}`} value={v} onChange={setV} vertical={vertical} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} />
    </div>
  );
}
export const radioDoc: ComponentDoc = {
  path: '/components/radio-cards', title: 'Radio Buttons & Radio Cards', refs: ['5.13'], provenance: 'STANDARDIZED', previewSurface: 'card',
  summary: 'Choose one of 2–4 options shown side by side; vertical list for more or longer options. The radio glyph is the state cue; arrow keys move and select (one tab stop).',
  preview: () => <RadioDemo />,
  variants: () => <Grid min={300}><Cell label="horizontal (2–4)"><RadioDemo /></Cell><Cell label="vertical list [EXTENSION]"><RadioDemo vertical /></Cell></Grid>,
  unsupported: ['plain stand-alone radio buttons without a card (the spec defines radio cards only)'],
  states: () => (
    <Grid min={260}>
      <Cell label="unselected · hover · selected · focus">
        <RadioCards value="b" onChange={() => {}} label="States" forceClass={{ a: 'is-hover', c: 'is-focus-visible' }} options={[{ value: 'a', label: 'Hover' }, { value: 'b', label: 'Selected' }, { value: 'c', label: 'Focus' }]} />
      </Cell>
      <Cell label="disabled group"><RadioCards value="a" onChange={() => {}} label="Disabled" disabled options={[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }]} /></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Min height', token: '--ds-size-control' },
    { property: 'Radius', token: '--ds-radius-sm' },
    { property: 'Unselected border', token: '--ds-color-border-radio' },
    { property: 'Selected fill / border', token: '--ds-color-surface-radio-selected + --ds-color-brand-strong' },
    { property: 'Glyph on / off', token: '--ds-color-brand + --ds-color-text-muted' },
    { property: 'Gap between cards', token: '--ds-space-3' },
  ],
  usage: `<RadioCards label="Priority" value={p} onChange={setP} options={[{ value: 'low', label: 'Low' }, …]} />`,
};

/* ── Binary toggle ──────────────────────────────────────────────── */
function ToggleDemo() {
  const [v, setV] = useState<'active' | 'inactive'>('active');
  return <div className="doc-narrow-lg ds-field"><span className="ds-field__label" id="tg">Status</span><BinaryToggle labelId="tg" value={v} onChange={setV} options={[{ value: 'active', label: 'Active', dot: 'success' }, { value: 'inactive', label: 'Inactive', dot: 'error' }]} /></div>;
}
export const toggleDoc: ComponentDoc = {
  path: '/components/binary-toggle', title: 'Binary Status Toggle', refs: ['5.14'], provenance: 'STANDARDIZED', previewSurface: 'card',
  summary: 'The canonical two-option state choice in forms (Active / Inactive). A radiogroup; the selected option has an inset 1px brand ring (4.31:1) as its non-color cue.',
  preview: () => <ToggleDemo />,
  variants: () => <Grid min={260}><Cell label="status (with dots)"><ToggleDemo /></Cell><Cell label="generic two-choice"><BinaryToggle label="Billing" value="m" onChange={() => {}} options={[{ value: 'm', label: 'Monthly' }, { value: 'y', label: 'Yearly' }]} /></Cell></Grid>,
  states: () => (
    <Grid min={260}>
      <Cell label="selected · hover"><BinaryToggle label="s" value="a" onChange={() => {}} forceClass={{ b: 'is-hover' }} options={[{ value: 'a', label: 'Selected' }, { value: 'b', label: 'Hover' }]} /></Cell>
      <Cell label="focus-visible (inset)"><BinaryToggle label="f" value="a" onChange={() => {}} forceClass={{ a: 'is-focus-visible' }} options={[{ value: 'a', label: 'Focused' }, { value: 'b', label: 'Other' }]} /></Cell>
      <Cell label="disabled"><BinaryToggle label="d" value="a" onChange={() => {}} disabled options={[{ value: 'a', label: 'On' }, { value: 'b', label: 'Off' }]} /></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Min height', token: '--ds-size-control' },
    { property: 'Outline', token: '--ds-color-border-strong' },
    { property: 'Radius', token: '--ds-radius-control' },
    { property: 'Selected fill / ring', token: '--ds-color-surface-card + --ds-color-brand' },
    { property: 'Option padding', token: '--ds-space-2 + --ds-space-4' },
  ],
  usage: `<BinaryToggle label="Status" value={status} onChange={setStatus} options={[{ value: 'active', label: 'Active', dot: 'success' }, { value: 'inactive', label: 'Inactive', dot: 'error' }]} />`,
};

/* ── Switch ─────────────────────────────────────────────────────── */
function SwitchDemo() {
  const [on, setOn] = useState(true);
  return <Switch checked={on} onChange={v => { setOn(v); toast(`Email notifications ${v ? 'on' : 'off'}`); }} label="Email notifications" />;
}
export const switchDoc: ComponentDoc = {
  path: '/components/switches', title: 'Switches', refs: ['5.15'], provenance: 'EXTENSION',
  summary: 'Only for instant-apply settings outside forms with a Save button. role="switch" with a visible label; the thumb travels toward the end edge (mirrors in RTL).',
  preview: () => <SwitchDemo />,
  states: () => (
    <Grid min={220}>
      <Cell label="off"><Switch checked={false} onChange={() => {}} label="Label" /></Cell>
      <Cell label="on"><Switch checked onChange={() => {}} label="Label" /></Cell>
      <Cell label="focus-visible"><Switch checked onChange={() => {}} label="Label" className="is-focus-visible" /></Cell>
      <Cell label="disabled"><Switch checked onChange={() => {}} label="Label" disabled /></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Track', value: '36 × 20px', note: ' (spec literal)' },
    { property: 'Off track', token: '--ds-color-surface-sunken + --ds-shadow-sunken-track' },
    { property: 'On track', token: '--ds-color-brand-strong' },
    { property: 'Thumb off / on', token: '--ds-color-text-muted + --ds-color-text-primary' },
    { property: 'Thumb travel', token: '--ds-duration-fast + --ds-ease-standard' },
  ],
  usage: `<Switch checked={on} onChange={save} label="Email notifications" />`,
};

/* ── File upload, attach, rich picker ──────────────────────────── */
export const uploadDoc: ComponentDoc = {
  path: '/components/file-upload', title: 'File Upload', refs: ['5.17'], provenance: 'OBSERVED', previewSurface: 'card',
  summary: 'A dropzone with role="button": click, Enter or Space opens the file picker; drag-and-drop is optional. Type and size are validated locally. Nothing is uploaded anywhere.',
  preview: () => <div className="doc-narrow-lg"><FileUpload /></div>,
  variants: () => <Grid min={300}><Cell label="single file"><FileUpload /></Cell><Cell label="multiple files (product choice)"><FileUpload multiple title="Upload attachments" /></Cell></Grid>,
  states: () => (
    <Grid min={260}>
      <Cell label="hover / drag-over"><FileUpload forceClass="is-hover" /></Cell>
      <Cell label="focus-visible"><FileUpload forceClass="is-focus-visible" /></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Border', token: '--ds-color-border-input', note: ' 1px dashed' },
    { property: 'Hover / focus / drag-over', token: '--ds-color-brand' },
    { property: 'Error', token: '--ds-color-error' },
    { property: 'Padding / gap', token: '--ds-space-6 + --ds-space-2' },
    { property: 'Radius', token: '--ds-radius-control' },
  ],
  usage: `<FileUpload title="Upload reference image" accept={['image/jpeg', 'image/png']} maxMb={5} />`,
};

function AttachDemo() {
  const [v, setV] = useState('');
  return <div className="doc-narrow-xl"><Field label="Primary code" required><AttachField value={v} onValueChange={setV} /></Field></div>;
}
export const attachDoc: ComponentDoc = {
  path: '/components/field-with-attach', title: 'Field with Attach Button', refs: ['5.18'], provenance: 'OBSERVED', previewSurface: 'card',
  summary: 'A text field whose value can be typed or extracted from an uploaded photo. The extraction here is simulated locally (it fills a sample code after a short "Scanning…" state).',
  preview: () => <AttachDemo />,
  states: () => <Grid min={320}><Cell label="error"><Field label="Primary code" error="Text not detected. Upload the photo again."><AttachField value="" onValueChange={() => {}} /></Field></Cell></Grid>,
  spec: [{ property: 'Field (recessed, no border)', token: '--ds-color-surface-sunken + --ds-shadow-sunken' }, { property: 'Button fill / border', token: '--ds-color-surface-attach + --ds-color-border-strong' }, { property: 'Gap', token: '--ds-space-3' }],
  usage: `<Field label="Primary code"><AttachField value={code} onValueChange={setCode} /></Field>`,
};

function PickerDemo() {
  const [v, setV] = useState<string | null>(null);
  return <div className="doc-narrow-xl"><Field label="Manager"><RichPicker people={people} value={v} onChange={setV} /></Field></div>;
}
export const richPickerDoc: ComponentDoc = {
  path: '/components/rich-picker', title: 'Rich Picker', refs: ['5.19'], provenance: 'OBSERVED', previewSurface: 'card',
  summary: 'Choose a person or entity where identity needs more than a label. Each option\'s accessible name is "Name, role, email"; the list searches name, email, role and ID.',
  preview: () => <PickerDemo />,
  spec: [{ property: 'List max height', token: '--ds-size-picker-max-height' }, { property: 'Row divider', token: '--ds-color-border-input' }, { property: 'Footer row', token: '--ds-color-surface-elevated + --ds-color-link' }],
  notes: <p className="ds-text-body-muted">The inline add form described in §5.19 is product-specific; the action row here shows a toast instead.</p>,
  usage: `<RichPicker people={people} value={managerId} onChange={setManagerId} />`,
};
