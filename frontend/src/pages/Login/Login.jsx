import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/auth.service';
import Swal from 'sweetalert2';
import '../../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login: setAuth } = useAuth();

    const [activeTab, setActiveTab] = useState('login');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(loginData.email, loginData.password);
            setAuth(response.data.user, response.data.token);
            const Toast = Swal.mixin({
                toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true,
                background: '#1a1a2e', color: '#fff'
            });
            Toast.fire({ icon: 'success', title: 'Sesión iniciada correctamente' });
            navigate('/');
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.error || 'Error al iniciar sesión',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (registerData.password !== registerData.confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
            setLoading(false);
            return;
        }

        try {
            await authService.register({
                nombre: registerData.nombre,
                email: registerData.email,
                password: registerData.password,
                rol: 'usuario'
            });
            Swal.fire({
                title: '¡Registro Exitoso!',
                text: 'Tu cuenta ha sido creada. Por favor inicia sesión.',
                icon: 'success',
                confirmButtonColor: '#6366f1'
            }).then(() => {
                setActiveTab('login');
                setRegisterData({ nombre: '', email: '', password: '', confirmPassword: '' });
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.error || 'Error al registrar',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="premium-login-wrapper">
            <div className="premium-login-container">
                {/* Banner Lateral */}
                <div className="premium-banner">
                    <div className="banner-content">
                        <div className="logo-icon">
                            <i className="bi bi-grid-1x2-fill"></i>
                        </div>
                        <h1>ReservasApp</h1>
                        <p>Plataforma inteligente para la gestión de espacios y recursos organizacionales.</p>
                        
                        <div className="banner-features">
                            <div className="feature-item">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Reservas al instante</span>
                            </div>
                            <div className="feature-item">
                                <i className="bi bi-shield-fill-check"></i>
                                <span>Sistema seguro y confiable</span>
                            </div>
                            <div className="feature-item">
                                <i className="bi bi-graph-up-arrow"></i>
                                <span>Optimización de recursos</span>
                            </div>
                        </div>
                    </div>
                    <div className="banner-overlay"></div>
                </div>

                {/* Formulario */}
                <div className="premium-form-section">
                    <div className="form-content">
                        <div className="form-header">
                            <h2>{activeTab === 'login' ? 'Bienvenido de nuevo' : 'Crear nueva cuenta'}</h2>
                            <p>{activeTab === 'login' ? 'Ingresa tus credenciales para continuar.' : 'Únete a nuestra plataforma hoy mismo.'}</p>
                        </div>

                        {/* Custom Sliding Tab Toggle */}
                        <div className="custom-tab-toggle">
                            <div 
                                className={`toggle-slider ${activeTab === 'register' ? 'slide-right' : ''}`}
                            ></div>
                            <button 
                                type="button"
                                className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                                onClick={() => setActiveTab('login')}
                            >
                                Iniciar Sesión
                            </button>
                            <button 
                                type="button"
                                className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                                onClick={() => setActiveTab('register')}
                            >
                                Registrarse
                            </button>
                        </div>

                        <div className="form-body">
                            {activeTab === 'login' ? (
                                <form onSubmit={handleLogin} className="premium-form fade-in-up">
                                    <div className="input-group">
                                        <label>Correo Electrónico</label>
                                        <div className="input-wrapper">
                                            <i className="bi bi-envelope"></i>
                                            <input
                                                type="email"
                                                name="email"
                                                value={loginData.email}
                                                onChange={handleLoginChange}
                                                placeholder="ejemplo@correo.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Contraseña</label>
                                        <div className="input-wrapper">
                                            <i className="bi bi-lock"></i>
                                            <input
                                                type="password"
                                                name="password"
                                                value={loginData.password}
                                                onChange={handleLoginChange}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        <div className="forgot-password">
                                            <a href="#/">¿Olvidaste tu contraseña?</a>
                                        </div>
                                    </div>

                                    <button type="submit" className="premium-btn primary-btn" disabled={loading}>
                                        {loading ? <span className="loader"></span> : 'Acceder'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} className="premium-form fade-in-up">
                                    <div className="input-group">
                                        <label>Nombre Completo</label>
                                        <div className="input-wrapper">
                                            <i className="bi bi-person"></i>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={registerData.nombre}
                                                onChange={handleRegisterChange}
                                                placeholder="Juan Pérez"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Correo Electrónico</label>
                                        <div className="input-wrapper">
                                            <i className="bi bi-envelope"></i>
                                            <input
                                                type="email"
                                                name="email"
                                                value={registerData.email}
                                                onChange={handleRegisterChange}
                                                placeholder="ejemplo@correo.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Contraseña</label>
                                        <div className="input-wrapper">
                                            <i className="bi bi-lock"></i>
                                            <input
                                                type="password"
                                                name="password"
                                                value={registerData.password}
                                                onChange={handleRegisterChange}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Confirmar Contraseña</label>
                                        <div className="input-wrapper">
                                            <i className="bi bi-shield-lock"></i>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={registerData.confirmPassword}
                                                onChange={handleRegisterChange}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="premium-btn primary-btn" disabled={loading}>
                                        {loading ? <span className="loader"></span> : 'Crear Cuenta'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

