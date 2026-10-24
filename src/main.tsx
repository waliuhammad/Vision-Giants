import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './app/App';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

declare global {
  interface Window {
    __hydrated?: boolean;
  }
}

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages are hydrated; the dev server serves an empty shell and renders client-side.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

window.__hydrated = true;
