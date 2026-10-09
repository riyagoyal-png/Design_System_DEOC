import { useMemo, useRef, useState } from 'react';
import { Bell, Briefcase, CalendarDays, ChevronRight, FolderKanban, KeyRound, ListTodo, Plus, ShieldCheck, SlidersHorizontal, UserCircle2, UserPlus, Users } from 'lucide-react';
import { AppShell } from './AppShell';
import { Button } from '../components/ds/Button';
import { Field, SearchInput, Textarea, TextInput } from '../components/ds/Field';
import { MultiSelect, Select } from '../components/ds/Select';
import { BinaryToggle, RadioCards, Switch } from '../components/ds/Choice';
import { RichPicker } from '../components/ds/Inputs2';
import { ConfirmDialog, SlidePanel } from '../components/ds/Overlay';
import { DataTable, sortRows, TableCard, type Sort } from '../components/ds/Table';
import { Pagination, TabPanel, Tabs } from '../components/ds/Nav';
import { Callout, IconTile, InlineAlert, Metric, Progress, Status, Stepper } from '../components/ds/Display';
import { EntityCard, KpiCard, SummaryStrip } from '../components/ds/Cards';
import { Icon } from '../components/ds/Icon';
import { toast } from '../components/ds/Toast';
import { employeeColumns } from '../docs/components/data';
import { DEPARTMENTS, employees as seed, people, projects, tasks, type Employee } from '../data/sample';

const user = { name: 'Jane Cooper', role: 'Administrator' };

/* ── Employee management (§12.2) ─────────────────────────────────── */
export function EmployeesApp() {
  const [rows, setRows] = useState<Employee[]>(seed);
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('all');
  const [status, setStatus] = useState('all');
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState<Sort>({ key: 'name', dir: 'ascending' });
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Employee | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const size = 8;
  const reset = () => setPage(1);
  const filtered = useMemo(() => rows.filter(e =>
    (tab === 'all' || e.department === tab) && (dept === 'all' || e.department === dept) && (status === 'all' || e.status.toLowerCase() === status)
    && `${e.name} ${e.email} ${e.team} ${e.role}`.toLowerCase().includes(q.toLowerCase())), [rows, tab, dept, status, q]);
  const cols = employeeColumns({ open: true, onEdit: e => setEditing(e), onDelete: setDeleting });
  const sorted = sortRows(filtered, sort, cols);
  const pageRows = sorted.slice((page - 1) * size, page * size);
  const counts = (d: string) => rows.filter(e => d === 'all' || e.department === d).length;
  const sections = [{ label: 'General', items: [{ id: 'people', label: 'Employees', icon: <Icon icon={Users} size={24} /> }] }];
  const filtersActive = q || dept !== 'all' || status !== 'all';
  const save = (e: Employee) => {
    setRows(r => (r.some(x => x.id === e.id) ? r.map(x => (x.id === e.id ? e : x)) : [e, ...r]));
    toast(editing === 'new' ? `${e.name} added` : `${e.name} updated`);
    setEditing(null);
  };
  return (
    <AppShell product="Crew" tagline="People directory" logo={<Icon icon={UserCircle2} size={20} />} sections={sections} current="people" onNavigate={() => {}} user={user}
      title="Employees" actions={<>
        <SearchInput value={q} onValueChange={v => { setQ(v); reset(); }} label="Search employees" placeholder="Search by name, email, team or role" width="lg" />
        <Select variant="filter" label="Department" className="ds-select--180" value={dept} onChange={v => { setDept(v); reset(); }} options={[{ value: 'all', label: 'All Departments' }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]} />
        <Select variant="filter" label="Status" className="ds-select--160" value={status} onChange={v => { setStatus(v); reset(); }} options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active', dot: 'success' }, { value: 'away', label: 'Away', dot: 'warning' }, { value: 'inactive', label: 'Inactive', dot: 'error' }]} />
        {filtersActive && <Button variant="ghost" onClick={() => { setQ(''); setDept('all'); setStatus('all'); reset(); }}>Clear filters</Button>}
        <Button leading={UserPlus} minWidth onClick={() => setEditing('new')}>Add Employee</Button>
      </>}>
      <Tabs idBase="emp" controls label="Filter by department" value={tab} onChange={v => { setTab(v); reset(); }} tabs={[{ value: 'all', label: 'All Employees', count: counts('all') }, ...DEPARTMENTS.slice(0, 3).map(d => ({ value: d, label: d, count: counts(d) }))]} />
      <TabPanel idBase="emp" value={tab}>
        <TableCard title="Directory" titleId="dir-t" count={filtered.length}
          bulk={sel.size ? <div className="ds-bulkbar"><span className="ds-text-body-strong" role="status">{sel.size} selected</span><div className="ds-bulkbar__actions">
            <Button size="sm" variant="secondary" onClick={() => { setRows(r => r.map(x => (sel.has(x.id) ? { ...x, status: 'Inactive' } : x))); toast(`${sel.size} employees deactivated`); setSel(new Set()); }}>Deactivate</Button>
            <Button size="sm" variant="ghost" onClick={() => setSel(new Set())}>Clear selection</Button></div></div> : undefined}>
          <DataTable caption="Employees" labelledBy="dir-t" rowHeader="name" columns={cols} rows={pageRows} rowKey={e => e.id} sort={sort} onSort={s => { setSort(s); reset(); }}
            selectable selected={sel} onSelect={setSel} rowName={e => e.name} minWidth={900} empty={filtersActive ? 'No employees match your filters.' : 'No employees yet.'} />
          <Pagination page={page} pageSize={size} total={filtered.length} noun="employees" onPage={setPage} />
        </TableCard>
      </TabPanel>
      <EmployeePanel key={editing === 'new' ? 'new' : editing?.id ?? 'none'} employee={editing} onClose={() => setEditing(null)} onSave={save} />
      <ConfirmDialog open={!!deleting} title={`Delete ${deleting?.name}?`} message={`${deleting?.name} will lose access immediately. This can't be undone.`} confirmLabel="Delete Employee"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          const d = deleting!; const idx = sorted.findIndex(x => x.id === d.id);
          setRows(r => r.filter(x => x.id !== d.id)); setDeleting(null); toast(`${d.name} deleted`);
          window.setTimeout(() => { const links = document.querySelectorAll<HTMLElement>('#app-main .ds-row-link'); (links[Math.min(idx % size, links.length - 1)] ?? document.getElementById('dir-t'))?.focus(); }, 50);
        }} />
    </AppShell>
  );
}

