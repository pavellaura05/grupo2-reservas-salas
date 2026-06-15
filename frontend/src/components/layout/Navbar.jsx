import React from 'react';

const Navbar = () => {
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
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0d6efd&color=fff" 
                  alt="Admin" 
                  className="rounded-circle me-2" 
                  width="32" 
                  height="32" 
                />
                Admin User
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i> Mi Perfil</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-danger" href="#"><i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
