import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { PERSONAL_URL, getClinicaId } from "../farmacia/personal/Personalutils.js";
import TabEmpleados from "../farmacia/personal/Tabempleados.jsx";
import TabPuestos from "../farmacia/personal/TabPuestos";
import TabHorarios from "../farmacia/personal/TabHorarios";
import TabPermisos from "../farmacia/personal/TabPermisos";
import TabVacaciones from "../farmacia/personal/TabVacaciones";
import TabHistorial from "../farmacia/personal/TabHistorial";
import "./dashboardFarmacia.css";
import "./gestionPersonal.css";

/** CLIC-384 · Gestión de Personal — administra la información del personal de la clínica. */
const TABS = [
  { key: "empleados", label: "Empleados", icon: "bi-people" },
  { key: "puestos", label: "Puestos", icon: "bi-briefcase" },
  { key: "horarios", label: "Horarios", icon: "bi-clock" },
  { key: "permisos", label: "Permisos", icon: "bi-file-earmark-check" },
  { key: "vacaciones", label: "Vacaciones", icon: "bi-sun" },
  { key: "historial", label: "Historial laboral", icon: "bi-clock-history" },
];

export default function GestionPersonal() {
  const clinicaId = getClinicaId();

  const [tab, setTab] = useState("empleados");
  const [empleadoHistorial, setEmpleadoHistorial] = useState("");
  const [resumen, setResumen] = useState(null);

  const cargarResumen = useCallback(async () => {
    if (!clinicaId) return;
    try {
      const { data } = await axios.get(`${PERSONAL_URL}/resumen`, { params: { clinica_id: clinicaId } });
      setResumen(data);
    } catch (err) {
      console.log("Error al cargar resumen de personal:", err);
    }
  }, [clinicaId]);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  const verHistorial = (empleadoId) => {
    setEmpleadoHistorial(String(empleadoId));
    setTab("historial");
  };

  const pendientes = (resumen?.permisos_pendientes ?? 0) + (resumen?.vacaciones_pendientes ?? 0);

  const kpis = [
    { color: "blue", icon: "bi-people", titulo: "Empleados activos", valor: resumen?.empleados_activos },
    { color: "green", icon: "bi-sun", titulo: "De vacaciones hoy", valor: resumen?.en_vacaciones_hoy },
    { color: "indigo", icon: "bi-file-earmark-check", titulo: "Con permiso hoy", valor: resumen?.con_permiso_hoy },
    {
      color: "amber",
      icon: "bi-hourglass-split",
      titulo: "Solicitudes pendientes",
      valor: resumen ? pendientes : undefined,
      detalle: resumen ? `${resumen.permisos_pendientes} permisos · ${resumen.vacaciones_pendientes} vacaciones` : null,
    },
    { color: "red", icon: "bi-clock", titulo: "Sin horario", valor: resumen?.sin_horario },
  ];

  const comunes = { clinicaId, onCambio: cargarResumen };

  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-content-modern">
        <Topbar />

        <div className="gp-page">
          <div className="gp-header">
            <div>
              <span className="dash-badge">
                <i className="bi bi-person-vcard"></i> Recursos humanos
              </span>
              <h2 className="main-title">Gestión de Personal</h2>
              <p className="text-muted mb-0">Administra la información del personal de la clínica.</p>
            </div>
          </div>

          {!clinicaId ? (
            <Alert variant="warning">
              No se encontró la clínica de tu sesión. Cierra sesión e inicia de nuevo con una cuenta de clínica.
            </Alert>
          ) : (
            <>
              <div className="stats-grid">
                {kpis.map((k) => (
                  <div key={k.titulo} className={`stat-card-modern ${k.color}`}>
                    <div className="stat-icon-wrapper">
                      <i className={`bi ${k.icon}`} style={{ fontSize: 22 }}></i>
                    </div>
                    <div className="stat-data">
                      <small>{k.titulo}</small>
                      <h3>{k.valor ?? "—"}</h3>
                      {k.detalle && <small>{k.detalle}</small>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="gp-tabs" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.key}
                    className={`gp-tab ${tab === t.key ? "activa" : ""}`}
                    onClick={() => setTab(t.key)}
                  >
                    <i className={`bi ${t.icon}`}></i>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {tab === "empleados" && <TabEmpleados {...comunes} onVerHistorial={verHistorial} />}
              {tab === "puestos" && <TabPuestos {...comunes} />}
              {tab === "horarios" && <TabHorarios {...comunes} />}
              {tab === "permisos" && <TabPermisos {...comunes} />}
              {tab === "vacaciones" && <TabVacaciones {...comunes} />}
              {tab === "historial" && (
                <TabHistorial key={empleadoHistorial} clinicaId={clinicaId} empleadoInicial={empleadoHistorial} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}