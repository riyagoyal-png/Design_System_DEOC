import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Order: the spec's own CSS (tokens, base, blueprints), generated text styles, derived component CSS, charts, showcase chrome.
import './generated/ds.css';
import './generated/text-styles.css';
import './styles/derived.css';
import './styles/charts.css';
import './styles/showcase.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
