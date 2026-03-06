import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import { useState } from "react";

export default function RecetasRecibidas() {

  const [recetas, setRecetas] = useState([
    {
      id: 1,
      paciente: "Juan Pérez",
      medicamento: "Amoxicilina",
      hora: "10:30",
      prioridad: "Urgente",
    },
    {
      id: 2,
      paciente: "María López",
      medicamento: "Paracetamol",
      hora: "11:15",
      prioridad: "Normal",
    },
    {
      id: 3,
      paciente: "Carlos Ruiz",
      medicamento: "Ibuprofeno",
      hora: "12:00",
      prioridad: "Urgente",
    },
  ]);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

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
            <h3>{recetas.length}</h3>
          </div>

          <div className="stat-card-modern">
            <small>Urgentes</small>
            <h3>
              {recetas.filter((r) => r.prioridad === "Urgente").length}
            </h3>
          </div>

          <div className="stat-card-modern">
            <small>Normales</small>
            <h3>
              {recetas.filter((r) => r.prioridad === "Normal").length}
            </h3>
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
              placeholder="Paciente"
            />

            <input
              name="medicamento"
              value={recetaSeleccionada.medicamento}
              onChange={handleChange}
              placeholder="Medicamento"
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