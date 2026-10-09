import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowLeft, BarChart3, Calendar, ChevronDown, ChevronRight, Copy as CopyIcon, ExternalLink, Maximize2, Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { spec } from '../../lib/spec';
import { resolveToken, useDensity } from '../../lib/tokens';
import { copyText } from '../../lib/copy';
import { CodeBlock, DocSection, Grid, Preview, Prov, SpecSource, SpecTable } from '../kit';
import { SearchInput, TextInput } from '../../components/ds/Field';
import { Button } from '../../components/ds/Button';
import { KpiCard } from '../../components/ds/Cards';
import { IconTile, Illustration, Status } from '../../components/ds/Display';
import { DataTable } from '../../components/ds/Table';
import { Icon } from '../../components/ds/Icon';
import { Select } from '../../components/ds/Select';
import { employees } from '../../data/sample';
import { employeeColumns } from '../components/data';
import { AlertCircle, AlertTriangle, Boxes, Building2, CheckCircle2, History, LogIn, Package, PackageCheck, PackageX, Percent, RefreshCw, ScanSearch, Settings, UserCheck, UserCog, UserPlus, Users, Video, Workflow, type LucideIcon } from 'lucide-react';

/* ── Colors ─────────────────────────────────────────────────────── */
const isColor = (v: string) => /^(#|rgba?\(|linear-gradient|radial-gradient)/.test(v.trim());
function groupOf(name: string): string {
  if (/^--ds-tag-|^--ds-heat-/.test(name)) return 'Component-specific: tags & heat scale';
  if (/^--ds-chart-/.test(name)) return 'Chart';
  if (/success|warning|error|critical|alert-count|info-/.test(name)) return 'Status';
  if (/^--ds-gradient-|stepper|avatar|detect|logo|attach|radio|callout|media|tooltip|scrollbar|skeleton/.test(name)) return 'Component-specific';
  if (/^--ds-color-overlay|^--ds-overlay/.test(name)) return 'Overlays';
  if (/^--ds-color-(bg|surface)/.test(name)) return 'Semantic: backgrounds & surfaces';
  if (/^--ds-color-text|^--ds-color-link|^--ds-color-icon/.test(name)) return 'Semantic: text & icons';
  if (/^--ds-color-border/.test(name)) return 'Semantic: borders & dividers';
  return 'Semantic: brand & interactive';
}
const COLOR_GROUPS = ['Semantic: backgrounds & surfaces', 'Semantic: text & icons', 'Semantic: borders & dividers', 'Semantic: brand & interactive', 'Status', 'Overlays', 'Chart', 'Component-specific', 'Component-specific: tags & heat scale'];

function Swatch({ name, value, use, primitive }: { name: string; value: string; use: string; primitive?: boolean }) {
  return (
    <button type="button" className="doc-swatch" onClick={() => copyText(primitive ? value : `var(${name})`, primitive ? 'Value copied' : 'Token copied')}>
      <span className="doc-swatch__chip"><span style={{ background: primitive ? value : `var(${name})` }} /></span>
      <span className="doc-swatch__text">
        <code className="doc-swatch__name">{name}</code>
        <span className="doc-swatch__value">{value}</span>
        {use && <span className="doc-swatch__use">{use}</span>}
      </span>
      <span className="doc-swatch__copy"><CopyIcon size={14} aria-hidden="true" /><span className="ds-sr-only">Copy {primitive ? 'value' : 'token'}</span></span>
    </button>
  );
}

export function ColorsPage() {
  const [q, setQ] = useState('');
  const tokens = Object.entries(spec.declared).filter(([n, v]) => n.startsWith('--ds-color') || n.startsWith('--ds-chart') || n.startsWith('--ds-tag') || n.startsWith('--ds-heat') || n.startsWith('--ds-gradient') || (n === '--ds-overlay-blur' ? false : isColor(v)));
  const match = (s: string) => s.toLowerCase().includes(q.toLowerCase());
  const groups = COLOR_GROUPS.map(g => ({ g, items: tokens.filter(([n]) => groupOf(n) === g).filter(([n, v]) => !q || match(n) || match(v) || match(spec.tokenDocs[n]?.use ?? '')) }));
  const prim = spec.primitives.filter(p => !p.name.startsWith('--ds-') && (!q || match(p.name) || match(p.value) || match(p.use)));
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Every color in the system. Components use <b>semantic tokens</b> only; primitives are reference labels for traceability and are not emitted as custom properties (R-54). Click a swatch to copy its token (or a primitive's value).</p>
      <div className="doc-toolbar"><SearchInput value={q} onValueChange={setQ} label="Filter colors" placeholder="Filter by name, value or use" width="md" />
        <span className="ds-text-small" role="status">{groups.reduce((s, g) => s + g.items.length, 0) + prim.length} colors</span></div>
      {groups.filter(g => g.items.length).map(g => (
        <DocSection key={g.g} id={g.g.replace(/\W+/g, '-').toLowerCase()} title={g.g}>
          <div className="doc-swatches">{g.items.map(([n, v]) => <Swatch key={n} name={n} value={v} use={spec.tokenDocs[n]?.use ?? `Declared in §3 (${spec.declaredGroup[n] ?? 'token file'})`} />)}</div>
        </DocSection>
      ))}
      {prim.length > 0 && (
        <DocSection id="primitives" title="Primitives (reference labels)" description="Raw values behind the semantic tokens. Never reference these in component code.">
          {[...new Set(prim.map(p => p.group))].map(gr => (
            <div key={gr} className="doc-stack-sm"><h3 className="ds-text-subgroup-title">{gr}</h3>
              <div className="doc-swatches">{prim.filter(p => p.group === gr).map(p => <Swatch key={p.name} name={p.name} value={p.value} use={p.use} primitive />)}</div></div>
          ))}
        </DocSection>
      )}
      <SpecSource num="2.2" />
    </div>
  );
}

/* ── Typography ─────────────────────────────────────────────────── */
export function TypographyPage() {
  const [sample, setSample] = useState('Quarterly revenue grew 12,480 units');
  const scale = Object.entries(spec.declared).filter(([n]) => n.startsWith('--ds-font-size-'));
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Inter at six sizes (10 / 12 / 14 / 16 / 20 / 24) plus two named exceptions (11px charts, 18px summary title). Weights 400–700. Headings use negative tracking, uppercase labels positive tracking.</p>
      <DocSection id="scale" title="Type scale">
        <div className="doc-scale">{scale.map(([n, v]) => (
          <div key={n} className="doc-scale__row"><code className="doc-token-static">{n}</code><span className="doc-scale__px">{v} · {parseFloat(v) / 16}rem</span>
            <span style={{ fontSize: `var(${n})`, lineHeight: `var(${n.replace('font-size', 'line-height')})` }} className="doc-scale__sample">Aa Inter {v}</span></div>
        ))}</div>
      </DocSection>
      <DocSection id="styles" title="Named text styles" description="Rendered with the .ds-ts-* classes generated from the §2.3 table. Edit the sample text to test wrapping and translations.">
        <div className="doc-narrow-xl"><label className="ds-field__label" htmlFor="ts-sample">Sample text</label><TextInput id="ts-sample" value={sample} onChange={e => setSample(e.target.value)} /></div>
        <div className="ds-table-region doc-table" role="region" aria-label="Text styles" tabIndex={0}>
          <table className="ds-table">
            <caption className="ds-sr-only">Named text styles</caption>
            <thead><tr><th scope="col">Style</th><th scope="col">Sample</th><th scope="col" className="ds-col-shrink">Size / LH</th><th scope="col" className="ds-col-shrink">Weight</th><th scope="col" className="ds-col-shrink">Tracking</th><th scope="col" className="ds-col-shrink">Color</th><th scope="col">Usage</th></tr></thead>
            <tbody>{spec.textStyles.map(t => (
              <tr key={t.name}>
                <th scope="row"><button type="button" className="doc-token" onClick={() => copyText(`.ds-ts-${t.name}`, 'Class copied')}>{t.name}</button></th>
                <td><span className={`ds-ts-${t.name}`}>{t.transform === 'UPPERCASE' ? sample.slice(0, 32) : sample}</span></td>
                <td className="ds-col-shrink">{t.size} / {t.lineHeight}</td><td className="ds-col-shrink">{t.weight}</td><td className="ds-col-shrink">{t.tracking}{t.transform !== '—' ? ` · ${t.transform}` : ''}</td>
                <td className="ds-col-shrink">{t.color}</td><td className="doc-usage">{t.usage}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </DocSection>
      <DocSection id="rem" title="Text scaling, rem and long content"><SpecSource num="Text scaling, rem units and long content" title="Rules" /></DocSection>
      <CodeBlock lang="css" title="Font loading (§2.3)" code={`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');\n--ds-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`} />
    </div>
  );
}

/* ── Spacing ────────────────────────────────────────────────────── */
export function SpacingPage() {
  useDensity();
  const prim = Object.keys(spec.declared).filter(n => /^--ds-space-\d/.test(n));
  const sem = Object.keys(spec.declared).filter(n => /^--ds-space-[a-z]/.test(n));
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Base unit 4px with 2px half-steps (2, 6, 10, 14). Use gap between siblings, padding inside containers, margin only for the three documented cases.</p>
      <DocSection id="scale" title="Primitive scale">
        <div className="doc-ruler">{prim.map(n => (
          <button type="button" key={n} className="doc-ruler__row" onClick={() => copyText(`var(${n})`, 'Token copied')}>
            <code>{n}</code><span className="doc-ruler__bar" style={{ width: `var(${n})` }} /><span className="ds-text-small">{resolveToken(n)}</span>
          </button>
        ))}</div>
      </DocSection>
      <DocSection id="semantic" title="Semantic spacing" description="Values follow the density mode where §2.13 says so.">
        <SpecTable caption="Semantic spacing" rows={sem.map(n => ({ property: spec.tokenDocs[n]?.use || n, token: n }))} />
      </DocSection>
      <DocSection id="examples" title="Real examples">
        <Grid min={300}>
          <Measured label="KPI card padding (space-card)" pad="--ds-space-card"><KpiCard label="Total Users" value="1,284" icon={<IconTile icon={BarChart3} />} /></Measured>
          <Measured label="Table cell padding (cell-y × cell-x)" pad="--ds-space-cell-y" padX="--ds-space-cell-x"><span className="ds-text-body">Cell content</span></Measured>
          <Measured label="Page gutter (page-gutter)" pad="--ds-space-page-gutter"><span className="ds-text-body">Page content</span></Measured>
          <div className="doc-gapdemo"><p className="ds-text-small">Form: label gap 6 · row gap 24 · column gap 20</p>
            <div className="ds-form-grid doc-outline-children"><div className="ds-field"><span className="ds-field__label">First name</span><TextInput aria-label="First name" /></div><div className="ds-field"><span className="ds-field__label">Last name</span><TextInput aria-label="Last name" /></div><div className="ds-field ds-span-2"><span className="ds-field__label">Email</span><TextInput aria-label="Email" /></div></div></div>
        </Grid>
      </DocSection>
      <SpecSource num="2.4" />
    </div>
  );
}
function Measured({ label, pad, padX, children }: { label: string; pad: string; padX?: string; children: ReactNode }) {
  return (
    <div className="doc-measured">
      <p className="ds-text-small">{label}: {resolveToken(pad)}{padX ? ` × ${resolveToken(padX)}` : ''}</p>
      <div className="doc-measured__box" style={{ padding: padX ? `var(${pad}) var(${padX})` : `var(${pad})` }}><div className="doc-measured__inner">{children}</div></div>
    </div>
  );
}

/* ── Radii ──────────────────────────────────────────────────────── */
export function RadiiPage() {
  const radii = Object.keys(spec.declared).filter(n => n.startsWith('--ds-radius-'));
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Radius is assigned by role: surface 20, nested 16, controls and their anchored panels 10, small elements 8, tracks 12, chips 6, micro 4, pills full. Slide panels are edge-attached (0).</p>
      <DocSection id="scale" title="Radius scale">
        <div className="doc-radii">{radii.map(n => (
          <button type="button" key={n} className="doc-radius" onClick={() => copyText(`var(${n})`, 'Token copied')}>
            <span className="doc-radius__shape" style={{ borderRadius: `var(${n})` }} />
            <code>{n}</code><span className="ds-text-small">{spec.declared[n]}</span><span className="doc-swatch__use">{spec.tokenDocs[n]?.use}</span>
          </button>
        ))}</div>
      </DocSection>
      <DocSection id="concentric" title="Concentric nesting in practice">
        <Preview><div className="doc-concentric"><div className="doc-concentric__outer"><span className="ds-text-small">surface 20</span><div className="doc-concentric__inner"><span className="ds-text-small">nested 16</span><Button size="sm">control 10</Button></div></div></div></Preview>
      </DocSection>
      <SpecSource num="2.5" />
    </div>
  );
}

/* ── Borders ────────────────────────────────────────────────────── */
export function BordersPage() {
  const borders = Object.keys(spec.declared).filter(n => n.startsWith('--ds-color-border'));
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Cards and the shell have no borders: depth comes from shadow. Borders appear only inside components and on the documented controls. Every border is 1px (2px for the emphasis cases); dashed only on the upload dropzone.</p>
      <DocSection id="widths" title="Widths"><SpecTable caption="Border widths" rows={[{ property: 'Default', token: '--ds-border-width' }, { property: 'Emphasis', token: '--ds-border-width-emphasis' }]} /></DocSection>
      <DocSection id="colors" title="Border colors on a card surface">
        <div className="doc-borders">{borders.map(n => (
          <button type="button" key={n} className="doc-border" style={{ borderColor: `var(${n})` }} onClick={() => copyText(`var(${n})`, 'Token copied')}>
            <code>{n}</code><span className="ds-text-small">{spec.declared[n]}</span><span className="doc-swatch__use">{spec.tokenDocs[n]?.use}</span>
          </button>
        ))}</div>
      </DocSection>
      <SpecSource num="2.6" />
    </div>
  );
}

