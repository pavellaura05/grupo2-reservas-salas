import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReservaForm from './ReservaForm';
import { getAll, create, update, remove } from '../../services/reservas.service';
import { getAll as getSalas } from '../../services/salas.service';
import { getAll as getUsuarios } from '../../services/usuarios.service';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reservaEdit, setReservaEdit] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resSalas, resUsu, resReservas] = await Promise.all([
        getSalas(), getUsuarios(), getAll()
      ]);
      setSalas(resSalas.data);
      setUsuarios(resUsu.data);
      setReservas(resReservas.data);
    } catch (e) {
      console.warn("API de reservas falló, usando Mocks temporales", e);
      setSalas([{ id: 1, nombre: 'Sala A' }, { id: 2, nombre: 'Sala B' }]);
      setUsuarios([{ id: 1, nombre: 'Admin Master' }]);
      setReservas([
        { id: 1, UsuarioId: 1, SalaId: 1, fecha: '2026-06-15', hora_inicio: '10:00', hora_fin: '12:00', estado: 'activa' }
      ]);
    }
  };

  const getNombreSala = (id) => salas.find(s => s.id === Number(id))?.nombre || 'Desconocida';
  const getNombreUsuario = (id) => usuarios.find(u => u.id === Number(id))?.nombre || 'Desconocido';

  const filteredReservas = reservas.filter(r => {
    const term = searchTerm.toLowerCase();
    return getNombreSala(r.SalaId).toLowerCase().includes(term) ||
           getNombreUsuario(r.UsuarioId).toLowerCase().includes(term) ||
           r.fecha.includes(term);
  });

  const handleOpenModal = (reserva = null) => { setReservaEdit(reserva); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setReservaEdit(null); };

  const handleStatusChange = (id, nuevoEstado) => {
    Swal.fire({
      title: '¿Confirmar acción?', text: `La reserva pasará a estado: ${nuevoEstado}`, icon: 'question',
      showCancelButton: true, confirmButtonColor: nuevoEstado === 'cancelada' ? '#d33' : '#198754',
      confirmButtonText: 'Sí, confirmar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await update(id, { estado: nuevoEstado });
          Swal.fire('¡Actualizado API!', `La reserva fue ${nuevoEstado}.`, 'success');
          loadData();
        } catch(e) {
          setReservas(reservas.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
          Swal.fire('¡Actualizado Local!', `Simulado ya que API falló.`, 'success');
        }
      }
    });
  };

  const handleSave = async (data) => {
    // Validar duplicados básicos Backend simulación (frontend validation only)
    const conflicto = reservas.find(r => 
      r.SalaId === Number(data.SalaId) && r.fecha === data.fecha && r.estado === 'activa' &&
      r.id !== (reservaEdit ? reservaEdit.id : null) &&
      ((data.hora_inicio >= r.hora_inicio && data.hora_inicio < r.hora_fin) ||
       (data.hora_fin > r.hora_inicio && data.hora_fin <= r.hora_fin))
    );
    if (conflicto) return Swal.fire('¡Conflicto!', 'La sala está ocupada', 'error');

    try {
      if (reservaEdit) {
        await update(reservaEdit.id, data);
        Swal.fire('¡Actualizada!', 'Reserva modificada en API', 'success');
      } else {
        await create({ ...data, estado: 'activa' });
        Swal.fire('¡Registrada!', 'Reserva generada en API', 'success');
      }
      loadData();
      handleCloseModal();
    } catch(err) {
      if (reservaEdit) {
        setReservas(reservas.map(r => (r.id === reservaEdit.id ? { ...r, ...data, UsuarioId: Number(data.UsuarioId), SalaId: Number(data.SalaId) } : r)));
      } else {
        setReservas([...reservas, { ...data, id: Date.now(), estado: 'activa', UsuarioId: Number(data.UsuarioId), SalaId: Number(data.SalaId) }]);
      }
      Swal.fire('¡Simulado!', 'Acción simulada sin backend', 'info');
      handleCloseModal();
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-gray-800">Gestión de Reservas</h2>
        <button className="btn btn-primary shadow-sm" onClick={() => handleOpenModal()}><i className="bi bi-calendar-plus-fill me-2"></i>Crear Reserva</button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col-md-6"><h6 className="m-0 fw-bold text-primary">Listado General</h6></div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
                <input type="text" className="form-control border-start-0" placeholder="Buscar por sala o usuario..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th className="ps-4">Fecha</th><th>Horario</th><th>Sala</th><th>Solicitante</th><th>Estado</th><th className="text-center pe-4">Acciones</th></tr>
              </thead>
              <tbody>
                {filteredReservas.length > 0 ? (
                  filteredReservas.map(res => (
                    <tr key={res.id}>
                      <td className="ps-4 fw-semibold">{res.fecha}</td>
                      <td><i className="bi bi-clock me-1 text-muted"></i>{res.hora_inicio} - {res.hora_fin}</td>
                      <td>{getNombreSala(res.SalaId)}</td>
                      <td>{getNombreUsuario(res.UsuarioId)}</td>
                      <td><span className={`badge ${res.estado === 'activa' ? 'bg-success' : 'bg-danger'}`}>{res.estado.toUpperCase()}</span></td>
                      <td className="text-center pe-4">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenModal(res)} disabled={res.estado === 'cancelada'}><i className="bi bi-pencil-square"></i></button>
                        {res.estado === 'activa' ? (
                          <button className="btn btn-sm btn-outline-warning" onClick={() => handleStatusChange(res.id, 'cancelada')} title="Cancelar"><i className="bi bi-x-circle-fill"></i></button>
                        ) : (
                          <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusChange(res.id, 'activa')} title="Activar"><i className="bi bi-check-circle-fill"></i></button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No se encontraron reservas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && <ReservaForm reservaEdit={reservaEdit} salas={salas} usuarios={usuarios} onClose={handleCloseModal} onSave={handleSave} />}
    </div>
  );
};

export default Reservas;
