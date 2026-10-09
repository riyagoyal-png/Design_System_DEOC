import { useState } from 'react';
import { ArrowLeft, ChevronRight, Copy, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, IconButton, LinkAction, type ButtonSize, type ButtonVariant } from '../../components/ds/Button';
import { toast } from '../../components/ds/Toast';
import { Cell, Grid, attrs } from '../kit';
import type { ComponentDoc } from '../ComponentPage';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'tonal', 'ghost', 'danger'];

function LoadingDemo() {
  const [busy, setBusy] = useState(false);
  return <Button loading={busy} onClick={() => { setBusy(true); window.setTimeout(() => { setBusy(false); toast('Changes saved'); }, 1500); }}>Save Changes</Button>;
}

export const buttonDoc: ComponentDoc = {
  path: '/components/buttons', title: 'Buttons', refs: ['5.1'], provenance: 'OBSERVED',
  summary: 'Triggers an action. One primary button per view region. Labels are verb-first title case; the label wraps instead of clipping, and the width is content-driven.',
  preview: () => (
    <div className="ds-cluster">
      <Button leading={Plus}>Add Item</Button>
      <Button variant="secondary" leading={ArrowLeft}>Back</Button>
      <LoadingDemo />
    </div>
  ),
  variants: () => (
    <>
      <Grid min={180}>{VARIANTS.map(v => <Cell key={v} label={v}><Button variant={v}>{v === 'danger' ? 'Delete User' : v === 'primary' ? 'Save' : 'Cancel'}</Button></Cell>)}</Grid>
      <Grid min={180}>
        {(['sm', 'md', 'lg'] as ButtonSize[]).map(s => <Cell key={s} label={`size ${s}`} note={s === 'sm' ? 'min-height 28 · 12/16' : s === 'md' ? 'min-height 40 · 14/20' : 'min-height 48 · 16/22'}><Button size={s} leading={Plus}>Add Item</Button></Cell>)}
        <Cell label="Trailing chevron (Next)"><Button trailing={ChevronRight}>Next</Button></Cell>
        <Cell label="Optional 180px min-width"><Button minWidth leading={Plus}>Add</Button></Cell>
        <Cell label="Long label wraps (R-52)" note="Never clipped"><div className="doc-narrow"><Button variant="secondary">Export selected records as spreadsheet</Button></div></Cell>
      </Grid>
    </>
  ),
  unsupported: ['outline / link-styled buttons (use §5.3 link action)', 'icon-only text buttons (use §5.2 icon button)', 'pill-shaped buttons'],
  states: () => (
    <Grid min={170}>
      {VARIANTS.flatMap(v => [
        <Cell key={v + 'd'} label={`${v} · default`}><Button variant={v}>Action</Button></Cell>,
        <Cell key={v + 'h'} label={`${v} · hover`}><Button variant={v} className="is-hover">Action</Button></Cell>,
        <Cell key={v + 'f'} label={`${v} · focus-visible`}><Button variant={v} className="is-focus-visible">Action</Button></Cell>,
        <Cell key={v + 'x'} label={`${v} · disabled`}><Button variant={v} disabled>Action</Button></Cell>,
      ])}
      <Cell label="primary · loading" note="aria-busy, spinner replaces the icon"><Button loading>Saving</Button></Cell>
      <Cell label="aria-disabled + reason" note="Stays focusable"><span className="doc-stack-sm"><Button softDisabled aria-describedby="why">Save</Button><span id="why" className="ds-text-small">Complete all required fields to save.</span></span></Cell>
    </Grid>
  ),
  anatomy: {
    render: () => <Button leading={Plus} trailing={ChevronRight}>Add Item</Button>,
    parts: [
      { part: 'container', label: 'Container', spec: 'min-height 40 (size-control) · padding 0 16 · radius 10 · 1px border · gap 8' },
      { part: 'leading', label: 'Leading icon', spec: '14px plus / 20px back arrow, currentColor' },
      { part: 'label', label: 'Label', spec: 'button-md 14/20 600; wraps when constrained' },
      { part: 'trailing', label: 'Trailing icon', spec: '14px chevron pointing right' },
    ],
  },
  spec: [
    { property: 'Min height (md / sm / lg)', token: '--ds-size-control + --ds-size-control-sm + --ds-size-control-lg' },
    { property: 'Horizontal padding (md)', token: '--ds-space-4' },
    { property: 'Radius', token: '--ds-radius-control' },
    { property: 'Icon → label gap', token: '--ds-space-2' },
    { property: 'Typography', token: '--ds-font-size-body + --ds-line-height-body', note: ' weight 600' },
    { property: 'Primary fill / hover', token: '--ds-color-brand-strong + --ds-color-brand-stronger' },
    { property: 'Primary border', token: '--ds-color-brand' },
    { property: 'Primary glow', token: '--ds-shadow-button-primary' },
    { property: 'Secondary fill', token: '--ds-gradient-button-secondary' },
    { property: 'Secondary border / hover', token: '--ds-color-border-control + --ds-color-border-control-hover' },
    { property: 'Tonal fill / hover / text', token: '--ds-color-brand-tint-20 + --ds-color-brand-tint-30 + --ds-color-brand-text' },
    { property: 'Ghost hover fill', token: '--ds-color-surface-hover' },
    { property: 'Danger fill / border / text', token: '--ds-color-error-bg + --ds-color-error-border + --ds-color-error-text' },
    { property: 'Optional min width', token: '--ds-size-header-button' },
    { property: 'Transition', token: '--ds-duration-fast + --ds-ease-standard' },
    { property: 'Disabled', value: 'opacity 0.4', note: ' (§2.2 Disabled)' },
  ],
  playground: {
    controls: [
      { kind: 'select', key: 'variant', label: 'Variant', options: VARIANTS },
      { kind: 'select', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'text', key: 'label', label: 'Label' },
      { kind: 'select', key: 'icon', label: 'Icon', options: ['none', 'leading plus', 'leading back', 'trailing chevron'] },
      { kind: 'bool', key: 'disabled', label: 'Disabled' },
      { kind: 'bool', key: 'loading', label: 'Loading' },
      { kind: 'bool', key: 'minWidth', label: 'Min width 180' },
    ],
    initial: { variant: 'primary', size: 'md', label: 'Add Item', icon: 'leading plus', disabled: false, loading: false, minWidth: false },
    render: p => (
      <Button variant={p.variant as ButtonVariant} size={p.size as ButtonSize} disabled={!!p.disabled} loading={!!p.loading} minWidth={!!p.minWidth}
        leading={p.icon === 'leading plus' ? Plus : p.icon === 'leading back' ? ArrowLeft : undefined} trailing={p.icon === 'trailing chevron' ? ChevronRight : undefined}>
        {String(p.label) || 'Action'}
      </Button>
    ),
    code: p => `<Button${attrs({ variant: p.variant !== 'primary' ? String(p.variant) : undefined, size: p.size !== 'md' ? String(p.size) : undefined })}${p.icon === 'leading plus' ? ' leading={Plus}' : p.icon === 'leading back' ? ' leading={ArrowLeft}' : p.icon === 'trailing chevron' ? ' trailing={ChevronRight}' : ''}${attrs({ disabled: !!p.disabled, loading: !!p.loading, minWidth: !!p.minWidth })}>\n  ${p.label}\n</Button>`,
  },
  usage: `import { Button } from './components/ds/Button';\n\n<Button leading={Plus} onClick={add}>Add Item</Button>\n<Button variant="secondary">Cancel</Button>\n<Button loading>Saving</Button>\n<Button softDisabled aria-describedby="save-hint">Save</Button>`,
  behavior: <ul className="doc-list"><li>Uses <code>&lt;button type="button"&gt;</code> unless it submits a form.</li><li>Loading sets <code>aria-busy</code> and ignores activation; <code>softDisabled</code> uses <code>aria-disabled</code> so a reason can be attached and the button stays focusable.</li><li>Footer pattern: secondary on the start side, primary on the end side.</li></ul>,
};

