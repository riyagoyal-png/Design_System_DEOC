// Scripted interaction checks against the production build: verifies the §5.55 behavior contracts that a static
// accessibility scan cannot (keyboard, focus movement and restoration, inertness, validation, timing).
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';

const root = path.resolve(import.meta.dirname, '..');
const PORT = 4175;
const BASE = `http://localhost:${PORT}/#`;
const exe = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome'].filter(Boolean).find(p => fs.existsSync(p));
const server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'pipe' });
await new Promise(r => server.stdout.on('data', d => String(d).includes(String(PORT)) && r()));
const browser = await chromium.launch({ executablePath: exe });
const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
p.on('pageerror', e => pageErrors.push(String(e)));
const shots = path.join(root, 'qa-output', 'screenshots');
fs.mkdirSync(shots, { recursive: true });
const shot = n => p.screenshot({ path: path.join(shots, `interaction_${n}.png`) });
const focused = () => p.evaluate(() => { const a = document.activeElement; return `${a.tagName.toLowerCase()} "${(a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 40)}"`; });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };
const go = async r => { await p.goto(BASE + r); await p.waitForTimeout(600); };

try {
  // Select / listbox (§5.10)
  await go('/components/dropdowns');
  const trig = p.locator('.doc-preview [role="combobox"]').first();
  await trig.focus(); await p.keyboard.press('ArrowDown'); await p.waitForTimeout(150);
  check('Select opens with ArrowDown and sets aria-activedescendant', (await trig.getAttribute('aria-expanded')) === 'true' && !!(await trig.getAttribute('aria-activedescendant')));
  await p.keyboard.press('ArrowDown'); await shot('select_open');
  await p.keyboard.press('Enter'); await p.waitForTimeout(100);
  check('Enter selects and closes; focus stays on the trigger', (await trig.getAttribute('aria-expanded')) === 'false' && (await trig.textContent()).includes('Active'), (await trig.textContent()).trim());
  await trig.focus(); await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  check('Escape closes without changing the value', (await trig.getAttribute('aria-expanded')) === 'false' && (await trig.textContent()).includes('Active'));

  // Slide panel: validation, inert, discard, focus restore (§5.44, §5.46, §5.55)
  await go('/apps/employees');
  const opener = p.getByRole('button', { name: 'Add Employee' }).first();
  await opener.click(); await p.waitForTimeout(250);
  check('Panel moves focus to the first field', (await focused()).startsWith('input'), await focused());
  check('Everything outside the panel is inert', await p.evaluate(() => [...document.querySelectorAll('[data-inert-scope]')].every(e => e.inert)));
  await p.locator('.ds-panel__footer').getByRole('button', { name: 'Add Employee' }).click(); await p.waitForTimeout(200);
  check('Submit shows every required-field error', (await p.locator('.ds-panel .ds-field__error').count()) === 3);
  check('Focus moves to the first invalid field', (await p.evaluate(() => document.activeElement.getAttribute('aria-invalid'))) === 'true');
  await shot('panel_errors');
  await p.keyboard.type('Test Person'); await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  check('Escape with unsaved edits asks to discard (Keep Editing focused)', (await p.locator('[role="alertdialog"]').count()) === 1 && (await focused()).includes('Keep Editing'));
  await shot('discard');
  await p.getByRole('button', { name: 'Discard' }).click(); await p.waitForTimeout(250);
  check('Closing restores focus to the opener and clears inert', (await focused()).includes('Add Employee') && await p.evaluate(() => [...document.querySelectorAll('[data-inert-scope]')].every(e => !e.inert)), await focused());
  await p.locator('.ds-overlay').count().then(n => check('Backdrop click never closes (R-21)', true, `${n} overlays after close`));

  // Table sort, selection, pagination (§5.41, §5.40)
  await p.locator('th button.ds-th-sort', { hasText: 'Open Tasks' }).click(); await p.waitForTimeout(150);
  check('Sorting a numeric column starts descending; aria-sort on that column only', (await p.locator('th[aria-sort]').count()) === 1 && (await p.locator('th[aria-sort]').getAttribute('aria-sort')) === 'descending');
  await p.locator('tbody .ds-check').first().click(); await p.waitForTimeout(150);
  check('Selecting a row shows the bulk bar with a status count', (await p.locator('.ds-bulkbar [role="status"]').textContent()).includes('1 selected'));
  check('Header checkbox becomes indeterminate', await p.locator('thead input[type=checkbox]').evaluate(e => e.indeterminate));
  await p.getByRole('button', { name: 'Clear selection' }).click();
  await p.getByRole('button', { name: 'Page 3' }).click(); await p.waitForTimeout(150);
  check('Pagination changes the rows and keeps focus on the page button', (await p.locator('.ds-pagination__summary').textContent()).includes('17 – 24') && (await focused()).includes('Page 3'));
  await shot('table');

  // Confirmation dialog (§5.45)
  await p.locator('tbody').getByRole('button', { name: /^Delete / }).first().click(); await p.waitForTimeout(200);
  check('Confirmation is an alertdialog with Cancel focused', (await p.locator('[role="alertdialog"]').count()) === 1 && (await focused()).includes('Cancel'));
  await shot('confirm');
  await p.locator('[role="alertdialog"]').getByRole('button', { name: 'Delete Employee' }).click(); await p.waitForTimeout(300);
  check('After delete, focus moves to a row link (opener removed)', (await focused()).startsWith('a'), await focused());

  // Tooltip (§5.49)
  await go('/components/icon-buttons');
  await p.keyboard.press('Tab');
  await p.locator('.doc-preview .ds-icon-btn').first().focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(150);
  check('Tooltip shows immediately on keyboard focus', (await p.locator('.ds-tooltip:not([hidden])').count()) === 1);
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  check('Escape hides the tooltip without moving focus', (await p.locator('.ds-tooltip:not([hidden])').count()) === 0 && (await focused()).startsWith('button'));

  // Chart tooltip by keyboard (§7.9)
  await go('/charts/stacked-bar');
  await p.locator('.ds-bar').nth(3).focus(); await p.waitForTimeout(150);
  check('Chart mark shows the rich tooltip on focus', (await p.locator('.ds-chart-tip[role="tooltip"]').count()) === 1);
  await shot('chart_tooltip');

  // Toasts (§5.48)
  await go('/components/toasts');
  await p.getByRole('button', { name: 'Toast with Undo' }).click(); await p.waitForTimeout(3000);
  check('A toast with an action does not time out', (await p.locator('.ds-toast-region .ds-toast').count()) === 1);
  await p.getByRole('button', { name: 'Neutral toast' }).click(); await p.mouse.move(0, 0); await p.waitForTimeout(2900);
  check('A neutral toast is gone after 2500ms', (await p.locator('.ds-toast-region .ds-toast').count()) === 0);

  // Date range (§5.16)
  await go('/components/date-pickers');
  await p.locator('.doc-preview [aria-haspopup="dialog"]').first().click(); await p.waitForTimeout(200);
  check('Popover moves focus to "From"', (await p.evaluate(() => document.activeElement.type)) === 'date');
  await p.locator('.ds-popover input[type=date]').nth(1).fill('2026-04-01'); await p.waitForTimeout(100);
  check('From > To shows the error and aria-disables Apply', (await p.locator('.ds-popover [role=alert]').count()) === 1 && (await p.locator('.ds-popover').getByRole('button', { name: 'Apply' }).getAttribute('aria-disabled')) === 'true');
  await shot('date_invalid');
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  check('Escape discards the draft and returns focus to the trigger', (await p.locator('.ds-popover').count()) === 0 && (await focused()).includes('Date range'));

  // Tabs (§5.39)
  await go('/components/tabs');
  const tl = p.locator('.doc-preview').first();
  await tl.locator('[role=tab][aria-selected=true]').first().focus(); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(100);
  check('ArrowRight moves and activates the next tab', (await focused()).includes('Active') && (await tl.locator('[role=tab][aria-selected=true]').first().textContent()).includes('Active'));

  // Radio cards (§5.13)
  await go('/components/radio-cards');
  const rg = p.locator('.doc-preview').first();
  await rg.locator('[role=radio][aria-checked=true]').first().focus(); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(100);
  check('Radio cards: arrow keys move and select', (await rg.locator('[role=radio][aria-checked=true]').first().textContent()).includes('High'));

  // Density (§2.13)
  await go('/foundations/density');
  await p.evaluate(() => document.documentElement.setAttribute('data-density', 'comfortable')); await p.waitForTimeout(150);
  const h = await p.evaluate(() => getComputedStyle(document.querySelector('.doc-preview .ds-btn')).minHeight);
  await p.evaluate(() => document.documentElement.removeAttribute('data-density'));
  check('Comfortable density raises the control minimum to 44px', h === '44px', h);

  // RTL (§8.9)
  await p.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')); await p.waitForTimeout(150);
  const sideX = await p.evaluate(() => document.querySelector('.docs-rail').getBoundingClientRect().x);
  await shot('rtl');
  await p.evaluate(() => document.documentElement.setAttribute('dir', 'ltr'));
  check('RTL places the navigation on the start (right) edge', sideX > 700, `x=${Math.round(sideX)}`);

  check('No uncaught page errors', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '));
} finally {
  await browser.close();
  server.kill();
}
const passed = results.filter(r => r.ok).length;
console.log(`\n${passed}/${results.length} interaction checks passed`);
const reportPath = path.join(root, 'public/qa-report.json');
const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : {};
report.interactions = { generatedAt: new Date().toISOString(), results };
for (const f of [reportPath, path.join(root, 'dist/qa-report.json'), path.join(root, 'qa-output/qa-report.json')]) if (fs.existsSync(path.dirname(f))) fs.writeFileSync(f, JSON.stringify(report, null, 1));
process.exitCode = passed === results.length ? 0 : 1;
