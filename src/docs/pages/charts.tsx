import { useState, type ReactNode } from 'react';
import { BarChart, BubbleMatrix, Donut, GroupedBarChart, HBarChart, Heatmap, LineChart } from '../../charts/Charts';
import { ChartData, ChartEmpty, fmtInt, fmtPct, heatCell, heatColor, Legend, TipContent } from '../../charts/core';
import { DashCard, StatusCard } from '../../components/ds/Cards';
import { Progress, SegBar } from '../../components/ds/Display';
import { Tabs } from '../../components/ds/Nav';
import { Select } from '../../components/ds/Select';
import { CodeBlock, DocSection, Grid, Preview, Prov, SpecSource, SpecTable, type SpecRow } from '../kit';
import { months, weekly } from '../../data/sample';

const CAT = ['var(--ds-chart-cat-1)', 'var(--ds-chart-cat-2)', 'var(--ds-chart-cat-3)', 'var(--ds-chart-cat-4)'];

function ChartDocPage({ intro, tag, refs, chart, empty, data, spec, code, extra, responsive }: {
  intro: string; tag: 'OBSERVED' | 'EXTENSION'; refs: string[]; chart: ReactNode; empty?: ReactNode; data?: ReactNode; spec: SpecRow[]; code: string; extra?: ReactNode; responsive: string;
}) {
  return (
    <div className="doc-page">
      <div className="doc-meta"><Prov tag={tag} /><span className="ds-text-small">Spec: {refs.map(r => `§${r}`).join(' · ')}</span></div>
      <p className="ds-text-body doc-lead">{intro}</p>
      <DocSection id="preview" title="Live chart" description="Hover or Tab to a mark for its tooltip; Escape closes it. The tooltip stays while the pointer is over it (SC 1.4.13).">{chart}</DocSection>
      {data && <DocSection id="data" title="Accessible data-table alternative">{data}</DocSection>}
      {extra}
      <DocSection id="spec" title="Styling (resolved tokens)"><SpecTable caption="Chart specification" rows={spec} /></DocSection>
      <DocSection id="responsive" title="Responsive behavior"><p className="ds-text-body">{responsive}</p></DocSection>
      {empty && <DocSection id="empty" title="Empty state"><Preview surface="card">{empty}</Preview></DocSection>}
      <DocSection id="code" title="Implementation"><CodeBlock code={code} title="React usage (this showcase's SVG/HTML chart)" /></DocSection>
      <div className="doc-stack">{refs.map(r => <SpecSource key={r} num={r} />)}</div>
    </div>
  );
}

/* ── Foundations ─────────────────────────────────────────────────── */
export function ChartFoundationsPage() {
  const ramp = Array.from({ length: 21 }, (_, i) => i / 20);
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">Charts live in dashboard cards, with no gridlines, transparent plots and a 1px baseline. Every chart has an accessible name; every mark with a tooltip is reachable by keyboard. No chart library is used here: marks are plain SVG/HTML styled only by §7 tokens, so no library defaults (colors, padding, fonts, gridlines, tooltips) can leak in.</p>
      <DocSection id="palettes" title="Palettes (§7.2)">
        <Grid min={240}>
          <div className="doc-palette"><b className="ds-text-body-strong">Categorical (in order)</b><div className="doc-palette__row">{CAT.map(c => <span key={c} style={{ background: c }} />)}</div><code className="ds-text-small">--ds-chart-cat-1 … 4</code></div>
          <div className="doc-palette"><b className="ds-text-body-strong">Categorical extension [EXT]</b><div className="doc-palette__row">{['#34d399', '#fb7185', '#93c5fd', '#f59e0b'].map(c => <span key={c} style={{ background: c }} />)}</div><code className="ds-text-small">categories 5–8 (spec literals)</code></div>
          <div className="doc-palette"><b className="ds-text-body-strong">Positive / negative</b><div className="doc-palette__row"><span style={{ background: 'var(--ds-chart-positive)' }} /><span style={{ background: 'var(--ds-chart-negative)' }} /></div><code className="ds-text-small">--ds-chart-positive · --ds-chart-negative</code></div>
          <div className="doc-palette"><b className="ds-text-body-strong">Running / stopped</b><div className="doc-palette__row"><span style={{ background: 'var(--ds-chart-running)' }} /><span style={{ background: 'var(--ds-chart-stopped)' }} /></div><code className="ds-text-small">--ds-chart-running · --ds-chart-stopped</code></div>
        </Grid>
        <div className="doc-heatramp" aria-label="Heat scale with text-contrast snapping" role="img">
          {ramp.map(t => { const c = heatCell(t); return <span key={t} style={{ background: c.fill }} className={c.ink ? 'ds-heat-cell--ink' : undefined}>{t.toFixed(2)}</span>; })}
        </div>
        <p className="ds-text-small">Sequential heat scale (good → bad) with the R-56 snapping: positions 0.55–0.59 are snapped so cell text always reaches ≥ 4.56:1 (white ≤ 0.55, ink ≥ 0.59).</p>
      </DocSection>
      <DocSection id="formatting" title="Number formatting (§7.1)">
        <SpecTable caption="Formatting" rows={[{ property: 'Thousands', value: fmtInt(12480) }, { property: 'Rates', value: fmtPct(3.4167) }, { property: 'Compact axes', value: '2.5k' }, { property: 'Units', value: '500 ms · 4 h' }, { property: 'Dates', value: '10 Apr 2024 · 10 Apr (axes)' }]} />
      </DocSection>
      <DocSection id="axes" title="Axes (§7.3)"><SpecSource num="7.3" title="Axis table" /></DocSection>
      <SpecSource num="7.1" />
      <SpecSource num="7.2" />
    </div>
  );
}

