import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { Pagination, Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import "./homeFarmacia.css";

const API_URL = import.meta.env.VITE_API_URL;

function fechaLocalISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function inicioDeMes() {
  const hoy = new Date();
  return fechaLocalISO(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
}

function formatearFechaHora(iso) {
  if (!iso) return "—";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "—";

  return fecha.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function urlFoto(foto) {
  if (!foto) return null;
  if (/^https?:\/\//i.test(foto)) return foto;
  return `${API_URL}/dashboard-farmacia/imagen/${foto}`;
}

function mensajeError(error) {
  const datos = error.response?.data;
  const primerCampo = datos?.errors ? Object.values(datos.errors)[0] : null;
  return primerCampo?.[0] || datos?.message || "No se pudo cargar el historial de sesiones.";
}

function AvatarDoctor({ doctor }) {
  const [rota, setRota] = useState(false);
  const src = urlFoto(doctor?.foto_url);
  const inicial = (doctor?.nombre || "?").trim().charAt(0).toUpperCase();

  if (!src || rota) {
    return <span className="session-avatar-fallback">{inicial}</span>;
  }

  return (
    <img
      src={src}
      alt=""
      className="patient-avatar"
      onError={() => setRota(true)}
    />
  );
}

export default function HistorialSesionesDoctores() {
  const [filtros, setFiltros] = useState({
    desde: inicioDeMes(),
    hasta: fechaLocalISO(new Date()),
    doctor_id: "",
    per_page: 50,
  });
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [doctores, setDoctores] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activas: 0,
    cerradas: 0,
    duracion_promedio: "—",
  });
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 50, total: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/doctores-completo`)
      .then((res) => {
        const lista = Array.isArray(res.data) ? res.data : [];
        setDoctores(
          lista.map((doctor) => ({
            id: doctor.id,
            nombre: doctor.usuario?.nombre || doctor.nombre || `Doctor ${doctor.id}`,
          }))
        );
      })
      .catch(() => setDoctores([]));
  }, []);

  useEffect(() => {
    const controlador = new AbortController();

    const cargar = async () => {
      setCargando(true);
      setError("");

      const params = {
        page,
        per_page: filtros.per_page,
      };

      if (filtros.desde) params.desde = filtros.desde;
      if (filtros.hasta) params.hasta = filtros.hasta;
      if (filtros.doctor_id) params.doctor_id = filtros.doctor_id;

      try {
        const res = await axios.get(`${API_URL}/sesiones-doctores`, {
          params,
          signal: controlador.signal,
        });

        setSesiones(res.data?.sesiones || []);
        setEstadisticas(res.data?.estadisticas || {});
        setMeta(res.data?.meta || { current_page: 1, last_page: 1, per_page: 50, total: 0 });
      } catch (err) {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") return;
        setSesiones([]);
        setError(mensajeError(err));
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    };

    cargar();
    return () => controlador.abort();
  }, [filtros, page]);

  const actualizarFiltro = (campo, valor) => {
    setPage(1);
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const sesionesVisibles = sesiones.filter((sesion) => {
    const consulta = busqueda.trim().toLowerCase();
    if (!consulta) return true;
    const doctor = sesion.doctor || {};
    return [doctor.nombre, doctor.correo, doctor.especialidad]
      .filter(Boolean)
      .some((valor) => String(valor).toLowerCase().includes(consulta));
  });

  const fechaHoy = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <div className="home-container">
          <header className="pharmacy-header">
            <div>
              <div className="header-badge">
                <MedicalServicesRoundedIcon fontSize="small" />
                <span>Módulo clínico</span>
              </div>
              <h1 className="main-title">Historial de entradas y salidas</h1>
              <p className="subtitle">{fechaHoy}</p>
            </div>

            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input
                type="search"
                placeholder="Buscar doctor o especialidad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="modern-search-input"
              />
            </div>
          </header>

          <div className="session-filters">
            <div className="session-field">
              <label htmlFor="desde">Desde</label>
              <input
                id="desde"
                type="date"
                className="session-input"
                value={filtros.desde}
                max={filtros.hasta || undefined}
                onChange={(e) => actualizarFiltro("desde", e.target.value)}
              />
            </div>
            <div className="session-field">
              <label htmlFor="hasta">Hasta</label>
              <input
                id="hasta"
                type="date"
                className="session-input"
                value={filtros.hasta}
                min={filtros.desde || undefined}
                onChange={(e) => actualizarFiltro("hasta", e.target.value)}
              />
            </div>
            <div className="session-field">
              <label htmlFor="doctor">Doctor</label>
              <select
                id="doctor"
                className="session-input"
                value={filtros.doctor_id}
                onChange={(e) => actualizarFiltro("doctor_id", e.target.value)}
              >
                <option value="">Todos los doctores</option>
                {doctores.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="session-field">
              <label htmlFor="per-page">Por página</label>
              <select
                id="per-page"
                className="session-input"
                value={filtros.per_page}
                onChange={(e) => actualizarFiltro("per_page", Number(e.target.value))}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="pharmacy-grid">
            <div className="main-card-container">
              <div className="card-header-flex">
                <div>
                  <h3>Sesiones de doctores</h3>
                  <p className="card-subtext">
                    Entradas y salidas registradas en el periodo seleccionado
                  </p>
                </div>
              </div>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
                  {error}
                </Alert>
              )}

              <div className="table-responsive-wrapper">
                <table className="pharmacy-table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Entrada</th>
                      <th>Salida</th>
                      <th>Duración</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr>
                        <td colSpan="5" className="empty-table-td">
                          Cargando sesiones...
                        </td>
                      </tr>
                    ) : sesionesVisibles.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-table-td">
                          No hay sesiones para los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      sesionesVisibles.map((sesion) => {
                        const activa = sesion.estado === "activa";
                        return (
                          <tr key={sesion.id}>
                            <td>
                              <div className="patient-profile">
                                <AvatarDoctor doctor={sesion.doctor} />
                                <div className="doctor-meta">
                                  <span className="patient-name">
                                    {sesion.doctor?.nombre || "Doctor sin nombre"}
                                  </span>
                                  <small>
                                    {sesion.doctor?.especialidad || sesion.doctor?.correo || "Sin especialidad"}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="time-badge">
                                <AccessTimeRoundedIcon fontSize="inherit" />
                                <span>{formatearFechaHora(sesion.inicio_sesion)}</span>
                              </div>
                            </td>
                            <td>
                              <div className="time-badge">
                                <AccessTimeRoundedIcon fontSize="inherit" />
                                <span>{formatearFechaHora(sesion.fin_sesion)}</span>
                              </div>
                            </td>
                            <td>{activa ? "En curso" : sesion.duracion || "—"}</td>
                            <td>
                              <span className={`status-chip ${activa ? "success" : "neutral"}`}>
                                {activa ? "Activa" : "Cerrada"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination-wrapper">
                <Pagination
                  count={meta.last_page || 1}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </div>
            </div>

            <aside className="quick-sidebar">
              <div className="sidebar-card metric">
                <div className="metric-icon-box blue">
                  <PeopleAltRoundedIcon />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Sesiones</span>
                  <h3 className="metric-value">{estadisticas.total ?? 0}</h3>
                </div>
              </div>

              <div className="sidebar-card metric">
                <div className="metric-icon-box green">
                  <LoginRoundedIcon />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Activas</span>
                  <h3 className="metric-value">{estadisticas.activas ?? 0}</h3>
                </div>
              </div>

              <div className="sidebar-card metric">
                <div className="metric-icon-box amber">
                  <LogoutRoundedIcon />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Cerradas</span>
                  <h3 className="metric-value">{estadisticas.cerradas ?? 0}</h3>
                </div>
              </div>

              <div className="sidebar-card metric">
                <div className="metric-icon-box blue">
                  <AccessTimeRoundedIcon />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Duración promedio</span>
                  <h3 className="metric-value">{estadisticas.duracion_promedio || "—"}</h3>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
