import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./homeFarmacia.css";
import { useState, useEffect, useRef } from "react";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function HomeFarmacia() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [notificacion, setNotificacion] = useState(null);
  const [pagination, setPagination] = useState({});
  const ultimaRecetaId = useRef(null);
  useEffect(() => {
  fetchRecetas(page);
}, [page]);

useEffect(() => {
  const interval = setInterval(() => {
    fetchRecetas(page);
  }, 5000); // cada 5 segundos

  return () => clearInterval(interval);
}, [page]);
useEffect(() => {
  if ("Notification" in window) {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }
}, []);

useEffect(() => {
  if (notificacion) {
    const timer = setTimeout(() => {
      setNotificacion(null);
    }, 4000);

    return () => clearTimeout(timer);
  }
}, [notificacion]);
const cambiarEstado = async (id, estado) => {
  try {
    await axios.put(`${API_URL}/recetas/${id}`, {
      estado,
    });

    fetchRecetas(page);
  } catch (err) {
    console.error(err);
  }
};
const fetchRecetas = async (pageNumber = 1) => {
  try {
    const res = await axios.get(
  `${API_URL}/farmacia/recetas-hoy?page=${pageNumber}`
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

  // 🔔 NOTIFICACIÓN DEL NAVEGADOR
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Nueva receta 💊", {
  body: "Tienes una nueva receta pendiente",
  icon: "https://cdn-icons-png.flaticon.com/512/2966/2966480.png",
  vibrate: [200, 100, 200],
});
  }
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
const handleSave = async () => {
  try {
    await axios.put(
      `${API_URL}/recetas/${recetaSeleccionada.id}`,
      {
        estado: recetaSeleccionada.estado,
      }
    );

    fetchRecetas(page);
    closeModal();
  } catch (err) {
    console.error(err);
  }
};

  //  eliminar receta
  const eliminarReceta = () => {
    setRecetas(recetas.filter((r) => r.id !== recetaSeleccionada.id));
    closeDeleteModal();
  };
const meds = recetaSeleccionada?.medicamentos
  ? recetaSeleccionada.medicamentos.split(";;").map(med => {
      const [nombre, presentacion, requiere_receta, stock, precio] = med.split("|");

      return {
        nombre,
        presentacion,
        requiere_receta: Number(requiere_receta),
        stock: Number(stock),
        precio: Number(precio)
      };
    })
  : [];

const total = meds.reduce((acc, m) => acc + m.precio, 0);


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
  <div
  className={`table-row-modern ${
    receta.estado === "entregado" ? "row-disabled" : ""
  }`}
  key={receta.id}
>
    
    {/* PACIENTE */}
    <div className="paciente-cell">
      <img
        src={
          receta.foto_paciente
            ? `${API_URL}/dashboard-farmacia/imagen/${receta.foto_paciente}`
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
  <span className={`status-badge ${
  receta.estado === "entregado"
    ? "success"
    : receta.estado === "pendiente"
    ? "warning"
    : "danger"
}`}>
  {receta.estado}
</span>
    </div>

    {/* ACCIONES */}
    <div className="acciones-cell">
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


{receta.estado === "pendiente" && (
<button
  onClick={() => cambiarEstado(receta.id, "entregado")}
  className="btn-entregar-icon"
  title="Entregar"
>
  <i className="bi bi-check-lg"></i>
</button>
)}
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
  <h3>Detalle de receta 💊</h3>

  <p><strong>Paciente:</strong> {recetaSeleccionada.paciente}</p>
  <p><strong>Doctor:</strong> {recetaSeleccionada.doctor}</p>
  <p><strong>Hora:</strong> {recetaSeleccionada.hora}</p>

  <hr />

<h4>Medicamentos</h4>

{meds.map((m, i) => (
  <details key={i} className="med-card animated">
    <summary>
       {m.nombre}
    </summary>

    <div className="med-content">
      <p><strong>Presentación:</strong> {m.presentacion}</p>
      <p>Receta: {m.requiere_receta ? "Sí" : "No"}</p>
      <p>Stock: {m.stock > 0 ? "Disponible" : "Sin stock ❌"}</p>
      <p>Precio: ${m.precio}</p>
    </div>
  </details>
))}

<hr />

<h3>Total: ${total}</h3>

  <hr />

  <select
    name="estado"
    value={recetaSeleccionada.estado}
    onChange={handleChange}
  >
    <option value="pendiente">Pendiente</option>
    <option value="entregado">Entregado</option>
    <option value="no_entregado">No entregado</option>
  </select>

  <div className="modal-footer-modern">
    <button onClick={closeModal}>Cerrar</button>
    <button onClick={handleSave}>Guardar</button>
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