export const iconButtonDoc: ComponentDoc = {
  path: '/components/icon-buttons', title: 'Icon Buttons', refs: ['5.2'], provenance: 'OBSERVED',
  summary: 'Icon-only actions for rows, back, close and expand. Every icon button has an aria-label (verb + object) and shows the same text in a tooltip on hover and keyboard focus.',
  preview: () => (
    <div className="ds-cluster">
      <IconButton icon={Copy} label="Copy Jane Cooper's email" size="sm" onClick={() => toast('Email copied')} />
      <IconButton icon={Pencil} label="Edit Jane Cooper" size="sm" />
      <IconButton icon={Trash2} label="Delete Jane Cooper" size="sm" />
      <IconButton icon={ArrowLeft} label="Back to Projects" iconSize={24} />
      <IconButton icon={Plus} label="Close panel" variant="close" tooltip={false} />
    </div>
  ),
  variants: () => (
    <Grid min={180}>
      <Cell label="sm · row action" note="28 × 28, 20px icon"><IconButton icon={Pencil} label="Edit row" size="sm" /></Cell>
      <Cell label="md · default" note="36 × 36"><IconButton icon={ArrowLeft} label="Back" iconSize={24} /></Cell>
      <Cell label="sunken close" note="36 × 36, sunken"><IconButton icon={Plus} label="Close" variant="close" tooltip={false} /></Cell>
      <Cell label="open / view (link color)" note="#2563eb allowed for navigation"><button type="button" className="ds-icon-btn ds-icon-btn--sm ds-icon-btn--open" aria-label="Open record"><ExternalLink size={20} strokeWidth={1.5} aria-hidden="true" /></button></Cell>
    </Grid>
  ),
  states: () => (
    <Grid min={150}>
      <Cell label="default"><IconButton icon={Pencil} label="Edit" size="sm" tooltip={false} /></Cell>
      <Cell label="hover"><IconButton icon={Pencil} label="Edit" size="sm" className="is-hover" tooltip={false} /></Cell>
      <Cell label="focus-visible"><IconButton icon={Pencil} label="Edit" size="sm" className="is-focus-visible" tooltip={false} /></Cell>
      <Cell label="disabled"><IconButton icon={Pencil} label="Edit" size="sm" disabled tooltip={false} /></Cell>
      <Cell label="close · hover"><IconButton icon={Plus} label="Close" variant="close" className="is-hover" tooltip={false} /></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Size md / sm', token: '--ds-size-icon-button + --ds-size-control-sm' },
    { property: 'Radius', token: '--ds-radius-sm' },
    { property: 'Icon color → hover', token: '--ds-color-icon + --ds-color-text-primary' },
    { property: 'Hover fill', token: '--ds-color-surface-hover' },
    { property: 'Close: fill / border / shadow', token: '--ds-color-surface-sunken-button + --ds-color-border-subtle + --ds-shadow-sunken-button' },
    { property: 'Row action gap', token: '--ds-space-3' },
  ],
  playground: {
    controls: [
      { kind: 'select', key: 'size', label: 'Size', options: ['sm', 'md'] },
      { kind: 'select', key: 'icon', label: 'Icon', options: ['edit', 'delete', 'copy', 'back'] },
      { kind: 'text', key: 'label', label: 'aria-label' },
      { kind: 'bool', key: 'disabled', label: 'Disabled' },
    ],
    initial: { size: 'sm', icon: 'edit', label: 'Edit Jane Cooper', disabled: false },
    render: p => <IconButton icon={{ edit: Pencil, delete: Trash2, copy: Copy, back: ArrowLeft }[String(p.icon) as 'edit']} label={String(p.label) || 'Action'} size={p.size as 'sm'} disabled={!!p.disabled} />,
    code: p => `<IconButton icon={${{ edit: 'Pencil', delete: 'Trash2', copy: 'Copy', back: 'ArrowLeft' }[String(p.icon) as 'edit']}} label="${p.label}"${p.size === 'sm' ? ' size="sm"' : ''}${p.disabled ? ' disabled' : ''} />`,
  },
  usage: `<IconButton icon={Pencil} label="Edit Jane Cooper" size="sm" onClick={edit} />`,
};

