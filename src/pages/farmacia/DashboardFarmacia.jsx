import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import Chart from "react-apexcharts";
import { useState } from "react";

export default function DashboardFarmacia() {

  const [recetas, setRecetas] = useState([
    {
      id: 1,
      paciente: "Juan Pérez",
      medicamento: "Amoxicilina 500 mg",
      hora: "10:30",
      prioridad: "Urgente",
    },
    {
      id: 2,
      paciente: "Ana López",
      medicamento: "Paracetamol 750 mg",
      hora: "11:15",
      prioridad: "Normal",
    },
  ]);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  // abrir editar
  const abrirEditar = (receta) => {
    setRecetaSeleccionada({ ...receta });
    setModalEditar(true);
  };

  // abrir eliminar
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

    setRecetaSeleccionada({
      ...recetaSeleccionada,
      [name]: value,
    });
  };

  const guardarCambios = () => {
    setRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaSeleccionada.id ? recetaSeleccionada : r
      )
    );

    cerrarModales();
  };

  const eliminarReceta = () => {
    setRecetas((prev) =>
      prev.filter((r) => r.id !== recetaSeleccionada.id)
    );

    cerrarModales();
  };

  // 🔹 CHARTS
  const topProductos = {
    series: [{ name: "Solicitudes", data: [45, 38, 30, 22, 18] }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 8, columnWidth: "45%" } },
      dataLabels: { enabled: false },
      colors: ["#2563eb"],
      xaxis: {
        categories: [
          "Paracetamol",
          "Ibuprofeno",
          "Amoxicilina",
          "Vitamina C",
          "Aspirina",
        ],
      },
    },
  };

  const topDistribuidores = {
    series: [40, 30, 20, 10],
    options: {
      chart: { type: "donut" },
      labels: [
        "Distribuidor A",
        "Distribuidor B",
        "Distribuidor C",
        "Distribuidor D",
      ],
      colors: ["#2563eb", "#1e40af", "#60a5fa", "#93c5fd"],
    },
  };

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <h2 className="main-title">Dashboard de Farmacia</h2>

        {/* CARDS */}
        <div className="stats-grid">
          <div className="stat-card-modern">
            <small>Recetas del día</small>
            <h3>{recetas.length}</h3>
          </div>

          <div className="stat-card-modern">
            <small>Recetas pendientes</small>
            <h3>{recetas.length}</h3>
          </div>

          <div className="stat-card-modern">
            <small>Productos por caducar</small>
            <h3>4</h3>
          </div>

          <div className="stat-card-modern">
            <small>Total de productos</small>
            <h3>248</h3>
          </div>
        </div>

        {/* TABLA */}
        <div className="card-modern table-card">
          <h5 className="section-title">Recetas Pendientes</h5>

          <div className="table-modern">
            <div className="table-header-modern">
              <span>Paciente</span>
              <span>Medicamento</span>
              <span>Hora</span>
              <span>Prioridad</span>
              <span>Acciones</span>
            </div>

            {recetas.map((receta) => (
              <div className="table-row-modern" key={receta.id}>
                <div>{receta.paciente}</div>
                <div>{receta.medicamento}</div>
                <div>{receta.hora}</div>

                <div>
                  <span
                    className={`status-badge ${
                      receta.prioridad === "Urgente"
                        ? "urgent"
                        : "normal"
                    }`}
                  >
                    {receta.prioridad}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <i
                    className="bi bi-pencil-square"
                    style={{ cursor: "pointer", color: "#2563eb" }}
                    onClick={() => abrirEditar(receta)}
                  />

                  <i
                    className="bi bi-trash"
                    style={{ cursor: "pointer", color: "#dc2626" }}
                    onClick={() => abrirEliminar(receta)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHARTS */}
        <div className="charts-grid">
          <div className="card-modern">
            <h5 className="section-title">Top Productos</h5>
            <Chart
              options={topProductos.options}
              series={topProductos.series}
              type="bar"
              height={320}
            />
          </div>

          <div className="card-modern">
            <h5 className="section-title">Top Distribuidores</h5>
            <Chart
              options={topDistribuidores.options}
              series={topDistribuidores.series}
              type="donut"
              height={320}
            />
          </div>
        </div>
      </div>

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal-modern">
            <h4>Editar Receta</h4>

            <input
              name="paciente"
              value={recetaSeleccionada.paciente}
              onChange={handleChange}
            />

            <input
              name="medicamento"
              value={recetaSeleccionada.medicamento}
              onChange={handleChange}
            />

            <input
              type="time"
              name="hora"
              value={recetaSeleccionada.hora}
              onChange={handleChange}
            />

            <select
              name="prioridad"
              value={recetaSeleccionada.prioridad}
              onChange={handleChange}
            >
              <option>Urgente</option>
              <option>Normal</option>
            </select>

            <div className="modal-footer-modern">
              <button onClick={cerrarModales}>Cancelar</button>
              <button onClick={guardarCambios}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {modalEliminar && (
        <div className="modal-overlay">
          <div className="modal-modern">
            <h4>¿Eliminar receta?</h4>
            <p>
              ¿Estás seguro de que deseas eliminar la receta de{" "}
              <strong>{recetaSeleccionada?.paciente}</strong>?
            </p>

            <div className="modal-footer-modern">
              <button onClick={cerrarModales}>Cancelar</button>
          <button
  className="btn-danger"
  onClick={eliminarReceta}
>
  Eliminar
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}