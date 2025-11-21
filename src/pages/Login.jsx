import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { LogIn, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        usuario: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.usuario || !formData.password) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        
        try {
            const result = await login(formData.usuario, formData.password);
            
            if (!result.success) {
                toast.error(result.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            toast.error('Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo y título */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
                        <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                            MP
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Sistema DICRI
                    </h1>
                    <p className="text-primary-100">
                        Dirección de Investigación Criminalística
                    </p>
                </div>

                {/* Formulario de login */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Ingresa tus credenciales para acceder al sistema
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="usuario"
                                    value={formData.usuario}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu usuario"
                                    className="input-field pl-10"
                                    disabled={loading}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu contraseña"
                                    className="input-field pl-10"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="w-full"
                            icon={LogIn}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    {/* Información de prueba */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-semibold mb-2">
                            💡 Usuarios de prueba:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Técnico: <code className="bg-blue-100 px-1 rounded">jtecnico</code></li>
                            <li>• Coordinador: <code className="bg-blue-100 px-1 rounded">ccoordinador</code></li>
                            <li>• Contraseña: <code className="bg-blue-100 px-1 rounded">password123</code></li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-primary-100 text-sm">
                    <p>Ministerio Público de Guatemala</p>
                    <p className="mt-1">© 2024 - Todos los derechos reservados</p>
                </div>
            </div>
        </div>
    );
};

export default Login;