const wonLost = weekly.map((x, i) => ({ x, values: { won: [42, 55, 38, 61, 47, 22, 18][i], lost: [8, 12, 6, 14, 9, 3, 2][i] } }));
const rate = wonLost.map(d => (d.values.won / (d.values.won + d.values.lost)) * 100);

export function VerticalBarPage({ stacked }: { stacked?: boolean }) {
  const [n, setN] = useState('7');
  const [trend, setTrend] = useState(true);
  const data = n === '0' ? [] : n === '7' ? wonLost : Array.from({ length: +n }, (_, i) => ({ x: `${i + 1} Apr`, values: { won: 30 + ((i * 13) % 35), lost: 4 + ((i * 7) % 11) } }));
  const rates = data.map(d => (d.values.won / (d.values.won + d.values.lost)) * 100);
  const series = stacked ? [{ key: 'won', label: 'Won', color: 'var(--ds-chart-positive)' }, { key: 'lost', label: 'Lost', color: 'var(--ds-chart-negative)' }] : [{ key: 'won', label: 'Won', color: 'var(--ds-chart-positive)' }];
  return (
    <ChartDocPage tag="OBSERVED" refs={['7.4', '7.5']}
      intro={stacked ? 'Stacked bars: the positive series at the bottom, the negative on top, 2px card-colored gaps between segments (R-45), 4px top corners on the topmost segment. Optional white dashed trend overlay on its own scale.' : 'Vertical bars in equal-width bands: 60% of the band, max 74px, min 6px; compact y-axis with 7 ticks; x labels thin out beyond 16 bands.'}
      chart={
        <DashCard title={stacked ? 'Deals Won vs Lost' : 'Deals Won'} subtitle="Count of deals per day" right={<>
          <Legend kind="swatch" items={[...series.map(s => ({ label: s.label, color: s.color })), ...(trend && stacked ? [{ label: 'Win rate', color: 'var(--ds-chart-trend)', dashed: true }] : [])]} />
          <Select variant="filter" label="Bands" value={n} onChange={setN} className="ds-select--160" options={[{ value: '0', label: 'No data' }, { value: '7', label: '7 bands' }, { value: '14', label: '14 bands' }, { value: '30', label: '30 bands' }]} />
          {stacked && <Tabs idBase="trend" variant="accent" label="Overlay" value={trend ? 'on' : 'off'} onChange={v => setTrend(v === 'on')} tabs={[{ value: 'on', label: 'Trend' }, { value: 'off', label: 'Bars only' }]} />}
        </>}>
          <BarChart label={`${stacked ? 'Deals won vs lost' : 'Deals won'} per day`} data={data} series={series} trend={trend && stacked ? { label: 'Win rate', values: rates, format: fmtPct } : undefined} />
        </DashCard>
      }
      data={<ChartData caption="Deals per day" head={['Day', 'Won', 'Lost', 'Win rate']} rows={wonLost.map((d, i) => [d.x, d.values.won, d.values.lost, fmtPct(rate[i])])} />}
      empty={<ChartEmpty />}
      spec={[
        { property: 'Plot height', value: '300px' }, { property: 'Bar width', value: '60% of band · max 74 · min 6' },
        { property: 'Series', token: '--ds-chart-positive + --ds-chart-negative' }, { property: 'Baseline', token: '--ds-chart-baseline' },
        { property: 'Y labels', token: '--ds-color-text-axis', note: ' 12/24 -0.4px' }, { property: 'X labels', token: '--ds-color-text-primary', note: ' 14/24 -0.4px' },
        { property: 'Top corners', token: '--ds-radius-xs' }, { property: 'Trend line', token: '--ds-chart-trend', note: ' 2px dashed 6 5' }, { property: 'Height animation', token: '--ds-duration-slow' },
      ]}
      responsive="Bands are flex columns, so the chart fills any card width. Above 16 bands only every ⌈n/12⌉-th label shows and trend data labels are hidden. Cards stack at ≤ md."
      code={`<BarChart label="Deals won vs lost per day" data={data}\n  series={[{ key: 'won', label: 'Won', color: 'var(--ds-chart-positive)' }, { key: 'lost', label: 'Lost', color: 'var(--ds-chart-negative)' }]}\n  trend={{ label: 'Win rate', values: rates, format: fmtPct }} />`} />
  );
}

