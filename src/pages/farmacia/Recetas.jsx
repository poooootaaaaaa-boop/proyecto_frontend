import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

export default function RecetasRecibidas() {

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [recetas, setRecetas] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const fetchRecetas = async (page = 1) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/recetas/farmacia?page=${page}&farmacia_id=1`
    );

    setRecetas(res.data.data);
    setTotalPages(res.data.last_page);

  } catch (error) {
    console.error(error);
  }
};

const fetchStats = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/recetas/stats?farmacia_id=1`
    );

    setStats(res.data);

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchRecetas(page);
  fetchStats();
}, [page]);

const [stats, setStats] = useState({
  total: 0,
  pendientes: 0,
  entregadas: 0,
});

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

    setRecetaSeleccionada({
      ...recetaSeleccionada,
      [name]: value,
    });
  };

const guardarCambios = () => {
  if (recetaSeleccionada.estado === "entregada") {
    setRecetas(prev =>
      prev.filter(r => r.id !== recetaSeleccionada.id)
    );
  } else {
    setRecetas(prev =>
      prev.map(r =>
        r.id === recetaSeleccionada.id ? recetaSeleccionada : r
      )
    );
  }

  cerrarModales();
};

  const eliminarReceta = () => {
    setRecetas((prev) =>
      prev.filter((r) => r.id !== recetaSeleccionada.id)
    );

    cerrarModales();
  };

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <h2 className="main-title">Recetas Recibidas</h2>

        {/* CARDS */}
        <div className="stats-grid">

<div className="stat-card-modern">
  <small>Recetas del día</small>
  <h3>{stats.total}</h3>
</div>

<div className="stat-card-modern">
  <small>Pendientes</small>
  <h3>{stats.pendientes}</h3>
</div>

<div className="stat-card-modern">
  <small>Entregadas</small>
  <h3>{stats.entregadas}</h3>
</div>

        </div>

        {/* TABLA */}
        <div className="card-modern table-card">

          <h5 className="section-title">Lista de Recetas</h5>

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

                <div>{receta.paciente.usuario.nombre}</div>

<div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
  {receta.detalles.map((d, i) => (
    <span key={i} className="badge-medicamento">
      💊 {d.medicamento?.nombre}
    </span>
  ))}
</div>

               <div>
  {new Date(receta.creado_en).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</div>

             <div>
  <span
    className={`status-badge ${
      receta.estado === "pendiente"
        ? "urgent"
        : "normal"
    }`}
  >
    {receta.estado}
  </span>
</div>

                <div style={{ display: "flex", gap: "12px" }}>

                  <i
                    className="bi bi-pencil-square"
                    style={{
                      cursor: "pointer",
                      color: "#2563eb",
                      fontSize: "18px",
                    }}
                    onClick={() => abrirEditar(receta)}
                  />

                  <i
                    className="bi bi-trash"
                    style={{
                      cursor: "pointer",
                      color: "#dc2626",
                      fontSize: "18px",
                    }}
                    onClick={() => abrirEliminar(receta)}
                  />

                </div>

              </div>

            ))}

            <Pagination
  count={totalPages}
  page={page}
  onChange={(e, value) => setPage(value)}
  shape="rounded"
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
              value={recetaSeleccionada?.paciente?.usuario?.nombre || ""}disabled
              onChange={handleChange}
              placeholder="Paciente"
            />

        <div>
  {recetaSeleccionada?.detalles?.map((d, i) => (
    <div key={i}>
      💊 {d.medicamento?.nombre}
    </div>
  ))}
</div>
<input
  type="time"
  value={
    recetaSeleccionada?.creado_en
      ? new Date(recetaSeleccionada.creado_en)
          .toISOString()
          .substring(11, 16)
      : ""
  }
  disabled
/>

<select
  name="estado"
  value={recetaSeleccionada.estado}
  onChange={handleChange}
>
  <option value="pendiente">Pendiente</option>
  <option value="entregada">Entregada</option>
</select>

            <div className="modal-footer-modern">

              <button onClick={cerrarModales}>
                Cancelar
              </button>

              <button
                className="primary-btn"
                onClick={guardarCambios}
              >
                Guardar
              </button>

            </div>

          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {modalEliminar && (
        <div className="modal-overlay">
          <div className="modal-modern">

            <h4>Eliminar Receta</h4>

            <p>
              ¿Seguro que deseas eliminar la receta de{" "}
              <strong>{recetaSeleccionada?.paciente}</strong>?
            </p>

            <div className="modal-footer-modern">

              <button onClick={cerrarModales}>
                Cancelar
              </button>

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