/* ── Shadows & elevation ───────────────────────────────────────── */
export function ShadowsPage() {
  const shadows = Object.keys(spec.declared).filter(n => n.startsWith('--ds-shadow-'));
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Depth through shadow, not lines. Every surface below is identical except for its shadow token.</p>
      <DocSection id="shadows" title="Shadow tokens">
        <div className="doc-shadows">{shadows.map(n => (
          <div key={n} className="doc-shadow">
            <div className="doc-shadow__surface" style={{ boxShadow: `var(${n})` }} />
            <button type="button" className="doc-token" onClick={() => copyText(`var(${n})`, 'Token copied')}>{n}</button>
            <code className="doc-shadow__value">{spec.declared[n]}</code>
            <span className="doc-swatch__use">{spec.tokenDocs[n]?.use}</span>
          </div>
        ))}</div>
      </DocSection>
      <DocSection id="elevation" title="Elevation levels"><SpecSource num="Elevation levels" title="Elevation table" /></DocSection>
      <DocSection id="focus" title="Focus indicators" description="Outline-based, never box-shadow; ≥ 3:1 on every surface.">
        <Grid min={200}>
          <div className="doc-cell"><div className="doc-cell__stage"><Button className="is-focus-visible">focus-ring</Button></div><p className="doc-cell__label">2px, offset 2 · buttons, links, cards</p></div>
          <div className="doc-cell"><div className="doc-cell__stage"><TextInput className="is-focus-visible" aria-label="Tight" defaultValue="focus-ring-tight" /></div><p className="doc-cell__label">offset 0 · fields, tabs</p></div>
          <div className="doc-cell"><div className="doc-cell__stage"><div className="doc-inset-demo is-focus-visible">focus-ring-inset</div></div><p className="doc-cell__label">offset −2 · clipped items</p></div>
          <div className="doc-cell"><div className="doc-cell__stage"><span className="ds-heat-cell is-focus-visible doc-heat-demo">3.42%</span></div><p className="doc-cell__label">on-color · white on data fills</p></div>
        </Grid>
      </DocSection>
      <DocSection id="z" title="Z-index"><SpecTable caption="Z-index" rows={Object.keys(spec.declared).filter(n => n.startsWith('--ds-z-')).map(n => ({ property: spec.tokenDocs[n]?.use || n, token: n }))} /></DocSection>
      <SpecSource num="2.7" />
    </div>
  );
}

