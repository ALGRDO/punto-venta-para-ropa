import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Ingresos } from './components/Ingresos';
import { Inventario } from './components/Inventario';
import { Ventas } from './components/Ventas';
import { Familias } from './components/Familias';
import { Dashboard } from './components/Dashboard';
import { initDummyDataIfNeeded } from './services/db';

function App() {
  useEffect(() => {
    initDummyDataIfNeeded();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="ingresos" element={<Ingresos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="familias" element={<Familias />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
