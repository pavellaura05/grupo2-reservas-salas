import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Usuarios from '../pages/Usuarios/Usuarios';
import Salas from '../pages/Salas/Salas';
import Reservas from '../pages/Reservas/Reservas';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="salas" element={<Salas />} />
          <Route path="reservas" element={<Reservas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
