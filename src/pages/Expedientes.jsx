import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, 
    Search, 
    Filter,
    Eye,
    Calendar,
    User
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';
import { ESTADO_NOMBRES } from '../utils/constants';

const Expedientes = () => {
    const { isTecnico } = useAuth();
    const navigate = useNavigate();
    const [expedientes, setExpedientes] = useState([]);
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        id_estado: '',
        fecha_inicio: '',
        fecha_fin: ''
    });

    useEffect(() => {
        cargarEstados();
        cargarExpedientes();
    }, []);

    const cargarEstados = async () => {
        try {
            const response = await api.get('/expedientes/estados');
            setEstados(response.data.data);
        } catch (error) {
            console.error('Error al cargar estados:', error);
        }
    };

    const cargarExpedientes = async () => {
        try {
            setLoading(true);
            const params = {};
            
            if (filtros.id_estado) params.id_estado = filtros.id_estado;
            if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio;
            if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin;

            const response = await api.get('/expedientes', { params });
            setExpedientes(response.data.data);
        } catch (error) {
            console.error('Error al cargar expedientes:', error);
            toast.error('Error al cargar expedientes');
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        });
    };

    const aplicarFiltros = () => {
        cargarExpedientes();
    };

    const limpiarFiltros = () => {
        setFiltros({
            busqueda: '',
            id_estado: '',
            fecha_inicio: '',
            fecha_fin: ''
        });
        setTimeout(() => cargarExpedientes(), 100);
    };

    const expedientesFiltrados = expedientes.filter(exp => {
        const busqueda = filtros.busqueda.toLowerCase();
        return (
            exp.numero_expediente.toLowerCase().includes(busqueda) ||
            exp.titulo.toLowerCase().includes(busqueda) ||
            exp.tecnico_registra.toLowerCase().includes(busqueda)
        );
    });

    if (loading) {
        return <Loading message="Cargando expedientes..." />;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Expedientes
                    </h1>
                    <p className="text-gray-600">
                        Gestión de expedientes DICRI
                    </p>
                </div>
                
                {isTecnico && (
                    <Button
                        icon={Plus}
                        onClick={() => navigate('/expedientes/nuevo')}
                        variant="primary"
                    >
                        Nuevo Expediente
                    </Button>
                )}
            </div>

            {/* Filtros */}
            <Card title="Filtros de Búsqueda" className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Búsqueda general */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="busqueda"
                                value={filtros.busqueda}
                                onChange={handleFiltroChange}
                                placeholder="Número, título, técnico..."
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            name="id_estado"
                            value={filtros.id_estado}
                            onChange={handleFiltroChange}
                            className="input-field"
                        >
                            <option value="">Todos los estados</option>
                            {estados.map(estado => (
                                <option key={estado.id_estado} value={estado.id_estado}>
                                    {estado.nombre_estado.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha inicio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha Inicio
                        </label>
                        <input
                            type="date"
                            name="fecha_inicio"
                            value={filtros.fecha_inicio}
                            onChange={handleFiltroChange}
                            className="input-field"
                        />
                    </div>

                    {/* Fecha fin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha Fin
                        </label>
                        <input
                            type="date"
                            name="fecha_fin"
                            value={filtros.fecha_fin}
                            onChange={handleFiltroChange}
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Botones de filtro */}
                <div className="flex gap-2 mt-4">
                    <Button
                        icon={Filter}
                        onClick={aplicarFiltros}
                        variant="primary"
                    >
                        Aplicar Filtros
                    </Button>
                    <Button
                        onClick={limpiarFiltros}
                        variant="secondary"
                    >
                        Limpiar
                    </Button>
                </div>
            </Card>

            {/* Lista de expedientes */}
            <Card>
                {expedientesFiltrados.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron expedientes
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {filtros.busqueda || filtros.id_estado || filtros.fecha_inicio || filtros.fecha_fin
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'Comienza creando tu primer expediente'
                            }
                        </p>
                        {isTecnico && !filtros.busqueda && (
                            <Button
                                icon={Plus}
                                onClick={() => navigate('/expedientes/nuevo')}
                                variant="primary"
                            >
                                Crear Expediente
                            </Button>
                        )}
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
                                        Técnico
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Indicios
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Registro
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {expedientesFiltrados.map((expediente) => (
                                    <tr key={expediente.id_expediente} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {expediente.numero_expediente}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {expediente.titulo}
                                            </div>
                                            {expediente.descripcion && (
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                    {expediente.descripcion}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ESTADO_NOMBRES[expediente.id_estado]?.color}`}>
                                                {ESTADO_NOMBRES[expediente.id_estado]?.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">
                                                    {expediente.tecnico_registra}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold">
                                                {expediente.total_indicios}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(expediente.fecha_registro).toLocaleDateString('es-GT', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Button
                                                icon={Eye}
                                                onClick={() => navigate(`/expedientes/${expediente.id_expediente}`)}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                Ver Detalle
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Contador de resultados */}
                {expedientesFiltrados.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500 text-center">
                        Mostrando {expedientesFiltrados.length} de {expedientes.length} expedientes
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Expedientes;