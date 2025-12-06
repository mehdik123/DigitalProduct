import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import LoginPage from './components/LoginPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login/returning" element={<LoginPage />} />
        <Route path="/login/:userId" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
