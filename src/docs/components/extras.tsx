import { useRef, useState, type ReactNode } from 'react';
import { ConfirmDialog, SlidePanel } from '../../components/ds/Overlay';
import { Tooltip } from '../../components/ds/Tooltip';
import { toast } from '../../components/ds/Toast';
import { ArrowLeft, Copy, FolderOpen, Info, Pencil, Plus, Trash2, Users } from 'lucide-react';
import type { ComponentDoc } from '../ComponentPage';
import { Cell, Grid } from '../kit';
import { Button, IconButton, LinkAction } from '../../components/ds/Button';
import { Avatar, Badge, Callout, Chip, CountPill, Dot, EmptyState, IconTile, InlineAlert, Metric, Progress, SegBar, Skeleton, Status, Stepper, Tag, TAG_ORDER, type TagColor } from '../../components/ds/Display';
import { DashCard, EntityCard, MediaCard, StatusCard, SummaryStrip } from '../../components/ds/Cards';
import { Field, Textarea, TextInput } from '../../components/ds/Field';
import { MultiSelect, Select } from '../../components/ds/Select';
import { BinaryToggle, RadioCards, Switch } from '../../components/ds/Choice';
import { AttachField, DateRangePicker, FileUpload, RichPicker } from '../../components/ds/Inputs2';
import { Breadcrumb, NavItem, PageHeader, Pagination, Tabs } from '../../components/ds/Nav';
import { Collapsible, DataTable, TableCard } from '../../components/ds/Table';
import { Icon } from '../../components/ds/Icon';
import { employeeColumns } from './data';
import { DEPARTMENTS, employees, people } from '../../data/sample';

type Extra = Partial<Pick<ComponentDoc, 'anatomy' | 'playground' | 'states' | 'variants' | 'staticComponent' | 'noVariants'>>;
const depts = DEPARTMENTS.map(d => ({ value: d, label: d }));
const asset = (f: string) => `${import.meta.env.BASE_URL}assets/${f}`;

/* Static renders of overlay markup (overlays themselves mount in a portal over the main panel). */
const StaticDialog = () => (
  <div className="ds-dialog doc-static-dialog" data-part="container">
    <div className="ds-dialog__text" data-part="text"><p className="ds-text-dialog-title">Delete Jane Cooper?</p><p className="ds-text-body-muted">Jane Cooper will lose access immediately. This can't be undone.</p></div>
    <div className="ds-dialog__actions" data-part="actions"><span className="ds-btn ds-btn--secondary">Cancel</span><span className="ds-btn ds-btn--danger">Delete User</span></div>
  </div>
);
const StaticPanel = () => (
  <div className="doc-static-panel">
    <aside className="ds-panel" data-part="panel">
      <div className="ds-panel__header" data-part="header"><div className="ds-panel__titlerow"><div className="ds-panel__titlegroup"><IconTile icon={Plus} size={32} /><p className="ds-text-dialog-title">New Project</p></div><span className="ds-icon-btn ds-icon-btn--close" aria-hidden="true">×</span></div></div>
      <div className="ds-panel__body" data-part="body"><div className="ds-form-grid"><div className="ds-field"><span className="ds-field__label">Name</span><span className="ds-input doc-static-input" /></div><div className="ds-field"><span className="ds-field__label">Client</span><span className="ds-input doc-static-input" /></div></div></div>
      <div className="ds-panel__footer" data-part="footer"><span className="ds-btn ds-btn--secondary">Cancel</span><span className="ds-btn ds-btn--primary">Save</span></div>
    </aside>
  </div>
);

function PlayState<T>({ init, children }: { init: T; children: (v: T, set: (v: T) => void) => ReactNode }) {
  const [v, setV] = useState(init);
  return <>{children(v, setV)}</>;
}

