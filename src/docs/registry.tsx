import type { ReactNode } from 'react';
import { ComponentPage, type ComponentDoc } from './ComponentPage';
import { actionGroupDoc, buttonDoc, iconButtonDoc, linkActionDoc } from './components/actions';
import { attachDoc, checkboxDoc, dateDoc, fieldDoc, multiSelectDoc, radioDoc, richPickerDoc, searchDoc, selectDoc, switchDoc, textareaDoc, textInputDoc, toggleDoc, uploadDoc } from './components/inputs';
import { alertDoc, avatarDoc, badgeDoc, calloutDoc, chipDoc, countDoc, emptyDoc, loadingDoc, metricDoc, progressDoc, statusDoc, stepperDoc, tagDoc } from './components/display';
import { dashCardDoc, entityDoc, kpiDoc, mediaDoc, statusCardDoc, stripDoc } from './components/cards';
import { breadcrumbDoc, navDoc, pageHeaderDoc, paginationDoc, tabsDoc } from './components/navigation';
import { collapsibleDoc, tableCardDoc, tableDoc } from './components/data';
import { drawerDoc, modalDoc, toastDoc, tooltipDoc } from './components/overlays';
import { HowToUsePage, IntroductionPage, PrinciplesPage, RulesPage } from './pages/start';
import { BordersPage, ColorsPage, DensityPage, IconographyPage, MotionPage, RadiiPage, ResponsivePage, ShadowsPage, SpacingPage, TypographyPage } from './pages/foundations';
import { BubblePage, ChartFoundationsPage, DonutPage, GroupedBarPage, HeatmapPage, HorizontalBarPage, LinePage, ProgressVizPage, TooltipsLegendsPage, VerticalBarPage } from './pages/charts';
import { DashboardLayout, DetailLayout, FilterLayout, FormsLayout, HeaderLayout, KpiLayout, ModalWorkflowLayout, ShellLayout, TableLayout } from './pages/layouts';
import { AppsIndex, QaPage } from './pages/qa';
import { EXTRAS } from './components/extras';

export interface NavItemDef { path: string; title: string; description: string; render: () => ReactNode; keywords?: string }
export interface NavGroup { label: string; items: NavItemDef[] }

/** Component docs in the order of the brief, followed by the other §5 components. */
export const COMPONENT_DOCS: ComponentDoc[] = [
  buttonDoc, iconButtonDoc, searchDoc, textInputDoc, textareaDoc, selectDoc, multiSelectDoc, dateDoc, checkboxDoc, radioDoc, switchDoc, fieldDoc,
  badgeDoc, tagDoc, statusDoc, kpiDoc, metricDoc, entityDoc, tableDoc, paginationDoc, tabsDoc, navDoc, breadcrumbDoc, modalDoc, drawerDoc, tooltipDoc,
  alertDoc, toastDoc, uploadDoc, loadingDoc, emptyDoc,
  // other documented components
  linkActionDoc, actionGroupDoc, toggleDoc, attachDoc, richPickerDoc, calloutDoc, stepperDoc, dashCardDoc, statusCardDoc, countDoc, chipDoc, avatarDoc,
  progressDoc, stripDoc, mediaDoc, pageHeaderDoc, tableCardDoc, collapsibleDoc,
];
const OTHER_START = COMPONENT_DOCS.indexOf(linkActionDoc);
// Anatomy, playgrounds and static/no-variant notes kept in extras.tsx are merged in (existing fields win).
for (const d of COMPONENT_DOCS) Object.assign(d, { ...EXTRAS[d.path], ...Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined)) });

const comp = (d: ComponentDoc): NavItemDef => ({ path: d.path, title: d.title, description: d.summary, render: () => <ComponentPage doc={d} />, keywords: d.refs.join(' ') });

