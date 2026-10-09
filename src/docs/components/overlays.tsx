import { useRef, useState } from 'react';
import { Info, Plus, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Button, IconButton } from '../../components/ds/Button';
import { ConfirmDialog, Modal, Popover, SlidePanel } from '../../components/ds/Overlay';
import { Field, TextInput, Textarea } from '../../components/ds/Field';
import { Select } from '../../components/ds/Select';
import { BinaryToggle } from '../../components/ds/Choice';
import { IconTile, Stepper } from '../../components/ds/Display';
import { toast } from '../../components/ds/Toast';
import { Tooltip } from '../../components/ds/Tooltip';
import { Cell, Grid } from '../kit';
import type { ComponentDoc } from '../ComponentPage';
import { DEPARTMENTS } from '../../data/sample';

function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Website relaunch');
  const [initial, setInitial] = useState(name);
  return (
    <>
      <Button variant="secondary" onClick={() => { setInitial(name); setOpen(true); }}>Rename Project</Button>
      <Modal open={open} onClose={() => { setName(initial); setOpen(false); }} title="Rename project" dirty={name !== initial}
        footer={<><Button variant="secondary" onClick={() => { setName(initial); setOpen(false); }}>Cancel</Button><Button onClick={() => { setOpen(false); toast('Project renamed'); }}>Save</Button></>}>
        <Field label="Project name" required><TextInput value={name} onChange={e => setName(e.target.value)} /></Field>
      </Modal>
    </>
  );
}
function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" leading={Trash2} onClick={() => setOpen(true)}>Delete User</Button>
      <ConfirmDialog open={open} title="Delete Jane Cooper?" message="Jane Cooper will lose access immediately. This can't be undone." confirmLabel="Delete User"
        onCancel={() => setOpen(false)} onConfirm={() => { setOpen(false); toast('Jane Cooper deleted', { action: { label: 'Undo', onAction: () => toast('Jane Cooper restored') } }); }} />
    </>
  );
}
export const modalDoc: ComponentDoc = {
  path: '/components/modals', title: 'Modals & Dialogs', refs: ['5.44', '5.45'], provenance: 'STANDARDIZED',
  summary: 'Overlays mount inside the main panel on desktop; everything else becomes inert. Backdrop clicks never close (R-21). Escape closes unless there are unsaved edits, which asks "Discard changes?". Confirmations are alertdialogs with Cancel focused.',
  preview: () => <div className="ds-cluster"><ModalDemo /><ConfirmDemo /></div>,
  variants: () => (
    <Grid min={300}>
      <Cell label="confirmation dialog (static render)">
        <div className="ds-dialog doc-static-dialog" role="presentation">
          <div className="ds-dialog__text"><p className="ds-text-dialog-title">Delete Jane Cooper?</p><p className="ds-text-body-muted">Jane Cooper will lose access immediately. This can't be undone.</p></div>
          <div className="ds-dialog__actions"><span className="ds-btn ds-btn--secondary">Cancel</span><span className="ds-btn ds-btn--danger">Delete User</span></div>
        </div>
      </Cell>
      <Cell label="generic modal [EXTENSION] (static render)">
        <div className="ds-modal doc-static-dialog" role="presentation">
          <div className="ds-modal__header"><p className="ds-text-dialog-title">Rename project</p></div>
          <div className="ds-modal__body"><p className="ds-text-body-muted">Body · padding 24 · scrolls</p></div>
          <div className="ds-modal__footer"><span className="ds-btn ds-btn--secondary">Cancel</span><span className="ds-btn ds-btn--primary">Save</span></div>
        </div>
      </Cell>
    </Grid>
  ),
  unsupported: ['closing on backdrop click (R-21)', 'enter/exit slide or scale animations (overlays appear instantly)', 'a larger dialog radius (single 20px surface radius, R-51)'],
  spec: [
    { property: 'Backdrop (modal)', token: '--ds-color-overlay-modal' },
    { property: 'Backdrop blur', token: '--ds-overlay-blur' },
    { property: 'Dialog max width', token: '--ds-size-dialog' },
    { property: 'Dialog padding / gap', token: '--ds-space-6' },
    { property: 'Radius', token: '--ds-radius-card' },
    { property: 'Border', token: '--ds-color-border-subtle' },
    { property: 'Shadow', token: '--ds-shadow-dialog' },
    { property: 'Z-index', token: '--ds-z-overlay' },
  ],
  behavior: <ul className="doc-list"><li>Open: store the opener, set <code>inert</code> on everything outside, move focus (first field / Cancel / close button).</li><li>Tab and Shift+Tab cycle inside. Escape: close, or ask to discard when dirty.</li><li>Close: remove <code>inert</code> and restore focus to the opener (or a fallback when it no longer exists).</li><li>Try it: open "Rename Project", edit the name, press Escape.</li></ul>,
  usage: `<ConfirmDialog open={open} title="Delete Jane Cooper?" message="…" confirmLabel="Delete User" onCancel={close} onConfirm={remove} />\n<Modal open={open} onClose={close} title="Rename project" dirty={changed} footer={…}>…</Modal>`,
};