export const linkActionDoc: ComponentDoc = {
  path: '/components/link-action', title: 'Link Action', refs: ['5.3'], provenance: 'STANDARDIZED',
  summary: 'A low-weight inline action inside a form or card. Blue text uses the link token (#60a5fa, 6.24:1), never the brand blue.',
  preview: () => <LinkAction icon={Plus} onClick={() => toast('Add form opened')}>Add New User</LinkAction>,
  variants: () => <Grid><Cell label="with leading icon"><LinkAction icon={Plus}>Add New User</LinkAction></Cell><Cell label="text only"><LinkAction>View all activity</LinkAction></Cell></Grid>,
  states: () => (
    <Grid min={160}>
      <Cell label="default"><LinkAction icon={Plus}>Add New</LinkAction></Cell>
      <Cell label="hover"><LinkAction icon={Plus} className="is-hover">Add New</LinkAction></Cell>
      <Cell label="focus-visible"><LinkAction icon={Plus} className="is-focus-visible">Add New</LinkAction></Cell>
      <Cell label="disabled"><LinkAction icon={Plus} disabled className="doc-disabled">Add New</LinkAction></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Text', token: '--ds-color-link', note: ' 14/20 600' },
    { property: 'Hover', token: '--ds-color-link-hover' },
    { property: 'Gap', token: '--ds-space-2' },
    { property: 'Focus radius', token: '--ds-radius-xs' },
  ],
  usage: `<LinkAction icon={Plus} onClick={openAdd}>Add New User</LinkAction>`,
};