/* ── Motion ─────────────────────────────────────────────────────── */
export function MotionPage() {
  const [run, setRun] = useState(false);
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const durations = Object.keys(spec.declared).filter(n => n.startsWith('--ds-duration-'));
  const eases = Object.keys(spec.declared).filter(n => n.startsWith('--ds-ease-'));
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Transitions are short and limited to color, background, border, opacity, box-shadow, filter, transform and chart sizes. Overlays appear instantly. Reduced motion disables the sidebar width and chart transitions.</p>
      {reduced && <p className="doc-callout-note" role="status">Your system requests reduced motion, so the demos below jump instead of animating — that is the documented behavior.</p>}
      <Button variant="secondary" onClick={() => setRun(r => !r)}>{run ? 'Reset' : 'Play transitions'}</Button>
      <DocSection id="durations" title="Durations (standard easing)">
        <div className="doc-motion">{durations.map(n => (
          <div key={n} className="doc-motion__row"><code>{n}</code><span className="ds-text-small">{spec.declared[n]}</span>
            <span className="doc-motion__track"><span className={`doc-motion__dot${run ? ' is-run' : ''}`} style={{ transitionDuration: `var(${n})`, transitionTimingFunction: 'var(--ds-ease-standard)' }} /></span></div>
        ))}</div>
      </DocSection>
      <DocSection id="easing" title="Easing (300ms)">
        <div className="doc-motion">{eases.map(n => (
          <div key={n} className="doc-motion__row"><code>{n}</code><span className="ds-text-small">{spec.declared[n]}</span>
            <span className="doc-motion__track"><span className={`doc-motion__dot${run ? ' is-run' : ''}`} style={{ transitionDuration: 'var(--ds-duration-slow)', transitionTimingFunction: `var(${n})` }} /></span></div>
        ))}</div>
      </DocSection>
      <SpecSource num="2.9" />
    </div>
  );
}

