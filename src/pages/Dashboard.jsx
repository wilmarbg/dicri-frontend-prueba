import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FolderOpen, 
    Clock, 
    CheckCircle, 
    XCircle,
    Plus,
    TrendingUp
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, isTecnico } = useAuth();
    const navigate = useNavigate();
    const [estadisticas, setEstadisticas] = useState(null);
    const [expedientesRecientes, setExpedientesRecientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            
            // Cargar estadísticas
            const statsResponse = await api.get('/expedientes/estadisticas');
            setEstadisticas(statsResponse.data.data);

            // Cargar expedientes recientes
            const expedientesResponse = await api.get('/expedientes');
            setExpedientesRecientes(expedientesResponse.data.data.slice(0, 5));
            
        } catch (error) {
            console.error('Error al cargar datos:', error);
            toast.error('Error al cargar información del dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Cargando dashboard..." />;
    }

    const stats = [
        {
            title: 'Total Expedientes',
            value: estadisticas?.total_expedientes || 0,
            icon: FolderOpen,
            color: 'bg-blue-500',
            textColor: 'text-blue-600'
        },
        {
            title: 'En Registro',
            value: estadisticas?.en_registro || 0,
            icon: Clock,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600'
        },
        {
            title: 'Aprobados',
            value: estadisticas?.aprobados || 0,
            icon: CheckCircle,
            color: 'bg-green-500',
            textColor: 'text-green-600'
        },
        {
            title: 'Rechazados',
            value: estadisticas?.rechazados || 0,
            icon: XCircle,
            color: 'bg-red-500',
            textColor: 'text-red-600'
        }
    ];

    const getEstadoBadge = (estado) => {
        const estados = {
            'REGISTRO': 'bg-blue-100 text-blue-800',
            'REVISION': 'bg-yellow-100 text-yellow-800',
            'APROBADO': 'bg-green-100 text-green-800',
            'RECHAZADO': 'bg-red-100 text-red-800'
        };
        return estados[estado] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Bienvenido, {user?.nombre_completo}
                </h1>
                <p className="text-gray-600">
                    Panel de control del Sistema de Gestión de Evidencias DICRI
                </p>
            </div>

            {/* Botón de acción rápida */}
            {isTecnico && (
                <div className="mb-6">
                    <Button
                        icon={Plus}
                        onClick={() => navigate('/expedientes/nuevo')}
                        variant="primary"
                    >
                        Crear Nuevo Expediente
                    </Button>
                </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingUp className={`${stat.textColor} mr-1`} size={16} />
                            <span className={stat.textColor}>
                                {((stat.value / (estadisticas?.total_expedientes || 1)) * 100).toFixed(1)}%
                            </span>
                            <span className="text-gray-500 ml-2">del total</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Expedientes recientes */}
            <Card 
                title="Expedientes Recientes" 
                subtitle="Los últimos expedientes registrados en el sistema"
                actions={
                    <Button
                        variant="outline"
                        onClick={() => navigate('/expedientes')}
                    >
                        Ver Todos
                    </Button>
                }
            >
                {expedientesRecientes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <FolderOpen className="mx-auto mb-2" size={48} />
                        <p>No hay expedientes registrados aún</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Número
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Título
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Indicios
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {expedientesRecientes.map((expediente) => (
                                    <tr key={expediente.id_expediente} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {expediente.numero_expediente}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {expediente.titulo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(expediente.nombre_estado)}`}>
                                                {expediente.nombre_estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {expediente.total_indicios}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(expediente.fecha_registro).toLocaleDateString('es-GT')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => navigate(`/expedientes/${expediente.id_expediente}`)}
                                                className="text-primary-600 hover:text-primary-900 font-medium"
                                            >
                                                Ver detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;