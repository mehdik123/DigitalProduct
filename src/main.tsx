import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { initKeyboardViewport } from './lib/keyboardViewport';
import PageLoader from './components/PageLoader';
import { Toaster } from 'sonner';
import './index.css';

const App = lazy(() => import('./App.tsx'));
const LoginPage = lazy(() => import('./components/LoginPage.tsx'));

function Root() {
  useEffect(() => initKeyboardViewport(), []);
  return (
    <AuthProvider>
      <LanguageProvider>
        <HashRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/nutrition/*" element={<Navigate to="/" replace />} />
              <Route path="/login/returning" element={<LoginPage />} />
              <Route path="/login/:userId" element={<LoginPage />} />
            </Routes>
          </Suspense>
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'font-sans text-sm',
              style: { background: '#14151c', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
            }}
          />
        </HashRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

const container = document.getElementById('root')!;
type RootHandle = ReturnType<typeof createRoot>;
const rootKey = '__hybridAthleteRoot__';
const existingRoot = (container as HTMLElement & { [rootKey]?: RootHandle })[rootKey];
const root = existingRoot ?? createRoot(container);
(container as HTMLElement & { [rootKey]?: RootHandle })[rootKey] = root;

root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);
