import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.tsx';
import LoginPage from './components/LoginPage.tsx';
import NutritionApp from './nutrition/NutritionApp';
import { LanguageProvider } from './contexts/LanguageContext';
import './nutrition/index.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>
);