function PanelDemo() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [dept, setDept] = useState<string | null>(null);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [submitted, setSubmitted] = useState(false);
  const nameErr = submitted && !name.trim() ? 'Enter a project name.' : undefined;
  const deptErr = submitted && !dept ? 'Choose a department.' : undefined;
  const firstField = useRef<HTMLInputElement>(null);
  const reset = () => { setStep(0); setName(''); setDept(null); setSubmitted(false); };
  const next = () => {
    setSubmitted(true);
    if (!name.trim() || !dept) { window.setTimeout(() => document.querySelector<HTMLElement>('.ds-panel [aria-invalid="true"]')?.focus(), 0); return; }
    if (step < 2) { setStep(step + 1); setSubmitted(false); } else { setOpen(false); reset(); toast(`${name} created`); }
  };
  return (
    <>
      <Button leading={Plus} onClick={() => setOpen(true)}>New Project</Button>
      <SlidePanel open={open} onClose={() => { setOpen(false); reset(); }} title="New Project" size="xl" dirty={!!name || !!dept} initialFocus={firstField}
        icon={<IconTile icon={Plus} size={32} />} subheader={<Stepper current={step} steps={[{ title: 'Basics', sub: 'In progress' }, { title: 'Team', sub: 'Members & roles' }, { title: 'Review', sub: 'Summary' }]} />}
        footer={<><Button variant="secondary" onClick={() => (step ? setStep(step - 1) : (setOpen(false), reset()))}>{step ? 'Back' : 'Cancel'}</Button><Button minWidth onClick={next}>{step < 2 ? 'Next' : 'Create Project'}</Button></>}>
        <div className="ds-form-grid">
          <Field label="Project name" required error={nameErr} className="ds-span-2"><TextInput ref={firstField} value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Website relaunch" /></Field>
          <Field label="Department" required error={deptErr}><Select options={DEPARTMENTS.map(d => ({ value: d, label: d }))} value={dept} onChange={setDept} placeholder="Choose department" /></Field>
          <Field label="Budget"><TextInput suffix="USD" inputMode="numeric" placeholder="E.g. 25000" /></Field>
          <Field label="Description" className="ds-span-2"><Textarea placeholder="What is this project about?" /></Field>
          <div className="ds-field"><span className="ds-field__label" id="pstat">Status</span><BinaryToggle labelId="pstat" value={status} onChange={setStatus} options={[{ value: 'active', label: 'Active', dot: 'success' }, { value: 'inactive', label: 'Inactive', dot: 'error' }]} /></div>
        </div>
      </SlidePanel>
    </>
  );
}
export const drawerDoc: ComponentDoc = {
  path: '/components/drawers', title: 'Drawers & Slide Panels', refs: ['5.46'], provenance: 'STANDARDIZED',
  summary: 'The default surface for creating or editing a record from a list. Widths 480 / 560 / 680 / 820 are maximums. Header gains a shadow while the body scrolls; the footer keeps secondary on the start side and primary on the end side.',
  preview: () => <PanelDemo />,
  variants: () => (
    <Grid min={200}>
      {(['sm', 'md', 'lg', 'xl'] as const).map(s => <Cell key={s} label={`${s}`} note={{ sm: '480 · simple', md: '560 · single column ≤5 fields', lg: '680 · mixed rows', xl: '820 · two-column / wizard' }[s]}><PanelSize size={s} /></Cell>)}
    </Grid>
  ),
  spec: [
    { property: 'Widths (max)', token: '--ds-size-panel-sm + --ds-size-panel-md + --ds-size-panel-lg + --ds-size-panel-xl' },
    { property: 'Body fill', token: '--ds-color-surface-overlay' },
    { property: 'Header / footer fill', token: '--ds-color-surface-overlay-chrome' },
    { property: 'Edge / shadow', token: '--ds-color-border-subtle + --ds-shadow-drawer' },
    { property: 'Backdrop', token: '--ds-color-overlay-panel' },
    { property: 'Header / footer padding', token: '--ds-space-5 + --ds-space-6' },
    { property: 'Form grid', token: '--ds-space-form-col + --ds-space-form-row' },
  ],
  behavior: <ul className="doc-list"><li>Try: open the panel, press Next with empty fields (errors appear, focus moves to the first invalid field), type a name, then press Escape to see the discard confirmation.</li></ul>,
  usage: `<SlidePanel open={open} onClose={close} title="New Project" size="xl" dirty={dirty} footer={…}>\n  <div className="ds-form-grid">…</div>\n</SlidePanel>`,
};
function PanelSize({ size }: { size: 'sm' | 'md' | 'lg' | 'xl' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Open {size}</Button>
      <SlidePanel open={open} onClose={() => setOpen(false)} title={`Panel ${size}`} size={size} footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Save</Button></>}>
        <p className="ds-text-body-muted">This panel is <code>min(var(--ds-size-panel-{size}), 100%)</code> wide.</p>
      </SlidePanel>
    </>
  );
}

function PopoverDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [region, setRegion] = useState<string | null>(null);
  return (
    <div className="ds-select">
      <Button ref={ref} variant="secondary" leading={SlidersHorizontal} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(o => !o)}>Filters</Button>
      <Popover open={open} onClose={() => setOpen(false)} label="Filters" anchorRef={ref} align="start" width="sm"
        footer={<><Button variant="ghost" size="sm" onClick={() => { setRegion(null); setOpen(false); ref.current?.focus(); }}>Clear</Button><Button size="sm" onClick={() => { setOpen(false); ref.current?.focus(); toast('Filters applied'); }}>Apply</Button></>}>
        <Field label="Region"><Select options={['Europe', 'Africa', 'Americas', 'Asia Pacific'].map(r => ({ value: r, label: r }))} value={region} onChange={setRegion} placeholder="Any region" /></Field>
      </Popover>
    </div>
  );
}
export const tooltipDoc: ComponentDoc = {
  path: '/components/tooltips-popovers', title: 'Tooltips & Popovers', refs: ['5.49', '5.47'], provenance: 'STANDARDIZED', derivedCss: true,
  summary: 'Label tooltips show after 300ms hover and immediately on keyboard focus, stay while the pointer is over them, and close on Escape or blur (SC 1.4.13). title is never the only source. Popovers hold small forms or details: non-modal dialogs that close on Escape or outside click.',
  preview: () => (
    <div className="ds-cluster">
      <Tooltip content="Workspace settings are shared by every member."><button type="button" className="ds-btn ds-btn--ghost"><Info size={14} aria-hidden="true" />Hover or focus me</button></Tooltip>
      <IconButton icon={Trash2} label="Delete Jane Cooper" size="sm" />
      <PopoverDemo />
    </div>
  ),
  variants: () => (
    <Grid min={280}>
      <Cell label="label tooltip (static render)"><span className="ds-tooltip ds-tooltip--static">Delete Jane Cooper</span></Cell>
      <Cell label="rich chart tooltip — see Data Visualization"><a className="ds-link-action" href="#/charts/tooltips-legends">Chart tooltips & legends</a></Cell>
      <Cell label="popover (form)"><PopoverDemo /></Cell>
    </Grid>
  ),
  unsupported: ['interactive content inside tooltips (use a popover)', 'tooltips as the only source of essential information on touch'],
  spec: [
    { property: 'Fill / border', token: '--ds-color-surface-tooltip + --ds-color-border-tooltip' },
    { property: 'Text', token: '--ds-color-text-tooltip', note: ' small 12/16' },
    { property: 'Radius / shadow', token: '--ds-radius-sm + --ds-shadow-tooltip' },
    { property: 'Padding', token: '--ds-space-1-5 + --ds-space-2-5' },
    { property: 'Max width', value: '280px' },
    { property: 'Popover radius / shadow', token: '--ds-radius-control + --ds-shadow-menu' },
    { property: 'Z-index tooltip / popover', token: '--ds-z-tooltip + --ds-z-menu' },
  ],
  usage: `<Tooltip content="Delete Jane Cooper"><button aria-label="Delete Jane Cooper">…</button></Tooltip>\n<Popover open={open} onClose={close} label="Filters" anchorRef={triggerRef}>…</Popover>`,
};

export const toastDoc: ComponentDoc = {
  path: '/components/toasts', title: 'Toasts', refs: ['5.48'], provenance: 'STANDARDIZED',
  summary: 'One at a time, in a persistent role="status" region at the top of the main panel (bottom at xs). 2500ms (5000ms errors), paused on hover/focus. Toasts with an action never time out (SC 2.2.1).',
  preview: () => (
    <div className="ds-cluster">
      <Button variant="secondary" onClick={() => toast('Jane Cooper added')}>Neutral toast</Button>
      <Button variant="secondary" onClick={() => toast("Couldn't copy: clipboard access blocked", { tone: 'error' })}>Error toast</Button>
      <Button variant="secondary" onClick={() => toast('3 tasks archived', { action: { label: 'Undo', onAction: () => toast('3 tasks restored') } })}>Toast with Undo</Button>
    </div>
  ),
  variants: () => (
    <Grid min={260}>
      <Cell label="neutral (static render)"><div className="ds-toast doc-static-toast">Jane Cooper added</div></Cell>
      <Cell label="error [EXTENSION] (static render)"><div className="ds-toast ds-toast--error doc-static-toast"><Info size={16} aria-hidden="true" />Couldn't copy</div></Cell>
    </Grid>
  ),
  spec: [{ property: 'Fill / border', token: '--ds-color-surface-card + --ds-color-border-subtle' }, { property: 'Shadow', token: '--ds-shadow-elevated' }, { property: 'Radius', token: '--ds-radius-sm' }, { property: 'Padding', token: '--ds-space-2-5 + --ds-space-4' }, { property: 'Z-index', token: '--ds-z-toast' }],
  usage: `toast('Jane Cooper added');\ntoast("Couldn't save", { tone: 'error' });\ntoast('3 tasks archived', { action: { label: 'Undo', onAction: undo } });`,
};