/* ── Iconography & assets ───────────────────────────────────────── */
/** §2.11-B fallback column, mapped to Lucide (the spec names Lucide as the example set). */
const FALLBACK: Record<string, LucideIcon> = {
  'illus.surveillance-camera': Video, 'illus.facility-set': Building2, 'illus.conveyor-line': Workflow, 'illus.analytics-board': BarChart3,
  'illus.catalog-item': Package, 'illus.gear': Settings, 'illus.user-group-admin': Users, 'illus.activity-document': History, 'illus.site-admin': UserCog,
  'illus.items-total': Boxes, 'illus.items-active': PackageCheck, 'illus.items-inactive': PackageX, 'illus.items-analyzed': ScanSearch, 'illus.defect-rate': Percent,
  'illus.event-user-created': UserPlus, 'illus.event-user-login': LogIn,
};
export function IconographyPage() {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const outline: [string, ReactNode, string][] = [
    ['Row actions', <><Icon icon={Pencil} /><Icon icon={Trash2} /><Icon icon={CopyIcon} /></>, '20px in a 28px button · icon #64748b'],
    ['Back arrow', <Icon icon={ArrowLeft} size={24} dir />, '24px · text-primary'], ['Select chevron', <Icon icon={ChevronDown} size={18} strokeWidth={1.35} />, '18px · icon-chevron'],
    ['Search', <Icon icon={Search} size={18} />, '18px · text-muted'], ['Calendar', <Icon icon={Calendar} size={16} strokeWidth={1} />, '16px · icon-chevron'],
    ['Close', <Icon icon={X} size={10} />, '10px · text-muted'], ['Expand', <Icon icon={Maximize2} size={16} />, '16px · icon'],
    ['Plus', <Icon icon={Plus} size={14} />, '14px · currentColor'], ['Forward chevron', <Icon icon={ChevronRight} size={14} dir />, '14px · currentColor'],
    ['Open / view', <Icon icon={ExternalLink} />, '20px · link'], ['Upload', <Icon icon={Upload} size={32} />, '32px · text-muted'],
  ];
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Two families with separate roles: glossy 3D illustrations for identity (navigation, headline metrics, record headers), and thin outline icons for actions. Never mix their roles, never generate look-alike illustrations.</p>
      <DocSection id="registry" title="Asset registry (§2.11-B)" description="Each registry entry with the copied source file (filename preserved) and its documented fallback icon tile.">
        <div className="doc-assets">{spec.registry.map(a => {
          const frames = a.frames || undefined;
          const FallbackIcon = FALLBACK[a.name] ?? RefreshCw;
          return (
            <div key={a.name} className="doc-asset">
              <div className="doc-asset__pair">
                <span className="doc-asset__img">{failed[a.file] ? <span className="ds-text-small">missing</span>
                  : frames ? <Illustration name={a.name} frames={frames} frame={0} size={56} />
                  : <img src={`${import.meta.env.BASE_URL}assets/${a.file}`} alt="" width={56} height={56} onError={() => setFailed(f => ({ ...f, [a.file]: true }))} />}</span>
                <IconTile icon={FallbackIcon} />
              </div>
              <code>{a.name}</code>
              <span className="ds-text-small">{a.file} · {a.master}{frames ? ` · ${frames} frames` : ''}</span>
              <span className="doc-swatch__use">{a.purpose}</span>
              <span className="doc-asset__status">{failed[a.file] ? <Prov tag="FALLBACK" /> : <Status tone="success">copied</Status>}</span>
            </div>
          );
        })}</div>
      </DocSection>
      <DocSection id="fallback" title="Icon-tile fallback (§2.11-D)">
        <div className="ds-cluster"><IconTile icon={Package} /><IconTile icon={Users} size={32} /><IconTile icon={CheckCircle2} tone="success" /><IconTile icon={AlertTriangle} tone="warning" /><IconTile icon={AlertCircle} tone="error" /></div>
      </DocSection>
      <DocSection id="outline" title="Outline UI icons (§2.11-E)" description="Lucide, 1.5px stroke, round caps and joins, currentColor, decorative (aria-hidden).">
        <div className="doc-icons">{outline.map(([l, g, s]) => <div key={l} className="doc-icon"><span className="doc-icon__glyph">{g}</span><b className="ds-text-body-strong">{l}</b><span className="ds-text-small">{s}</span></div>)}</div>
      </DocSection>
      <SpecSource num="2.11" />
    </div>
  );
}

