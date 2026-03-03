import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './utils/logger';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register service worker via Vite PWA plugin (virtual helper)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  (async () => {
    try {
      const mod = await import('virtual:pwa-register' as string);
      const registerSW = mod.registerSW;
      registerSW({
        onRegistered(reg) {
          console.log('Service worker registered.', reg);
        },
        onRegisterError(err) {
          console.warn('Service worker registration failed:', err);
        },
      });
    } catch (err) {
      // The virtual module will fail to import if the plugin isn't installed yet
      console.debug('registerSW not available (install deps):', err);
    }
  })();
}
