import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.tsx';
import LoginPage from './components/LoginPage.tsx';
import NutritionApp from './nutrition/NutritionApp';
import { LanguageProvider } from './contexts/LanguageContext';
import { initKeyboardViewport } from './lib/keyboardViewport';
import './nutrition/index.css';
import './index.css';

function Root() {
  useEffect(() => initKeyboardViewport(), []);
  return (
    <AuthProvider>
      <LanguageProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/nutrition/*" element={<NutritionApp />} />
            <Route path="/login/returning" element={<LoginPage />} />
            <Route path="/login/:userId" element={<LoginPage />} />
          </Routes>
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
