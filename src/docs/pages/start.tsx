import { useMemo } from 'react';
import { marked } from 'marked';
import { section, spec } from '../../lib/spec';
import { CodeBlock, DocSection, wrapTables } from '../kit';
import { href } from '../../lib/router';

/** Renders spec sections verbatim (markdown → HTML) so the guidance stays identical to DESIGN_SYSTEM.md. */
export function SpecMd({ nums }: { nums: string[] }) {
  const html = useMemo(() => nums.map(n => {
    const s = section(n);
    return s ? `<h2>§${s.title}</h2>` + wrapTables(marked.parse(s.body, { async: false }) as string) : '';
  }).join(''), [nums]);
  return <div className="doc-md doc-md--open" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function IntroductionPage() {
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">This is a standalone, interactive implementation of <b>DESIGN_SYSTEM.md</b> — the Dark Operations Console design language: a dark, low-glare, data-dense visual system with depth through shadow, one blue accent, glowing status and a strict small type scale. Every color, size, radius and shadow on this site comes from the specification's token file; the showcase itself is built with the components it documents.</p>
      <div className="doc-intro-grid">
        {[
          ['Foundations', 'Tokens for color, type, spacing, radii, borders, shadows, motion, icons, density and responsive rules.', '/foundations/colors'],
          ['Components', `${51} documented components with live previews, variants, forced states, anatomy, specs and playgrounds.`, '/components/buttons'],
          ['Data visualization', 'Bars, lines, areas, donuts, heatmaps and bubble matrices drawn only with §7 tokens.', '/charts/foundations'],
          ['Layout patterns', 'Shells, headers, filters, KPI grids, tables, dashboards, forms, detail pages and modal workflows.', '/layouts/shell'],
          ['Example applications', 'Five full applications in the same language: analytics, CRM, employees, projects, settings.', '/apps'],
          ['Visual QA', 'Coverage matrix, live token and asset checks, automated accessibility results and spec findings.', '/qa'],
        ].map(([t, d, p]) => (
          <a key={t} className="ds-dash-card doc-intro-card" href={href(p)}><span className="ds-text-card-title">{t}</span><span className="ds-text-body-muted">{d}</span></a>
        ))}
      </div>
      <DocSection id="source" title="Source of truth">
        <p className="ds-text-body">The specification lives in <code>spec/DESIGN_SYSTEM.md</code> ({spec.lineCount.toLocaleString('en-GB')} lines). <code>npm run spec</code> extracts its token file, base CSS and component blueprints into <code>src/generated/ds.css</code> verbatim, plus the token, text-style, registry and section data the pages render. Change the spec, re-run, and the showcase follows.</p>
      </DocSection>
      <SpecMd nums={['0.1', '0.2']} />
    </div>
  );
}

export function PrinciplesPage() {
  return <div className="doc-page"><SpecMd nums={['1']} /></div>;
}

export function HowToUsePage() {
  return (
    <div className="doc-page">
      <p className="ds-text-body doc-lead">To build a new product in this language you need three things from the specification, in this order. The showcase project is a working example of each step.</p>
      <DocSection id="steps" title="Adopting the system">
        <ol className="doc-list doc-list--num">
          <li><b>Tokens.</b> Copy the §3 <code>:root</code> block into your global stylesheet (or use <code>src/generated/ds.css</code>). Every value in components must come from it.</li>
          <li><b>Base CSS.</b> Copy §4: box-sizing, Inter, scrollbars, the single focus-visible rule, boundary mode, reduced motion, RTL icon flipping.</li>
          <li><b>Components.</b> Build each component to its §5 spec. The blueprints are HTML + CSS; behavior follows the §5.55 contracts. This project's React versions are in <code>src/components/ds</code>.</li>
          <li><b>Layouts.</b> Compose pages from §6 defaults and variants; record deviations.</li>
          <li><b>Verify.</b> Run the §13 checklist (this project automates part of it: <code>npm run qa</code>).</li>
        </ol>
      </DocSection>
      <DocSection id="tokens" title="Using tokens in code">
        <CodeBlock lang="css" title="CSS" code={`.my-card {\n  padding: var(--ds-space-card);\n  border-radius: var(--ds-radius-card);\n  background: var(--ds-color-surface-card);\n  box-shadow: var(--ds-shadow-card);\n  color: var(--ds-color-text-secondary);\n}`} />
        <CodeBlock title="React (this project)" code={`import { Button } from './components/ds/Button';\nimport { KpiCard } from './components/ds/Cards';\n\n<KpiCard label="Total Users" value="1,284" icon={<IconTile icon={Users} />} />\n<Button leading={Plus}>Add User</Button>`} />
      </DocSection>
      <DocSection id="density" title="Density and contrast modes">
        <CodeBlock lang="html" title="HTML" code={`<html data-density="comfortable">   <!-- §2.13 -->\n<html data-contrast="more">         <!-- §9.3 boundary mode (also automatic under prefers-contrast: more) -->`} />
      </DocSection>
      <SpecMd nums={['0.3', '0.4', '0.5']} />
    </div>
  );
}

export function RulesPage() {
  return <div className="doc-page"><SpecMd nums={['10']} /></div>;
}
