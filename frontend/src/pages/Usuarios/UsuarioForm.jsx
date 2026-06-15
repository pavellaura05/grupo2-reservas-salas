import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Esquema de validación con Yup adaptado al modelo de Sequelize
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().required('El email es obligatorio').email('Debe ser un email válido'),
  password: yup.string().when('$isEdit', (isEdit, schema) => {
    return isEdit[0] 
      ? schema.notRequired() // En edición, la contraseña puede no venir si no se quiere cambiar
      : schema.required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres');
  }),
  rol: yup.string().required('El rol es obligatorio').oneOf(['admin', 'usuario'], 'Rol inválido')
});

const UsuarioForm = ({ usuarioEdit, onClose, onSave }) => {
  const isEdit = !!usuarioEdit;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    context: { isEdit } // Pasamos el contexto para la validación condicional de password
  });

  useEffect(() => {
    if (usuarioEdit) {
      reset({
        nombre: usuarioEdit.nombre,
        email: usuarioEdit.email,
        rol: usuarioEdit.rol,
        password: '' // No seteamos la password por seguridad
      });
    }
  }, [usuarioEdit, reset]);

  const onSubmit = (data) => {
    // Si es edición y el campo password está vacío, lo borramos para no sobreescribir con cadena vacía
    if (isEdit && !data.password) {
      delete data.password;
    }
    onSave(data);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-primary">
              {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre Completo</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  {...register('nombre')}
                  placeholder="Ej. Juan Pérez"
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Correo Electrónico</label>
                <input 
                  type="email" 
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email')}
                  placeholder="ejemplo@empresa.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              {/* Contraseña */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Contraseña {isEdit && <span className="text-muted fw-normal fs-6">(Dejar en blanco para mantener)</span>}
                </label>
                <input 
                  type="password" 
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  {...register('password')}
                  placeholder="******"
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              {/* Rol */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Rol de Usuario</label>
                <select 
                  className={`form-select ${errors.rol ? 'is-invalid' : ''}`}
                  {...register('rol')}
                >
                  <option value="">Seleccione un rol...</option>
                  <option value="usuario">Usuario Estándar</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors.rol && <div className="invalid-feedback">{errors.rol.message}</div>}
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;
