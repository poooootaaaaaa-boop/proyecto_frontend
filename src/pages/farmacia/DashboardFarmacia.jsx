import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";

export default function DashboardFarmacia() {


  const [mesFiltro, setMesFiltro] = useState("2026-03");
    // STOCK SIMULADO

      const [movimientos, setMovimientos] = useState([
  {
    id: 1,
    fecha: "2026-03-01",
    medicamento: "Paracetamol",
    proveedor: "Farmadis",
    tipo: "entrada",
    cantidad: 100,
  },
  {
    id: 2,
    fecha: "2026-03-02",
    medicamento: "Amoxicilina",
    proveedor: "MedSupply",
    tipo: "salida",
    cantidad: 20,
  },
]);

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
const [inventario, setInventario] = useState([
  { nombre: "Paracetamol", stock: 20, minimo: 25, caducaEn: 10 },
  { nombre: "Amoxicilina", stock: 15, minimo: 20, caducaEn: 5 },
  { nombre: "Ibuprofeno", stock: 5, minimo: 10, caducaEn: 30 },
  { nombre: "Aspirina", stock: 8, minimo: 10, caducaEn: 7 },
]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);


const recetasPendientes = recetas.length;

const movimientosFiltrados = movimientos.filter((m) =>
  m.fecha.startsWith(mesFiltro)
);

const entradasMes = movimientosFiltrados
  .filter((m) => m.tipo === "entrada")
  .reduce((acc, m) => acc + m.cantidad, 0);

const salidasMes = movimientosFiltrados
  .filter((m) => m.tipo === "salida")
  .reduce((acc, m) => acc + m.cantidad, 0);

const productosBajos = inventario.filter(
  (p) => p.stock < p.minimo
);

const proximosCaducar = inventario.filter(
  (p) => p.caducaEn <= 15
);

 

useEffect(() => {
  if (productosBajos.length > 0) {
    console.log("⚠️ Stock bajo");
  }

  if (proximosCaducar.length > 0) {
    console.log("⚠️ Por caducar");
  }
}, [productosBajos, proximosCaducar]);

const consumoMedicamentos = {
  series: [
    {
      name: "Consumo",
      data: [120, 90, 70, 50, 30],
    },
  ],
  options: {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#2563eb"],
    xaxis: {
      categories: ["Paracetamol", "Ibuprofeno", "Amoxicilina", "Aspirina", "Vitamina C"],
    },
  },
};



const stockMinimo = {
  series: [
    {
      name: "Stock",
      data: inventario.map((p) => p.stock),
    },
    {
      name: "Mínimo",
      data: inventario.map((p) => p.minimo),
    },
  ],
  options: {
    chart: { type: "bar" },
    colors: ["#16a34a", "#dc2626"],
    xaxis: {
      categories: inventario.map((p) => p.nombre),
    },
  },
};

const caducidad = {
  series: [
    inventario.filter((p) => p.caducaEn <= 30).length,
    inventario.filter((p) => p.caducaEn <= 15).length,
    inventario.filter((p) => p.caducaEn <= 7).length,
  ],
  options: {
    chart: { type: "donut" },
    labels: ["30 días", "15 días", "7 días"],
  },
};


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

  //  CHARTS

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

    <div className="dashboard-header">
  <h2 className="main-title">Dashboard de Farmacia</h2>

  <div className="month-filter">
    <input
      type="month"
      value={mesFiltro}
      onChange={(e) => setMesFiltro(e.target.value)}
    />
  </div>
</div>

        {/* CARDS */}
     <div className="stats-grid">

  <div className="stat-card-modern">
    <small>📦 Entradas del mes</small>
    <h3>{entradasMes}</h3>
  </div>

  <div className="stat-card-modern">
    <small>📉 Salidas del mes</small>
    <h3>{salidasMes}</h3>
  </div>

  <div className="stat-card-modern">
    <small>⚠️ Stock bajo</small>
    <h3>{productosBajos.length}</h3>
  </div>

  <div className="stat-card-modern">
    <small>⏳ Por caducar</small>
    <h3>{proximosCaducar.length}</h3>
  </div>

  <div className="stat-card-modern">
    <small>🧾 Recetas del mes</small>
    <h3>{recetasPendientes}</h3>
  </div>

</div>

        {/* TABLA */}
        <div className="card-modern table-card">
          <h5 className="section-title">Recetas del Mes</h5>

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

        <div className="card-modern table-card">

<h5 className="section-title">
Historial de Movimientos de Inventario
</h5>

<div className="table-modern">

<div className="table-header-modern">
<span>Fecha</span>
<span>Medicamento</span>
<span>Proveedor</span>
<span>Tipo</span>
<span>Cantidad</span>
</div>

{movimientosFiltrados.map((m) => (
<div className="table-row-modern" key={m.id}>

<div>{m.fecha}</div>

<div>{m.medicamento}</div>

<div>{m.proveedor}</div>

<div>
<span className={`badge ${m.tipo}`}>
{m.tipo}
</span>
</div>

<div>{m.cantidad}</div>

</div>
))}

</div>



</div>

        {/* CHARTS */}
 <div className="charts-grid">

  <div className="card-modern">
    <h5 className="section-title">Consumo de Medicamentos</h5>
    <Chart options={consumoMedicamentos.options} series={consumoMedicamentos.series} type="bar" height={300}/>
  </div>

  <div className="card-modern">
    <h5 className="section-title">Stock vs Mínimo</h5>
    <Chart options={stockMinimo.options} series={stockMinimo.series} type="bar" height={300}/>
  </div>

  <div className="card-modern">
    <h5 className="section-title">Caducidad</h5>
    <Chart options={caducidad.options} series={caducidad.series} type="donut" height={300}/>
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