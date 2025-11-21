import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import Input from "../common/Input";
import toast from "react-hot-toast";

const IndicioForm = ({ idExpediente, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [tiposIndicio, setTiposIndicio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_expediente: idExpediente,
    codigo_indicio: "",
    id_tipo_indicio: "",
    descripcion: "",
    color: "",
    tamano: "",
    peso: "",
    unidad_peso: "kg",
    ubicacion_hallazgo: "",
    observaciones: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarTiposIndicio();
  }, []);

  const cargarTiposIndicio = async () => {
    try {
      const response = await api.get("/indicios/tipos");
      setTiposIndicio(response.data.data);
    } catch (error) {
      console.error("Error al cargar tipos de indicio:", error);
      toast.error("Error al cargar tipos de indicio");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.codigo_indicio.trim()) {
      newErrors.codigo_indicio = "El código es requerido";
    }

    if (!formData.id_tipo_indicio) {
      newErrors.id_tipo_indicio = "Selecciona un tipo de indicio";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);

    try {
      // Limpiar campos vacíos
      const dataToSend = {
        ...formData,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        color: formData.color || null,
        tamano: formData.tamano || null,
        unidad_peso: formData.peso ? formData.unidad_peso : null,
        ubicacion_hallazgo: formData.ubicacion_hallazgo || null,
        observaciones: formData.observaciones || null,
        id_tecnico_registra: user.id_usuario,
      };

      await api.post("/indicios", dataToSend);
      toast.success("Indicio agregado exitosamente");
      onSuccess();
    } catch (error) {
      console.error("Error al crear indicio:", error);
      toast.error(error.response?.data?.message || "Error al crear indicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {}
      <Input
        label="Código del Indicio"
        type="text"
        name="codigo_indicio"
        value={formData.codigo_indicio}
        onChange={handleChange}
        placeholder="Ej: IND-001"
        required
        error={errors.codigo_indicio}
        disabled={loading}
      />

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Indicio <span className="text-red-500">*</span>
        </label>
        <select
          name="id_tipo_indicio"
          value={formData.id_tipo_indicio}
          onChange={handleChange}
          className={`input-field ${
            errors.id_tipo_indicio ? "border-red-500" : ""
          }`}
          disabled={loading}
          required
        >
          <option value="">Selecciona un tipo</option>
          {tiposIndicio.map((tipo) => (
            <option key={tipo.id_tipo_indicio} value={tipo.id_tipo_indicio}>
              {tipo.nombre_tipo}
            </option>
          ))}
        </select>
        {errors.id_tipo_indicio && (
          <p className="mt-1 text-sm text-red-600">{errors.id_tipo_indicio}</p>
        )}
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción detallada del indicio..."
          rows="4"
          className={`input-field resize-none ${
            errors.descripcion ? "border-red-500" : ""
          }`}
          disabled={loading}
          required
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
        )}
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {}
        <Input
          label="Color"
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Ej: Plateado"
          disabled={loading}
        />

        {}
        <Input
          label="Tamaño"
          type="text"
          name="tamano"
          value={formData.tamano}
          onChange={handleChange}
          placeholder="Ej: 20cm de largo"
          disabled={loading}
        />

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="input-field flex-1"
              disabled={loading}
            />
            <select
              name="unidad_peso"
              value={formData.unidad_peso}
              onChange={handleChange}
              className="input-field w-24"
              disabled={loading || !formData.peso}
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        {}
        <Input
          label="Ubicación del Hallazgo"
          type="text"
          name="ubicacion_hallazgo"
          value={formData.ubicacion_hallazgo}
          onChange={handleChange}
          placeholder="Ej: Cocina, segundo cajón"
          disabled={loading}
        />
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observaciones
        </label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Observaciones adicionales..."
          rows="3"
          className="input-field resize-none"
          disabled={loading}
        />
      </div>

      {}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          icon={Save}
          variant="primary"
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Guardando..." : "Guardar Indicio"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default IndicioForm;