export function HorizontalBarPage() {
  const pages = [['/pricing', 'Pricing page', 18420], ['/', 'Home', 15210], ['/blog/launch', 'Launch post', 9320], ['/docs/start', 'Getting started', 7410], ['/signup', 'Sign up', 5120]] as const;
  return (
    <ChartDocPage tag="EXTENSION" refs={['7.4']}
      intro="Horizontal bars [EXTENSION]: 20px bars with a 12px gap, a 154px label column (body-strong + small) and the value to the right of the bar in small-strong."
      chart={<DashCard title="Top Pages" subtitle="Sessions this month"><HBarChart label="Top pages by sessions" data={pages.map(([sub, label, value]) => ({ label, sub, value }))} /></DashCard>}
      data={<ChartData caption="Top pages" head={['Page', 'Sessions']} rows={pages.map(([, l, v]) => [l, v])} />}
      empty={<ChartEmpty height={200} />}
      spec={[{ property: 'Bar height / gap', value: '20px / 12px' }, { property: 'Label column', value: '154px' }, { property: 'Bar color', token: '--ds-chart-cat-1' }, { property: 'Value label', token: '--ds-color-text-secondary', note: ' small-strong' }]}
      responsive="The label column stays 154px; bars scale to the remaining width. Labels truncate with the full text in the bar's accessible name and tooltip."
      code={`<HBarChart label="Top pages by sessions" data={[{ label: 'Pricing page', sub: '/pricing', value: 18420 }, …]} />`} />
  );
}

export function GroupedBarPage() {
  const data = ['Q1', 'Q2', 'Q3', 'Q4'].map((x, i) => ({ x, values: { a: 120 + i * 30, b: 90 + i * 22, c: 60 + i * 41 } }));
  const series = [{ key: 'a', label: 'Web', color: CAT[0] }, { key: 'b', label: 'Mobile', color: CAT[1] }, { key: 'c', label: 'Partner', color: CAT[2] }];
  return (
    <ChartDocPage tag="EXTENSION" refs={['7.4']}
      intro="Grouped bars [EXTENSION]: up to 3 series per band with a 4px gap inside the group; the group takes 60% of the band. Categorical colors in order."
      chart={<DashCard title="Signups by Channel" subtitle="Per quarter" right={<Legend items={series.map(s => ({ label: s.label, color: s.color }))} />}><GroupedBarChart label="Signups by channel per quarter" data={data} series={series} /></DashCard>}
      data={<ChartData caption="Signups by channel" head={['Quarter', ...series.map(s => s.label)]} rows={data.map(d => [d.x, ...series.map(s => d.values[s.key as 'a'])])} />}
      empty={<ChartEmpty />}
      spec={[{ property: 'Series colors', token: '--ds-chart-cat-1 + --ds-chart-cat-2 + --ds-chart-cat-3' }, { property: 'Gap in group', token: '--ds-space-1' }, { property: 'Group width', value: '60% of band' }]}
      responsive="Groups shrink with the band; with more than ~8 bands on narrow cards prefer a stacked or line chart."
      code={`<GroupedBarChart label="Signups by channel" data={data} series={series} />`} />
  );
}