export const actionGroupDoc: ComponentDoc = {
  path: '/components/action-group', title: 'Action Group', refs: ['5.4'], provenance: 'OBSERVED', derivedCss: true,
  summary: 'Horizontal sets of related controls. The context defines gap, alignment and order; the split button is an extension.',
  preview: () => (
    <div className="doc-stack">
      <div className="ds-cluster doc-end"><Button variant="secondary">Cancel</Button><Button variant="danger">Delete User</Button></div>
      <div className="doc-footer-demo"><Button variant="secondary" leading={ArrowLeft}>Back</Button><Button trailing={ChevronRight} minWidth>Next</Button></div>
    </div>
  ),
  variants: () => (
    <Grid min={280}>
      <Cell label="Dialog actions · gap 12 · end"><div className="ds-cluster doc-end"><Button variant="secondary">Cancel</Button><Button>Confirm</Button></div></Cell>
      <Cell label="Panel footer · space-between"><div className="doc-footer-demo"><Button variant="secondary" leading={ArrowLeft}>Back</Button><Button>Save</Button></div></Cell>
      <Cell label="Row actions · gap 12 · end"><div className="ds-row-actions"><IconButton icon={Copy} label="Copy" size="sm" /><IconButton icon={Pencil} label="Edit" size="sm" /><IconButton icon={Trash2} label="Delete" size="sm" /></div></Cell>
      <Cell label="Popover footer"><div className="doc-footer-demo"><Button variant="ghost" size="sm">Clear</Button><Button size="sm">Apply</Button></div></Cell>
      <Cell label="Split button [EXTENSION]"><div className="ds-split"><Button>Export</Button><button type="button" className="ds-btn ds-btn--primary ds-split__toggle" aria-label="More export options" aria-haspopup="menu"><ChevronRight size={14} className="ds-rot90" aria-hidden="true" /></button></div></Cell>
    </Grid>
  ),
  spec: [
    { property: 'Header / dialog / row gap', token: '--ds-space-3' },
    { property: 'Card header gap', token: '--ds-space-4' },
    { property: 'Footer min width (optional)', token: '--ds-size-header-button' },
  ],
  usage: `<div className="ds-dialog__actions">\n  <Button variant="secondary">Cancel</Button>\n  <Button variant="danger">Delete User</Button>\n</div>`,
};
