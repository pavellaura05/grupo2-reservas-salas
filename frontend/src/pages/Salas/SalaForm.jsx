import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Adaptado al modelo Sala de Sequelize
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre de la sala es obligatorio').min(3, 'Mínimo 3 caracteres'),
  capacidad: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('La capacidad es obligatoria')
    .positive('Debe ser un número positivo')
    .integer('Debe ser un número entero')
    .min(1, 'La capacidad mínima es 1'),
  tiene_proyector: yup.boolean().required(),
  disponible: yup.boolean().required()
});

const SalaForm = ({ salaEdit, onClose, onSave }) => {
  const isEdit = !!salaEdit;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tiene_proyector: false,
      disponible: true
    }
  });

  useEffect(() => {
    if (salaEdit) {
      reset({
        nombre: salaEdit.nombre,
        capacidad: salaEdit.capacidad,
        tiene_proyector: salaEdit.tiene_proyector,
        disponible: salaEdit.disponible
      });
    }
  }, [salaEdit, reset]);

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-primary">
              {isEdit ? 'Editar Sala' : 'Nueva Sala'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit(onSave)}>
            <div className="modal-body">
              {/* Nombre Sala */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre de la Sala</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  {...register('nombre')}
                  placeholder="Ej. Sala de Conferencias A"
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
              </div>

              {/* Capacidad */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Capacidad (Personas)</label>
                <input 
                  type="number" 
                  min="1"
                  className={`form-control ${errors.capacidad ? 'is-invalid' : ''}`}
                  {...register('capacidad')}
                  placeholder="Ej. 15"
                />
                {errors.capacidad && <div className="invalid-feedback">{errors.capacidad.message}</div>}
              </div>

              {/* Proyector */}
              <div className="mb-3 form-check form-switch ps-5">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch" 
                  id="tieneProyectorSwitch"
                  style={{ marginLeft: "-2.5em" }}
                  {...register('tiene_proyector')}
                />
                <label className="form-check-label fw-semibold" htmlFor="tieneProyectorSwitch">
                  ¿La sala tiene proyector?
                </label>
              </div>

              {/* Disponible */}
              <div className="mb-3 form-check form-switch ps-5">
                <input 
                  className="form-check-input bg-success border-success" 
                  type="checkbox" 
                  role="switch" 
                  id="disponibleSwitch"
                  style={{ marginLeft: "-2.5em" }}
                  {...register('disponible')}
                />
                <label className="form-check-label fw-semibold text-success" htmlFor="disponibleSwitch">
                  ¿Sala disponible / activa?
                </label>
              </div>

            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Guardar Cambios' : 'Crear Sala'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalaForm;