export function LinePage({ area }: { area?: boolean }) {
  const series = [{ key: 'organic', label: 'Organic', color: CAT[0], values: [1200, 1350, 1280, 1500, 1620, 1580, 1710, 1820, 1760, 1900, 2050, 2120] }, { key: 'paid', label: 'Paid', color: CAT[1], values: [800, 760, 900, 950, 870, 1020, 1100, 1060, 1180, 1250, 1210, 1330] }, { key: 'referral', label: 'Referral', color: CAT[2], values: [300, 340, 320, 410, 450, 430, 480, 520, 500, 560, 590, 640] }];
  return (
    <ChartDocPage tag="EXTENSION" refs={['7.5']}
      intro={area ? 'Area chart [EXTENSION]: the line chart with each series filled by its color at 12% → 0% vertically.' : 'Standalone line chart [EXTENSION]: 2px strokes in categorical colors; points show on hover/focus (always with 12 points or fewer); a 1px guide line and a rich tooltip listing every series at that x.'}
      chart={<DashCard title="Traffic Over Time" subtitle="Sessions per month, by channel" right={<Legend items={series.map(s => ({ label: s.label, color: s.color }))} />}><LineChart label="Sessions per month by channel" x={months} series={series} area={area} /></DashCard>}
      data={<ChartData caption="Sessions per month" head={['Month', ...series.map(s => s.label)]} rows={months.map((m, i) => [m, ...series.map(s => s.values[i])])} />}
      empty={<ChartEmpty />}
      spec={[{ property: 'Stroke', value: '2px solid, categorical colors' }, { property: 'Points', value: '6px, on hover/focus (always ≤ 12 points)' }, { property: 'Guide line', value: '1px rgba(255,255,255,0.2)' }, { property: 'Plot height', value: '300px' }, ...(area ? [{ property: 'Area fill', value: 'series color 12% → 0%' }] : [])]}
      responsive="The plot measures its container (ResizeObserver) and redraws; x labels thin out beyond 16 points. No visual reference exists in the source for this extension."
      code={`<LineChart label="Sessions per month" x={months} series={[{ key: 'organic', label: 'Organic', color: 'var(--ds-chart-cat-1)', values }]}${area ? ' area' : ''} />`} />
  );
}

export function DonutPage() {
  const data = [['Prospect', 1240], ['Qualified', 860], ['Proposal', 540], ['Negotiation', 320]].map(([label, value], i) => ({ label: label as string, value: value as number, color: CAT[i] }));
  return (
    <ChartDocPage tag="OBSERVED" refs={['7.6']}
      intro="Donut (never pie): 180px, 32px ring over a full track, starting at 12 o'clock clockwise with 2px card-colored gaps. The legend repeats every value, so nothing is hover-only; legend rows are the keyboard targets."
      chart={<DashCard title="Pipeline by Stage" subtitle="Open deals"><Donut label="Pipeline by stage" data={data} center={{ value: fmtInt(data.reduce((s, d) => s + d.value, 0)), caption: 'Open deals' }} /></DashCard>}
      data={<ChartData caption="Pipeline by stage" head={['Stage', 'Deals']} rows={data.map(d => [d.label, d.value])} />}
      empty={<ChartEmpty height={180} />}
      spec={[{ property: 'Size / ring', value: '180px / 32px' }, { property: 'Track', token: '--ds-chart-track' }, { property: 'Colors', token: '--ds-chart-cat-1 + --ds-chart-cat-2 + --ds-chart-cat-3 + --ds-chart-cat-4' }, { property: 'Legend text', token: '--ds-color-text-muted', note: ' 14/20 500' }, { property: 'Segment animation', token: '--ds-duration-chart' }]}
      responsive="The legend sits beside the donut (gap 20) and wraps below it when the card is narrow."
      code={`<Donut label="Pipeline by stage" data={[{ label: 'Prospect', value: 1240, color: 'var(--ds-chart-cat-1)' }, …]} center={{ value: '2,960', caption: 'Open deals' }} />`} />
  );
}

