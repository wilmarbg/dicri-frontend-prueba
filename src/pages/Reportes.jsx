import { useState, useEffect } from "react";
import {
  Download,
  FileText,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  PieChart,
} from "lucide-react";
import api from "../api/axios";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import toast from "react-hot-toast";
import { ESTADO_NOMBRES } from "../utils/constants";

const Reportes = () => {
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [reporteData, setReporteData] = useState([]);
  const [estados, setEstados] = useState([]);
  const [filtros, setFiltros] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    id_estado: "",
  });

  useEffect(() => {
    cargarEstadisticas();
    cargarEstados();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await api.get("/expedientes/estadisticas");
      setEstadisticas(response.data.data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      toast.error("Error al cargar estadísticas");
    }
  };

  const cargarEstados = async () => {
    try {
      const response = await api.get("/expedientes/estados");
      setEstados(response.data.data);
    } catch (error) {
      console.error("Error al cargar estados:", error);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const generarReporte = async () => {
    if (!filtros.fecha_inicio || !filtros.fecha_fin) {
      toast.error("Debes seleccionar un rango de fechas");
      return;
    }

    try {
      setLoading(true);
      const params = {
        fecha_inicio: filtros.fecha_inicio,
        fecha_fin: filtros.fecha_fin,
      };

      if (filtros.id_estado) {
        params.id_estado = filtros.id_estado;
      }

      const response = await api.get("/expedientes/reporte", { params });
      setReporteData(response.data.data);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      console.error("Error al generar reporte:", error);
      toast.error("Error al generar reporte");
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    if (reporteData.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    // Crear CSV
    const headers = [
      "Número Expediente",
      "Título",
      "Fecha Registro",
      "Estado",
      "Técnico",
      "Coordinador",
      "Fecha Revisión",
      "Total Indicios",
    ];

    const csvContent = [
      headers.join(","),
      ...reporteData.map((row) =>
        [
          `"${row.numero_expediente}"`,
          `"${row.titulo}"`,
          new Date(row.fecha_registro).toLocaleDateString("es-GT"),
          `"${row.nombre_estado}"`,
          `"${row.tecnico}"`,
          row.coordinador ? `"${row.coordinador}"` : '""',
          row.fecha_revision
            ? new Date(row.fecha_revision).toLocaleDateString("es-GT")
            : '""',
          row.total_indicios,
        ].join(",")
      ),
    ].join("\n");

    // Descargar archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reporte_expedientes_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Reporte exportado exitosamente");
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha_inicio: "",
      fecha_fin: "",
      id_estado: "",
    });
    setReporteData([]);
  };

  // Calcular porcentajes para gráficos
  const calcularPorcentajes = () => {
    if (!estadisticas) return [];

    const total = estadisticas.total_expedientes || 1;
    return [
      {
        label: "En Registro",
        value: estadisticas.en_registro || 0,
        percentage: ((estadisticas.en_registro / total) * 100).toFixed(1),
        color: "bg-blue-500",
      },
      {
        label: "En Revisión",
        value: estadisticas.en_revision || 0,
        percentage: ((estadisticas.en_revision / total) * 100).toFixed(1),
        color: "bg-yellow-500",
      },
      {
        label: "Aprobados",
        value: estadisticas.aprobados || 0,
        percentage: ((estadisticas.aprobados / total) * 100).toFixed(1),
        color: "bg-green-500",
      },
      {
        label: "Rechazados",
        value: estadisticas.rechazados || 0,
        percentage: ((estadisticas.rechazados / total) * 100).toFixed(1),
        color: "bg-red-500",
      },
    ];
  };

  if (!estadisticas) {
    return <Loading message="Cargando reportes..." />;
  }

  const porcentajes = calcularPorcentajes();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reportes y Estadísticas
        </h1>
        <p className="text-gray-600">
          Análisis y reportes del sistema de gestión de evidencias
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Expedientes
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {estadisticas.total_expedientes}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                En Registro
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {estadisticas.en_registro}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Aprobados
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {estadisticas.aprobados}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Rechazados
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {estadisticas.rechazados}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <PieChart className="text-white" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de distribución */}
      <Card title="Distribución de Expedientes por Estado" className="mb-8">
        <div className="space-y-4">
          {porcentajes.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.value} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${item.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Generador de reportes */}
      <Card title="Generar Reporte Personalizado" className="mb-8">
        <div className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={filtros.fecha_inicio}
                onChange={handleFiltroChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha Fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={filtros.fecha_fin}
                onChange={handleFiltroChange}
                className="input-field"
              />
            </div>

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
                {estados.map((estado) => (
                  <option key={estado.id_estado} value={estado.id_estado}>
                    {estado.nombre_estado.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              icon={Filter}
              onClick={generarReporte}
              variant="primary"
              disabled={loading}
            >
              {loading ? "Generando..." : "Generar Reporte"}
            </Button>
            <Button onClick={limpiarFiltros} variant="secondary">
              Limpiar
            </Button>
            {/* {reporteData.length > 0 && (
              <Button icon={Download} onClick={exportarCSV} variant="success">
                Exportar CSV
              </Button>
            )} */}
          </div>
        </div>
      </Card>

      {/* Tabla de resultados */}
      {reporteData.length > 0 && (
        <Card
          title={`Resultados del Reporte (${reporteData.length} registros)`}
        >
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
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Técnico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordinador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Indicios
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reporteData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.numero_expediente}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {row.titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(row.fecha_registro).toLocaleDateString("es-GT")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {row.nombre_estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.tecnico}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.coordinador || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 text-xs font-semibold">
                        {row.total_indicios}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reportes;
