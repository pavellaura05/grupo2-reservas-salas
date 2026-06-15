import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Adaptado al modelo Reserva de Sequelize e integrando reglas de negocio Frontend
const schema = yup.object().shape({
  UsuarioId: yup.string().required('Debe seleccionar un usuario'),
  SalaId: yup.string().required('Debe seleccionar una sala'),
  fecha: yup.date()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .typeError("Fecha inválida")
    .required('La fecha es obligatoria')
    .min(new Date(new Date().toDateString()), 'No puedes reservar en fechas pasadas'),
  hora_inicio: yup.string().required('La hora de inicio es obligatoria'),
  hora_fin: yup.string().required('La hora de fin es obligatoria').test(
    'is-greater',
    'La hora de finalización debe ser posterior a la de inicio',
    function(value) {
      const { hora_inicio } = this.parent;
      if (!hora_inicio || !value) return true;
      return value > hora_inicio; // Comparación de strings 'HH:mm'
    }
  )
});

const ReservaForm = ({ reservaEdit, salas, usuarios, onClose, onSave }) => {
  const isEdit = !!reservaEdit;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (reservaEdit) {
      reset({
        UsuarioId: reservaEdit.UsuarioId,
        SalaId: reservaEdit.SalaId,
        fecha: reservaEdit.fecha,
        hora_inicio: reservaEdit.hora_inicio,
        hora_fin: reservaEdit.hora_fin
      });
    }
  }, [reservaEdit, reset]);

  // Reformatear data
  const onSubmit = (data) => {
    let d = new Date(data.fecha);
    let strDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const formattedData = {
      ...data,
      fecha: strDate 
    };
    onSave(formattedData);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-primary">
              {isEdit ? 'Editar Reserva' : 'Nueva Reserva'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                {/* Seleccionar Usuario */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Solicitante</label>
                  <select 
                    className={`form-select ${errors.UsuarioId ? 'is-invalid' : ''}`}
                    {...register('UsuarioId')}
                  >
                    <option value="">Seleccione usuario...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nombre}</option>
                    ))}
                  </select>
                  {errors.UsuarioId && <div className="invalid-feedback">{errors.UsuarioId.message}</div>}
                </div>

                {/* Seleccionar Sala */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Sala Reservada</label>
                  <select 
                    className={`form-select ${errors.SalaId ? 'is-invalid' : ''}`}
                    {...register('SalaId')}
                  >
                    <option value="">Seleccione sala...</option>
                    {salas.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                  {errors.SalaId && <div className="invalid-feedback">{errors.SalaId.message}</div>}
                </div>
              </div>

              <div className="row">
                {/* Fecha */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Fecha</label>
                  <input 
                    type="date" 
                    className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
                    {...register('fecha')}
                  />
                  {errors.fecha && <div className="invalid-feedback">{errors.fecha.message}</div>}
                </div>

                {/* Hora Inicio */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Hora Inicio</label>
                  <input 
                    type="time" 
                    className={`form-control ${errors.hora_inicio ? 'is-invalid' : ''}`}
                    {...register('hora_inicio')}
                  />
                  {errors.hora_inicio && <div className="invalid-feedback">{errors.hora_inicio.message}</div>}
                </div>

                {/* Hora Fin */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Hora Fin</label>
                  <input 
                    type="time" 
                    className={`form-control ${errors.hora_fin ? 'is-invalid' : ''}`}
                    {...register('hora_fin')}
                  />
                  {errors.hora_fin && <div className="invalid-feedback">{errors.hora_fin.message}</div>}
                </div>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Actualizar Reserva' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservaForm;
