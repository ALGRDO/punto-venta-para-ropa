import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Ingresos } from './components/Ingresos';
import { Inventario } from './components/Inventario';
import { Ventas } from './components/Ventas';

// View placeholders
const Dashboard = () => <div className="glass" style={{ padding: '2rem' }}><h2>Dashboard</h2><p>Métricas y reportes (En construcción).</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="ingresos" element={<Ingresos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
