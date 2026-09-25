import { useState, useEffect } from "react";
import Axios from "axios";
import Sidebar from "../../components/farmacia/Sidebar";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;
const CONTROL_ALIMENTOS_ENDPOINT =
  import.meta.env.VITE_CONTROL_ALIMENTOS_ENDPOINT || "/control-alimentos";

function ControlAlimientos() {
  const navigate = useNavigate();
  const [listaPacientes, setListaPacientes] = useState([]);

  // Un const independiente para cada campo
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
  const [fechaHoraRecepcion, setFechaHoraRecepcion] = useState("");
  const [estadoAlimentos, setEstadoAlimentos] = useState("");
  const [cantidadRecibida, setCantidadRecibida] = useState("");
  const [alimentosDesechados, setAlimentosDesechados] = useState("");
  const [motivoDesecho, setMotivoDesecho] = useState("");
  const [pacienteConsumio, setPacienteConsumio] = useState("");
  const [observacionesNutricionales, setObservacionesNutricionales] = useState("");
  const [entregaAlimentosPaciente, setEntregaAlimentosPaciente] = useState("");

  const [cargandoPacientes, setCargandoPacientes] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);


  //----------------------------- nuevo-------------------------
      const [alimentosRecibidos, setAlimentosRecibidos] = useState([
      { nombre: "", cantidad: 1 }
    ]);


  //------------------------------------------------------------
  // Función para traer los pacientes de la base de datos
  const obtenerPacientes = async () => {
    try {
      const response = await Axios.get(`${API_URL}/MostrarPaciente`);
      const pacientes = response.data?.paciente ?? response.data ?? [];
      setListaPacientes(Array.isArray(pacientes) ? pacientes : []);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
      setMensaje({ tipo: "error", texto: "No se pudieron cargar los pacientes." });
    } finally {
      setCargandoPacientes(false);
    }
  };

  /*
    useEffect(() => {
    Axios.get(`${API_URL}/MostrarPaciente`)
      .then((response) => {
        setDataPacientes(response.data.paciente || []);
      })
      .catch((error) => console.error("Error cargando pacientes:", error));
  }, []);
  */

  // Se ejecuta solo una vez al cargar la pantalla
  useEffect(() => {
    obtenerPacientes();
  }, []);

  const nombrePaciente = (paciente) => {
    const nombre = paciente.nombre || paciente.usuario?.nombre || "";
    const apellidos = [paciente.apellidoP, paciente.apellidoM]
      .filter(Boolean)
      .join(" ");

    return `${nombre} ${apellidos}`.trim() || `Paciente #${paciente.id}`;
  };

  //---------------------------nuevo-------------------------------

        const agregarAlimento = () => {
      setAlimentosRecibidos([
        ...alimentosRecibidos,
        { nombre: "", cantidad: 1 }
      ]);
    };

    const eliminarAlimento = (index) => {
      setAlimentosRecibidos(
        alimentosRecibidos.filter((_, i) => i !== index)
      );
    };

    const actualizarAlimento = (index, campo, valor) => {
      const nuevosAlimentos = [...alimentosRecibidos];

      nuevosAlimentos[index][campo] =
        campo === "cantidad" ? Number(valor) : valor;

      setAlimentosRecibidos(nuevosAlimentos);
    };

  //---------------------------------------------------------------

  const limpiarCampos = () => {
    setPacienteSeleccionado("");
    setFechaHoraRecepcion("");
    setEstadoAlimentos("");
    setCantidadRecibida("");
    setAlimentosDesechados("");
    setMotivoDesecho("");
    setPacienteConsumio("");
    setObservacionesNutricionales("");
    setEntregaAlimentosPaciente("");
  };






  /*
  const manejarEnvio = async (event) => {
    event.preventDefault();
    setMensaje(null);

    if (alimentosDesechados && !motivoDesecho.trim()) {
      setMensaje({ tipo: "error", texto: "Indica el motivo del desecho." });
      return;
    }

    setGuardando(true);

    try {
      await Axios.post(`${API_URL}${CONTROL_ALIMENTOS_ENDPOINT}`, {
        paciente_id: Number(pacienteSeleccionado),
        fecha_hora_recepcion: fechaHoraRecepcion,
        estado_alimentos: estadoAlimentos,
        //cantidad_recibida: Number(cantidadRecibida),
          // NUEVO
        detalle_alimentos: alimentosRecibidos,
        alimentos_desechados: alimentosDesechados || null,
        motivo_desecho: motivoDesecho || null,
        paciente_consumio: pacienteConsumio === "si",
        observaciones_nutricionales: observacionesNutricionales || null,
        entrega_alimentos_paciente: entregaAlimentosPaciente === "si",
      });

      limpiarCampos();
      setMensaje({ tipo: "ok", texto: "El control de alimentos se guardó correctamente." });
    } catch (error) {
      console.error("Error guardando el control de alimentos:", error);
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || "No se pudo guardar el control de alimentos.",
      });
    } finally {
      setGuardando(false);
    }
  };
  */

  const manejarEnvio = async (event) => {
  event.preventDefault();
  setMensaje(null);

  if (alimentosDesechados && !motivoDesecho.trim()) {
    setMensaje({
      tipo: "error",
      texto: "Indica el motivo del desecho."
    });
    return;
  }

  setGuardando(true);

  try {
    await Axios.post(`${API_URL}${CONTROL_ALIMENTOS_ENDPOINT}`, {
      paciente_id: Number(pacienteSeleccionado),
      fecha_hora_recepcion: fechaHoraRecepcion,
      estado_alimentos: estadoAlimentos,
      // cantidad_recibida: Number(cantidadRecibida),

      detalle_alimentos: alimentosRecibidos,
      alimentos_desechados: alimentosDesechados || null,
      motivo_desecho: motivoDesecho || null,
      paciente_consumio: pacienteConsumio === "si",
      observaciones_nutricionales: observacionesNutricionales || null,
      entrega_alimentos_paciente: entregaAlimentosPaciente === "si",
    });

    // Primero limpiamos los campos
    limpiarCampos();

    // Después de guardar correctamente, enviamos los datos
    navigate("/farmacia/documento-control-alimentos", {
      state: {
        control: {
          paciente_id: Number(pacienteSeleccionado),

          paciente_nombre:
            listaPacientes.find(
              p => String(p.id) === String(pacienteSeleccionado)
            )
              ? nombrePaciente(
                  listaPacientes.find(
                    p => String(p.id) === String(pacienteSeleccionado)
                  )
                )
              : null,

          fecha_hora_recepcion: fechaHoraRecepcion,
          estado_alimentos: estadoAlimentos,
          detalle_alimentos: alimentosRecibidos,
          alimentos_desechados: alimentosDesechados,
          motivo_desecho: motivoDesecho,
          paciente_consumio: pacienteConsumio,
          observaciones_nutricionales: observacionesNutricionales,
          entrega_alimentos_paciente: entregaAlimentosPaciente,
        }
      }
    });

  } catch (error) {
    console.error(
      "Error guardando el control de alimentos:",
      error
    );

    setMensaje({
      tipo: "error",
      texto:
        error.response?.data?.message ||
        "No se pudo guardar el control de alimentos.",
    });

  } finally {
    setGuardando(false);
  }
};

  return (
    <div
      className="movimientos-layout"
      style={{ backgroundColor: "#f4f7f6", minHeight: "100vh", display: "flex" }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "40px 20px",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "#f3f0f0",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
            width: "100%",
            maxWidth: "520px",
            padding: "40px",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#0a1931", fontSize: "26px", fontWeight: "700", margin: "0 0 8px 0" }}>
            Control de alimentos
          </h2>

          <p style={{ textAlign: "center", color: "#6c757d", fontSize: "13.5px", margin: "0 0 30px 0" }}>
            Registra la recepción y entrega de alimentos del paciente.
          </p>

          {mensaje && (
            <div
              role="alert"
              style={{
                marginBottom: "20px",
                padding: "12px 14px",
                borderRadius: "8px",
                color: mensaje.tipo === "ok" ? "#166534" : "#991b1b",
                backgroundColor: mensaje.tipo === "ok" ? "#dcfce7" : "#fee2e2",
                fontSize: "13px",
              }}
            >
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={manejarEnvio}>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="paciente" style={{ display: "block", marginBottom: "8px", color: "#333333", fontSize: "13.5px", fontWeight: "500" }}>
                Seleccionar paciente
              </label>
              <select
                id="paciente"
                value={pacienteSeleccionado}
                onChange={(event) => setPacienteSeleccionado(event.target.value)}
                required
                disabled={cargandoPacientes}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#4a5568", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              >
                <option value="">
                  {cargandoPacientes ? "Cargando pacientes..." : "-- Selecciona un paciente --"}
                </option>
                {listaPacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {nombrePaciente(paciente)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="fecha-hora-recepcion" style={{ display: "block", marginBottom: "8px", color: "#333333", fontSize: "13.5px", fontWeight: "500" }}>
                Fecha y hora de la recepción
              </label>
              <input id="fecha-hora-recepcion" type="datetime-local" value={fechaHoraRecepcion} onChange={(event) => setFechaHoraRecepcion(event.target.value)} required style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#4a5568", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="estado-alimentos" style={{ display: "block", marginBottom: "8px", color: "#333333", fontSize: "13.5px", fontWeight: "500" }}>
                Estado de los alimentos
              </label>
              <select id="estado-alimentos" value={estadoAlimentos} onChange={(event) => setEstadoAlimentos(event.target.value)} required style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#4a5568", fontSize: "14px", outline: "none", boxSizing: "border-box" }}>
                <option value="">-- Selecciona el estado --</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="malo">Malo</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333333",
                    fontSize: "13.5px",
                    fontWeight: "500"
                  }}
                >
                  Alimentos recibidos
                </label>

                {alimentosRecibidos.map((alimento, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "10px"
                    }}
                  >

                    <input
                      type="text"
                      placeholder="Ej. Plátano"
                      value={alimento.nombre}
                      onChange={(event) =>
                        actualizarAlimento(
                          index,
                          "nombre",
                          event.target.value
                        )
                      }
                      style={{
                        flex: 1,
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#f8fafc",
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />

                    <input
                      type="number"
                      min="1"
                      value={alimento.cantidad}
                      onChange={(event) =>
                        actualizarAlimento(
                          index,
                          "cantidad",
                          event.target.value
                        )
                      }
                      style={{
                        width: "80px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#f8fafc",
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />

                    {alimentosRecibidos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarAlimento(index)}
                        style={{
                          padding: "0 12px",
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      >
                        ✕
                      </button>
                    )}

                  </div>
                ))}

                <button
                  type="button"
                  onClick={agregarAlimento}
                  style={{
                    marginTop: "5px",
                    padding: "9px 14px",
                    backgroundColor: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  + Agregar alimento
                </button>

              </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="alimentos-desechados" style={{ display: "block", marginBottom: "8px", color: "#333333", fontSize: "13.5px", fontWeight: "500" }}>
                Alimentos desechados (si hay)
              </label>
              <input id="alimentos-desechados" type="text" value={alimentosDesechados} onChange={(event) => setAlimentosDesechados(event.target.value)} placeholder="Ej. Ensalada, sopa..." style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#4a5568", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="motivo-desecho" style={{ display: "block", marginBottom: "8px", color: "#333333", fontSize: "13.5px", fontWeight: "500" }}>
                Motivo del desecho
              </label>
              <textarea id="motivo-desecho" value={motivoDesecho} onChange={(event) => setMotivoDesecho(event.target.value)} placeholder="Describe el motivo si se desecharon alimentos" style={{ width: "100%", padding: "12px 14px", minHeight: "80px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#333333", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="paciente-consumio" style={{ display: "block", marginBottom: "8px", color: "#333333", fontSize: "13.5px", fontWeight: "500" }}>
                ¿El paciente consumió la comida?
              </label>
              <select id="paciente-consumio" value={pacienteConsumio} onChange={(event) => setPacienteConsumio(event.target.value)} required style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#4a5568", fontSize: "14px", outline: "none", boxSizing: "border-box" }}>
                <option value="">-- Selecciona una opción --</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="observaciones-nutricionales" style={{ display: "block", marginBottom: "8px", color: "#333333", fontSize: "13.5px", fontWeight: "500" }}>
                Observaciones nutricionales
              </label>
              <textarea id="observaciones-nutricionales" value={observacionesNutricionales} onChange={(event) => setObservacionesNutricionales(event.target.value)} placeholder="Registra observaciones relevantes" style={{ width: "100%", padding: "12px 14px", minHeight: "100px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#333333", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label htmlFor="entrega-alimentos" style={{ display: "block", marginBottom: "8px", color: "#333333", fontSize: "13.5px", fontWeight: "500" }}>
                Entrega de alimentos al paciente
              </label>
              <select id="entrega-alimentos" value={entregaAlimentosPaciente} onChange={(event) => setEntregaAlimentosPaciente(event.target.value)} required style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#4a5568", fontSize: "14px", outline: "none", boxSizing: "border-box" }}>
                <option value="">-- Selecciona una opción --</option>
                <option value="si">Entregado</option>
                <option value="no">No entregado</option>
              </select>
            </div>

            <button type="submit" disabled={guardando} style={{ width: "100%", padding: "14px", backgroundColor: guardando ? "#93c5fd" : "#1d4ed8", color: "#ffffff", border: "none", borderRadius: "8px", cursor: guardando ? "wait" : "pointer", fontSize: "15px", fontWeight: "600", boxSizing: "border-box" }}>
              {guardando ? "Guardando..." : "Guardar control de alimentos"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ControlAlimientos;