/* ── Density ────────────────────────────────────────────────────── */
export function DensityPage() {
  const density = useDensity();
  const rows = ['--ds-size-control', '--ds-size-control-sm', '--ds-size-control-lg', '--ds-size-icon-button', '--ds-size-pagination-button', '--ds-size-table-row', '--ds-size-table-header', '--ds-size-section-header', '--ds-size-nav-item', '--ds-space-cell-y', '--ds-space-card', '--ds-space-card-lg', '--ds-space-card-xl', '--ds-space-form-row', '--ds-space-grid', '--ds-space-grid-lg'];
  const set = (d: string) => { if (d === 'comfortable') document.documentElement.dataset.density = 'comfortable'; else delete document.documentElement.dataset.density; try { localStorage.setItem('ds-density', d); } catch { /* ignore */ } };
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Dense is the default. Comfortable is derived mechanically (+4px control sizes, one spacing step up) and introduces no new values. The switch here sets <code>data-density</code> on &lt;html&gt;, so every page of the showcase follows it.</p>
      <div className="ds-cluster"><span className="ds-field__label" id="dens">Density</span>
        <Select variant="filter" labelId="dens" value={density} onChange={set} options={[{ value: 'dense', label: 'Dense (default)' }, { value: 'comfortable', label: 'Comfortable' }]} className="ds-select--200" /></div>
      <DocSection id="live" title="Live preview">
        <Preview>
          <div className="doc-stack doc-full">
            <div className="ds-kpi-row"><KpiCard label="Total Users" value="1,284" icon={<IconTile icon={Users} />} /><KpiCard label="Active Users" value="1,107" icon={<IconTile icon={UserCheck} />} /></div>
            <div className="ds-cluster"><Button>Primary</Button><Button variant="secondary" size="sm">Small</Button><TextInput aria-label="Input" placeholder="Input" /></div>
            <section className="ds-table-card"><DataTable caption="Density demo" rowHeader="name" rowKey={e => e.id} rows={employees.slice(0, 3)} columns={employeeColumns().slice(0, 4)} /></section>
          </div>
        </Preview>
      </DocSection>
      <DocSection id="tokens" title="Tokens that change"><SpecTable caption="Density tokens" rows={rows.map(r => ({ property: r.replace('--ds-', ''), token: r }))} /></DocSection>
      <SpecSource num="2.13" />
    </div>
  );
}

