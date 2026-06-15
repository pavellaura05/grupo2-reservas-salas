import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Usuarios from '../pages/Usuarios/Usuarios';
import Salas from '../pages/Salas/Salas';
import Reservas from '../pages/Reservas/Reservas';
import Login from '../pages/Login/Login';
import AppContent from './AppContent';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default AppRouter;