export const EXTRAS: Record<string, Extra> = {
  '/components/icon-buttons': {
    anatomy: { render: () => <IconButton icon={Pencil} label="Edit Jane Cooper" size="sm" tooltip={false} />, parts: [{ part: 'container', label: 'Hit area', spec: '28×28 (sm) / 36×36 (md), radius 8, transparent' }] },
  },
  '/components/link-action': {
    anatomy: { render: () => <LinkAction icon={Plus}>Add New User</LinkAction>, parts: [{ part: 'container', label: 'Action', spec: 'inline-flex, gap 8, radius 4 (focus)' }, { part: 'icon', label: 'Icon', spec: '14px plus, currentColor' }, { part: 'label', label: 'Label', spec: 'link-action 14/20 600 link' }] },
    playground: {
      controls: [{ kind: 'text', key: 'label', label: 'Label' }, { kind: 'bool', key: 'icon', label: 'Leading plus' }],
      initial: { label: 'Add New User', icon: true },
      render: p => <LinkAction icon={p.icon ? Plus : undefined}>{String(p.label)}</LinkAction>,
      code: p => `<LinkAction${p.icon ? ' icon={Plus}' : ''}>${p.label}</LinkAction>`,
    },
  },
  '/components/action-group': {
    staticComponent: 'An action group has no states of its own; each member keeps its own states (§5.54).',
    anatomy: { render: () => <div className="doc-footer-demo doc-narrow-xl" data-part="container"><span data-part="secondary" className="ds-contents"><Button variant="secondary" leading={ArrowLeft}>Back</Button></span><span data-part="primary" className="ds-contents"><Button>Save</Button></span></div>,
      parts: [{ part: 'container', label: 'Panel footer group', spec: 'justify-content: space-between' }, { part: 'secondary', label: 'Secondary (start)', spec: 'Back / Cancel' }, { part: 'primary', label: 'Primary (end)', spec: 'optional min-width 180' }] },
    playground: {
      controls: [{ kind: 'select', key: 'ctx', label: 'Context', options: ['Dialog', 'Panel footer', 'Row actions', 'Popover footer'] }],
      initial: { ctx: 'Dialog' },
      render: p => p.ctx === 'Dialog' ? <div className="ds-dialog__actions"><Button variant="secondary">Cancel</Button><Button variant="danger">Delete</Button></div>
        : p.ctx === 'Panel footer' ? <div className="doc-footer-demo doc-narrow-xl"><Button variant="secondary" leading={ArrowLeft}>Back</Button><Button minWidth>Save</Button></div>
        : p.ctx === 'Row actions' ? <div className="ds-row-actions"><IconButton icon={Copy} label="Copy" size="sm" /><IconButton icon={Pencil} label="Edit" size="sm" /><IconButton icon={Trash2} label="Delete" size="sm" /></div>
        : <div className="doc-footer-demo doc-narrow-lg"><Button variant="ghost" size="sm">Clear</Button><Button size="sm">Apply</Button></div>,
      code: p => p.ctx === 'Row actions' ? '<div className="ds-row-actions">…3 sm IconButtons…</div>' : p.ctx === 'Dialog' ? '<div className="ds-dialog__actions"><Button variant="secondary">Cancel</Button><Button variant="danger">Delete</Button></div>' : '<div className="ds-panel__footer"><Button variant="secondary">Back</Button><Button>Save</Button></div>',
    },
  },
  '/components/textareas': {
    noVariants: 'The spec defines one textarea; auto-grow is a product choice.',
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><Field label="Description" help="Visible to the team."><Textarea /></Field></div>, parts: [{ part: 'label', label: 'Label', spec: 'form-label 12/16 500' }, { part: 'message', label: 'Helper', spec: 'small 12/16 text-muted' }] },
    playground: {
      surface: 'card',
      controls: [{ kind: 'text', key: 'label', label: 'Label' }, { kind: 'bool', key: 'error', label: 'Error' }, { kind: 'bool', key: 'disabled', label: 'Disabled' }],
      initial: { label: 'Description', error: false, disabled: false },
      render: p => <div className="doc-narrow-xl"><Field label={String(p.label)} error={p.error ? 'Keep it under 500 characters.' : undefined}><Textarea disabled={!!p.disabled} /></Field></div>,
      code: p => `<Field label="${p.label}"${p.error ? ' error="…"' : ''}><Textarea${p.disabled ? ' disabled' : ''} /></Field>`,
    },
  },
  '/components/labels': {
    staticComponent: 'Labels are static; the control inside carries the interactive states. Error is shown via the message (see Variants).',
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><Field label="Work email" required error="Enter a valid email address."><TextInput defaultValue="jane@" /></Field></div>,
      parts: [{ part: 'container', label: 'Field', spec: 'column, gap 6' }, { part: 'label', label: 'Label + required', spec: '12/16 500 text-muted; * error-text aria-hidden' }, { part: 'message', label: 'Validation', spec: '12/16 error-text, role=alert, 2px offset' }] },
    playground: {
      surface: 'card',
      controls: [{ kind: 'text', key: 'label', label: 'Label' }, { kind: 'bool', key: 'required', label: 'Required' }, { kind: 'select', key: 'msg', label: 'Message', options: ['none', 'helper', 'error'] }],
      initial: { label: 'Work email', required: true, msg: 'helper' },
      render: p => <div className="doc-narrow-xl"><Field label={String(p.label)} required={!!p.required} help={p.msg === 'helper' ? 'We will never share it.' : undefined} error={p.msg === 'error' ? 'Enter a valid email address.' : undefined}><TextInput /></Field></div>,
      code: p => `<Field label="${p.label}"${p.required ? ' required' : ''}${p.msg === 'helper' ? ' help="…"' : p.msg === 'error' ? ' error="…"' : ''}><TextInput /></Field>`,
    },
  },
  '/components/multi-selects': {
    states: () => <Grid min={260}><Cell label="focus-visible"><MultiSelect label="Tags" options={depts} value={['Design']} onChange={() => {}} triggerClassName="is-focus-visible" /></Cell><Cell label="error"><MultiSelect label="Tags" options={depts} value={[]} onChange={() => {}} aria-invalid="true" /></Cell><Cell label="disabled"><MultiSelect label="Tags" options={depts} value={['Sales']} onChange={() => {}} disabled /></Cell></Grid>,
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><MultiSelect label="Departments" options={depts} value={['Design', 'Sales']} onChange={() => {}} /></div>, parts: [{ part: 'trigger', label: 'Sunken trigger', spec: 'min-height 40, joined labels or "N selected", chevron' }] },
    playground: {
      surface: 'card',
      controls: [{ kind: 'bool', key: 'action', label: 'Action row' }, { kind: 'bool', key: 'error', label: 'Error' }, { kind: 'select', key: 'width', label: 'Width', options: ['440px', '200px'] }],
      initial: { action: true, error: false, width: '440px' },
      render: p => <PlayState init={['Design']}>{(v, set) => <div className={p.width === '200px' ? 'doc-narrow' : 'doc-narrow-xl'}><MultiSelect label="Departments" options={depts} value={v} onChange={set} aria-invalid={p.error ? 'true' : undefined} action={p.action ? { label: 'Add New Department', onAction: () => {} } : undefined} /></div>}</PlayState>,
      code: p => `<MultiSelect options={departments} value={selected} onChange={setSelected}${p.action ? " action={{ label: 'Add New Department', onAction }}" : ''}${p.error ? ' aria-invalid="true"' : ''} />`,
    },
  },
  '/components/date-pickers': {
    anatomy: { render: () => <DateRangePicker from="2026-04-10" to="2026-04-20" onChange={() => {}} />, parts: [{ part: 'container', label: 'Trigger wrapper', spec: 'min-width 240 (default)' }, { part: 'trigger', label: 'Raised trigger', spec: 'aria-haspopup=dialog · 16px calendar in an 18px box' }] },
    playground: {
      controls: [{ kind: 'select', key: 'range', label: 'Value', options: ['range', 'from only', 'to only', 'none'] }],
      initial: { range: 'range' },
      render: p => <PlayState init={0}>{() => <DateRangePicker from={p.range === 'range' || p.range === 'from only' ? '2026-04-10' : ''} to={p.range === 'range' || p.range === 'to only' ? '2026-04-20' : ''} onChange={() => {}} />}</PlayState>,
      code: () => `<DateRangePicker from={from} to={to} onChange={(f, t) => setRange({ from: f, to: t })} />`,
    },
  },
  '/components/checkboxes': { noVariants: 'One checkbox; indeterminate is a state (see States).' },
  '/components/radio-cards': {
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><RadioCards label="Priority" value="b" onChange={() => {}} options={[{ value: 'a', label: 'Low' }, { value: 'b', label: 'Medium' }]} /></div>, parts: [{ part: 'group', label: 'Radiogroup', spec: 'flex, gap 12' }, { part: 'card', label: 'Card', spec: 'min-height 40, radius 8, 1px border, padding 0 16' }, { part: 'label', label: 'Label', spec: '14/20, wraps' }] },
    playground: {
      surface: 'card',
      controls: [{ kind: 'select', key: 'n', label: 'Options', options: ['2', '3', '4', '5 (vertical)'] }, { kind: 'bool', key: 'disabled', label: 'Disabled group' }],
      initial: { n: '3', disabled: false },
      render: p => <PlayState init="a">{(v, set) => <div className="doc-narrow-xxl"><RadioCards label="Example" value={v} onChange={set} disabled={!!p.disabled} vertical={String(p.n).startsWith('5')} options={['Low', 'Medium', 'High', 'Urgent', 'Critical'].slice(0, parseInt(String(p.n), 10)).map((l, i) => ({ value: 'abcde'[i], label: l }))} /></div>}</PlayState>,
      code: p => `<RadioCards label="Priority" value={value} onChange={setValue}${String(p.n).startsWith('5') ? ' vertical' : ''}${p.disabled ? ' disabled' : ''} options={[…]} />`,
    },
  },
  '/components/binary-toggle': {
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><BinaryToggle label="Status" value="a" onChange={() => {}} options={[{ value: 'a', label: 'Active', dot: 'success' }, { value: 'b', label: 'Inactive', dot: 'error' }]} /></div>, parts: [{ part: 'container', label: 'Container', spec: 'radiogroup · 1px border-strong · radius 10 · min-height 40' }, { part: 'option', label: 'Option', spec: 'flex 1, 8px dot + label, selected = inset 1px brand ring' }] },
    playground: {
      surface: 'card',
      controls: [{ kind: 'bool', key: 'dots', label: 'Status dots' }, { kind: 'bool', key: 'disabled', label: 'Disabled' }],
      initial: { dots: true, disabled: false },
      render: p => <PlayState init="a">{(v, set) => <div className="doc-narrow-xl"><BinaryToggle label="Status" value={v} onChange={set} disabled={!!p.disabled} options={[{ value: 'a', label: 'Active', dot: p.dots ? 'success' : undefined }, { value: 'b', label: 'Inactive', dot: p.dots ? 'error' : undefined }]} /></div>}</PlayState>,
      code: p => `<BinaryToggle label="Status" value={v} onChange={setV}${p.disabled ? ' disabled' : ''} options={[{ value: 'a', label: 'Active'${p.dots ? ", dot: 'success'" : ''} }, …]} />`,
    },
  },
  '/components/switches': {
    noVariants: 'The spec defines one switch.',
    anatomy: { render: () => <Switch checked onChange={() => {}} label="Email notifications" />, parts: [{ part: 'track', label: 'Track', spec: '36×20, radius full, on = brand-strong' }, { part: 'thumb', label: 'Thumb', spec: '16px, travels 16px toward the end edge' }, { part: 'label', label: 'Visible label', spec: '14/20 text-secondary, 12px gap' }] },
    playground: {
      controls: [{ kind: 'text', key: 'label', label: 'Label' }, { kind: 'bool', key: 'disabled', label: 'Disabled' }],
      initial: { label: 'Email notifications', disabled: false },
      render: p => <PlayState init={true}>{(v, set) => <Switch checked={v} onChange={set} label={String(p.label)} disabled={!!p.disabled} />}</PlayState>,
      code: p => `<Switch checked={on} onChange={setOn} label="${p.label}"${p.disabled ? ' disabled' : ''} />`,
    },
  },
  '/components/file-upload': {
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><FileUpload /></div>, parts: [{ part: 'container', label: 'Dropzone', spec: 'role=button · 1px dashed border-input · radius 10 · padding 24 · gap 8' }, { part: 'icon', label: 'Icon', spec: '32px upload at 60%' }, { part: 'title', label: 'Title', spec: '14/20 500 text-secondary' }, { part: 'hint', label: 'Hint', spec: '12/16 text-muted' }] },
    playground: {
      surface: 'card',
      controls: [{ kind: 'text', key: 'title', label: 'Title' }, { kind: 'bool', key: 'multiple', label: 'Multiple files' }],
      initial: { title: 'Upload reference image', multiple: false },
      render: p => <div className="doc-narrow-xl"><FileUpload key={String(p.multiple)} title={String(p.title)} multiple={!!p.multiple} /></div>,
      code: p => `<FileUpload title="${p.title}"${p.multiple ? ' multiple' : ''} />`,
    },
  },
  '/components/field-with-attach': {
    noVariants: 'One component; the attached / processing appearance are states of it.',
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><AttachField value="8901030875397" onValueChange={() => {}} /></div>, parts: [{ part: 'container', label: 'Row', spec: 'gap 12, wraps at xs' }, { part: 'field', label: 'Sunken field', spec: 'min-height 40, recessed, no border' }, { part: 'button', label: 'Attach button', spec: 'min-height 40, surface-attach, 18px icon' }] },
    playground: {
      surface: 'card', controls: [{ kind: 'bool', key: 'error', label: 'Error' }], initial: { error: false },
      render: p => <PlayState init="">{(v, set) => <div className="doc-narrow-xl"><Field label="Primary code" error={p.error ? 'Text not detected. Upload the photo again.' : undefined}><AttachField value={v} onValueChange={set} /></Field></div>}</PlayState>,
      code: p => `<Field label="Primary code"${p.error ? ' error="…"' : ''}><AttachField value={code} onValueChange={setCode} /></Field>`,
    },
  },
  '/components/rich-picker': {
    noVariants: 'Select-only vs inline-add is a product choice; the action row here represents it.',
    states: () => <Grid min={340}><Cell label="empty"><RichPicker label="Manager" people={people} value={null} onChange={() => {}} /></Cell><Cell label="with value (64px)"><RichPicker label="Manager" people={people} value={people[0].id} onChange={() => {}} /></Cell><Cell label="error"><RichPicker label="Manager" people={people} value={null} onChange={() => {}} aria-invalid="true" /></Cell></Grid>,
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><RichPicker label="Manager" people={people} value={people[1].id} onChange={() => {}} /></div>, parts: [{ part: 'trigger', label: 'Trigger with rich row', spec: '40px avatar + name/ID chip/role + email; 12px vertical padding' }] },
    playground: {
      surface: 'card', controls: [{ kind: 'select', key: 'n', label: 'People', options: ['3', '10'] }], initial: { n: '10' },
      render: p => <PlayState init={null as string | null}>{(v, set) => <div className="doc-narrow-xl"><RichPicker label="Manager" people={people.slice(0, +p.n)} value={v} onChange={set} /></div>}</PlayState>,
      code: () => `<RichPicker people={people} value={managerId} onChange={setManagerId} />`,
    },
  },
  '/components/badges': { staticComponent: 'Badges are not interactive (§5.27): no hover, focus or disabled states.' },
  '/components/tags': {
    staticComponent: 'Tags are static (§5.29). Removable filter chips add a separate remove button (§6.3).',
    anatomy: { render: () => <Tag color="blue">Engineering</Tag>, parts: [{ part: 'container', label: 'Tag', spec: 'padding 6 12 · radius 4 · 14/20 500 white on a muted fill' }] },
    playground: {
      controls: [{ kind: 'select', key: 'color', label: 'Fill', options: TAG_ORDER }, { kind: 'text', key: 'label', label: 'Label' }, { kind: 'bool', key: 'raised', label: 'Raised' }],
      initial: { color: 'purple', label: 'Engineering', raised: false },
      render: p => <Tag color={p.color as TagColor} raised={!!p.raised}>{String(p.label)}</Tag>,
      code: p => `<Tag color="${p.color}"${p.raised ? ' raised' : ''}>${p.label}</Tag>`,
    },
  },
  '/components/status-indicators': {
    staticComponent: 'Status dots are static; a standalone dot with a tooltip becomes focusable (§5.28 b).',
    anatomy: { render: () => <Status tone="success" size="md">Online</Status>, parts: [{ part: 'dot', label: 'Dot', spec: '10px (md) / 8px (sm), glow' }, { part: 'label', label: 'Label', spec: 'body text-secondary, 8px gap' }] },
    playground: {
      controls: [{ kind: 'select', key: 'tone', label: 'Tone', options: ['success', 'warning', 'error'] }, { kind: 'select', key: 'size', label: 'Size', options: ['sm', 'md'] }, { kind: 'bool', key: 'label', label: 'Visible label' }],
      initial: { tone: 'success', size: 'sm', label: true },
      render: p => p.label ? <Status tone={p.tone as 'success'} size={p.size as 'sm'}>{p.tone === 'success' ? 'Online' : p.tone === 'warning' ? 'Idle' : 'Offline'}</Status> : <Dot tone={p.tone as 'success'} size={p.size as 'sm'} label={String(p.tone)} />,
      code: p => (p.label ? `<Status tone="${p.tone}"${p.size === 'md' ? ' size="md"' : ''}>…</Status>` : `<Dot tone="${p.tone}" label="…" />`),
    },
  },
  '/components/count-pill': {
    staticComponent: 'Not interactive (§5.30).', noVariants: 'One style.',
    anatomy: { render: () => <CountPill>12</CountPill>, parts: [{ part: 'container', label: 'Pill', spec: 'padding 3 13 · radius full · surface-pill · 1px border-subtle · 14/18 700' }] },
    playground: { controls: [{ kind: 'text', key: 'n', label: 'Value' }], initial: { n: '12' }, render: p => <div className="ds-cluster"><span className="ds-text-group-title">Group</span><CountPill>{String(p.n)}</CountPill></div>, code: p => `<CountPill>${p.n}</CountPill>` },
  },
  '/components/info-chip': {
    staticComponent: 'Static text (§5.31).', noVariants: 'One style.',
    anatomy: { render: () => <Chip>EMP-2041</Chip>, parts: [{ part: 'container', label: 'Chip', spec: 'padding 3 9 · radius 4 · brand-tint-10 · 10/15 brand-text' }] },
    playground: { controls: [{ kind: 'text', key: 't', label: 'Text' }], initial: { t: 'EMP-2041' }, render: p => <Chip>{String(p.t)}</Chip>, code: p => `<Chip>${p.t}</Chip>` },
  },
  '/components/avatar': {
    staticComponent: 'Avatars are static and decorative when the name is adjacent.',
    anatomy: { render: () => <Avatar name="Jane Cooper" />, parts: [{ part: 'container', label: 'Circle', spec: '40px, brand gradient, 1px brand-avatar-border, 12/16 700 initials' }] },
    playground: {
      controls: [{ kind: 'text', key: 'name', label: 'Name' }, { kind: 'select', key: 'variant', label: 'Variant', options: ['brand', 'neutral', 'photo'] }],
      initial: { name: 'Jane Cooper', variant: 'brand' },
      render: p => <Avatar name={String(p.name) || 'A'} variant={p.variant as 'brand'} />,
      code: p => `<Avatar name="${p.name}"${p.variant !== 'brand' ? ` variant="${p.variant}"` : ''} />`,
    },
  },
  '/components/metric-cards': {
    staticComponent: 'Metric indicators are static (§5.33).',
    anatomy: { render: () => <Metric label="Members" value={30} of={36} />, parts: [{ part: 'label', label: 'Label', spec: 'metric-label 12/18 500 uppercase' }, { part: 'value', label: 'Value', spec: 'metric-value 16/24 700, baseline gap 2' }, { part: 'denominator', label: 'Denominator', spec: '12/24 500 text-tertiary' }] },
    playground: {
      controls: [{ kind: 'text', key: 'label', label: 'Label' }, { kind: 'text', key: 'value', label: 'Value' }, { kind: 'text', key: 'of', label: 'Denominator (blank = none)' }, { kind: 'select', key: 'tone', label: 'Value tone', options: ['neutral', 'success', 'warning', 'alert'] }],
      initial: { label: 'Members', value: '30', of: '36', tone: 'neutral' },
      render: p => <Metric label={String(p.label)} value={String(p.value)} of={p.of ? Number(p.of) : undefined} tone={p.tone === 'neutral' ? undefined : p.tone as 'success'} />,
      code: p => `<Metric label="${p.label}" value={${p.value}}${p.of ? ` of={${p.of}}` : ''}${p.tone !== 'neutral' ? ` tone="${p.tone}"` : ''} />`,
    },
  },
  '/components/progress': {
    staticComponent: 'Static; value changes animate (500ms).',
    anatomy: { render: () => <div className="doc-narrow-xl doc-stack"><Progress value={64} label="Completion" /><SegBar segments={[{ value: 18, color: 'var(--ds-chart-running)', label: 'running' }, { value: 3, color: 'var(--ds-chart-stopped)', label: 'stopped' }]} /></div>,
      parts: [{ part: 'track', label: 'Track', spec: '8px progress / 20px status bar, radius 6' }, { part: 'fill', label: 'Fill', spec: 'brand / success / warning / error' }, { part: 'value', label: 'Value label', spec: '12/16 600 text-secondary, 8px gap' }, { part: 'segment', label: 'Segment', spec: 'flex-grow ∝ count, min 28px, ink count' }] },
    playground: {
      controls: [{ kind: 'select', key: 'tone', label: 'Tone', options: ['brand', 'success', 'warning', 'error'] }, { kind: 'select', key: 'v', label: 'Value', options: ['0', '18', '46', '64', '100'] }],
      initial: { tone: 'brand', v: '64' },
      render: p => <div className="doc-narrow-xl"><Progress value={+p.v} tone={p.tone as 'brand'} label="Completion" /></div>,
      code: p => `<Progress value={${p.v}}${p.tone !== 'brand' ? ` tone="${p.tone}"` : ''} label="Completion" />`,
    },
  },
  '/components/callout': {
    staticComponent: 'Static (§5.20).', noVariants: 'Neutral only; status tones are the Alert extension.',
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><Callout title="How billing works">Hours are billed monthly against the estimate.</Callout></div>, parts: [{ part: 'container', label: 'Container', spec: 'padding 14 · radius 8 · surface-callout · 1px border-callout · gap 4' }, { part: 'title', label: 'Title', spec: 'small-strong 12/16 600' }, { part: 'body', label: 'Body', spec: '12px / 1.45 text-muted' }] },
    playground: { surface: 'card', controls: [{ kind: 'text', key: 't', label: 'Title' }, { kind: 'text', key: 'b', label: 'Body' }], initial: { t: 'How billing works', b: 'Hours are billed monthly against the estimate.' }, render: p => <div className="doc-narrow-xl"><Callout title={String(p.t)}>{String(p.b)}</Callout></div>, code: p => `<Callout title="${p.t}">${p.b}</Callout>` },
  },
  '/components/alerts': {
    staticComponent: 'Static; the optional dismiss button has the universal states.',
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><InlineAlert tone="warning" title="Approaching limit" onDismiss={() => {}}>You have used 92% of your storage.</InlineAlert></div>, parts: [{ part: 'container', label: 'Container', spec: 'padding 12 14 · radius 8 · tone tint + border' }, { part: 'icon', label: 'Status icon', spec: '16px' }, { part: 'content', label: 'Title + body', spec: '12/16 600 + 12/16 text-secondary' }, { part: 'dismiss', label: 'Dismiss', spec: 'sm icon button' }] },
    playground: {
      surface: 'card',
      controls: [{ kind: 'select', key: 'tone', label: 'Tone', options: ['info', 'success', 'warning', 'error'] }, { kind: 'text', key: 'title', label: 'Title' }, { kind: 'bool', key: 'dismiss', label: 'Dismissible' }],
      initial: { tone: 'info', title: 'Scheduled maintenance', dismiss: false },
      render: p => <div className="doc-narrow-xl"><InlineAlert tone={p.tone as 'info'} title={String(p.title)} onDismiss={p.dismiss ? () => {} : undefined}>Reports will be read-only on Sunday 02:00–04:00.</InlineAlert></div>,
      code: p => `<InlineAlert tone="${p.tone}" title="${p.title}"${p.dismiss ? ' onDismiss={dismiss}' : ''}>…</InlineAlert>`,
    },
  },
  '/components/stepper': {
    staticComponent: 'Non-interactive by default (§5.22); clickable steps would be buttons with universal states.',
    anatomy: { render: () => <div className="doc-narrow-xxl"><Stepper current={0} steps={[{ title: 'Basics', sub: 'In progress' }, { title: 'Team', sub: 'Members & roles' }]} /></div>, parts: [{ part: 'list', label: 'List', spec: '<ol>, flex, connectors between steps' }, { part: 'index', label: 'Current index', spec: '32×32 radius 8 brand-strong, aria-current=step' }, { part: 'text', label: 'Title + subtitle', spec: '12/16 700 white + 12/16 500 link' }, { part: 'upcoming', label: 'Upcoming step', spec: 'full opacity; muted/tertiary text' }] },
    playground: {
      controls: [{ kind: 'select', key: 'cur', label: 'Current step', options: ['1', '2', '3'] }],
      initial: { cur: '1' },
      render: p => <div className="doc-narrow-xxl"><Stepper current={+p.cur - 1} steps={[{ title: 'Basics', sub: 'In progress' }, { title: 'Team', sub: 'Members & roles' }, { title: 'Review', sub: 'Summary' }]} /></div>,
      code: p => `<Stepper current={${+p.cur - 1}} steps={[…]} />`,
    },
  },
  '/components/loading': {
    staticComponent: 'Loading is itself a state (loading → loaded / error); see Variants.',
    anatomy: { render: () => <div className="doc-narrow-xl doc-stack-sm" data-part="container"><Skeleton w="80%" /><Skeleton w="60%" /></div>, parts: [{ part: 'container', label: 'Skeleton bars', spec: '12px tall, radius 6, skeleton fill, pulse 1.5s' }] },
    playground: {
      controls: [{ kind: 'select', key: 'kind', label: 'Context', options: ['button', 'table'] }, { kind: 'bool', key: 'loading', label: 'Loading' }],
      initial: { kind: 'table', loading: true },
      render: p => p.kind === 'button' ? <Button loading={!!p.loading}>Save Changes</Button>
        : <section className="ds-table-card doc-full"><DataTable caption="Loading demo" rowHeader="name" loading={!!p.loading} rowKey={e => e.id} rows={employees.slice(0, 3)} columns={employeeColumns().slice(0, 3)} /></section>,
      code: p => (p.kind === 'button' ? `<Button${p.loading ? ' loading' : ''}>Save Changes</Button>` : `<DataTable${p.loading ? ' loading' : ''} … />`),
    },
  },
  '/components/empty-states': {
    staticComponent: 'Static; the action button has the universal states.',
    anatomy: { surface: 'card', render: () => <EmptyState variant="first-use" icon={<IconTile icon={FolderOpen} />} title="No projects yet" message="Create your first project." action={<Button>Add Project</Button>} />,
      parts: [{ part: 'container', label: 'Container', spec: 'centered column, gap 12, padding 64 24' }, { part: 'icon', label: 'Illustration / icon tile', spec: '40px' }, { part: 'title', label: 'Title', spec: 'card-title' }, { part: 'message', label: 'Message', spec: 'body-muted, one sentence' }, { part: 'action', label: 'Primary action', spec: 'optional' }] },
    playground: {
      surface: 'card',
      controls: [{ kind: 'select', key: 'v', label: 'Variant', options: ['inline', 'first-use'] }, { kind: 'text', key: 'msg', label: 'Message' }],
      initial: { v: 'first-use', msg: 'Create your first project to start tracking work.' },
      render: p => p.v === 'inline' ? <EmptyState message={String(p.msg)} /> : <EmptyState variant="first-use" icon={<IconTile icon={FolderOpen} />} title="No projects yet" message={String(p.msg)} action={<Button>Add Project</Button>} />,
      code: p => `<EmptyState${p.v === 'first-use' ? ' variant="first-use" icon={…} title="No projects yet"' : ''} message="${p.msg}"${p.v === 'first-use' ? ' action={<Button>Add Project</Button>}' : ''} />`,
    },
  },
  '/components/standard-cards': {
    playground: {
      controls: [{ kind: 'text', key: 'title', label: 'Title' }, { kind: 'bool', key: 'inactive', label: 'Inactive' }, { kind: 'select', key: 'metrics', label: 'Metric columns', options: ['2', '3', '4'] }],
      initial: { title: 'Website relaunch', inactive: false, metrics: '3' },
      render: p => <PlayEntity {...p} />,
      code: p => `<EntityCard title="${p.title}" … metrics={[/* ${p.metrics} items */]}${p.inactive ? ' inactive' : ''} onOpen={open} />`,
    },
  },
  '/components/dashboard-card': {
    staticComponent: 'A static container; its loading and empty states are §5.50 / §5.51.',
    anatomy: { render: () => <div className="doc-full"><DashCard title="Revenue" subtitle="Last 30 days" right={<Tabs idBase="anat" variant="accent" label="View" value="a" onChange={() => {}} tabs={[{ value: 'a', label: 'Chart' }, { value: 'b', label: 'Table' }]} />}><div className="doc-placeholder">Chart</div></DashCard></div>,
      parts: [{ part: 'container', label: 'Card', spec: 'padding 24 · radius 20 · shadow-card · gap 20' }, { part: 'title', label: 'Title', spec: 'card-title 20/24 600' }, { part: 'subtitle', label: 'Subtitle', spec: '14/20 chart-subtle, 5px below' }, { part: 'controls', label: 'Legend / controls', spec: 'right side, gap 16–20' }, { part: 'body', label: 'Body', spec: 'chart / table; flush variant runs edge to edge' }] },
    playground: {
      controls: [{ kind: 'bool', key: 'flush', label: 'Flush (tables / heatmaps)' }, { kind: 'bool', key: 'sub', label: 'Subtitle' }],
      initial: { flush: false, sub: true },
      render: p => <div className="doc-full"><DashCard flush={!!p.flush} title="Revenue" subtitle={p.sub ? 'Last 30 days' : undefined}>{p.flush ? <DataTable caption="Revenue" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 2)} columns={employeeColumns().slice(0, 3)} /> : <div className="doc-placeholder">Chart</div>}</DashCard></div>,
      code: p => `<DashCard title="Revenue"${p.sub ? ' subtitle="Last 30 days"' : ''}${p.flush ? ' flush' : ''}>…</DashCard>`,
    },
  },
  '/components/status-card': {
    staticComponent: 'Inherits the table states; loading and empty per §5.50 / §5.51.', noVariants: 'One composition.',
    anatomy: { render: () => <div className="doc-narrow-xxl"><StatusCard title="Integrations" running={9} stopped={3}><p className="ds-text-body-muted doc-pad">Capped table (§5.41)</p></StatusCard></div>, parts: [{ part: 'header', label: 'Header', spec: 'title + dot legend, min-height 40' }, { part: 'legend', label: 'Dot legend', spec: '12px dots, gap 20' }, { part: 'bar', label: 'Segmented bar', spec: '§5.34, 20px, padding 0 24' }, { part: 'table', label: 'Table', spec: 'capped 266px, worst first' }] },
    playground: {
      controls: [{ kind: 'select', key: 'r', label: 'Running', options: ['0', '5', '18'] }, { kind: 'select', key: 's', label: 'Stopped', options: ['0', '3', '9'] }],
      initial: { r: '18', s: '3' },
      render: p => <div className="doc-narrow-xxl"><StatusCard title="Integrations" running={+p.r} stopped={+p.s}><p className="ds-text-body-muted doc-pad">{+p.r + +p.s} units</p></StatusCard></div>,
      code: p => `<StatusCard title="Integrations" running={${p.r}} stopped={${p.s}}>…</StatusCard>`,
    },
  },
  '/components/summary-strip': {
    staticComponent: 'Static; a clamped title is focusable for its tooltip.', noVariants: 'With or without status fields only (see Playground).',
    playground: {
      controls: [{ kind: 'select', key: 'len', label: 'Title length', options: ['short', 'long (clamps to 2 lines)'] }, { kind: 'bool', key: 'status', label: 'Status fields' }],
      initial: { len: 'short', status: true },
      render: p => <div className="doc-full"><SummaryStrip eyebrow="Project" title={p.len === 'short' ? 'Website relaunch' : 'Website relaunch for Northwind Labs — phase two, international markets, accessibility review and performance budget'} fields={[{ label: 'Code', value: 'PRJ-100' }, { label: 'Client', value: 'Northwind Labs' }]} statuses={p.status ? [{ label: 'Build', tone: 'success', value: 'Passing' }] : undefined} /></div>,
      code: p => `<SummaryStrip eyebrow="Project" title={title} fields={[…]}${p.status ? ' statuses={[…]}' : ''} />`,
    },
  },
  '/components/media-card': {
    noVariants: 'Card and viewer are documented together (open a card for the viewer).',
    states: () => <Grid min={280}><Cell label="hover (blue/40% border)"><div className="doc-media-cell"><MediaCard title="Loading dock" sub="Source 1" src={asset('1a86e.png')} detail="Detected: ABC-123" badge={<Badge tone="success">Matched</Badge>} onOpen={() => {}} /></div></Cell></Grid>,
    anatomy: { render: () => <div className="doc-media-cell"><MediaCard title="Loading dock" sub="Source 1" src={asset('1a86e.png')} detail="Detected: ABC-123" badge={<Badge tone="success">Matched</Badge>} onOpen={() => {}} /></div>,
      parts: [{ part: 'container', label: 'Card', spec: 'button · radius 20 · surface-overlay · 1px border-media · shadow-float' }, { part: 'header', label: 'Header', spec: 'padding 16, 28px icon tile, card-title + body-muted' }, { part: 'media', label: 'Media well', spec: 'surface-media, image at 50%' }, { part: 'footer', label: 'Footer', spec: 'padding 10 16, card-footer fill, detail + badge' }] },
    playground: {
      controls: [{ kind: 'text', key: 'title', label: 'Title' }, { kind: 'select', key: 'frame', label: 'Frame', options: ['1a86e.png', '2cc30.png', '839eb.png'] }, { kind: 'select', key: 'tone', label: 'Badge', options: ['success', 'warning', 'error'] }],
      initial: { title: 'Loading dock', frame: '1a86e.png', tone: 'success' },
      render: p => <div className="doc-media-cell"><MediaCard title={String(p.title)} sub="Source 1" src={asset(String(p.frame))} detail="Detected: ABC-123" badge={<Badge tone={p.tone as 'success'}>{p.tone === 'success' ? 'Matched' : p.tone === 'warning' ? 'Review' : 'Mismatch'}</Badge>} onOpen={() => toast('Opens the media viewer')} /></div>,
      code: p => `<MediaCard title="${p.title}" sub="Source 1" src={url} detail="Detected: ABC-123" badge={<Badge tone="${p.tone}">…</Badge>} onOpen={openViewer} />`,
    },
  },
  '/components/tables': {
    anatomy: { render: () => <section className="ds-table-card doc-full"><DataTable caption="Anatomy" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 2)} columns={employeeColumns().slice(0, 5)} sort={{ key: 'name', dir: 'ascending' }} onSort={() => {}} /></section>,
      parts: [{ part: 'region', label: 'Scroll region', spec: 'role=region, labelled, tabindex 0, overflow-x auto' }, { part: 'header', label: 'Header row', spec: '12/16 600 uppercase muted, white/2%, padding 12 16' }, { part: 'sort', label: 'Sort button', spec: 'label + 14px icon; aria-sort on the th' }, { part: 'row', label: 'Body row', spec: 'min-height 44, no borders, zebra white/1%' }] },
    playground: {
      controls: [{ kind: 'bool', key: 'selectable', label: 'Selectable' }, { kind: 'bool', key: 'capped', label: 'Capped (sticky header)' }, { kind: 'bool', key: 'loading', label: 'Loading' }, { kind: 'bool', key: 'empty', label: 'Empty' }, { kind: 'bool', key: 'tints', label: 'Status tints' }],
      initial: { selectable: false, capped: false, loading: false, empty: false, tints: false },
      render: p => <PlayTable {...p} />,
      code: p => `<DataTable caption="Employees" rowHeader="name" columns={columns} rows={rows} rowKey={e => e.id}${p.selectable ? ' selectable selected={sel} onSelect={setSel}' : ''}${p.capped ? ' maxHeight={266}' : ''}${p.loading ? ' loading' : ''}${p.tints ? ' rowTone={toneFor}' : ''} />`,
    },
  },
  '/components/table-card': {
    staticComponent: 'A static container (§5.42).', noVariants: 'With or without the section header / bulk bar (see Playground).',
    anatomy: { render: () => <div className="doc-full"><TableCard title="Open Tasks" titleId="anat-tc" count={12} actions={<Button variant="tonal" size="sm" leading={Plus}>Add Task</Button>}><DataTable caption="Tasks" labelledBy="anat-tc" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 2)} columns={employeeColumns().slice(0, 3)} /></TableCard></div>,
      parts: [{ part: 'container', label: 'Card', spec: 'radius 20 · overflow hidden · shadow-card' }, { part: 'header', label: 'Section header', spec: 'padding 16, group-title + count pill, actions right, 1px border-faint' }] },
    playground: {
      controls: [{ kind: 'bool', key: 'header', label: 'Section header' }, { kind: 'bool', key: 'pagination', label: 'Pagination' }],
      initial: { header: true, pagination: true },
      render: p => <div className="doc-full"><TableCard title={p.header ? 'Open Tasks' : undefined} titleId="pl-tc" count={12}><DataTable caption="Tasks" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 3)} columns={employeeColumns().slice(0, 3)} />{p.pagination && <Pagination page={1} pageSize={3} total={12} noun="tasks" onPage={() => {}} />}</TableCard></div>,
      code: p => `<TableCard${p.header ? ' title="Open Tasks" count={12}' : ''}>\n  <DataTable … />${p.pagination ? '\n  <Pagination … />' : ''}\n</TableCard>`,
    },
  },
  '/components/collapsible-section': {
    anatomy: { render: () => <div className="doc-full"><Collapsible title="Engineering" count={12} open={false} onToggle={() => {}} action={<Button variant="tonal" leading={Plus}>Add Member</Button>}><p /></Collapsible></div>,
      parts: [{ part: 'container', label: 'Section card', spec: 'radius 20 · shadow-card' }, { part: 'toggle', label: 'Header button', spec: 'aria-expanded, gap 24; min-height 60' }, { part: 'title', label: 'Title', spec: 'group-title, wraps' }, { part: 'count', label: 'Count pill', spec: '14px gap' }] },
    playground: {
      controls: [{ kind: 'bool', key: 'nested', label: 'Nested' }, { kind: 'bool', key: 'action', label: 'Action button' }, { kind: 'text', key: 'title', label: 'Title' }],
      initial: { nested: false, action: true, title: 'Engineering' },
      render: p => <PlayState init={true}>{(o, set) => <div className="doc-full"><Collapsible nested={!!p.nested} title={String(p.title)} count={4} open={o} onToggle={() => set(!o)} action={p.action ? <Button variant="tonal" leading={Plus}>Add Member</Button> : undefined}><DataTable caption="Members" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 2)} columns={employeeColumns().slice(0, 3)} /></Collapsible></div>}</PlayState>,
      code: p => `<Collapsible title="${p.title}" count={4} open={open} onToggle={toggle}${p.nested ? ' nested' : ''}${p.action ? ' action={<Button variant="tonal">Add Member</Button>}' : ''}>…</Collapsible>`,
    },
  },
  '/components/navigation-items': {
    anatomy: { render: () => <div className="doc-nav-item-frame"><NavItem item={{ id: 'u', label: 'Users', icon: <Icon icon={Users} size={24} /> }} current /></div>, parts: [{ part: 'item', label: 'Item', spec: 'min-height 44 · padding 0 14 · radius 16' }, { part: 'icon', label: 'Icon', spec: '24px illustration or outline icon' }, { part: 'label', label: 'Label', spec: 'nav-item 14/20, one line + tooltip; 600 when current' }] },
    playground: {
      controls: [{ kind: 'text', key: 'label', label: 'Label' }, { kind: 'bool', key: 'current', label: 'Current page' }],
      initial: { label: 'Users', current: true },
      render: p => <div className="doc-nav-item-frame"><NavItem item={{ id: 'p', label: String(p.label), icon: <Icon icon={Users} size={24} /> }} current={!!p.current} /></div>,
      code: p => `<NavItem item={{ id: 'users', label: '${p.label}', icon: <UsersIcon /> }}${p.current ? ' current' : ''} />`,
    },
  },
  '/components/page-headers': {
    staticComponent: 'The header itself is static; scrolled / unscrolled is shown in Variants.',
    anatomy: { render: () => <div className="doc-header-frame"><PageHeader title="Employees" back={{ label: 'Directory', onBack: () => {} }} actions={<Button leading={Plus}>Add Employee</Button>} /></div>, parts: [{ part: 'container', label: 'Header', spec: 'min-height 76 · padding 0 16 · space-between' }, { part: 'lead', label: 'Lead', spec: 'back button + 10px + h1' }, { part: 'title', label: 'Title', spec: 'page-title 24/28 600, wraps' }, { part: 'actions', label: 'Actions', spec: 'gap 12, wrap' }] },
    playground: {
      controls: [{ kind: 'text', key: 'title', label: 'Title' }, { kind: 'bool', key: 'back', label: 'Back button' }, { kind: 'bool', key: 'crumb', label: 'Breadcrumb' }, { kind: 'bool', key: 'desc', label: 'Description' }, { kind: 'bool', key: 'scrolled', label: 'Scrolled' }],
      initial: { title: 'Employees', back: false, crumb: false, desc: false, scrolled: false },
      render: p => <div className="doc-header-frame"><PageHeader title={String(p.title)} back={p.back ? { label: 'Directory', onBack: () => {} } : undefined} breadcrumb={p.crumb ? [{ label: 'People', href: '#/components/page-headers' }] : undefined} description={p.desc ? 'Everyone with access to this workspace.' : undefined} scrolled={!!p.scrolled} actions={<Button leading={Plus}>Add Employee</Button>} /></div>,
      code: p => `<PageHeader title="${p.title}"${p.back ? " back={{ label: 'Directory', onBack }}" : ''}${p.crumb ? ' breadcrumb={[…]}' : ''}${p.desc ? ' description="…"' : ''}${p.scrolled ? ' scrolled' : ''} actions={…} />`,
    },
  },
  '/components/breadcrumbs': {
    noVariants: 'One style.',
    anatomy: { render: () => <Breadcrumb items={[{ label: 'Clients', href: '#/components/breadcrumbs' }, { label: 'Quartz Retail', href: '#/components/breadcrumbs' }]} />, parts: [{ part: 'container', label: 'nav[aria-label=Breadcrumb]', spec: '<ol>, gap 6, small 12/16' }, { part: 'link', label: 'Link', spec: 'text-muted → text-primary on hover' }, { part: 'separator', label: 'Separator', spec: '"/" text-faint, aria-hidden' }] },
    playground: { controls: [{ kind: 'select', key: 'n', label: 'Levels', options: ['1', '2', '3'] }], initial: { n: '2' }, render: p => <Breadcrumb items={['Clients', 'Quartz Retail', 'Projects'].slice(0, +p.n).map(l => ({ label: l, href: '#/components/breadcrumbs' }))} />, code: p => `<Breadcrumb items={[${['Clients', 'Quartz Retail', 'Projects'].slice(0, +p.n).map(l => `{ label: '${l}', href: '…' }`).join(', ')}]} />` },
  },
  '/components/tabs': {
    anatomy: { render: () => <Tabs idBase="anat-tabs" label="Anatomy" value="a" onChange={() => {}} tabs={[{ value: 'a', label: 'All', count: 248 }, { value: 'b', label: 'Open', count: 31 }]} />, parts: [{ part: 'track', label: 'Track', spec: 'sunken-deep · radius 12 · padding 5 · min-height 50' }, { part: 'tab', label: 'Tab', spec: 'padding 10 20 · radius 8; selected = raised pill + 600' }, { part: 'count', label: 'Count', spec: 'tab-count 12/16, 4px gap' }] },
  },
  '/components/pagination': {
    anatomy: { render: () => <section className="ds-table-card doc-full"><Pagination page={2} pageSize={8} total={24} noun="users" onPage={() => {}} /></section>, parts: [{ part: 'container', label: 'Bar', spec: 'padding 12 16 · 1px border-subtle top · space-between' }, { part: 'summary', label: 'Summary', spec: 'body-muted, numbers 500 white' }, { part: 'pages', label: 'Buttons', spec: '32×32 min, radius 6, gap 6; current brand-strong' }] },
    playground: {
      controls: [{ kind: 'select', key: 'total', label: 'Total rows', options: ['24', '96', '248'] }, { kind: 'select', key: 'size', label: 'Page size', options: ['6', '8'] }],
      initial: { total: '248', size: '8' },
      render: p => <PlayState init={1}>{(pg, set) => <section className="ds-table-card doc-full"><Pagination page={pg} pageSize={+p.size} total={+p.total} noun="employees" onPage={set} /></section>}</PlayState>,
      code: p => `<Pagination page={page} pageSize={${p.size}} total={${p.total}} noun="employees" onPage={setPage} />`,
    },
  },
  '/components/modals': {
    staticComponent: 'Overlay states are open / dirty (Escape asks to discard); try the live preview.',
    anatomy: { surface: 'card', render: () => <div className="doc-narrow-xl"><StaticDialog /></div>, parts: [{ part: 'container', label: 'Dialog', spec: 'max 440 · padding 24 · gap 24 · radius 20 · 1px border-subtle · shadow-dialog' }, { part: 'text', label: 'Title + message', spec: 'dialog-title 20/28 700 + body-muted, gap 8' }, { part: 'actions', label: 'Actions', spec: 'end-aligned, gap 12; Cancel focused' }] },
    playground: {
      controls: [{ kind: 'select', key: 'tone', label: 'Confirm action', options: ['danger', 'primary'] }, { kind: 'text', key: 'title', label: 'Title' }],
      initial: { tone: 'danger', title: 'Delete Jane Cooper?' },
      render: p => <PlayConfirm tone={p.tone as 'danger'} title={String(p.title)} />,
      code: p => `<ConfirmDialog open={open} title="${p.title}" message="…" confirmLabel="${p.tone === 'danger' ? 'Delete User' : 'Publish'}"${p.tone === 'primary' ? ' tone="primary"' : ''} onCancel={close} onConfirm={run} />`,
    },
  },
  '/components/drawers': {
    staticComponent: 'Panel states are open, body scrolled (header shadow) and dirty; try the live preview.',
    anatomy: { render: () => <StaticPanel />, parts: [{ part: 'panel', label: 'Panel', spec: 'surface-overlay · 1px border-subtle start edge · shadow-drawer' }, { part: 'header', label: 'Header', spec: 'padding 20 24 · overlay-chrome · 1px border-subtle' }, { part: 'body', label: 'Body', spec: 'padding 24, scrolls, form grid 20/24' }, { part: 'footer', label: 'Footer', spec: 'padding 20 24 · 1px border-strong · secondary start, primary end' }] },
    playground: {
      controls: [{ kind: 'select', key: 'size', label: 'Size', options: ['sm', 'md', 'lg', 'xl'] }],
      initial: { size: 'md' },
      render: p => <PlayPanel size={p.size as 'md'} />,
      code: p => `<SlidePanel open={open} onClose={close} title="Edit Item" size="${p.size}" footer={…}>…</SlidePanel>`,
    },
  },
  '/components/tooltips-popovers': {
    staticComponent: 'Tooltip states are hidden / shown (hover after 300ms or focus) / dismissed (Escape); popovers are open / closed.',
    anatomy: { render: () => <span className="ds-tooltip ds-tooltip--static" data-part="container">Delete Jane Cooper</span>, parts: [{ part: 'container', label: 'Tooltip', spec: 'padding 6 10 · radius 8 · tooltip fill + border · 12/16 · max 280' }] },
    playground: {
      controls: [{ kind: 'text', key: 'text', label: 'Tooltip text' }, { kind: 'select', key: 'placement', label: 'Placement', options: ['top', 'bottom', 'right'] }],
      initial: { text: 'Workspace settings are shared by every member.', placement: 'top' },
      render: p => <PlayTip text={String(p.text)} placement={p.placement as 'top'} />,
      code: p => `<Tooltip content="${p.text}" placement="${p.placement}"><button>…</button></Tooltip>`,
    },
  },
  '/components/toasts': {
    staticComponent: 'States: visible (2500 / 5000ms, no timeout with an action), paused on hover / focus, replaced.',
    anatomy: { render: () => <div className="ds-toast doc-static-toast" data-part="container"><Icon icon={Info} size={16} />3 tasks archived<span className="ds-btn ds-btn--ghost ds-btn--sm">Undo</span></div>, parts: [{ part: 'container', label: 'Toast', spec: 'padding 10 16 · radius 8 · surface-card · 1px border-subtle · shadow-elevated · max 480' }] },
    playground: {
      controls: [{ kind: 'text', key: 'msg', label: 'Message' }, { kind: 'select', key: 'tone', label: 'Tone', options: ['neutral', 'error'] }, { kind: 'bool', key: 'action', label: 'Undo action' }],
      initial: { msg: 'Jane Cooper added', tone: 'neutral', action: false },
      render: p => <PlayToast msg={String(p.msg)} tone={p.tone as 'neutral'} action={!!p.action} />,
      code: p => `toast('${p.msg}'${p.tone === 'error' || p.action ? `, { ${[p.tone === 'error' ? "tone: 'error'" : '', p.action ? "action: { label: 'Undo', onAction: undo }" : ''].filter(Boolean).join(', ')} }` : ''});`,
    },
  },
};


