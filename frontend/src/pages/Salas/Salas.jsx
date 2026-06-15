import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import SalaForm from './SalaForm';
import { getAll, create, update, remove } from '../../services/salas.service';

const Salas = () => {
  const [salas, setSalas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [salaEdit, setSalaEdit] = useState(null);

  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    try {
      const res = await getAll();
      setSalas(res.data);
    } catch(err) {
      console.warn("Usando Mocks de Salas", err);
      setSalas([
        { id: 1, nombre: 'Sala A', capacidad: 20, tiene_proyector: true, disponible: true },
        { id: 2, nombre: 'Sala B', capacidad: 10, tiene_proyector: false, disponible: true }
      ]);
    }
  }

  const filteredSalas = salas.filter(s => s.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenModal = (sala = null) => { setSalaEdit(sala); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setSalaEdit(null); };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?', text: "Se eliminará esta sala", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(id);
          Swal.fire('¡Eliminada!', 'Sala borrada de BD', 'success');
          loadSalas();
        }catch(e) {
          setSalas(salas.filter(s => s.id !== id));
          Swal.fire('Borrado Local', 'Backend desconectado', 'success');
        }
      }
    });
  };

  const handleSave = async (data) => {
    const salaProcessed = {
      ...data,
      tiene_proyector: String(data.tiene_proyector) === 'true',
      disponible: String(data.disponible) === 'true'
    };

    try {
      if (salaEdit) {
        await update(salaEdit.id, salaProcessed);
        Swal.fire('¡Actualizada!', 'Guardada en API', 'success');
      } else {
        await create(salaProcessed);
        Swal.fire('¡Creada!', 'Guardada en API', 'success');
      }
      loadSalas();
      handleCloseModal();
    } catch(err) {
       if (salaEdit) {
         setSalas(salas.map(s => (s.id === salaEdit.id ? { ...s, ...salaProcessed } : s)));
       } else {
         setSalas([...salas, { ...salaProcessed, id: Date.now() }]);
       }
       Swal.fire('¡Simulado!', 'Acción simulada', 'info');
       handleCloseModal();
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-gray-800">Gestión de Salas</h2>
        <button className="btn btn-primary shadow-sm" onClick={() => handleOpenModal()}><i className="bi bi-door-open-fill me-2"></i>Nueva Sala</button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col-md-6"><h6 className="m-0 fw-bold text-primary">Lista de Salas</h6></div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
                <input type="text" className="form-control border-start-0" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th className="ps-4">Nombre</th><th>Capacidad</th><th>Proyector</th><th>Estado</th><th className="text-center pe-4">Acciones</th></tr>
              </thead>
              <tbody>
                {filteredSalas.length > 0 ? (
                  filteredSalas.map(sala => (
                    <tr key={sala.id}>
                      <td className="ps-4 fw-semibold">{sala.nombre}</td>
                      <td><span className="badge bg-secondary"><i className="bi bi-people-fill me-1"></i>{sala.capacidad} pax</span></td>
                      <td>{sala.tiene_proyector ? <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Sí</span> : <span className="text-danger"><i className="bi bi-x-circle-fill me-1"></i>No</span>}</td>
                      <td><span className={`badge ${sala.disponible ? 'bg-success' : 'bg-warning text-dark'}`}>{sala.disponible ? 'Disponible' : 'No Disponible'}</span></td>
                      <td className="text-center pe-4">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenModal(sala)}><i className="bi bi-pencil-square"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sala.id)}><i className="bi bi-trash-fill"></i></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">No se encontraron salas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && <SalaForm salaEdit={salaEdit} onClose={handleCloseModal} onSave={handleSave} />}
    </div>
  );
};
export default Salas;
