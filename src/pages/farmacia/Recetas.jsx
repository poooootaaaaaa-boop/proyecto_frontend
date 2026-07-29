import React, { useState, useEffect } from "react";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import axios from "axios";
import "./dashboardFarmacia.css";

// Material UI Components
import {
  Pagination,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from "@mui/material";

// Icons
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";

const API_URL = import.meta.env.VITE_API_URL;

export default function RecetasRecibidas() {
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    entregadas: 0,
  });

  const fetchRecetas = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/recetas/farmacia?page=${pageNumber}&farmacia_id=1`
      );
      setRecetas(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
    } catch (error) {
      console.error("Error al obtener recetas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/recetas/stats?farmacia_id=1`);
      setStats(res.data || { total: 0, pendientes: 0, entregadas: 0 });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    }
  };

  useEffect(() => {
    fetchRecetas(page);
    fetchStats();
  }, [page]);

  const abrirEditar = (receta) => {
    setRecetaSeleccionada({ ...receta });
    setModalEditar(true);
  };

  const abrirEliminar = (receta) => {
    setRecetaSeleccionada(receta);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalEditar(false);
    setModalEliminar(false);
    setRecetaSeleccionada(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecetaSeleccionada((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarCambios = () => {
    if (recetaSeleccionada.estado === "entregada") {
      setRecetas((prev) => prev.filter((r) => r.id !== recetaSeleccionada.id));
    } else {
      setRecetas((prev) =>
        prev.map((r) => (r.id === recetaSeleccionada.id ? recetaSeleccionada : r))
      );
    }
    cerrarModales();
  };

  const eliminarReceta = () => {
    setRecetas((prev) => prev.filter((r) => r.id !== recetaSeleccionada.id));
    cerrarModales();
  };

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <div className="dashboard-container">
          {/* HEADER PRINCIPAL */}
          <header className="dashboard-header">
            <div>
              <div className="dash-badge">
                <ReceiptLongRoundedIcon fontSize="small" />
                <span>Módulo de Pedidos</span>
              </div>
              <h1 className="main-title">Recetas Recibidas</h1>
            </div>
          </header>

          {/* TARJETAS METRICAS */}
          <section className="stats-grid">
            <div className="stat-card-modern blue">
              <div className="stat-icon-wrapper">
                <ReceiptLongRoundedIcon />
              </div>
              <div className="stat-data">
                <small>Recetas del Día</small>
                <h3>{stats.total}</h3>
              </div>
            </div>

            <div className="stat-card-modern amber">
              <div className="stat-icon-wrapper">
                <PendingActionsRoundedIcon />
              </div>
              <div className="stat-data">
                <small>Pendientes</small>
                <h3>{stats.pendientes}</h3>
              </div>
            </div>

            <div className="stat-card-modern green">
              <div className="stat-icon-wrapper">
                <TaskAltRoundedIcon />
              </div>
              <div className="stat-data">
                <small>Entregadas</small>
                <h3>{stats.entregadas}</h3>
              </div>
            </div>
          </section>

          {/* CONTENEDOR DE TABLA DE MATERIAL UI */}
          <Paper
            elevation={0}
            className="card-modern"
            style={{ padding: "1.5rem", borderRadius: "16px" }}
          >
            <div className="card-header-flex" style={{ marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 className="chart-title">Listado de Recetas Solicitadas</h3>
              </div>
              <span className="count-tag">{recetas.length} Registros activos</span>
            </div>

            <TableContainer style={{ borderRadius: "12px", border: "1px solid #f1f5f9" }}>
              <Table size="medium">
                <TableHead style={{ backgroundColor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: 700, color: "#475569" }}>Paciente</TableCell>
                    <TableCell style={{ fontWeight: 700, color: "#475569" }}>Medicamentos Prescritos</TableCell>
                    <TableCell style={{ fontWeight: 700, color: "#475569" }}>Hora</TableCell>
                    <TableCell style={{ fontWeight: 700, color: "#475569" }}>Estado</TableCell>
                    <TableCell align="center" style={{ fontWeight: 700, color: "#475569" }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recetas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" style={{ padding: "3rem 1rem" }}>
                        <Typography color="textSecondary" variant="body2">
                          {loading ? "Cargando recetas..." : "No hay recetas disponibles por el momento."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recetas.map((receta) => (
                      <TableRow key={receta.id} hover style={{ transition: "background-color 0.2s" }}>
                        <TableCell style={{ fontWeight: 600, color: "#0f172a" }}>
                          {receta.paciente?.usuario?.nombre || "Paciente sin nombre"}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexWrap="wrap" gap="6px">
                            {receta.detalles?.map((d, i) => (
                              <Chip
                                key={i}
                                icon={<LocalPharmacyRoundedIcon style={{ fontSize: 14 }} />}
                                label={d.medicamento?.nombre || "Desconocido"}
                                size="small"
                                variant="outlined"
                                style={{
                                  borderColor: "#cbd5e1",
                                  backgroundColor: "#f8fafc",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell style={{ color: "#64748b", fontWeight: 500 }}>
                          {receta.creado_en
                            ? new Date(receta.creado_en).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={receta.estado === "pendiente" ? "Pendiente" : "Entregada"}
                            color={receta.estado === "pendiente" ? "warning" : "success"}
                            size="small"
                            style={{ fontWeight: 600, borderRadius: "8px" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" gap="4px">
                            <Tooltip title="Editar estado">
                              <IconButton
                                size="small"
                                onClick={() => abrirEditar(receta)}
                                style={{ color: "#2563eb", backgroundColor: "#eff6ff" }}
                              >
                                <EditNoteRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar receta">
                              <IconButton
                                size="small"
                                onClick={() => abrirEliminar(receta)}
                                style={{ color: "#dc2626", backgroundColor: "#fef2f2" }}
                              >
                                <DeleteSweepRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* PAGINACIÓN */}
            <Box display="flex" justifyContent="flex-end" marginTop="1.5rem">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          </Paper>
        </div>
      </div>

      {/* MODAL EDITAR RECETA */}
      <Dialog
        open={modalEditar}
        onClose={cerrarModales}
        PaperProps={{
          style: { borderRadius: "16px", padding: "8px", maxWidth: "460px", width: "100%" },
        }}
      >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Actualizar Estado de Receta</span>
          <IconButton size="small" onClick={cerrarModales}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ borderBottom: "none" }}>
          {recetaSeleccionada && (
            <div className="modal-form-grid">
              <label>
                Paciente
                <input
                  name="paciente"
                  value={recetaSeleccionada?.paciente?.usuario?.nombre || ""}
                  disabled
                  className="modal-input"
                  style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                />
              </label>

              <label>
                Medicamentos Solicitados
                <Box display="flex" flexWrap="wrap" gap="6px" marginTop="4px">
                  {recetaSeleccionada?.detalles?.map((d, i) => (
                    <Chip
                      key={i}
                      label={d.medicamento?.nombre}
                      size="small"
                      style={{ backgroundColor: "#e2e8f0" }}
                    />
                  ))}
                </Box>
              </label>

              <label>
                Estado de la Orden
                <select
                  name="estado"
                  value={recetaSeleccionada.estado}
                  onChange={handleChange}
                  className="modal-input"
                  style={{ fontWeight: 600, borderColor: "#2563eb" }}
                >
                  <option value="pendiente">🟡 Pendiente</option>
                  <option value="entregada">🟢 Entregada</option>
                </select>
              </label>

              <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
                <button className="btn-secondary-dash" onClick={cerrarModales}>
                  Cancelar
                </button>
                <button className="btn-primary-dash" onClick={guardarCambios}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL ELIMINAR */}
      <Dialog
        open={modalEliminar}
        onClose={cerrarModales}
        PaperProps={{
          style: { borderRadius: "16px", padding: "8px", maxWidth: "400px", width: "100%" },
        }}
      >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, color: "#dc2626" }}>Eliminar Registro</span>
          <IconButton size="small" onClick={cerrarModales}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p className="delete-text" style={{ margin: "0.5rem 0 1.5rem 0", color: "#475569" }}>
            ¿Estás seguro de que deseas retirar la receta perteneciente a{" "}
            <strong>{recetaSeleccionada?.paciente?.usuario?.nombre || "este paciente"}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="modal-actions">
            <button className="btn-secondary-dash" onClick={cerrarModales}>
              Cancelar
            </button>
            <button className="btn-danger-dash" onClick={eliminarReceta}>
              Sí, Eliminar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}