export function HeatmapPage() {
  const rows = ['North', 'South', 'East', 'West', 'Central'];
  const cols = ['SMB', 'Mid-market', 'Enterprise', 'Public', 'Partner'];
  const values = rows.map((_, i) => cols.map((_, j) => 1 + ((i * 7 + j * 5) % 11) * 0.6 + (i === 2 && j === 3 ? 2.1 : 0)));
  const [rev, setRev] = useState(false);
  return (
    <ChartDocPage tag="OBSERVED" refs={['7.7']}
      intro="Heatmap in a flush card: full-bleed heat cells, normalized over the visible values. Cell text is white at ramp positions ≤ 0.55 and ink ≥ 0.59; fills in between are snapped (R-56). Hover adds a 1px inset white line; focus uses the white on-color ring."
      chart={<DashCard flush title="Error Rate by Region & Segment" subtitle={rev ? 'Relative scale · high = good (stops reversed)' : 'Relative scale · high = bad'} right={<Tabs idBase="hm" variant="accent" label="Scale direction" value={rev ? 'good' : 'bad'} onChange={v => setRev(v === 'good')} tabs={[{ value: 'bad', label: 'High = bad' }, { value: 'good', label: 'High = good' }]} />}>
        <Heatmap label="Error rate by region and segment" rows={rows} cols={cols} values={values} reversed={rev} rowLabel="Region" /></DashCard>}
      data={<ChartData caption="Error rate by region and segment" head={['Region', ...cols]} rows={rows.map((r, i) => [r, ...values[i].map(v => fmtPct(v))])} />}
      spec={[{ property: 'Row min height', token: '--ds-size-heat-row' }, { property: 'Header fill', token: '--ds-color-surface-table-header' }, { property: 'Row label divider', token: '--ds-color-border-divider' }, { property: 'Stops', token: '--ds-heat-0 + --ds-heat-1 + --ds-heat-2 + --ds-heat-3 + --ds-heat-4' }, { property: 'Ink text', token: '--ds-color-text-on-bright' }, { property: 'Focus on color', token: '--ds-color-focus-ring-on-color' }]}
      responsive="The grid keeps a 520px minimum and scrolls horizontally inside the card on narrow screens."
      extra={<DocSection id="contrast" title="Text contrast with snapping"><div className="doc-heatramp">{Array.from({ length: 21 }, (_, i) => i / 20).map(t => { const c = heatCell(t); return <span key={t} style={{ background: c.fill }} className={c.ink ? 'ds-heat-cell--ink' : undefined}>{t.toFixed(2)}</span>; })}</div></DocSection>}
      code={`<Heatmap label="Error rate by region and segment" rows={regions} cols={segments} values={matrix} rowLabel="Region" />`} />
  );
}

export function BubblePage() {
  const rows = [{ label: 'Organic search', sub: 'google, bing' }, { label: 'Paid social', sub: '3 campaigns' }, { label: 'Email', sub: 'newsletter' }, { label: 'Referral', sub: 'partners' }];
  const cols = ['Home', 'Pricing', 'Blog post', 'Docs', 'Sign up'];
  const vol = rows.map((_, i) => cols.map((_, j) => 200 + ((i * 37 + j * 53) % 9) * 410));
  const rate = rows.map((_, i) => cols.map((_, j) => 0.8 + ((i * 3 + j * 7) % 10) * 0.55));
  return (
    <ChartDocPage tag="OBSERVED" refs={['7.8']}
      intro="Bubble matrix: size = volume (14 + √(v / max) × 40 px), color = rate on the heat scale (reversed here, because high conversion is good). Bubbles have no text, so no snapping is needed."
      chart={<DashCard flush title="Channel × Landing Page Conversion" subtitle="Size = sessions · color = conversion (high = good)"><BubbleMatrix label="Channel by landing page conversion" rows={rows} cols={cols} volume={vol} rate={rate} reversed rateLabel="Conversion" volumeLabel="Sessions" /></DashCard>}
      data={<ChartData caption="Sessions and conversion" head={['Channel', ...cols]} rows={rows.map((r, i) => [r.label, ...cols.map((_, j) => `${fmtInt(vol[i][j])} · ${fmtPct(rate[i][j])}`)])} />}
      spec={[{ property: 'Row height', value: '88px (64px with more than 6 rows)' }, { property: 'Label column', value: '154px' }, { property: 'Row label / sub', token: '--ds-color-text-chart-strong + --ds-color-text-chart-subtle' }, { property: 'Hover', value: 'transform: scale(1.1)' }, { property: 'Focus', token: '--ds-color-focus-ring' }]}
      responsive="Columns are equal grid tracks with a 480px minimum; the matrix scrolls horizontally in narrow cards."
      code={`<BubbleMatrix label="…" rows={channels} cols={pages} volume={sessions} rate={conversion} reversed />`} />
  );
}