function PlayEntity(p: Record<string, string | boolean>) {
  const m = [{ label: 'Open items', value: 8, of: 12 }, { label: 'Members', value: 30, of: 36 }, { label: 'Alerts', value: 11, of: 12 }, { label: 'Files', value: 42 }].slice(0, +p.metrics);
  return <div className="doc-narrow-xl"><EntityCard title={String(p.title)} subtitle="Northwind Labs · London" icon={<IconTile icon={FolderOpen} />} status={p.inactive ? { tone: 'error', label: 'Inactive' } : { tone: 'success', label: 'Active' }} owner="Jane Cooper" role="Project lead" when="12 May" whenCaption={p.inactive ? 'Inactive since' : 'Updated on'} metrics={m} inactive={!!p.inactive} onOpen={() => toast('Opens the detail page')} /></div>;
}
function PlayTable(p: Record<string, string | boolean>) {
  const [sel, setSel] = useState<Set<string>>(new Set());
  return (
    <section className="ds-table-card doc-full">
      <DataTable caption="Playground table" rowHeader="name" rowKey={e => e.id} rows={p.empty ? [] : employees.slice(0, 8)} columns={employeeColumns().slice(0, 5)}
        selectable={!!p.selectable} selected={sel} onSelect={setSel} rowName={e => e.name} maxHeight={p.capped ? 266 : undefined} loading={!!p.loading}
        rowTone={p.tints ? e => (e.status === 'Away' ? 'warning' : e.status === 'Inactive' ? 'critical' : undefined) : undefined} />
    </section>
  );
}
function PlayConfirm({ tone, title }: { tone: 'danger' | 'primary'; title: string }) {
  const [open, setOpen] = useState(false);
  return <><Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={() => setOpen(true)}>Open dialog</Button>
    <ConfirmDialog open={open} tone={tone} title={title} message={tone === 'danger' ? "This can't be undone." : 'Everyone in the workspace will see it.'} confirmLabel={tone === 'danger' ? 'Delete User' : 'Publish'} onCancel={() => setOpen(false)} onConfirm={() => { setOpen(false); toast('Done'); }} /></>;
}
function PlayPanel({ size }: { size: 'sm' | 'md' | 'lg' | 'xl' }) {
  const [open, setOpen] = useState(false);
  return <><Button onClick={() => setOpen(true)}>Open {size} panel</Button>
    <SlidePanel open={open} onClose={() => setOpen(false)} title="Edit Item" size={size} footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Save</Button></>}>
      <div className="ds-form-grid"><Field label="Name" required className="ds-span-2"><TextInput /></Field><Field label="Department"><Select options={depts} value={null} onChange={() => {}} /></Field></div>
    </SlidePanel></>;
}
function PlayTip({ text, placement }: { text: string; placement: 'top' | 'bottom' | 'right' }) {
  const ref = useRef<HTMLButtonElement>(null);
  return <Tooltip key={placement + text} content={text} placement={placement}><button ref={ref} type="button" className="ds-btn ds-btn--secondary">Hover or focus</button></Tooltip>;
}
function PlayToast({ msg, tone, action }: { msg: string; tone: 'neutral' | 'error'; action: boolean }) {
  return <Button variant="secondary" onClick={() => toast(msg, { tone, action: action ? { label: 'Undo', onAction: () => toast('Undone') } : undefined })}>Show toast</Button>;
}
