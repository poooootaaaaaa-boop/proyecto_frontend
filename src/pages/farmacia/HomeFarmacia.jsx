import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

// Material UI Components & Icons
import {
  Pagination,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import "./homeFarmacia.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomeFarmacia() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [notificacion, setNotificacion] = useState(null);
  const [pagination, setPagination] = useState({});
  const [recetas, setRecetas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const ultimaRecetaId = useRef(null);

  // 🔹 Estado para el token de Metabase y referencia del contenedor
  const [metabaseToken, setMetabaseToken] = useState(null);
  const dashboardRef = useRef(null);

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  useEffect(() => {
    fetchRecetas(page);
    fetchMetabaseToken(); // 🔹 Cargar token de Metabase al iniciar
  }, [page]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRecetas(page);
    }, 5000); // Cada 5 segundos

    return () => clearInterval(interval);
  }, [page]);

  // 🔹 Efecto para inyectar dinámicamente el componente de Metabase cuando llegue el token
  useEffect(() => {
    if (metabaseToken && dashboardRef.current) {
      dashboardRef.current.innerHTML = ""; // Limpiar por si acaso
      const dashboardElement = document.createElement('metabase-dashboard');
      dashboardElement.setAttribute('token', metabaseToken);
      dashboardElement.setAttribute('with-title', 'true');
      dashboardElement.setAttribute('with-downloads', 'true');
      dashboardRef.current.appendChild(dashboardElement);
    }
  }, [metabaseToken]);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
  }, []);

  // 🔹 Función para obtener el token seguro desde Laravel
  const fetchMetabaseToken = async () => {
    try {
      const res = await axios.get(`${API_URL}/metabase-token`);
      if (res.data.token) {
        setMetabaseToken(res.data.token);
      }
    } catch (error) {
      console.error("Error al obtener el token de Metabase:", error);
    }
  };

  const fetchRecetas = async (pageNumber = 1) => {
    try {
      const res = await axios.get(
        `${API_URL}/farmacia/recetas-hoy?page=${pageNumber}`
      );

      const data = res.data;
      const nuevasRecetas = data.recetas?.data || [];

      if (nuevasRecetas.length > 0) {
        const primerId = nuevasRecetas[0].id;

        if (ultimaRecetaId.current === null) {
          ultimaRecetaId.current = primerId;
        } else if (primerId !== ultimaRecetaId.current) {
          setNotificacion("🚨 Nueva receta disponible para surtir");
          ultimaRecetaId.current = primerId;

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Nueva Receta 💊", {
              body: "Tienes una nueva receta pendiente en farmacia",
              icon: "https://cdn-icons-png.flaticon.com/512/2966/2966480.png",
              vibrate: [200, 100, 200],
            });
          }
        }
      }

      setRecetas(nuevasRecetas);
      setPagination(data.recetas || {});
    } catch (error) {
      console.error("Error al cargar recetas:", error);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await axios.put(`${API_URL}/recetas/${id}`, { estado });
      fetchRecetas(page);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const openModal = (receta) => {
    setRecetaSeleccionada({ ...receta });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRecetaSeleccionada(null);
  };

  const openDeleteModal = (receta) => {
    setRecetaSeleccionada(receta);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRecetaSeleccionada(null);
  };

  const handleChange = (e) => {
    if (!recetaSeleccionada) return;
    const { name, value } = e.target;
    setRecetaSeleccionada({
      ...recetaSeleccionada,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/recetas/${recetaSeleccionada.id}`, {
        estado: recetaSeleccionada.estado,
      });

      fetchRecetas(page);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarReceta = () => {
    setRecetas(recetas.filter((r) => r.id !== recetaSeleccionada.id));
    closeDeleteModal();
  };

  const meds = recetaSeleccionada?.medicamentos
    ? recetaSeleccionada.medicamentos.split(";;").map((med) => {
        const [nombre, presentacion, requiere_receta, stock, precio] = med.split("|");
        return {
          nombre,
          presentacion,
          requiere_receta: Number(requiere_receta),
          stock: Number(stock),
          precio: Number(precio),
        };
      })
    : [];

  const total = meds.reduce((acc, m) => acc + (m.precio || 0), 0);

  const recetasFiltradas = (recetas || []).filter((r) => {
    const query = busqueda.toLowerCase();
    return (
      r.paciente?.toLowerCase().includes(query) ||
      r.doctor?.toLowerCase().includes(query)
    );
  });

  const fechaHoy = new Date().toLocaleDateString("es-ES", {
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

        <Snackbar
          open={!!notificacion}
          autoHideDuration={4000}
          onClose={() => setNotificacion(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="info" onClose={() => setNotificacion(null)} className="alert-custom shadow-lg">
            {notificacion}
          </Alert>
        </Snackbar>

        <div className="home-container">
          <header className="pharmacy-header">
            <div>
              <div className="header-badge">
                <LocalPharmacyRoundedIcon fontSize="small" />
                <span>Módulo de Dispensación</span>
              </div>
              <h1 className="main-title">Panel de Farmacia</h1>
              <p className="subtitle">{fechaHoy}</p>
            </div>

            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input
                type="search"
                placeholder="Buscar paciente o doctor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="modern-search-input"
              />
            </div>
          </header>

          {/* CUERPO EN GRID */}
          <div className="pharmacy-grid">
            <div className="main-card-container">
              <div className="card-header-flex">
                <div>
                  <h3>Próximas Recetas</h3>
                  <p className="card-subtext">Monitoreo y despacho de órdenes de hoy</p>
                </div>
              </div>

              <div className="table-responsive-wrapper">
                <table className="pharmacy-table">
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Doctor</th>
                      <th>Hora</th>
                      <th>Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recetasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-table-td">
                          No hay recetas registradas para mostrar.
                        </td>
                      </tr>
                    ) : (
                      recetasFiltradas.map((receta) => (
                        <tr
                          key={receta.id}
                          className={receta.estado === "entregado" ? "row-disabled" : ""}
                        >
                          <td>
                            <div className="patient-profile">
                              <img
                                src={
                                  receta.foto_paciente
                                    ? `${API_URL}/dashboard-farmacia/imagen/${receta.foto_paciente}`
                                    : "https://i.pravatar.cc/150?u=" + receta.id
                                }
                                alt="paciente"
                                className="patient-avatar"
                              />
                              <span className="patient-name">{receta.paciente}</span>
                            </div>
                          </td>

                          <td>
                            <div className="doctor-info">
                              <MedicalServicesRoundedIcon fontSize="small" className="doc-icon" />
                              <span>{receta.doctor || "Sin doctor asignado"}</span>
                            </div>
                          </td>

                          <td>
                            <div className="time-badge">
                              <AccessTimeRoundedIcon fontSize="inherit" />
                              <span>{receta.hora}</span>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`status-chip ${
                                receta.estado === "entregado"
                                  ? "success"
                                  : receta.estado === "pendiente"
                                  ? "warning"
                                  : "danger"
                              }`}
                            >
                              {receta.estado === "entregado"
                                ? "Entregado"
                                : receta.estado === "pendiente"
                                ? "Pendiente"
                                : "No Entregado"}
                            </span>
                          </td>

                          <td className="text-center">
                            <div className="actions-cell">
                              <Tooltip title="Editar / Ver Detalle" arrow>
                                <IconButton
                                  size="small"
                                  className="btn-action-icon edit"
                                  onClick={() => openModal(receta)}
                                >
                                  <EditNoteRoundedIcon />
                                </IconButton>
                              </Tooltip>

                              {receta.estado === "pendiente" && (
                                <Tooltip title="Marcar como Entregado" arrow>
                                  <IconButton
                                    size="small"
                                    className="btn-action-icon check"
                                    onClick={() => cambiarEstado(receta.id, "entregado")}
                                  >
                                    <CheckCircleRoundedIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination-wrapper">
                <Pagination
                  count={pagination.last_page || 1}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                />
              </div>
            </div>

            {/* SIDEBAR DE ACCIONES Y ESTADÍSTICAS */}
            <aside className="quick-sidebar">
              <div className="sidebar-card">
                <h4 className="sidebar-title">Gestión Rápida</h4>
                <div className="buttons-stack">
                  <button
                    className="btn-pharmacy-primary"
                    onClick={() => navigate("/farmacia/AgregarMedicamento")}
                  >
                    <AddCircleOutlineIcon />
                    <span>Agregar Medicamento</span>
                  </button>

                  <button
                    className="btn-pharmacy-secondary"
                    onClick={() => navigate("/farmacia/Distribuidores")}
                  >
                    <LocalShippingRoundedIcon />
                    <span>Distribuidores</span>
                  </button>
                </div>
              </div>

              <div className="sidebar-card metric">
                <div className="metric-icon-box amber">
                  <PendingActionsRoundedIcon />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Recetas por validar</span>
                  <h3 className="metric-value">{pagination.total || 0}</h3>
                </div>
              </div>

              <div className="sidebar-card metric">
                <div className="metric-icon-box red">
                  <ReportProblemRoundedIcon />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Alertas de Stock</span>
                  <h3 className="metric-value">{pagination.total || 0}</h3>
                </div>
              </div>
            </aside>
          </div>

          {/* 🔹 SECCIÓN DEL DASHBOARD DE METABASE */}
          <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "15px" }}>Estadísticas Globales de Farmacia</h3>
            <div ref={dashboardRef}></div>
          </div>

        </div>
      </div>

      {/* MODAL 1: EDITAR / DETALLE DE RECETA */}
      <Dialog
        open={showModal}
        onClose={closeModal}
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "8px",
            maxWidth: "520px",
            width: "100%",
          },
        }}
      >
        <div className="modal-header-custom">
          <div className="dialog-title-wrapper">
            <MedicationRoundedIcon className="dialog-title-icon" />
            <div>
              <h3>Detalle de Receta</h3>
              <p>Revisión e inventario de medicamentos prescritos</p>
            </div>
          </div>
          <IconButton onClick={closeModal} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </div>

        <DialogContent style={{ padding: "16px 0" }}>
          {recetaSeleccionada && (
            <div className="modal-body-custom">
              <div className="info-summary-box">
                <div className="summary-item">
                  <PersonRoundedIcon className="summary-icon" />
                  <div>
                    <span className="summary-label">Paciente</span>
                    <strong>{recetaSeleccionada.paciente}</strong>
                  </div>
                </div>

                <div className="summary-item">
                  <MedicalServicesRoundedIcon className="summary-icon" />
                  <div>
                    <span className="summary-label">Doctor</span>
                    <strong>{recetaSeleccionada.doctor || "N/A"}</strong>
                  </div>
                </div>

                <div className="summary-item">
                  <AccessTimeRoundedIcon className="summary-icon" />
                  <div>
                    <span className="summary-label">Hora Prescripción</span>
                    <strong>{recetaSeleccionada.hora}</strong>
                  </div>
                </div>
              </div>

              <div className="meds-section">
                <h4 className="meds-title">Medicamentos Prescritos</h4>

                {meds.length === 0 ? (
                  <p className="no-meds-text">No se encontraron detalles de medicamentos.</p>
                ) : (
                  meds.map((m, i) => (
                    <details key={i} className="med-accordion">
                      <summary className="med-accordion-summary">
                        <span>{m.nombre}</span>
                        <ExpandMoreRoundedIcon fontSize="small" />
                      </summary>

                      <div className="med-accordion-details">
                        <div className="med-detail-row">
                          <span>Presentación:</span>
                          <strong>{m.presentacion || "N/A"}</strong>
                        </div>
                        <div className="med-detail-row">
                          <span>Requiere Receta:</span>
                          <strong>{m.requiere_receta ? "Sí 📄" : "No"}</strong>
                        </div>
                        <div className="med-detail-row">
                          <span>Disponibilidad Stock:</span>
                          <span
                            className={
                              m.stock > 0 ? "stock-tag in-stock" : "stock-tag out-stock"
                            }
                          >
                            {m.stock > 0 ? "Disponible" : "Sin Stock ❌"}
                          </span>
                        </div>
                        <div className="med-detail-row">
                          <span>Precio:</span>
                          <strong>${m.precio.toFixed(2)}</strong>
                        </div>
                      </div>
                    </details>
                  ))
                )}
              </div>

              <div className="total-price-box">
                <span>Total Estimado:</span>
                <strong className="total-amount">${total.toFixed(2)}</strong>
              </div>

              <div className="status-selector-box">
                <label className="select-label">Estado de la Orden</label>
                <select
                  name="estado"
                  value={recetaSeleccionada.estado}
                  onChange={handleChange}
                  className="custom-select-field"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="entregado">Entregado</option>
                  <option value="no_entregado">No entregado</option>
                </select>
              </div>

              <div className="modal-actions-wrapper">
                <button type="button" className="btn-modal-cancel" onClick={closeModal}>
                  Cerrar
                </button>
                <button type="button" className="btn-modal-save" onClick={handleSave}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CONFIRMAR ELIMINAR */}
      <Dialog
        open={showDeleteModal}
        onClose={closeDeleteModal}
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "8px",
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <div className="modal-header-custom">
          <div className="dialog-title-wrapper danger">
            <ReportProblemRoundedIcon className="dialog-title-icon red" />
            <div>
              <h3>Eliminar Receta</h3>
              <p>Confirmación de borrado</p>
            </div>
          </div>
          <IconButton onClick={closeDeleteModal} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </div>

        <DialogContent style={{ padding: "16px 0" }}>
          <div className="delete-modal-content">
            <p>
              ¿Estás seguro de que deseas eliminar la receta del paciente{" "}
              <strong>{recetaSeleccionada?.paciente}</strong>? Esta acción no se puede deshacer.
            </p>

            <div className="modal-actions-wrapper">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={closeDeleteModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-delete"
                onClick={eliminarReceta}
              >
                Eliminar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}