function EmployeePanel({ employee, onClose, onSave }: { employee: Employee | 'new' | null; onClose: () => void; onSave: (e: Employee) => void }) {
  const base = employee && employee !== 'new' ? employee : null;
  const [f, setF] = useState({ name: base?.name ?? '', email: base?.email ?? '', department: base?.department ?? null as string | null, manager: null as string | null, start: '', status: base?.status === 'Inactive' ? 'inactive' : 'active' });
  const [submitted, setSubmitted] = useState(false);
  const errs = {
    name: !f.name.trim() ? 'Enter a full name.' : undefined,
    email: !/^\S+@\S+\.\S+$/.test(f.email) ? 'Enter a valid email address.' : undefined,
    department: !f.department ? 'Choose a department.' : undefined,
  };
  const show = (k: keyof typeof errs) => (submitted ? errs[k] : undefined);
  const dirty = !!(f.name !== (base?.name ?? '') || f.email !== (base?.email ?? '') || f.department !== (base?.department ?? null));
  const first = useRef<HTMLInputElement>(null);
  const submit = () => {
    setSubmitted(true);
    if (Object.values(errs).some(Boolean)) { window.setTimeout(() => document.querySelector<HTMLElement>('.ds-panel [aria-invalid="true"]')?.focus(), 0); return; }
    onSave({ ...(base ?? { id: `EMP-${3000 + Math.floor(Math.random() * 900)}`, role: 'Engineer', team: 'Core', location: 'London', openTasks: 0, lastActive: 'Today', lastActiveDays: 0 }),
      name: f.name.trim(), email: f.email, department: f.department!, status: f.status === 'active' ? 'Active' : 'Inactive' } as Employee);
  };
  return (
    <SlidePanel open={!!employee} onClose={onClose} title={base ? `Edit ${base.name}` : 'Add Employee'} size="xl" dirty={dirty} initialFocus={first} icon={<IconTile icon={UserPlus} size={32} />}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button minWidth onClick={submit}>{base ? 'Save Changes' : 'Add Employee'}</Button></>}>
      <form className="ds-form-grid" noValidate onSubmit={e => { e.preventDefault(); submit(); }}>
        <Field label="Full name" required error={show('name')}><TextInput ref={first} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} autoComplete="name" /></Field>
        <Field label="Email" required error={show('email')}><TextInput type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} autoComplete="email" /></Field>
        <Field label="Department" required error={show('department')}><Select options={DEPARTMENTS.map(d => ({ value: d, label: d }))} value={f.department} onChange={v => setF({ ...f, department: v })} placeholder="Choose department" /></Field>
        <Field label="Start date"><TextInput type="date" value={f.start} onChange={e => setF({ ...f, start: e.target.value })} className="ds-input--date" /></Field>
        <Field label="Manager" className="ds-span-2"><RichPicker people={people} value={f.manager} onChange={v => setF({ ...f, manager: v })} /></Field>
        <div className="ds-field"><span className="ds-field__label" id="emp-status">Status</span>
          <BinaryToggle labelId="emp-status" value={f.status} onChange={v => setF({ ...f, status: v })} options={[{ value: 'active', label: 'Active', dot: 'success' }, { value: 'inactive', label: 'Inactive', dot: 'error' }]} /></div>
        <button type="submit" hidden />
      </form>
    </SlidePanel>
  );
}

