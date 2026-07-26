import React, { useState, useEffect } from "react";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import Chart from "react-apexcharts";
import "./dashboardFarmacia.css";

// Material UI
import {
  Pagination,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";

// Icons
import MoveToInboxRoundedIcon from "@mui/icons-material/MoveToInboxRounded";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";

export default function DashboardFarmacia() {
  const [consumo, setConsumo] = useState([]);
  const [mesFiltro, setMesFiltro] = useState("2026-03");

  // PAGINACIÓN Y FILTROS
  const [paginaRecetas, setPaginaRecetas] = useState(1);
  const [paginaMovimientos, setPaginaMovimientos] = useState(1);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState("");

  // ESTADOS Y DATOS INICIALES
  const [movimientos, setMovimientos] = useState([
    { id: 1, fecha: "2026-03-01", medicamento: "Paracetamol", proveedor: "Farmadis", tipo: "entrada", cantidad: 100 },
    { id: 2, fecha: "2026-03-02", medicamento: "Amoxicilina", proveedor: "MedSupply", tipo: "salida", cantidad: 20 },
  ]);

  const [recetas, setRecetas] = useState([
    { id: 1, paciente: "Juan Pérez", medicamento: "Amoxicilina 500 mg", hora: "10:30", prioridad: "Urgente" },
    { id: 2, paciente: "Ana López", medicamento: "Paracetamol 750 mg", hora: "11:15", prioridad: "Normal" },
  ]);

  const [inventario, setInventario] = useState([
    { nombre: "Paracetamol", stock: 20, minimo: 25, caducaEn: 10 },
    { nombre: "Amoxicilina", stock: 15, minimo: 20, caducaEn: 5 },
    { nombre: "Ibuprofeno", stock: 5, minimo: 10, caducaEn: 30 },
    { nombre: "Aspirina", stock: 8, minimo: 10, caducaEn: 7 },
  ]);

  // MODALES
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  const itemsPorPagina = 5;

  useEffect(() => {
    setPaginaRecetas(1);
    setPaginaMovimientos(1);
  }, [mesFiltro]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/dashboard-farmacia?mes=${mesFiltro}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setMovimientos(data.movimientos || []);
          setRecetas(data.recetas?.data || []);
          setInventario(data.inventario || []);
          setConsumo(data.consumo || []);
        }
      })
      .catch((err) => console.error("Error backend dashboard:", err));
  }, [mesFiltro]);

  // CÁLCULOS
  const inventarioCritico = [...inventario]
    .sort((a, b) => a.stock - a.minimo - (b.stock - b.minimo))
    .slice(0, 4);

  const inventarioFiltrado = medicamentoSeleccionado
    ? inventario.filter((p) => p.nombre === medicamentoSeleccionado)
    : inventario;

  const dataMostrar = medicamentoSeleccionado ? inventarioFiltrado : inventarioCritico;

  const entradasMes = movimientos.filter((m) => m.tipo === "entrada").reduce((acc, m) => acc + m.cantidad, 0);
  const salidasMes = movimientos.filter((m) => m.tipo === "salida").reduce((acc, m) => acc + m.cantidad, 0);
  const productosBajos = inventario.filter((p) => p.stock < p.minimo);
  const proximosCaducar = inventario.filter((p) => p.caducaEn <= 15);

  // PAGINACIÓN CÁLCULOS
  const totalPaginasRecetas = Math.max(1, Math.ceil(recetas.length / itemsPorPagina));
  const recetasPaginadas = recetas.slice((paginaRecetas - 1) * itemsPorPagina, paginaRecetas * itemsPorPagina);

  const totalPaginasMovimientos = Math.max(1, Math.ceil(movimientos.length / itemsPorPagina));
  const movimientosPaginados = movimientos.slice((paginaMovimientos - 1) * itemsPorPagina, paginaMovimientos * itemsPorPagina);

  // CONFIGURACIÓN DE GRÁFICAS APEXCHARTS

  // 1. Consumo - Área con Gradiente
  const consumoChartOptions = {
    chart: { type: "area", toolbar: { show: false } },
    colors: ["#2563eb"],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: consumo.length > 0 ? consumo.map((c) => c.nombre) : ["Ene", "Feb", "Mar"],
      labels: { style: { colors: "#64748b", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: "#64748b" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
  };

  const consumoChartSeries = [
    { name: "Unidades Consumidas", data: consumo.length > 0 ? consumo.map((c) => c.total) : [30, 40, 35] },
  ];

  // 2. Disponibilidad/Stock - Barras
  const stockChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "40%", borderRadius: 6 } },
    colors: ["#10b981", "#f43f5e"],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: dataMostrar.map((p) => p.nombre),
      labels: { style: { colors: "#64748b", fontSize: "11px" } },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    legend: { position: "top", horizontalAlign: "right" },
  };

  const stockChartSeries = [
    { name: "Stock Actual", data: dataMostrar.map((p) => p.stock) },
    { name: "Stock Mínimo", data: dataMostrar.map((p) => p.minimo) },
  ];

  // 3. Caducidad - Donut Moderno
  const caducidadChartOptions = {
    chart: { type: "donut" },
    colors: ["#3b82f6", "#f59e0b", "#ef4444"],
    labels: ["30 Días", "15 Días", "7 Días o menos"],
    legend: { position: "bottom", fontSize: "12px" },
    plotOptions: { pie: { donut: { size: "72%" } } },
    dataLabels: { enabled: false },
  };

  const caducidadChartSeries = [
    inventario.filter((p) => p.caducaEn > 15 && p.caducaEn <= 30).length || 5,
    inventario.filter((p) => p.caducaEn > 7 && p.caducaEn <= 15).length || 2,
    inventario.filter((p) => p.caducaEn <= 7).length || 1,
  ];

  // MANEJO MODALES
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
    setRecetaSeleccionada({ ...recetaSeleccionada, [name]: value });
  };

  const guardarCambios = () => {
    setRecetas((prev) => prev.map((r) => (r.id === recetaSeleccionada.id ? recetaSeleccionada : r)));
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
          {/* HEADER DEL DASHBOARD */}
          <header className="dashboard-header">
            <div>
              <div className="dash-badge">
                <AnalyticsRoundedIcon fontSize="small" />
                <span>Métricas de Control</span>
              </div>
              <h1 className="main-title">Dashboard Analítico de Farmacia</h1>
            </div>

            <div className="month-filter-box">
              <CalendarMonthRoundedIcon className="calendar-icon" />
              <input
                type="month"
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="month-input"
              />
            </div>
          </header>

          {/* TARJETAS KPI / MÉTRICAS */}
          <section className="stats-grid">
            <div className="stat-card-modern blue">
              <div className="stat-icon-wrapper"><MoveToInboxRoundedIcon /></div>
              <div className="stat-data">
                <small>Entradas del Mes</small>
                <h3>{entradasMes}</h3>
              </div>
            </div>

            <div className="stat-card-modern indigo">
              <div className="stat-icon-wrapper"><OutboxRoundedIcon /></div>
              <div className="stat-data">
                <small>Salidas del Mes</small>
                <h3>{salidasMes}</h3>
              </div>
            </div>

            <div className="stat-card-modern amber">
              <div className="stat-icon-wrapper"><WarningAmberRoundedIcon /></div>
              <div className="stat-data">
                <small>Stock Bajo</small>
                <h3>{productosBajos.length}</h3>
              </div>
            </div>

            <div className="stat-card-modern red">
              <div className="stat-icon-wrapper"><AccessTimeFilledRoundedIcon /></div>
              <div className="stat-data">
                <small>Por Caducar</small>
                <h3>{proximosCaducar.length}</h3>
              </div>
            </div>

            <div className="stat-card-modern green">
              <div className="stat-icon-wrapper"><ReceiptLongRoundedIcon /></div>
              <div className="stat-data">
                <small>Recetas del Mes</small>
                <h3>{recetas.length}</h3>
              </div>
            </div>
          </section>

          {/* TABLAS */}
          <div className="tables-grid">
            {/* TABLA 1: RECETAS */}
            <div className="card-modern table-card">
              <div className="card-header-flex">
                <h3>Recetas del Mes</h3>
                <span className="count-tag">{recetas.length} Registros</span>
              </div>

              <div className="table-responsive">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Medicamento</th>
                      <th>Hora</th>
                      <th>Prioridad</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recetasPaginadas.map((r) => (
                      <tr key={r.id}>
                        <td className="font-semibold">{r.paciente}</td>
                        <td>{r.medicamento}</td>
                        <td><span className="time-pill">{r.hora}</span></td>
                        <td>
                          <span className={`priority-tag ${r.prioridad === "Urgente" ? "urgent" : "normal"}`}>
                            {r.prioridad || "Normal"}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="actions-flex">
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => abrirEditar(r)} color="primary">
                                <EditNoteRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" onClick={() => abrirEliminar(r)} color="error">
                                <DeleteSweepRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-box">
                <Pagination
                  count={totalPaginasRecetas}
                  page={paginaRecetas}
                  onChange={(e, value) => setPaginaRecetas(value)}
                  size="small"
                  color="primary"
                />
              </div>
            </div>

            {/* TABLA 2: MOVIMIENTOS */}
            <div className="card-modern table-card">
              <div className="card-header-flex">
                <h3>Movimientos de Inventario</h3>
                <span className="count-tag">{movimientos.length} Movimientos</span>
              </div>

              <div className="table-responsive">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Medicamento</th>
                      <th>Proveedor</th>
                      <th>Tipo</th>
                      <th>Cant.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientosPaginados.map((m) => (
                      <tr key={m.id}>
                        <td>{m.fecha}</td>
                        <td className="font-semibold">{m.medicamento}</td>
                        <td>{m.proveedor || "N/A"}</td>
                        <td>
                          <span className={`type-badge ${m.tipo}`}>
                            {m.tipo === "entrada" ? "Entrada" : "Salida"}
                          </span>
                        </td>
                        <td className="font-bold">{m.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-box">
                <Pagination
                  count={totalPaginasMovimientos}
                  page={paginaMovimientos}
                  onChange={(e, value) => setPaginaMovimientos(value)}
                  size="small"
                  color="primary"
                />
              </div>
            </div>
          </div>

          {/* GRÁFICAS */}
          <section className="charts-grid">
            {/* GRÁFICA 1 */}
            <div className="card-modern chart-card">
              <h3 className="chart-title">Consumo de Medicamentos</h3>
              <p className="chart-sub">Tendencia acumulada del período</p>
              <Chart options={consumoChartOptions} series={consumoChartSeries} type="area" height={260} width="100%" />
            </div>

            {/* GRÁFICA 2 */}
            <div className="card-modern chart-card">
              <div className="chart-header-select">
                <div>
                  <h3 className="chart-title">Disponibilidad de Stock</h3>
                  <p className="chart-sub">Stock actual vs Stock mínimo</p>
                </div>
                <select
                  value={medicamentoSeleccionado}
                  onChange={(e) => setMedicamentoSeleccionado(e.target.value)}
                  className="chart-filter-select"
                >
                  <option value="">Críticos / Todos</option>
                  {inventario.map((p, i) => (
                    <option key={i} value={p.nombre}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <Chart options={stockChartOptions} series={stockChartSeries} type="bar" height={240} width="100%" />
            </div>

            {/* GRÁFICA 3 */}
            <div className="card-modern chart-card">
              <h3 className="chart-title">Riesgo de Caducidad</h3>
              <p className="chart-sub">Distribución por vencimiento</p>
              <Chart options={caducidadChartOptions} series={caducidadChartSeries} type="donut" height={260} width="100%" />
            </div>
          </section>
        </div>
      </div>

      {/* DIALOG EDITAR RECETA */}
      <Dialog open={modalEditar} onClose={cerrarModales} PaperProps={{ style: { borderRadius: "16px", padding: "8px", maxWidth: "450px", width: "100%" } }}>
        <div className="modal-header-dash">
          <h3>Editar Receta</h3>
          <IconButton size="small" onClick={cerrarModales}><CloseRoundedIcon /></IconButton>
        </div>
        <DialogContent>
          {recetaSeleccionada && (
            <div className="modal-form-grid">
              <label>Paciente
                <input name="paciente" value={recetaSeleccionada.paciente} onChange={handleChange} className="modal-input" />
              </label>
              <label>Medicamento
                <input name="medicamento" value={recetaSeleccionada.medicamento} onChange={handleChange} className="modal-input" />
              </label>
              <label>Hora
                <input type="time" name="hora" value={recetaSeleccionada.hora} onChange={handleChange} className="modal-input" />
              </label>
              <label>Prioridad
                <select name="prioridad" value={recetaSeleccionada.prioridad} onChange={handleChange} className="modal-input">
                  <option value="Urgente">Urgente</option>
                  <option value="Normal">Normal</option>
                </select>
              </label>
              <div className="modal-actions">
                <button className="btn-secondary-dash" onClick={cerrarModales}>Cancelar</button>
                <button className="btn-primary-dash" onClick={guardarCambios}>Guardar</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG ELIMINAR */}
      <Dialog open={modalEliminar} onClose={cerrarModales} PaperProps={{ style: { borderRadius: "16px", padding: "8px", maxWidth: "400px", width: "100%" } }}>
        <div className="modal-header-dash">
          <h3>Eliminar Registro</h3>
          <IconButton size="small" onClick={cerrarModales}><CloseRoundedIcon /></IconButton>
        </div>
        <DialogContent>
          <p className="delete-text">
            ¿Deseas borrar la receta de <strong>{recetaSeleccionada?.paciente}</strong>?
          </p>
          <div className="modal-actions">
            <button className="btn-secondary-dash" onClick={cerrarModales}>Cancelar</button>
            <button className="btn-danger-dash" onClick={eliminarReceta}>Eliminar</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}