export const NAV: NavGroup[] = [
  { label: 'Getting Started', items: [
    { path: '/', title: 'Introduction', description: 'What this showcase is and how it is built from DESIGN_SYSTEM.md.', render: () => <IntroductionPage /> },
    { path: '/start/principles', title: 'Design Principles', description: 'The ten principles that define the visual identity (§1).', render: () => <PrinciplesPage /> },
    { path: '/start/how-to-use', title: 'How to Use This System', description: 'Adopting the tokens, base CSS, components and layouts in a new product.', render: () => <HowToUsePage /> },
    { path: '/start/rules', title: 'Implementation Rules', description: 'The mandatory rules and decision hierarchy for developers and AI agents (§10).', render: () => <RulesPage /> },
  ] },
  { label: 'Foundations', items: [
    { path: '/foundations/colors', title: 'Colors', description: 'Semantic, status, chart and component colors, and the primitive reference labels.', render: () => <ColorsPage /> },
    { path: '/foundations/typography', title: 'Typography', description: 'Inter, the six-step scale and every named text style.', render: () => <TypographyPage /> },
    { path: '/foundations/spacing', title: 'Spacing', description: 'The 4px scale, semantic spacing and real examples.', render: () => <SpacingPage /> },
    { path: '/foundations/radii', title: 'Radii', description: 'Role-based radii: surface 20, nested 16, control 10, small 8.', render: () => <RadiiPage /> },
    { path: '/foundations/borders', title: 'Borders', description: 'Border widths and colors; cards have none.', render: () => <BordersPage /> },
    { path: '/foundations/shadows', title: 'Shadows & Elevation', description: 'Shadow tokens, elevation levels, focus indicators and z-index.', render: () => <ShadowsPage /> },
    { path: '/foundations/motion', title: 'Motion', description: 'Durations and easing, with reduced-motion support.', render: () => <MotionPage /> },
    { path: '/foundations/iconography', title: 'Iconography', description: '3D illustration registry, icon-tile fallback and outline icons.', render: () => <IconographyPage /> },
    { path: '/foundations/density', title: 'Density Modes', description: 'Dense (default) and the derived comfortable mode.', render: () => <DensityPage /> },
    { path: '/foundations/responsive', title: 'Responsive Rules', description: 'Breakpoints, and the example apps rendered at real widths.', render: () => <ResponsivePage /> },
  ] },
  { label: 'Components', items: COMPONENT_DOCS.slice(0, OTHER_START).map(comp) },
  { label: 'Other Documented Components', items: COMPONENT_DOCS.slice(OTHER_START).map(comp) },
  { label: 'Data Visualization', items: [
    { path: '/charts/foundations', title: 'Chart Foundations', description: 'Palettes, heat scale, axes and number formatting (§7.1–7.3).', render: () => <ChartFoundationsPage /> },
    { path: '/charts/vertical-bar', title: 'Vertical Bar Charts', description: 'Single-series vertical bars (§7.4).', render: () => <VerticalBarPage /> },
    { path: '/charts/horizontal-bar', title: 'Horizontal Bar Charts', description: 'Horizontal bars [EXTENSION] (§7.4).', render: () => <HorizontalBarPage /> },
    { path: '/charts/grouped-bar', title: 'Grouped Bar Charts', description: 'Grouped bars [EXTENSION] (§7.4).', render: () => <GroupedBarPage /> },
    { path: '/charts/stacked-bar', title: 'Stacked Bar Charts', description: 'Stacked bars with the trend overlay (§7.4, §7.5).', render: () => <VerticalBarPage stacked /> },
    { path: '/charts/line', title: 'Line Charts', description: 'Standalone line charts [EXTENSION] (§7.5).', render: () => <LinePage /> },
    { path: '/charts/area', title: 'Area Charts', description: 'Area charts [EXTENSION] (§7.5).', render: () => <LinePage area /> },
    { path: '/charts/donut', title: 'Donut Charts', description: 'Donuts with legends that repeat every value (§7.6).', render: () => <DonutPage /> },
    { path: '/charts/heatmap', title: 'Heatmaps', description: 'Heat cells with contrast-safe snapping (§7.7).', render: () => <HeatmapPage /> },
    { path: '/charts/bubble', title: 'Bubble Matrices', description: 'Size = volume, color = rate (§7.8).', render: () => <BubblePage /> },
    { path: '/charts/progress', title: 'Progress Visualizations', description: 'Segmented status bars and progress bars (§5.34).', render: () => <ProgressVizPage /> },
    { path: '/charts/tooltips-legends', title: 'Chart Tooltips & Legends', description: 'The rich tooltip and the three legend styles (§7.9, §7.10).', render: () => <TooltipsLegendsPage /> },
  ] },
  { label: 'Layout Patterns', items: [
    { path: '/layouts/shell', title: 'Application Shell', description: 'Sidebar rail + main panel (§6.1).', render: () => <ShellLayout /> },
    { path: '/layouts/page-headers', title: 'Page Headers', description: 'Header defaults and variants (§6.2).', render: () => <HeaderLayout /> },
    { path: '/layouts/filters', title: 'Filter Toolbars', description: 'Place filters by scope (§6.3).', render: () => <FilterLayout /> },
    { path: '/layouts/kpi-grids', title: 'KPI Grids', description: 'KPI rows and metric variants (§6.4).', render: () => <KpiLayout /> },
    { path: '/layouts/data-tables', title: 'Data Tables', description: 'List / management pages (§6.6, §6.7).', render: () => <TableLayout /> },
    { path: '/layouts/dashboards', title: 'Dashboard Layouts', description: 'Dashboard composition (§6.9).', render: () => <DashboardLayout /> },
    { path: '/layouts/forms', title: 'Forms', description: 'Form containers and invariants (§6.10).', render: () => <FormsLayout /> },
    { path: '/layouts/detail-pages', title: 'Detail Pages', description: 'One record and its children (§6.8).', render: () => <DetailLayout /> },
    { path: '/layouts/modal-workflows', title: 'Modal Workflows', description: 'Create, edit and delete flows with the overlay contract.', render: () => <ModalWorkflowLayout /> },
  ] },
  { label: 'Example Applications', items: [
    { path: '/apps', title: 'All Applications', description: 'Five complete applications built only from the system.', render: () => <AppsIndex /> },
  ] },
  { label: 'Quality', items: [
    { path: '/qa', title: 'Visual QA', description: 'Coverage matrix, live checks, automated accessibility results and specification findings.', render: () => <QaPage /> },
  ] },
];

export const APPS = [
  { id: 'analytics', title: 'Analytics Dashboard', description: 'KPI cards, line/donut/bar/bubble charts, filters, a sortable table and live integration status.' },
  { id: 'crm', title: 'CRM Dashboard', description: 'Customer metrics, stacked bars with a trend overlay, a heatmap, and searchable account records.' },
  { id: 'employees', title: 'Employee Management', description: 'Search, filters, tabs with counts, sorting, selection, pagination, add/edit panel, delete confirmation.' },
  { id: 'projects', title: 'Project Management', description: 'Project cards with progress, a detail page, task lists by state and a three-step creation wizard.' },
  { id: 'settings', title: 'Settings & Forms', description: 'A full-page multi-section form with validation, instant-apply switches and radio cards.' },
];

export const ALL_ITEMS = NAV.flatMap(g => g.items);
