import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./homeFarmacia.css";
import { useState, useEffect, useRef } from "react";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomeFarmacia() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [notificacion, setNotificacion] = useState(null);
  const [pagination, setPagination] = useState({});
  const ultimaRecetaId = useRef(null);
  useEffect(() => {
  fetchRecetas(page);
}, [page]);
-

useEffect(() => {
  if (notificacion) {
    const timer = setTimeout(() => {
      setNotificacion(null);
    }, 4000);

    return () => clearTimeout(timer);
  }
}, [notificacion]);

const fetchRecetas = async (pageNumber = 1) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/dashboard-farmacia?page=${pageNumber}`
    );

    const data = res.data;
    const nuevasRecetas = data.recetas.data || [];

    if (nuevasRecetas.length > 0) {
      const primerId = nuevasRecetas[0].id;

      //  PRIMERA VEZ: solo guardar, NO notificar
      if (ultimaRecetaId.current === null) {
        ultimaRecetaId.current = primerId;
      } 
      //  NUEVA RECETA
      else if (primerId !== ultimaRecetaId.current) {
        setNotificacion("🚨 Nueva receta disponible");
        ultimaRecetaId.current = primerId;
      }
    }

    setRecetas(nuevasRecetas);
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
        {notificacion && (
  <div
    style={{
      background: "#22c55e",
      color: "white",
      padding: "10px",
      borderRadius: "10px",
      marginBottom: "10px",
      textAlign: "center",
      fontWeight: "bold",
    }}
  >
    {notificacion}
  </div>
)}
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
  <span>Doctor</span>
  <span>Hora</span>
  <span>Estado</span>
  <span>Acciones</span>
</div>

{recetas.map((receta) => (
  <div className="table-row-modern" key={receta.id}>
    
    {/* PACIENTE */}
    <div className="paciente-cell">
      <img
        src={
          receta.foto_paciente
            ? `http://localhost:8000/api/dashboard-farmacia/imagen/${receta.foto_paciente}`
            : "https://i.pravatar.cc/40"
        }
        alt="paciente"
      />
      {receta.paciente}
    </div>

    {/* DOCTOR  */}
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {receta.doctor || "Sin doctor"}
    </div>

    {/* HORA */}
    <div>{receta.hora}</div>

    {/* ESTADO */}
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

    {/* ACCIONES */}
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

<p style={{ marginTop: "10px", fontWeight: "bold" }}>
  Medicamentos:
</p>

<ul style={{ marginTop: "10px" }}>
  {recetaSeleccionada?.medicamento
    ?.split(",")
    .map((med, index) => (
      <li key={index}>{med.trim()}</li>
    ))}
</ul>
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