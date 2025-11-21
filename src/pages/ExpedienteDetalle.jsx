import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Edit,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import IndicioForm from "../components/indicios/IndicioForm";
import IndicioCard from "../components/indicios/IndicioCard";
import toast from "react-hot-toast";
import { ESTADO_NOMBRES, ESTADOS } from "../utils/constants";

const ExpedienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isTecnico, isCoordinador } = useAuth();

  const [expediente, setExpediente] = useState(null);
  const [indicios, setIndicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIndicio, setModalIndicio] = useState(false);
  const [modalRevision, setModalRevision] = useState(false);
  const [accionRevision, setAccionRevision] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar expediente
      const expResponse = await api.get(`/expedientes/${id}`);
      setExpediente(expResponse.data.data);

      // Cargar indicios
      const indResponse = await api.get(`/indicios/expediente/${id}`);
      setIndicios(indResponse.data.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar información del expediente");
      navigate("/expedientes");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarRevision = async () => {
    if (indicios.length === 0) {
      toast.error(
        "Debes agregar al menos un indicio antes de enviar a revisión"
      );
      return;
    }

    try {
      setProcesando(true);
      await api.post(`/expedientes/${id}/enviar-revision`);
      toast.success("Expediente enviado a revisión exitosamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al enviar a revisión:", error);
      toast.error(
        error.response?.data?.message || "Error al enviar a revisión"
      );
    } finally {
      setProcesando(false);
    }
  };

  const handleRevisar = async () => {
    if (accionRevision === "RECHAZAR" && !justificacion.trim()) {
      toast.error("Debes proporcionar una justificación para rechazar");
      return;
    }

    try {
      setProcesando(true);
      await api.post(`/expedientes/${id}/revisar`, {
        accion: accionRevision,
        justificacion: accionRevision === "RECHAZAR" ? justificacion : null,
      });

      toast.success(`Expediente ${accionRevision.toLowerCase()} exitosamente`);
      setModalRevision(false);
      setJustificacion("");
      cargarDatos();
    } catch (error) {
      console.error("Error al revisar expediente:", error);
      toast.error(
        error.response?.data?.message || "Error al revisar expediente"
      );
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarIndicio = async (idIndicio) => {
    if (!window.confirm("¿Estás seguro de eliminar este indicio?")) {
      return;
    }

    try {
      await api.delete(`/indicios/${idIndicio}`);
      toast.success("Indicio eliminado exitosamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar indicio:", error);
      toast.error("Error al eliminar indicio");
    }
  };

  const abrirModalRevision = (accion) => {
    setAccionRevision(accion);
    setModalRevision(true);
  };

  if (loading) {
    return <Loading message="Cargando expediente..." />;
  }

  if (!expediente) {
    return null;
  }

  const puedeAgregarIndicios =
    isTecnico &&
    (expediente.id_estado === ESTADOS.EN_REGISTRO ||
      expediente.id_estado === ESTADOS.RECHAZADO);

  const puedeEnviarRevision =
    isTecnico &&
    expediente.id_estado === ESTADOS.EN_REGISTRO &&
    expediente.id_tecnico_registra === user.id_usuario;

  const puedeRevisar =
    isCoordinador && expediente.id_estado === ESTADOS.EN_REVISION;

  return (
    <div>
      {}
      <div className="mb-6">
        <Button
          icon={ArrowLeft}
          onClick={() => navigate("/expedientes")}
          variant="secondary"
          className="mb-4"
        >
          Volver
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {expediente.numero_expediente}
            </h1>
            <p className="text-gray-600">{expediente.titulo}</p>
          </div>
          <span
            className={`px-4 py-2 text-sm font-semibold rounded-full ${
              ESTADO_NOMBRES[expediente.id_estado]?.color
            }`}
          >
            {ESTADO_NOMBRES[expediente.id_estado]?.label}
          </span>
        </div>
      </div>

      {}
      <Card title="Información General" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Número de Expediente
            </label>
            <p className="text-gray-900 font-semibold">
              {expediente.numero_expediente}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Estado
            </label>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                ESTADO_NOMBRES[expediente.id_estado]?.color
              }`}
            >
              {ESTADO_NOMBRES[expediente.id_estado]?.label}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              <User className="inline h-4 w-4 mr-1" />
              Técnico Registrador
            </label>
            <p className="text-gray-900">{expediente.tecnico_registra}</p>
            <p className="text-sm text-gray-500">{expediente.tecnico_email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              <Calendar className="inline h-4 w-4 mr-1" />
              Fecha de Registro
            </label>
            <p className="text-gray-900">
              {new Date(expediente.fecha_registro).toLocaleDateString("es-GT", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {expediente.coordinador_revisa && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Coordinador Revisor
                </label>
                <p className="text-gray-900">{expediente.coordinador_revisa}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Fecha de Revisión
                </label>
                <p className="text-gray-900">
                  {new Date(expediente.fecha_revision).toLocaleDateString(
                    "es-GT",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              <FileText className="inline h-4 w-4 mr-1" />
              Descripción
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">
              {expediente.descripcion || "Sin descripción"}
            </p>
          </div>

          {}
          {expediente.id_estado === ESTADOS.RECHAZADO &&
            expediente.justificacion_rechazo && (
              <div className="md:col-span-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-900 mb-1">
                        Justificación de Rechazo
                      </h4>
                      <p className="text-sm text-red-800 whitespace-pre-wrap">
                        {expediente.justificacion_rechazo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
        {}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
          {puedeEnviarRevision && (
            <Button
              icon={Send}
              onClick={handleEnviarRevision}
              variant="primary"
              disabled={procesando || indicios.length === 0}
            >
              Enviar a Revisión
            </Button>
          )}

          {puedeRevisar && (
            <>
              <Button
                icon={CheckCircle}
                onClick={() => abrirModalRevision("APROBAR")}
                variant="success"
                disabled={procesando}
              >
                Aprobar
              </Button>
              <Button
                icon={XCircle}
                onClick={() => abrirModalRevision("RECHAZAR")}
                variant="danger"
                disabled={procesando}
              >
                Rechazar
              </Button>
            </>
          )}
        </div>

        {!puedeEnviarRevision &&
          isTecnico &&
          expediente.id_estado === ESTADOS.EN_REGISTRO && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Solo el técnico que registró el expediente puede enviarlo a
                revisión.
              </p>
            </div>
          )}
      </Card>

      {}
      <Card
        title="Indicios Registrados"
        subtitle={`${indicios.length} indicio${
          indicios.length !== 1 ? "s" : ""
        } registrado${indicios.length !== 1 ? "s" : ""}`}
        actions={
          puedeAgregarIndicios && (
            <Button
              icon={Plus}
              onClick={() => setModalIndicio(true)}
              variant="primary"
            >
              Agregar Indicio
            </Button>
          )
        }
      >
        {indicios.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay indicios registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando el primer indicio de este expediente
            </p>
            {puedeAgregarIndicios && (
              <Button
                icon={Plus}
                onClick={() => setModalIndicio(true)}
                variant="primary"
              >
                Agregar Primer Indicio
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicios.map((indicio) => (
              <IndicioCard
                key={indicio.id_indicio}
                indicio={indicio}
                onDelete={puedeAgregarIndicios ? handleEliminarIndicio : null}
              />
            ))}
          </div>
        )}

        {puedeEnviarRevision && indicios.length === 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Debes agregar al menos un indicio antes de
              enviar el expediente a revisión.
            </p>
          </div>
        )}
      </Card>

      {/* Modal para agregar indicio */}
      <Modal
        isOpen={modalIndicio}
        onClose={() => setModalIndicio(false)}
        title="Agregar Indicio"
        size="lg"
      >
        <IndicioForm
          idExpediente={parseInt(id)}
          onSuccess={() => {
            setModalIndicio(false);
            cargarDatos();
          }}
          onCancel={() => setModalIndicio(false)}
        />
      </Modal>

      {/* Modal para revisar expediente */}
      <Modal
        isOpen={modalRevision}
        onClose={() => {
          setModalRevision(false);
          setJustificacion("");
        }}
        title={`${
          accionRevision === "APROBAR" ? "Aprobar" : "Rechazar"
        } Expediente`}
        size="md"
      >
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${
              accionRevision === "APROBAR"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`text-sm ${
                accionRevision === "APROBAR" ? "text-green-800" : "text-red-800"
              }`}
            >
              {accionRevision === "APROBAR"
                ? "¿Estás seguro de aprobar este expediente? Una vez aprobado, no se podrán realizar más cambios."
                : "El expediente será devuelto al técnico para correcciones. Por favor, proporciona una justificación detallada."}
            </p>
          </div>

          {accionRevision === "RECHAZAR" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Justificación <span className="text-red-500">*</span>
              </label>
              <textarea
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                placeholder="Describe los motivos del rechazo y las correcciones necesarias..."
                rows="6"
                className="input-field resize-none"
                disabled={procesando}
              />
              <p className="mt-1 text-xs text-gray-500">
                Esta justificación será visible para el técnico
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleRevisar}
              variant={accionRevision === "APROBAR" ? "success" : "danger"}
              disabled={
                procesando ||
                (accionRevision === "RECHAZAR" && !justificacion.trim())
              }
              className="flex-1"
            >
              {procesando
                ? "Procesando..."
                : `Confirmar ${
                    accionRevision === "APROBAR" ? "Aprobación" : "Rechazo"
                  }`}
            </Button>
            <Button
              onClick={() => {
                setModalRevision(false);
                setJustificacion("");
              }}
              variant="secondary"
              disabled={procesando}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExpedienteDetalle;