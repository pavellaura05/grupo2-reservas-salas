import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import UsuarioForm from './UsuarioForm';
import { getAll, create, update, remove } from '../../services/usuarios.service';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const res = await getAll();
      setUsuarios(res.data);
    } catch (error) {
      console.warn("API falló, usando Mocks para Usuarios", error);
      setUsuarios([
        { id: 1, nombre: 'Admin Master', email: 'admin@empresa.com', rol: 'admin' },
        { id: 2, nombre: 'Juan Pérez', email: 'jperez@empresa.com', rol: 'usuario' }
      ]);
    }
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (usuario = null) => {
    setUsuarioEdit(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioEdit(null);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?', text: "No podrás revertir esta acción", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(id);
          Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado de la BD.', 'success');
          loadUsuarios();
        } catch (error) {
          setUsuarios(usuarios.filter(u => u.id !== id));
          Swal.fire('¡Eliminado Local!', 'Simulado ya que no hay conexión a API.', 'success');
        }
      }
    });
  };

  const handleSave = async (data) => {
    try {
      if (usuarioEdit) {
        await update(usuarioEdit.id, data);
        Swal.fire('¡Actualizado!', 'Usuario actualizado en servidor', 'success');
      } else {
        await create(data);
        Swal.fire('¡Creado!', 'Usuario creado en servidor', 'success');
      }
      loadUsuarios();
      handleCloseModal();
    } catch (error) {
      // Fallback
      if (usuarioEdit) {
        setUsuarios(usuarios.map(u => (u.id === usuarioEdit.id ? { ...u, ...data } : u)));
      } else {
        setUsuarios([...usuarios, { ...data, id: Date.now() }]);
      }
      Swal.fire('¡Simulado!', 'Acción simulada localmente (API caída)', 'info');
      handleCloseModal();
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-gray-800">Gestión de Usuarios</h2>
        <button className="btn btn-primary shadow-sm" onClick={() => handleOpenModal()}>
          <i className="bi bi-person-plus-fill me-2"></i>Nuevo Usuario
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col-md-6"><h6 className="m-0 fw-bold text-primary">Lista de Usuarios</h6></div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
                <input type="text" className="form-control border-start-0" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th className="ps-4">Nombre</th><th>Email</th><th>Rol</th><th className="text-center pe-4">Acciones</th></tr>
              </thead>
              <tbody>
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map(user => (
                    <tr key={user.id}>
                      <td className="ps-4 fw-semibold">{user.nombre}</td>
                      <td>{user.email}</td>
                      <td><span className={`badge ${user.rol === 'admin' ? 'bg-danger' : 'bg-info'}`}>{user.rol.toUpperCase()}</span></td>
                      <td className="text-center pe-4">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenModal(user)}><i className="bi bi-pencil-square"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}><i className="bi bi-trash-fill"></i></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center py-4 text-muted">No se encontraron usuarios.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && <UsuarioForm usuarioEdit={usuarioEdit} onClose={handleCloseModal} onSave={handleSave} />}
    </div>
  );
};

export default Usuarios;
