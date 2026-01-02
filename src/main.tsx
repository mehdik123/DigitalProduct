import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.tsx';
import LoginPage from './components/LoginPage.tsx';
import NutritionApp from './nutrition/NutritionApp';
import WelcomePortal from './components/WelcomePortal';
import './nutrition/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<WelcomePortal onSelectTraining={() => window.location.hash = '#/workouts'} />} />
          <Route path="/workouts" element={<App />} />
          <Route path="/nutrition/*" element={<NutritionApp />} />
          <Route path="/login/returning" element={<LoginPage />} />
          <Route path="/login/:userId" element={<LoginPage />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  </StrictMode>
);
