import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Usuarios from '../pages/Usuarios/Usuarios';
import Salas from '../pages/Salas/Salas';
import Reservas from '../pages/Reservas/Reservas';
import Login from '../pages/Login/Login';

const AppContent = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {!token ? (
        // Rutas públicas
        <Route path="/login" element={<Login />} />
      ) : (
        // Rutas protegidas
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="salas" element={<Salas />} />
          <Route path="reservas" element={<Reservas />} />
        </Route>
      )}
      <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
    </Routes>
  );
};

export default AppContent;