/* ── Project management (§12.3) ──────────────────────────────────── */
export function ProjectsApp() {
  const [view, setView] = useState('projects');
  const [open, setOpen] = useState<string | null>(null);
  const [wizard, setWizard] = useState(false);
  const [taskTab, setTaskTab] = useState('To do');
  const sections = [{ label: 'General', items: [
    { id: 'projects', label: 'Projects', icon: <Icon icon={FolderKanban} size={24} /> },
    { id: 'tasks', label: 'My Tasks', icon: <Icon icon={ListTodo} size={24} /> },
  ] }];
  const project = projects.find(p => p.id === open);
  const taskRows = (list: typeof tasks) => (
    <DataTable caption="Tasks" rowHeader="title" rowKey={t => t.id} rows={list}
      columns={[
        { key: 'title', header: 'Task', render: t => <span className="doc-two-line">{t.title}<span className="ds-text-small">{t.id}</span></span> },
        { key: 'project', header: 'Project', shrink: true }, { key: 'assignee', header: 'Assignee', shrink: true },
        { key: 'priority', header: 'Priority', shrink: true, render: t => <Status tone={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : 'success'}>{t.priority}</Status> },
        { key: 'due', header: 'Due', shrink: true },
      ]} empty="No tasks in this state." />
  );
  return (
    <AppShell product="Northstar" tagline="Project management" logo={<Icon icon={Briefcase} size={20} />} sections={sections} current={view} onNavigate={v => { setView(v); setOpen(null); }} user={user}
      title={project ? project.name : view === 'projects' ? 'Projects' : 'My Tasks'} back={project ? { label: 'Projects', onBack: () => setOpen(null) } : undefined}
      actions={project ? <Button variant="secondary" onClick={() => toast('Edit project panel opens here')}>Edit Project</Button> : view === 'projects' ? <Button leading={Plus} minWidth onClick={() => setWizard(true)}>New Project</Button> : undefined}>
      {view === 'projects' && !project && <>
        <div className="ds-kpi-row app-kpis">
          <KpiCard label="Active Projects" value={projects.length} icon={<IconTile icon={FolderKanban} />} />
          <KpiCard label="Open Tasks" value={projects.reduce((s, p) => s + p.tasks - p.done, 0)} icon={<IconTile icon={ListTodo} />} />
          <KpiCard label="At Risk" value={projects.filter(p => p.status !== 'On track').length} icon={<IconTile icon={ShieldCheck} tone="warning" />} />
          <KpiCard label="Due This Month" value={2} icon={<IconTile icon={CalendarDays} />} />
        </div>
        <div className="ds-entity-grid">
          {projects.map(p => (
            <div key={p.id} className="app-project">
              <EntityCard title={p.name} subtitle={p.client} icon={<IconTile icon={Briefcase} />} onOpen={() => setOpen(p.id)}
                status={{ tone: p.status === 'On track' ? 'success' : p.status === 'At risk' ? 'warning' : 'error', label: p.status }}
                owner={p.lead} role="Project lead" when={p.due} whenCaption="Due date"
                metrics={[{ label: 'Tasks done', value: p.done, of: p.tasks }, { label: 'Members', value: p.members, of: p.membersOf }, { label: 'Progress', value: p.progress }]} />
            </div>
          ))}
        </div>
      </>}
      {project && <>
        <SummaryStrip eyebrow="Project" title={project.name} fields={[{ label: 'Code', value: project.id }, { label: 'Client', value: project.client }, { label: 'Due', value: project.due }]}
          statuses={[{ label: 'Health', tone: project.status === 'On track' ? 'success' : project.status === 'At risk' ? 'warning' : 'error', value: project.status }]} />
        <section className="ds-dash-card" aria-labelledby="prog-t">
          <div className="ds-dash-card__header"><h2 className="ds-dash-card__title" id="prog-t">Progress</h2></div>
          <div className="doc-stack"><Progress value={project.progress} tone={project.status === 'On track' ? 'success' : project.status === 'At risk' ? 'warning' : 'error'} label={`${project.name} completion`} />
            <div className="ds-entity__metrics app-metrics">{[['Tasks done', project.done, project.tasks], ['Members', project.members, project.membersOf]].map(([l, v, o]) => <div key={l as string} className="ds-entity__metric"><Metric label={l as string} value={v as number} of={o as number} /></div>)}</div></div>
        </section>
        <TableCard title="Tasks" titleId="ptasks" count={tasks.filter(t => t.project === project.name).length}>{taskRows(tasks.filter(t => t.project === project.name))}</TableCard>
      </>}
      {view === 'tasks' && <>
        <Tabs idBase="tasks" controls label="Task state" value={taskTab} onChange={setTaskTab} tabs={['To do', 'In progress', 'Done'].map(s => ({ value: s, label: s, count: tasks.filter(t => t.state === s).length }))} />
        <TabPanel idBase="tasks" value={taskTab}><TableCard title={taskTab} titleId="tt" count={tasks.filter(t => t.state === taskTab).length}>{taskRows(tasks.filter(t => t.state === taskTab))}</TableCard></TabPanel>
      </>}
      <ProjectWizard open={wizard} onClose={() => setWizard(false)} />
    </AppShell>
  );
}

function ProjectWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: '', client: null as string | null, code: '', start: '', due: '', priority: 'medium' as 'low' | 'medium' | 'high', tags: [] as string[], budget: '', estimate: '', description: '', status: 'active', team: [] as string[] });
  const [submitted, setSubmitted] = useState(false);
  const first = useRef<HTMLInputElement>(null);
  const errs = { name: !f.name.trim() ? 'Enter a project name.' : undefined, client: !f.client ? 'Choose a client.' : undefined, due: f.start && f.due && f.due < f.start ? 'Due date must be on or after the start date.' : undefined };
  const e = (k: keyof typeof errs) => (submitted ? errs[k] : undefined);
  const close = () => { onClose(); setStep(0); setSubmitted(false); setF({ ...f, name: '', client: null, team: [] }); };
  const next = () => {
    if (step === 0) { setSubmitted(true); if (Object.values(errs).some(Boolean)) { window.setTimeout(() => document.querySelector<HTMLElement>('.ds-panel [aria-invalid="true"]')?.focus(), 0); return; } }
    if (step < 2) setStep(step + 1); else { toast(`${f.name} created`); close(); }
  };
  return (
    <SlidePanel open={open} onClose={close} title="New Project" size="xl" dirty={!!f.name || !!f.client} initialFocus={first} icon={<IconTile icon={FolderKanban} size={32} />}
      subheader={<Stepper current={step} steps={[{ title: 'Basics', sub: 'In progress' }, { title: 'Team', sub: 'Members & roles' }, { title: 'Review', sub: 'Summary' }]} />}
      footer={<><Button variant="secondary" onClick={() => (step ? setStep(step - 1) : close())}>{step ? 'Back' : 'Cancel'}</Button><Button minWidth trailing={step < 2 ? ChevronRight : undefined} onClick={next}>{step < 2 ? 'Next' : 'Create Project'}</Button></>}>
      {step === 0 && (
        <div className="ds-form-grid">
          <Field label="Project name" required error={e('name')} className="ds-span-2"><TextInput ref={first} value={f.name} onChange={x => setF({ ...f, name: x.target.value })} /></Field>
          <Field label="Client" required error={e('client')}><Select options={['Northwind Labs', 'Kestrel Systems', 'Pinecrest Bank', 'Atlas Mobility'].map(c => ({ value: c, label: c }))} value={f.client} onChange={v => setF({ ...f, client: v })} placeholder="Choose client" /></Field>
          <Field label="Project code"><TextInput value={f.code} onChange={x => setF({ ...f, code: x.target.value })} placeholder="PRJ-000" /></Field>
          <Field label="Start date"><TextInput type="date" className="ds-input--date" value={f.start} onChange={x => setF({ ...f, start: x.target.value })} /></Field>
          <Field label="Due date" error={e('due')}><TextInput type="date" className="ds-input--date" value={f.due} onChange={x => setF({ ...f, due: x.target.value })} /></Field>
          <div className="ds-field ds-span-2"><span className="ds-field__label" id="prio">Priority</span><RadioCards labelId="prio" value={f.priority} onChange={v => setF({ ...f, priority: v })} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} /></div>
          <Field label="Tags" className="ds-span-2"><MultiSelect options={['Design', 'Backend', 'Mobile', 'Data', 'Compliance', 'Research'].map(t => ({ value: t, label: t }))} value={f.tags} onChange={v => setF({ ...f, tags: v })} action={{ label: 'Add New Tag', onAction: () => toast('Add tag form opens here') }} /></Field>
          <Field label="Budget"><TextInput suffix="USD" inputMode="numeric" value={f.budget} onChange={x => setF({ ...f, budget: x.target.value })} /></Field>
          <Field label="Estimate"><TextInput suffix="h" inputMode="numeric" value={f.estimate} onChange={x => setF({ ...f, estimate: x.target.value })} /></Field>
          <div className="ds-span-2"><Callout title="How billing works">Hours are billed monthly against the estimate. Overruns need approval from the project lead.</Callout></div>
          <Field label="Description" className="ds-span-2"><Textarea value={f.description} onChange={x => setF({ ...f, description: x.target.value })} /></Field>
          <div className="ds-field"><span className="ds-field__label" id="pstatus">Status</span><BinaryToggle labelId="pstatus" value={f.status} onChange={v => setF({ ...f, status: v })} options={[{ value: 'active', label: 'Active', dot: 'success' }, { value: 'inactive', label: 'Inactive', dot: 'error' }]} /></div>
        </div>
      )}
      {step === 1 && <div className="ds-form-grid"><Field label="Team members" className="ds-span-2" help="Choose everyone who will work on this project."><MultiSelect options={people.map(p => ({ value: p.id, label: p.name }))} value={f.team} onChange={v => setF({ ...f, team: v })} /></Field></div>}
      {step === 2 && (
        <dl className="app-review">
          {[['Project name', f.name], ['Client', f.client ?? '—'], ['Priority', f.priority], ['Tags', f.tags.join(', ') || '—'], ['Team', `${f.team.length} members`], ['Status', f.status]].map(([k, v]) => <div key={k}><dt className="ds-field__label">{k}</dt><dd className="ds-text-body">{v}</dd></div>)}
        </dl>
      )}
    </SlidePanel>
  );
}

