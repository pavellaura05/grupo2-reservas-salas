import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Está seguro de que desea cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
        Swal.fire('Sesión cerrada', 'Ha cerrado sesión correctamente', 'success');
      }
    });
  };

  return (
    <nav className="navbar navbar-expand navbar-light top-navbar px-4 py-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <h5 className="mb-0 text-secondary d-none d-md-block">Menu / Administración</h5>
        </div>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.nombre || 'Usuario'}&background=0d6efd&color=fff`}
                  alt={user?.nombre || 'Usuario'} 
                  className="rounded-circle me-2" 
                  width="32" 
                  height="32" 
                />
                {user?.nombre || 'Usuario'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i> Mi Perfil</a></li>
                <li><span className="dropdown-item text-muted small">{user?.email}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item text-danger border-0 bg-transparent" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
