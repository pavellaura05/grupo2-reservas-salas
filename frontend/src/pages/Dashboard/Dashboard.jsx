import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getAll as getUsuarios } from '../../services/usuarios.service';
import { getAll as getSalas } from '../../services/salas.service';
import { getAll as getReservas } from '../../services/reservas.service';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalSalas: 0,
    totalReservas: 0,
    reservasActivas: 0
  });

  const [proximasReservas, setProximasReservas] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Intentamos jalar data real del backend
      const [usrRes, salaRes, resRes] = await Promise.all([
        getUsuarios(), getSalas(), getReservas()
      ]);
      const users = usrRes.data;
      const salas = salaRes.data;
      const reservs = resRes.data;

      setStats({
        totalUsuarios: users.length,
        totalSalas: salas.length,
        totalReservas: reservs.length,
        reservasActivas: reservs.filter(r => r.estado === 'activa').length
      });

      // Mapear reservas con su info (si el backend no hizo join con Includes, lo unimos aquí manual)
      const proximas = reservs.filter(r => r.estado === 'activa').slice(0, 5).map(r => ({
        ...r,
        Usuario: users.find(u => u.id === r.UsuarioId) || { nombre: 'Desconocido' },
        Sala: salas.find(s => s.id === r.SalaId) || { nombre: 'Desconocida' }
      }));
      setProximasReservas(proximas);

    } catch (error) {
      console.warn("No se pudo conectar al Backend. Cargando Mocks temporales en Dashboard.");
      // Fallback a Mocks
      setStats({ totalUsuarios: 12, totalSalas: 5, totalReservas: 48, reservasActivas: 5 });
      setProximasReservas([
        { id: 1, Usuario: { nombre: 'Juan Pérez' }, Sala: { nombre: 'Sala A' }, fecha: '2026-06-15', hora_inicio: '10:00', hora_fin: '12:00', estado: 'activa' },
        { id: 2, Usuario: { nombre: 'María Gómez' }, Sala: { nombre: 'Sala B' }, fecha: '2026-06-15', hora_inicio: '14:00', hora_fin: '16:00', estado: 'activa' }
      ]);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-gray-800">Dashboard General</h2>
        <NavLink to="/reservas" className="btn btn-primary shadow-sm">
          <i className="bi bi-plus-lg me-2"></i>Nueva Reserva
        </NavLink>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 border-start border-primary border-4 shadow-sm h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">Total Usuarios</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.totalUsuarios}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-people fs-2 text-secondary opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 border-start border-success border-4 shadow-sm h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">Total Salas</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.totalSalas}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-door-open fs-2 text-secondary opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 border-start border-info border-4 shadow-sm h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-info text-uppercase mb-1">Total Reservas</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.totalReservas}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-journal-check fs-2 text-secondary opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 border-start border-warning border-4 shadow-sm h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1">Reservas Activas</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.reservasActivas}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-calendar-event fs-2 text-secondary opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 fw-bold text-primary">Detalle de Próximas Reservas</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Sala</th>
                      <th>Usuario</th>
                      <th>Fecha</th>
                      <th>Horario</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proximasReservas.length > 0 ? (
                      proximasReservas.map(res => (
                        <tr key={res.id}>
                          <td className="fw-semibold">{res.Sala?.nombre}</td>
                          <td>{res.Usuario?.nombre}</td>
                          <td>{res.fecha}</td>
                          <td>{res.hora_inicio} - {res.hora_fin}</td>
                          <td>
                            <span className="badge bg-success">Activa</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="text-center py-4">No hay reservas próximas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
