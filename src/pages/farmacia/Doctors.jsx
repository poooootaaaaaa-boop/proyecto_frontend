import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PencilSquare, Trash } from "react-bootstrap-icons";

export default function Doctors() {

  const [search, setSearch] = useState("");

  const [doctors, setDoctors] = useState(
  JSON.parse(localStorage.getItem("doctors")) ||[
    {
      name: "Dr. Sarah Connor",
      role: "Medicina Interna",
      specialty: "Cardiólogo",
      license: "MLN-88291",
      email: "sarah.c@citypharmacy.com",
      status: "Activo",
    },
    {
      name: "Dr. James Wilson",
      role: "Medicina General",
      specialty: "Médico General",
      license: "MLN-44502",
      email: "j.wilson@healthlink.net",
      status: "Activo",
    },
    {
      name: "Dr. Elena Rodriguez",
      role: "Dermatología",
      specialty: "Dermatóloga",
      license: "MLN-11938",
      email: "elena.r@clinical.org",
      status: "Inactivo",
    },
    {
      name: "Dr. Marcus Thorne",
      role: "Ciencias Farmacéuticas",
      specialty: "Farmacéutico",
      license: "MLN-99201",
      email: "m.thorne@citypharmacy.com",
      status: "Activo",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEditModal = (doctor, index) => {
    setSelectedDoctor({ ...doctor });
    setEditIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setSelectedDoctor({
      ...selectedDoctor,
      [e.target.name]: e.target.value,
    });
  };

  const saveDoctor = () => {
    const updatedDoctors = [...doctors];
    updatedDoctors[editIndex] = selectedDoctor;
    setDoctors(updatedDoctors);
    setShowModal(false);
  };

  const openDeleteModal = (index) => {
    setDoctorToDelete(index);
    setShowDeleteModal(true);
  };

  const deleteDoctor = () => {
    const updatedDoctors = doctors.filter((_, i) => i !== doctorToDelete);
    setDoctors(updatedDoctors);
    setShowDeleteModal(false);
  };

  return (
    <div className="home-layout">

      <Sidebar />

      <div className="home-content-modern">

        <Topbar />

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h2 className="main-title">Gestión de Doctores</h2>
            <p style={{ color: "#64748b" }}>
              Administra los profesionales médicos del sistema.
            </p>
          </div>

          <Button
            as={NavLink}
            to="/farmacia/agregardoctor"
            size="sm"
            variant="primary"
          >
            + Agregar
          </Button>

        </div>

        {/* BUSCADOR */}
        <div className="card-modern" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad o licencia..."
            className="modern-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLA */}
        <div className="card-modern table-card">

          <div className="table-modern">

            <div className="table-header-modern">
              <span>Perfil</span>
              <span>Especialidad</span>
              <span>Número de Licencia</span>
              <span>Contacto</span>
              <span>Acciones</span>
            </div>

            {filteredDoctors.map((doctor, index) => (

              <div className="table-row-modern" key={index}>

                {/* PERFIL */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {doctor.name.charAt(3)}
                  </div>

                  <div>
                    <strong>{doctor.name}</strong>
                    <small style={{ display: "block", color: "#64748b" }}>
                      {doctor.role}
                    </small>
                  </div>

                </div>

                <div>{doctor.specialty}</div>

                <div>{doctor.license}</div>

                <div>{doctor.email}</div>

                {/* ACCIONES */}
                <div style={{ display: "flex", gap: "8px" }}>

                  <button
                    onClick={() => openEditModal(doctor, index)}
                    style={{
                      border: "none",
                      background: "#f1f5f9",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <PencilSquare />
                  </button>

                  <button
                    onClick={() => openDeleteModal(index)}
                    style={{
                      border: "none",
                      background: "#fee2e2",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      color: "#dc2626",
                    }}
                  >
                    <Trash />
                  </button>

                </div>

                {/* ESTADO 
                <div>
                  <span
                    className={
                      doctor.status === "Activo"
                        ? "status-badge success"
                        : "status-badge danger"
                    }
                  >
                    {doctor.status}
                  </span>
                </div>*/}

              </div>

            ))}

          </div>

          <div
            style={{
              padding: "15px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Mostrando {filteredDoctors.length} doctores
          </div>

        </div>

      </div>

      {/* MODAL EDITAR */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Editar Doctor</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">

                <div className="mb-3">
                  <label>Nombre</label>
                  <input
                    className="form-control"
                    name="name"
                    value={selectedDoctor.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Rol</label>
                  <input
                    className="form-control"
                    name="role"
                    value={selectedDoctor.role}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Especialidad</label>
                  <input
                    className="form-control"
                    name="specialty"
                    value={selectedDoctor.specialty}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    className="form-control"
                    name="email"
                    value={selectedDoctor.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Estado</label>
                  <select
                    className="form-control"
                    name="status"
                    value={selectedDoctor.status}
                    onChange={handleChange}
                  >
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>

                <button className="btn btn-primary" onClick={saveDoctor}>
                  Guardar Cambios
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Eliminar Doctor</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este doctor?</p>
              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-danger"
                  onClick={deleteDoctor}
                >
                  Eliminar
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}