import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

console.log("main.jsx: Starting app mount");

try {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log("main.jsx: App mounted");
} catch (e) {
  console.error("main.jsx: Error mounting app", e);
  document.body.innerHTML = `<div style="color:red; padding: 20px;"><h1>Mount Error</h1><pre>${e.toString()}</pre></div>`;
}
