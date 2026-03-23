import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./homeFarmacia.css";
import { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";

export default function HomeFarmacia() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  useEffect(() => {
  fetchRecetas(page);
}, [page]);

  const fetchRecetas = async (pageNumber = 1) => {
  try {
    const res = await fetch(
      `http://localhost:8000/api/dashboard-farmacia?page=${pageNumber}`
    );

    const data = await res.json();
    console.log(data);

    setRecetas(data.recetas.data || []);
setPagination(data.recetas);
  } catch (error) {
    console.error(error);
  }
};

const handlePageChange = (event, value) => {
  setPage(value);
};

const [recetas, setRecetas] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  // 🔹 abrir editar
  const openModal = (receta) => {
    setRecetaSeleccionada({ ...receta });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRecetaSeleccionada(null);
  };

  // 🔹 abrir eliminar
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

  // 🔹 guardar edición
  const handleSave = () => {
    setRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaSeleccionada.id ? recetaSeleccionada : r
      )
    );

    closeModal();
  };

  //  eliminar receta
  const eliminarReceta = () => {
    setRecetas(recetas.filter((r) => r.id !== recetaSeleccionada.id));
    closeDeleteModal();
  };

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        {/* HEADER */}
        <div className="home-header-modern">
          <div>
            <h2 className="main-title">Panel de Farmacia</h2>
            <p className="subtitle">Jueves, 24 de octubre</p>
          </div>

          <input
            type="search"
            placeholder="Buscar receta..."
            className="modern-search"
          />
        </div>

        <div className="home-grid">
          {/* RECETAS */}
          <div className="card-modern">
            <div className="card-header-modern">
              <h5>Próximas recetas</h5>
            </div>

            <div className="table-modern">
              <div className="table-header-modern">
                <span>Paciente</span>
                <span>Hora</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>

              {recetas.map((receta) => (
                <div className="table-row-modern" key={receta.id}>
                  <div className="paciente-cell">
                    <img src="https://i.pravatar.cc/40" alt="avatar" />
                    {receta.paciente}
                  </div>

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

                  {/* ICONOS */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => openModal(receta)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#2563eb",
                      }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      onClick={() => openDeleteModal(receta)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#dc2626",
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
  <Pagination
    count={pagination.last_page || 1}
    page={page}
    onChange={handlePageChange}
    color="primary"
  />
</div>
          </div>

          {/* ACCESOS RAPIDOS */}
          <div className="quick-actions">
            <div className="card-modern">
              <button
                className="btn-primary-modern"
                onClick={() =>
                  navigate("/farmacia/AgregarMedicamento")
                }
              >
                Agregar medicamento
              </button>
            </div>

            <div className="card-modern">
              <button
                className="btn-primary-modern"
                onClick={() =>
                  navigate("/farmacia/Distribuidores")
                }
              >
                Distribuidores
              </button>
            </div>

            <div className="card-modern stats-card">
              <small>Recetas por validar</small>
              <h3>{pagination.total || 0}</h3>
            </div>

            <div className="card-modern stats-card">
              <small>Alerta de stock</small>
              <h3>{pagination.total || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDITAR */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-modern">
            <h4>Editar receta</h4>

            {recetaSeleccionada && (
              <>
                <input
                  type="text"
                  name="paciente"
                  value={recetaSeleccionada.paciente}
                  onChange={handleChange}
                  placeholder="Paciente"
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
  <option value="Urgente">Urgente</option>
  <option value="Normal">Normal</option>
</select>
              </>
            )}

            <div className="modal-footer-modern">
              <button onClick={closeModal}>Cancelar</button>

              <button onClick={handleSave}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-modern">
            <h4>Eliminar receta</h4>

            <p>
              ¿Estás seguro que deseas eliminar la receta de{" "}
              <strong>{recetaSeleccionada?.paciente}</strong>?
            </p>

            <div className="modal-footer-modern">
              <button onClick={closeDeleteModal}>
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