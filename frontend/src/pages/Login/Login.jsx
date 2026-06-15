import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab } from 'react-bootstrap';
import '../../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login: setAuth } = useAuth();

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
            Swal.fire('¡Éxito!', 'Sesión iniciada correctamente', 'success');
            navigate('/');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Error al iniciar sesión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (registerData.password !== registerData.confirmPassword) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register({
                nombre: registerData.nombre,
                email: registerData.email,
                password: registerData.password,
                rol: 'usuario'
            });
            Swal.fire('¡Éxito!', 'Usuario registrado. Por favor inicia sesión', 'success');
            setRegisterData({ nombre: '', email: '', password: '', confirmPassword: '' });
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Error al registrar', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <h2 className="text-center mb-4">
                                <i className="bi bi-building"></i> ReservasApp
                            </h2>

                            <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-4">
                                <Tab eventKey="login" title="Iniciar Sesión">
                                    <Form onSubmit={handleLogin} className="mt-4">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Correo Electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={loginData.email}
                                                onChange={handleLoginChange}
                                                placeholder="tu@email.com"
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={loginData.password}
                                                onChange={handleLoginChange}
                                                placeholder="Contraseña"
                                                required
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="w-100"
                                            disabled={loading}
                                        >
                                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                                        </Button>
                                    </Form>

                                    <div className="text-center mt-3 text-muted">
                                        <p>¿No tienes cuenta? Usa la pestaña de Registro</p>
                                    </div>
                                </Tab>

                                <Tab eventKey="register" title="Registrarse">
                                    <Form onSubmit={handleRegister} className="mt-4">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre Completo</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={registerData.nombre}
                                                onChange={handleRegisterChange}
                                                placeholder="Tu nombre"
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Correo Electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={registerData.email}
                                                onChange={handleRegisterChange}
                                                placeholder="tu@email.com"
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={registerData.password}
                                                onChange={handleRegisterChange}
                                                placeholder="Contraseña"
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label>Confirmar Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={registerData.confirmPassword}
                                                onChange={handleRegisterChange}
                                                placeholder="Confirma tu contraseña"
                                                required
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="success"
                                            type="submit"
                                            className="w-100"
                                            disabled={loading}
                                        >
                                            {loading ? 'Cargando...' : 'Registrarse'}
                                        </Button>
                                    </Form>

                                    <div className="text-center mt-3 text-muted">
                                        <p>¿Ya tienes cuenta? Usa la pestaña de Iniciar Sesión</p>
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
