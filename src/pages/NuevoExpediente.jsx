import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const NuevoExpediente = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        numero_expediente: '',
        titulo: '',
        descripcion: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario escribe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validarFormulario = () => {
        const newErrors = {};

        if (!formData.numero_expediente.trim()) {
            newErrors.numero_expediente = 'El número de expediente es requerido';
        }

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'El título es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/expedientes', {
                ...formData,
                id_tecnico_registra: user.id_usuario
            });

            toast.success('Expediente creado exitosamente');
            navigate(`/expedientes/${response.data.data.id_expediente}`);
        } catch (error) {
            console.error('Error al crear expediente:', error);
            
            if (error.response?.status === 409) {
                setErrors({
                    numero_expediente: 'Este número de expediente ya existe'
                });
                toast.error('El número de expediente ya existe');
            } else {
                toast.error(error.response?.data?.message || 'Error al crear expediente');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <Button
                    icon={ArrowLeft}
                    onClick={() => navigate('/expedientes')}
                    variant="secondary"
                    className="mb-4"
                >
                    Volver
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Nuevo Expediente
                </h1>
                <p className="text-gray-600">
                    Completa la información del expediente
                </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
                <Card>
                    <div className="space-y-6">
                        {/* Información del técnico */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">
                                Técnico Registrador
                            </h3>
                            <p className="text-sm text-blue-700">
                                {user?.nombre_completo}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                {user?.email}
                            </p>
                        </div>

                        {/* Número de expediente */}
                        <Input
                            label="Número de Expediente"
                            type="text"
                            name="numero_expediente"
                            value={formData.numero_expediente}
                            onChange={handleChange}
                            placeholder="Ej: EXP-2024-001"
                            required
                            error={errors.numero_expediente}
                            disabled={loading}
                        />

                        {/* Título */}
                        <Input
                            label="Título del Expediente"
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ej: Caso de Robo Agravado"
                            required
                            error={errors.titulo}
                            disabled={loading}
                        />

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Descripción detallada del caso..."
                                rows="6"
                                className="input-field resize-none"
                                disabled={loading}
                            />
                        </div>

                        {/* Nota informativa */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Nota:</strong> Después de crear el expediente, podrás agregar los indicios correspondientes en la página de detalle.
                            </p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3 mt-8 pt-6 border-t">
                        <Button
                            type="submit"
                            icon={Save}
                            variant="primary"
                            disabled={loading}
                            className="flex-1 sm:flex-none"
                        >
                            {loading ? 'Guardando...' : 'Crear Expediente'}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => navigate('/expedientes')}
                            variant="secondary"
                            disabled={loading}
                            className="flex-1 sm:flex-none"
                        >
                            Cancelar
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default NuevoExpediente;