/* ── Responsive ─────────────────────────────────────────────────── */
export function ResponsivePage() {
  const [w, setW] = useState(window.innerWidth);
  const [frame, setFrame] = useState('390');
  const [app, setApp] = useState('analytics');
  useEffect(() => { const on = () => setW(window.innerWidth); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  const bp = w < 640 ? 'xs' : w < 1024 ? 'sm' : w < 1280 ? 'md' : w < 1536 ? 'lg' : 'xl';
  const fw = +frame;
  const scale = Math.min(1, 900 / fw);
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Responsive design is required (the source was desktop-only). Breakpoints change layout only, never colors, type or anatomy. Minimum supported width 360px; reflow at 320px.</p>
      <p className="ds-text-body">Your viewport: <b className="ds-text-body-strong">{w}px</b> → breakpoint <b className="ds-text-body-strong">{bp}</b>.</p>
      <DocSection id="breakpoints" title="Breakpoints"><SpecSource num="8.1" title="Breakpoint table" /></DocSection>
      <DocSection id="frames" title="Example applications at real widths" description="Each frame loads an example app in an iframe at the chosen width, so its media queries respond exactly as on a device.">
        <div className="ds-cluster">
          <Select variant="filter" label="Width" value={frame} onChange={setFrame} options={['360', '390', '768', '1024', '1440'].map(v => ({ value: v, label: `${v}px` }))} className="ds-select--160" />
          <Select variant="filter" label="Application" value={app} onChange={setApp} options={[['analytics', 'Analytics Dashboard'], ['crm', 'CRM Dashboard'], ['employees', 'Employee Management'], ['projects', 'Project Management'], ['settings', 'Settings & Forms']].map(([v, l]) => ({ value: v, label: l }))} className="ds-select--220" />
        </div>
        <div className="doc-device" style={{ width: fw * scale, height: 720 * scale }}>
          <iframe title={`${app} at ${fw}px`} src={`${window.location.pathname}#/apps/${app}?frame=1`} style={{ width: fw, height: 720, transform: `scale(${scale})` }} />
        </div>
      </DocSection>
      <SpecSource num="8" title="All responsive rules" />
      <SpecSource num="8.9" title="Internationalization & RTL" />
    </div>
  );
}