export function ProgressVizPage() {
  return (
    <ChartDocPage tag="OBSERVED" refs={['5.34', '5.26']}
      intro="Segmented status bars (observed) and single-value progress bars (extension). Segment counts use ink text on the bright fills; empty segments are omitted."
      chart={<div className="doc-stack"><StatusCard title="Integrations" running={18} stopped={3}><p className="ds-text-body-muted doc-pad">Table goes here (§5.26).</p></StatusCard>
        <Preview surface="card"><div className="doc-stack doc-full"><SegBar segments={[{ value: 12, color: 'var(--ds-chart-running)', label: 'healthy' }, { value: 7, color: 'var(--ds-chart-cat-3)', label: 'degraded' }, { value: 3, color: 'var(--ds-chart-stopped)', label: 'down' }]} /><Progress value={72} label="Sprint completion" /><Progress value={38} tone="warning" label="Budget used" /></div></Preview></div>}
      spec={[{ property: 'Bar height', value: '20px (status) · 8px (progress)' }, { property: 'Radius', token: '--ds-radius-chip' }, { property: 'Segment gap', token: '--ds-space-0-5' }, { property: 'Count text', token: '--ds-color-text-on-bright' }, { property: 'Track', token: '--ds-chart-track' }]}
      responsive="Full width at every breakpoint; segment numbers hide below the 28px minimum (the total stays in the accessible name)."
      code={`<SegBar segments={[{ value: 18, color: 'var(--ds-chart-running)', label: 'running' }, …]} />\n<Progress value={72} label="Sprint completion" />`} />
  );
}

export function TooltipsLegendsPage() {
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">The rich chart tooltip (§7.9) is anchored 12px right and below the mark, flips at the container edges, is hoverable and closes on Escape. Legends come in three styles (§7.10).</p>
      <DocSection id="tooltip" title="Rich tooltip (static render)">
        <Preview surface="card"><div className="ds-chart-tip doc-static-tip" role="presentation"><TipContent title="North" sub="Enterprise" color={heatColor(0.7)} rows={[['Error rate', '3.42%'], ['Items', '12,480']]} list={{ title: 'Top causes', items: [['Damaged packaging', '1.2% (150)'], ['Label misprint', '0.9% (112)'], ['Wrong item', '0.4% (50)']] }} /></div></Preview>
      </DocSection>
      <DocSection id="legends" title="Legends">
        <Grid min={260}>
          <div className="doc-cell"><div className="doc-cell__stage"><Legend items={[{ label: 'Won', color: 'var(--ds-chart-positive)' }, { label: 'Lost', color: 'var(--ds-chart-negative)' }]} /></div><p className="doc-cell__label">swatch · 24×16 · charts</p></div>
          <div className="doc-cell"><div className="doc-cell__stage"><Legend kind="dot" items={[{ label: 'Running', color: 'var(--ds-chart-running)' }, { label: 'Stopped', color: 'var(--ds-chart-stopped)' }]} /></div><p className="doc-cell__label">dot · 12px · compact headers</p></div>
          <div className="doc-cell"><div className="doc-cell__stage"><Legend kind="line" items={[{ label: 'Win rate', color: 'var(--ds-chart-trend)' }]} /></div><p className="doc-cell__label">line · trend overlays</p></div>
          <div className="doc-cell"><div className="doc-cell__stage"><Legend items={[{ label: 'Organic', color: CAT[0], value: '1,240' }, { label: 'Paid', color: CAT[1], value: '860' }]} /></div><p className="doc-cell__label">with values</p></div>
        </Grid>
      </DocSection>
      <DocSection id="spec" title="Tooltip styling"><SpecTable caption="Tooltip" rows={[{ property: 'Width', token: '--ds-size-tooltip' }, { property: 'Fill / border', token: '--ds-color-surface-tooltip + --ds-color-border-tooltip' }, { property: 'Divider', token: '--ds-color-border-tooltip-divider' }, { property: 'Text strong / muted', token: '--ds-color-text-tooltip + --ds-color-text-tooltip-muted' }, { property: 'Shadow', token: '--ds-shadow-tooltip' }, { property: 'Z-index', token: '--ds-z-tooltip' }]} /></DocSection>
      <SpecSource num="7.9" />
      <SpecSource num="7.10" />
    </div>
  );
}
