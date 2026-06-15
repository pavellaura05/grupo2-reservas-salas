import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column">
      <div className="sidebar-header text-center">
        <h4 className="mb-0 text-white">
          <i className="bi bi-calendar2-check-fill me-2 text-primary"></i>
          ReservasApp
        </h4>
      </div>
      <ul className="nav nav-pills flex-column mb-auto mt-3">
        <li className="nav-item">
          <NavLink to="/" className="nav-link fw-semibold" end>
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/usuarios" className="nav-link fw-semibold">
            <i className="bi bi-people-fill me-2"></i> Usuarios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/salas" className="nav-link fw-semibold">
            <i className="bi bi-door-open-fill me-2"></i> Salas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/reservas" className="nav-link fw-semibold">
            <i className="bi bi-journal-bookmark-fill me-2"></i> Reservas
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
