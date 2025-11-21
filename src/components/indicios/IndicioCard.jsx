import {
  Package,
  MapPin,
  Weight,
  Ruler,
  Palette,
  FileText,
  Trash2,
  User,
  Calendar,
} from "lucide-react";
import Button from "../common/Button";

const IndicioCard = ({ indicio, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">
            {indicio.codigo_indicio}
          </h4>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
            {indicio.tipo_indicio}
          </span>
        </div>
        {onDelete && (
          <Button
            icon={Trash2}
            onClick={() => onDelete(indicio.id_indicio)}
            variant="danger"
            className="text-xs px-2 py-1"
          >
            Eliminar
          </Button>
        )}
      </div>

      {/* Descripción */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 line-clamp-3">
          {indicio.descripcion}
        </p>
      </div>

      {/* Detalles */}
      <div className="space-y-2 mb-3">
        {indicio.color && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Palette size={16} className="text-gray-400" />
            <span className="font-medium">Color:</span>
            <span>{indicio.color}</span>
          </div>
        )}

        {indicio.tamano && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Ruler size={16} className="text-gray-400" />
            <span className="font-medium">Tamaño:</span>
            <span>{indicio.tamano}</span>
          </div>
        )}

        {indicio.peso && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Weight size={16} className="text-gray-400" />
            <span className="font-medium">Peso:</span>
            <span>
              {indicio.peso} {indicio.unidad_peso}
            </span>
          </div>
        )}

        {indicio.ubicacion_hallazgo && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400" />
            <span className="font-medium">Ubicación:</span>
            <span>{indicio.ubicacion_hallazgo}</span>
          </div>
        )}

        {indicio.observaciones && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FileText size={16} className="text-gray-400 mt-0.5" />
            <div>
              <span className="font-medium">Observaciones:</span>
              <p className="text-gray-500 mt-1">{indicio.observaciones}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{indicio.tecnico_registra}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {new Date(indicio.fecha_registro).toLocaleDateString("es-GT")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicioCard;
