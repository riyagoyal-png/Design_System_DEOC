import { useMemo, useState } from 'react';
import { ChartEmpty, fmtCompact, fmtInt, fmtPct, heatCell, heatColor, niceTicks, normalize, TipContent, useChartTip, useWidth } from './core';

export interface Series { key: string; label: string; color: string }

/* ── Y axis (§7.3) ───────────────────────────────────────────────── */
function YAxis({ ticks, height }: { ticks: number[]; height: number }) {
  const max = ticks[ticks.length - 1];
  return (
    <div className="ds-axis-y" style={{ height }} aria-hidden="true">
      {ticks.map(t => <span key={t} style={{ bottom: `${(t / max) * 100}%` }}>{fmtCompact(t)}</span>)}
    </div>
  );
}
function labelEvery(n: number) { return n > 16 ? Math.ceil(n / 12) : 1; }

/**
  §7.4 vertical bars (stacked) + §7.5 trend overlay [OBSERVED].
  Band = equal flex columns; bar 60% of band (max 74, min 6); 2px card-colored gaps between segments; top corners 4px.
*/
export function BarChart({ data, series, trend, height = 300, label, stacked = true }: {
  data: { x: string; values: Record<string, number> }[]; series: Series[]; trend?: { label: string; values: number[]; format: (n: number) => string };
  height?: number; label: string; stacked?: boolean;
}) {
  const { container, bind, node } = useChartTip();
  const totals = data.map(d => series.reduce((s, se) => s + (d.values[se.key] ?? 0), 0));
  const ticks = niceTicks(Math.max(...totals, 0));
  const max = ticks[ticks.length - 1];
  const every = labelEvery(data.length);
  const tMax = trend ? Math.max(...trend.values) * 1.25 : 1;
  if (!data.length) return <ChartEmpty height={height} />;
  return (
    <div ref={container} className="ds-chart" role="group" aria-label={label}>
      <div className="ds-chart__plotrow">
        <YAxis ticks={ticks} height={height} />
        <div className="ds-chart__plot" style={{ height }}>
          {data.map((d, i) => (
            <div className="ds-chart__band" key={d.x}>
              <button type="button" className="ds-bar" style={{ height: `${(totals[i] / max) * 100}%` }}
                aria-label={`${d.x}: ${series.map(s => `${fmtInt(d.values[s.key] ?? 0)} ${s.label.toLowerCase()}`).join(', ')}`}
                {...bind(<TipContent title={d.x} rows={series.map(s => [s.label, fmtInt(d.values[s.key] ?? 0)] as [string, string]).concat(trend ? [[trend.label, trend.format(trend.values[i])]] : [])} />, `b${i}`)}>
                {(stacked ? [...series].reverse() : series).map(s => {
                  const v = d.values[s.key] ?? 0;
                  return v > 0 ? <span key={s.key} className="ds-bar__seg" style={{ flexGrow: v, background: s.color }} /> : null;
                })}
              </button>
            </div>
          ))}
          {trend && (
            <svg className="ds-trend" viewBox={`0 0 ${data.length * 100} 1000`} preserveAspectRatio="none" aria-hidden="true">
              <polyline points={trend.values.map((v, i) => `${i * 100 + 50},${1000 - (v / tMax) * 1000}`).join(' ')} fill="none" stroke="var(--ds-chart-trend)" strokeWidth="2" strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          {trend && data.length <= 16 && trend.values.map((v, i) => (
            <span key={i} className="ds-trend__pt" style={{ left: `${((i + 0.5) / data.length) * 100}%`, bottom: `${(v / tMax) * 100}%` }} aria-hidden="true">
              <span className="ds-trend__label">{trend.format(v)}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="ds-axis-x" aria-hidden="true">
        {data.map((d, i) => <span key={d.x}>{i % every === 0 ? d.x : ''}</span>)}
      </div>
      {node}
    </div>
  );
}

/** §7.4 grouped bars [EXTENSION]: up to 3 series per band, 4px inside the group, the group at 60% of the band. */
export function GroupedBarChart({ data, series, height = 300, label }: { data: { x: string; values: Record<string, number> }[]; series: Series[]; height?: number; label: string }) {
  const { container, bind, node } = useChartTip();
  const ticks = niceTicks(Math.max(...data.flatMap(d => series.map(s => d.values[s.key] ?? 0))));
  const max = ticks[ticks.length - 1];
  return (
    <div ref={container} className="ds-chart" role="group" aria-label={label}>
      <div className="ds-chart__plotrow">
        <YAxis ticks={ticks} height={height} />
        <div className="ds-chart__plot" style={{ height }}>
          {data.map((d, i) => (
            <div className="ds-chart__band" key={d.x}>
              <div className="ds-bar-group">
                {series.slice(0, 3).map(s => (
                  <button key={s.key} type="button" className="ds-bar ds-bar--single" style={{ height: `${((d.values[s.key] ?? 0) / max) * 100}%`, background: s.color }}
                    aria-label={`${d.x}, ${s.label}: ${fmtInt(d.values[s.key] ?? 0)}`}
                    {...bind(<TipContent title={d.x} sub={s.label} color={s.color} rows={[[s.label, fmtInt(d.values[s.key] ?? 0)]]} />, `g${i}${s.key}`)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ds-axis-x" aria-hidden="true">{data.map(d => <span key={d.x}>{d.x}</span>)}</div>
      {node}
    </div>
  );
}

/** §7.4 horizontal bars [EXTENSION]: 20px bars, 12px gap, 154px label column, value label in small-strong. */
export function HBarChart({ data, color = 'var(--ds-chart-cat-1)', label, format = fmtInt }: { data: { label: string; sub?: string; value: number }[]; color?: string; label: string; format?: (n: number) => string }) {
  const { container, bind, node } = useChartTip();
  const max = Math.max(...data.map(d => d.value), 1);
  if (!data.length) return <ChartEmpty height={200} />;
  return (
    <div ref={container} className="ds-chart ds-hbar" role="group" aria-label={label}>
      {data.map((d, i) => (
        <div className="ds-hbar__row" key={d.label}>
          <div className="ds-hbar__label"><span className="ds-ts-body-strong ds-truncate">{d.label}</span>{d.sub && <span className="ds-ts-small ds-truncate">{d.sub}</span>}</div>
          <div className="ds-hbar__track">
            <button type="button" className="ds-hbar__bar" style={{ width: `${(d.value / max) * 100}%`, background: color }} aria-label={`${d.label}: ${format(d.value)}`}
              {...bind(<TipContent title={d.label} rows={[['Value', format(d.value)]]} />, `h${i}`)} />
            <span className="ds-ts-small-strong">{format(d.value)}</span>
          </div>
        </div>
      ))}
      {node}
    </div>
  );
}

/** §7.5 standalone line / area chart [EXTENSION]: 2px strokes; points on hover/focus (always when ≤ 12); guide line + rich tooltip for all series at x. */
export function LineChart({ x, series, height = 300, label, area }: { x: string[]; series: (Series & { values: number[] })[]; height?: number; label: string; area?: boolean }) {
  const { container, bind, node } = useChartTip();
  const { ref, w } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const ticks = niceTicks(Math.max(...series.flatMap(s => s.values)));
  const max = ticks[ticks.length - 1];
  const n = x.length;
  const px = (i: number) => (n === 1 ? w / 2 : (i / (n - 1)) * w);
  const py = (v: number) => height - (v / max) * height;
  const showPts = n <= 12;
  const every = labelEvery(n);
  if (!n) return <ChartEmpty height={height} />;
  return (
    <div ref={container} className="ds-chart" role="group" aria-label={label}>
      <div className="ds-chart__plotrow">
        <YAxis ticks={ticks} height={height} />
        <div ref={ref} className="ds-chart__plot ds-chart__plot--svg" style={{ height }} onPointerLeave={() => setHover(null)}>
          <svg width={w} height={height} aria-hidden="true">
            <defs>
              {series.map(s => (
                <linearGradient key={s.key} id={`area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.12" /><stop offset="100%" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>
            {area && series.map(s => <path key={s.key} d={`M${px(0)},${height} ${s.values.map((v, i) => `L${px(i)},${py(v)}`).join(' ')} L${px(n - 1)},${height} Z`} fill={`url(#area-${s.key})`} />)}
            {series.map(s => <polyline key={s.key} points={s.values.map((v, i) => `${px(i)},${py(v)}`).join(' ')} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" />)}
            {hover !== null && <line x1={px(hover)} x2={px(hover)} y1="0" y2={height} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />}
            {series.map(s => s.values.map((v, i) => (showPts || hover === i) && <circle key={`${s.key}${i}`} cx={px(i)} cy={py(v)} r="3" fill={s.color} />))}
          </svg>
          {x.map((xl, i) => {
            const b = bind(<TipContent title={xl} rows={series.map(s => [s.label, fmtInt(s.values[i])] as [string, string])} />, `l${i}`);
            return (
              <button key={xl} type="button" className="ds-line-hit" style={{ left: Math.max(0, px(i) - Math.max(6, w / n / 2)), width: Math.min(w, px(i) + Math.max(6, w / n / 2)) - Math.max(0, px(i) - Math.max(6, w / n / 2)) }}
                aria-label={`${xl}: ${series.map(s => `${s.label} ${fmtInt(s.values[i])}`).join(', ')}`} aria-describedby={b['aria-describedby']}
                onPointerEnter={e => { setHover(i); b.onPointerEnter(e); }} onPointerLeave={b.onPointerLeave}
                onFocus={e => { setHover(i); b.onFocus(e); }} onBlur={() => { setHover(null); b.onBlur(); }} />
            );
          })}
        </div>
      </div>
      <div className="ds-axis-x ds-axis-x--line" aria-hidden="true" style={{ marginInlineStart: 38 }}>
        {x.map((xl, i) => <span key={xl} style={{ left: px(i) }}>{i % every === 0 ? xl : ''}</span>)}
      </div>
      {node}
    </div>
  );
}

/** §7.6 donut: 180px, 32px ring, track, 12 o'clock clockwise, 2px card-colored gaps; legend repeats every value. */
export function Donut({ data, label, center }: { data: { label: string; value: number; color: string }[]; label: string; center?: { value: string; caption: string } }) {
  const { container, bind, node } = useChartTip();
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 74, C = 2 * Math.PI * R;
  const gap = data.filter(d => d.value > 0).length > 1 ? 2 : 0;
  const [active, setActive] = useState<number | null>(null);
  const tipFor = (d: { label: string; value: number; color: string }) => <TipContent title={d.label} color={d.color} rows={[['Value', `${fmtInt(d.value)} (${fmtPct((d.value / total) * 100)})`]]} />;
  let acc = 0;
  if (!total) return <ChartEmpty height={180} />;
  return (
    <div ref={container} className="ds-donut" role="group" aria-label={label}>
      <div className="ds-donut__ring">
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r={R} fill="none" stroke="var(--ds-chart-track)" strokeWidth="32" />
        </svg>
        <svg width="180" height="180" viewBox="0 0 180 180" className="ds-donut__segs" aria-hidden="true">
          {data.map((d, i) => {
            const len = (d.value / total) * C;
            const seg = (
              <circle key={d.label} className={`ds-donut__seg${active === i ? ' is-active' : ''}`} cx="90" cy="90" r={R} fill="none" stroke={d.color} strokeWidth="32"
                strokeDasharray={`${Math.max(0, len - gap)} ${C - Math.max(0, len - gap)}`} strokeDashoffset={-acc} transform="rotate(-90 90 90)"
                {...bind(tipFor(d), `d${i}`)} onPointerEnter={e => { setActive(i); bind(tipFor(d), `d${i}`).onPointerEnter(e); }} onPointerLeave={() => { setActive(null); bind(tipFor(d), `d${i}`).onPointerLeave(); }} />
            );
            acc += len;
            return seg;
          })}
        </svg>
        {center && <div className="ds-donut__center"><span className="ds-ts-kpi-value">{center.value}</span><span className="ds-ts-small">{center.caption}</span></div>}
      </div>
      <ul className="ds-donut__legend">
        {data.map((d, i) => (
          <li key={d.label}>
            <button type="button" className="ds-donut__row" {...bind(tipFor(d), `dl${i}`)}
              onFocus={e => { setActive(i); bind(tipFor(d), `dl${i}`).onFocus(e); }} onBlur={() => { setActive(null); bind(tipFor(d), `dl${i}`).onBlur(); }}>
              <span className="ds-legend__item"><span className="ds-legend__mark" style={{ background: d.color }} aria-hidden="true" />{d.label}</span>
              <span>{fmtInt(d.value)} ({fmtPct((d.value / total) * 100)})</span>
            </button>
          </li>
        ))}
      </ul>
      {node}
    </div>
  );
}

/** §7.7 heatmap: grid, row labels, full-bleed heat cells with snapped fills and contrast-safe text. */
export function Heatmap({ rows, cols, values, format = fmtPct, reversed, label, rowLabel = 'Row' }: {
  rows: string[]; cols: string[]; values: number[][]; format?: (n: number) => string; reversed?: boolean; label: string; rowLabel?: string;
}) {
  const { container, bind, node } = useChartTip();
  const norm = useMemo(() => normalize(values.flat()), [values]);
  return (
    <div ref={container} className="ds-heatmap-wrap">
      <div className="ds-heatmap" role="table" aria-label={label} style={{ gridTemplateColumns: `minmax(140px, 1.2fr) repeat(${cols.length}, minmax(64px, 1fr))` }}>
        <div role="row" className="ds-heatmap__row ds-heatmap__row--head">
          <span role="columnheader" className="ds-heatmap__head ds-heatmap__head--first">{rowLabel}</span>
          {cols.map(c => <span role="columnheader" key={c} className="ds-heatmap__head">{c}</span>)}
        </div>
        {rows.map((r, i) => (
          <div role="row" className="ds-heatmap__row" key={r}>
            <span role="rowheader" className="ds-heatmap__label">{r}</span>
            {cols.map((c, j) => {
              const v = values[i][j];
              const cell = heatCell(norm(v), reversed);
              return (
                <span role="cell" key={c} className="ds-heatmap__cellwrap">
                  <button type="button" className={`ds-heat-cell${cell.ink ? ' ds-heat-cell--ink' : ''}`} style={{ background: cell.fill }}
                    aria-label={`${r}, ${c}: ${format(v)}`}
                    {...bind(<TipContent title={r} sub={c} color={cell.fill} rows={[['Value', format(v)], ['Relative position', `${Math.round(norm(v) * 100)}%`]]} />, `hm${i}-${j}`)}>
                    {format(v)}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {node}
    </div>
  );
}

/** §7.8 bubble matrix: size = volume (14 + √(v/max)·40), color = rate on the heat scale. */
export function BubbleMatrix({ rows, cols, volume, rate, label, reversed, rateLabel = 'Rate', volumeLabel = 'Volume' }: {
  rows: { label: string; sub: string }[]; cols: string[]; volume: number[][]; rate: number[][]; label: string; reversed?: boolean; rateLabel?: string; volumeLabel?: string;
}) {
  const { container, bind, node } = useChartTip();
  const vmax = Math.max(...volume.flat());
  const norm = normalize(rate.flat());
  const rowH = rows.length > 6 ? 64 : 88;
  return (
    <div ref={container} className="ds-bubble" role="group" aria-label={label}>
      {rows.map((r, i) => (
        <div className="ds-bubble__row" key={r.label} style={{ height: rowH, gridTemplateColumns: `154px repeat(${cols.length}, minmax(0, 1fr))` }}>
          <div className="ds-bubble__label"><span>{r.label}</span><span>{r.sub}</span></div>
          {cols.map((c, j) => {
            const d = 14 + Math.sqrt(volume[i][j] / vmax) * 40;
            const p = reversed ? 1 - norm(rate[i][j]) : norm(rate[i][j]);
            return (
              <span className="ds-bubble__cell" key={c}>
                <button type="button" className="ds-bubble__dot" style={{ width: d, height: d, background: heatColor(p) }}
                  aria-label={`${r.label}, ${c}: ${volumeLabel.toLowerCase()} ${fmtInt(volume[i][j])}, ${rateLabel.toLowerCase()} ${fmtPct(rate[i][j])}`}
                  {...bind(<TipContent title={r.label} sub={c} color={heatColor(p)} rows={[[volumeLabel, fmtInt(volume[i][j])], [rateLabel, fmtPct(rate[i][j])]]} />, `bm${i}-${j}`)} />
              </span>
            );
          })}
        </div>
      ))}
      <div className="ds-bubble__row ds-bubble__axis" style={{ gridTemplateColumns: `154px repeat(${cols.length}, minmax(0, 1fr))` }} aria-hidden="true">
        <span />{cols.map(c => <span key={c} className="ds-ts-axis-caption ds-clamp-2">{c}</span>)}
      </div>
      {node}
    </div>
  );
}