/* ── Settings & forms (§6.12 settings extension) ─────────────────── */
export function SettingsApp() {
  const [view, setView] = useState('general');
  const [p, setP] = useState({ name: 'Jane Cooper', email: 'jane.cooper@example.com', title: 'Administrator', bio: '' });
  const [saved, setSaved] = useState(p);
  const [submitted, setSubmitted] = useState(false);
  const [notify, setNotify] = useState({ email: true, digest: false, mentions: true });
  const [mfa, setMfa] = useState<'app' | 'sms'>('app');
  const [tz, setTz] = useState('Europe/London');
  const [confirm, setConfirm] = useState(false);
  const errs = { name: !p.name.trim() ? 'Enter your name.' : undefined, email: !/^\S+@\S+\.\S+$/.test(p.email) ? 'Enter a valid email address.' : undefined };
  const dirty = JSON.stringify(p) !== JSON.stringify(saved);
  const sections = [{ label: 'Workspace', items: [
    { id: 'general', label: 'General', icon: <Icon icon={SlidersHorizontal} size={24} /> },
    { id: 'notifications', label: 'Notifications', icon: <Icon icon={Bell} size={24} /> },
    { id: 'security', label: 'Security', icon: <Icon icon={KeyRound} size={24} /> },
  ] }];
  const save = () => {
    setSubmitted(true);
    if (errs.name || errs.email) { window.setTimeout(() => document.querySelector<HTMLElement>('#app-main [aria-invalid="true"]')?.focus(), 0); return; }
    setSaved(p); setSubmitted(false); toast('Profile saved');
  };
  const instant = (k: keyof typeof notify, label: string) => (v: boolean) => { setNotify({ ...notify, [k]: v }); toast(`${label} ${v ? 'on' : 'off'}`); };
  return (
    <AppShell product="Atlas" tagline="Workspace settings" logo={<Icon icon={SlidersHorizontal} size={20} />} sections={sections} current={view} onNavigate={setView} user={user}
      title="Settings" description="Manage your profile, notifications and security.">
      <div className="app-settings">
        {view === 'general' && <>
          <section className="ds-dash-card" aria-labelledby="s-profile">
            <div><h2 className="ds-text-card-title" id="s-profile">Profile</h2><p className="ds-text-body-muted">Shown to everyone in your workspace.</p></div>
            {submitted && (errs.name || errs.email) && <InlineAlert tone="error" title="Couldn't save">Fix the highlighted fields and try again.</InlineAlert>}
            <form className="ds-form-grid" noValidate onSubmit={e => { e.preventDefault(); save(); }}>
              <Field label="Full name" required error={submitted ? errs.name : undefined}><TextInput value={p.name} onChange={e => setP({ ...p, name: e.target.value })} autoComplete="name" /></Field>
              <Field label="Email" required error={submitted ? errs.email : undefined}><TextInput type="email" value={p.email} onChange={e => setP({ ...p, email: e.target.value })} autoComplete="email" /></Field>
              <Field label="Job title"><TextInput value={p.title} onChange={e => setP({ ...p, title: e.target.value })} /></Field>
              <Field label="Time zone"><Select options={['Europe/London', 'Europe/Berlin', 'America/Toronto', 'Asia/Singapore', 'Africa/Nairobi', 'America/Chicago'].map(z => ({ value: z, label: z }))} value={tz} onChange={setTz} /></Field>
              <Field label="Bio" help="Up to 280 characters." error={submitted && p.bio.length > 280 ? 'Keep your bio under 280 characters.' : undefined} className="ds-span-2"><Textarea value={p.bio} onChange={e => setP({ ...p, bio: e.target.value })} /></Field>
              <div className="ds-span-2 app-form-actions"><Button variant="ghost" size="sm" disabled={!dirty} onClick={() => { setP(saved); setSubmitted(false); }}>Discard</Button><Button size="sm" type="submit">Save</Button></div>
            </form>
          </section>
          <section className="ds-dash-card" aria-labelledby="s-danger">
            <div><h2 className="ds-text-card-title" id="s-danger">Delete workspace</h2><p className="ds-text-body-muted">Removes every project, member and file. This can't be undone.</p></div>
            <div><Button variant="danger" onClick={() => setConfirm(true)}>Delete Workspace</Button></div>
          </section>
        </>}
        {view === 'notifications' && (
          <section className="ds-dash-card" aria-labelledby="s-notif">
            <div><h2 className="ds-text-card-title" id="s-notif">Notifications</h2><p className="ds-text-body-muted">Changes apply immediately.</p></div>
            <div className="doc-stack">
              <Switch checked={notify.email} onChange={instant('email', 'Email notifications')} label="Email notifications" />
              <Switch checked={notify.digest} onChange={instant('digest', 'Weekly digest')} label="Weekly digest" />
              <Switch checked={notify.mentions} onChange={instant('mentions', 'Mentions')} label="Notify me when someone mentions me" />
            </div>
          </section>
        )}
        {view === 'security' && (
          <section className="ds-dash-card" aria-labelledby="s-sec">
            <div><h2 className="ds-text-card-title" id="s-sec">Two-step verification</h2><p className="ds-text-body-muted">Choose how you confirm sign-ins.</p></div>
            <InlineAlert tone="info" title="Recommended">An authenticator app works offline and can't be intercepted.</InlineAlert>
            <div className="ds-field"><span className="ds-field__label" id="mfa">Method</span><RadioCards labelId="mfa" value={mfa} onChange={v => { setMfa(v); toast('Verification method updated'); }} options={[{ value: 'app', label: 'Authenticator app' }, { value: 'sms', label: 'Text message' }]} /></div>
            <Field label="Current password" required><TextInput type="password" autoComplete="current-password" /></Field>
          </section>
        )}
      </div>
      <ConfirmDialog open={confirm} title="Delete this workspace?" message="Every project, member and file will be removed. This can't be undone." confirmLabel="Delete Workspace" onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); toast('Workspace deletion scheduled (demo)'); }} />
    </AppShell>
  );
}
