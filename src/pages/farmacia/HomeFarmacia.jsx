import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./homeFarmacia.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeFarmacia() {
  const navigate = useNavigate();

  // 🔹 Datos dinámicos
  const [recetas, setRecetas] = useState([
    { id: 1, paciente: "Juan Pérez", hora: "10:30", estado: "Urgente" },
    { id: 2, paciente: "María López", hora: "11:00", estado: "Normal" },
    { id: 3, paciente: "Carlos Ruiz", hora: "12:15", estado: "Normal" },
  ]);

  // 🔹 Modal
  const [showModal, setShowModal] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  const openModal = (receta) => {
    setRecetaSeleccionada({ ...receta });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRecetaSeleccionada(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecetaSeleccionada({
      ...recetaSeleccionada,
      [name]: value,
    });
  };

  const handleSave = () => {
    setRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaSeleccionada.id ? recetaSeleccionada : r
      )
    );
    closeModal();
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
                <span></span>
              </div>

              {recetas.map((receta) => (
                <div className="table-row-modern" key={receta.id}>
                  <div className="paciente-cell">
                    <img
                      src="https://i.pravatar.cc/40"
                      alt="avatar"
                    />
                    {receta.paciente}
                  </div>

                  <div>{receta.hora}</div>

                  <div>
                    <span
                      className={`status-badge ${
                        receta.estado === "Urgente"
                          ? "urgent"
                          : "normal"
                      }`}
                    >
                      {receta.estado}
                    </span>
                  </div>

                  <div
                    className="row-action"
                    onClick={() => openModal(receta)}
                  >
                    ⋮
                  </div>
                </div>
              ))}
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
              <h3>{recetas.length}</h3>
            </div>

            <div className="card-modern stats-card">
              <small>Alerta de stock</small>
              <h3>5</h3>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL MODERNO */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-modern">
            <div className="modal-header-modern">
              <h4>Editar receta</h4>
              <button onClick={closeModal}>✕</button>
            </div>

            {recetaSeleccionada && (
              <div className="modal-body-modern">
                <div className="form-group-modern">
                  <label>Paciente</label>
                  <input
                    type="text"
                    name="paciente"
                    value={recetaSeleccionada.paciente}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group-modern">
                  <label>Hora</label>
                  <input
                    type="time"
                    name="hora"
                    value={recetaSeleccionada.hora}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group-modern">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={recetaSeleccionada.estado}
                    onChange={handleChange}
                  >
                    <option value="Urgente">Urgente</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>
            )}

            <div className="modal-footer-modern">
              <button
                className="btn-secondary-modern"
                onClick={closeModal}
              >
                Cancelar
              </button>

              <button
                className="btn-primary-modern"
                onClick={handleSave}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}