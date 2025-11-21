import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                // Verificar que el token sigue siendo válido
                await api.get('/auth/verify');
                setUser(JSON.parse(savedUser));
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (usuario, password) => {
        try {
            const response = await api.post('/auth/login', { usuario, password });
            const { token, user: userData } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            toast.success(`Bienvenido, ${userData.nombre_completo}`);
            navigate('/dashboard');
            
            return { success: true };
        } catch (error) {
            console.error('Error en login:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error al iniciar sesión' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        toast.success('Sesión cerrada correctamente');
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        // isTecnico: user?.nombre_rol === 'Tecnico' || user?.nombre_rol === 'Coordinador' || user?.nombre_rol === 'Administrador',
        isTecnico: user?.nombre_rol === 'Tecnico' || user?.nombre_rol === 'Administrador',
        isCoordinador: user?.nombre_rol === 'Coordinador' || user?.nombre_rol === 'Administrador',
        isAdmin: user?.nombre_rol === 'Administrador'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};