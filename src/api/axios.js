import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token en cada request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // El servidor respondió con un código de error
            const { status, data } = error.response;
            
            if (status === 401) {
                // Token inválido o expirado
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            } else if (status === 403) {
                toast.error('No tienes permisos para realizar esta acción');
            } else if (status === 404) {
                toast.error('Recurso no encontrado');
            } else if (status === 500) {
                toast.error('Error del servidor. Intenta nuevamente.');
            } else {
                toast.error(data.message || 'Ocurrió un error');
            }
        } else if (error.request) {
           
            toast.error('No se pudo conectar con el servidor');
        } else {
            
            toast.error('Error al procesar la solicitud');
        }
        
        return Promise.reject(error);
    }
);

export default api;