import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import logo from './assets/logo.png'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
if (favicon) {
  favicon.href = logo;
}
