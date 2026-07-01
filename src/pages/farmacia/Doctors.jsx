import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import { useState, useEffect } from "react";
import { Button, Spinner, Modal, Form, Pagination } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PencilSquare, Trash, PlusCircle } from "react-bootstrap-icons";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Doctors() {

  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  //  GET
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctores`);
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  //  FILTRO
  const filteredDoctors = doctors.filter((doc) =>
    doc.cedula_profesional?.toLowerCase().includes(search.toLowerCase())
  );

  //  PAGINACIÓN
  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //  EDITAR
  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedDoctor({
      ...selectedDoctor,
      [e.target.name]: e.target.value,
    });
  };

  const updateDoctor = async () => {
    try {
      await axios.put(
        `${API_URL}/doctores/${selectedDoctor.id}`,
        selectedDoctor
      );
      fetchDoctors();
      setShowEditModal(false);
    } catch (err) {
      console.log("Error al actualizar:", err);
    }
  };

  // 🗑 DELETE
  const openDeleteModal = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const deleteDoctor = async () => {
    try {
      await axios.delete(
        `${API_URL}/doctores/${doctorToDelete.id}`
      );
      fetchDoctors();
      setShowDeleteModal(false);
    } catch (err) {
      console.log("Error al eliminar:", err);
    }
  };

  return (
    <div className="home-layout">

      <Sidebar />
      <div className="home-content-modern">
        <Topbar />

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Gestión de Doctores</h2>

          <Button
            as={NavLink}
            to="/farmacia/agregardoctor"
            size="sm"
            variant="primary"
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <PlusCircle /> Agregar
          </Button>
        </div>

        {/* BUSCADOR */}
        <input
          className="modern-search"
          placeholder="Buscar por cédula..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* TABLA */}
        <div className="table-modern">

          <div className="table-header-modern">
            <span>Especialidad</span>
            <span>Cédula</span>
            <span>Experiencia</span>
            <span>Teléfono</span>
            <span>Acciones</span>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            currentDoctors.map((doctor) => (
              <div key={doctor.id} className="table-row-modern">

                <div>{doctor.especialidad_id}</div>
                <div>{doctor.cedula_profesional}</div>
                <div>{doctor.anios_exp} años</div>
                <div>{doctor.telefono}</div>

                <div style={{ display: "flex", gap: "10px" }}>

                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => openEditModal(doctor)}
                  >
                    <PencilSquare />
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => openDeleteModal(doctor)}
                  >
                    <Trash />
                  </Button>

                </div>

              </div>
            ))
          )}

        </div>

        {/* PAGINACIÓN */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <Pagination>
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>

      </div>

      {/* MODAL EDITAR */}
      <Modal
  show={showEditModal}
  onHide={() => setShowEditModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title style={{ fontWeight: "600" }}>
       Editar Doctor
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {selectedDoctor && (
      <Form>

        {/* ESPECIALIDAD */}
        <Form.Group className="mb-3">
          <Form.Label>Especialidad</Form.Label>
          <Form.Control
            type="number"
            name="especialidad_id"
            value={selectedDoctor.especialidad_id}
            onChange={handleEditChange}
            placeholder="Ej: 1"
          />
        </Form.Group>

        {/* CÉDULA */}
        <Form.Group className="mb-3">
          <Form.Label>Cédula Profesional</Form.Label>
          <Form.Control
            type="text"
            name="cedula_profesional"
            value={selectedDoctor.cedula_profesional}
            onChange={handleEditChange}
            placeholder="Ej: 12345678"
          />
        </Form.Group>

        {/* EXPERIENCIA */}
        <Form.Group className="mb-3">
          <Form.Label>Años de experiencia</Form.Label>
          <Form.Control
            type="number"
            name="anios_exp"
            value={selectedDoctor.anios_exp}
            onChange={handleEditChange}
            placeholder="Ej: 5"
          />
        </Form.Group>

        {/* TELÉFONO */}
        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            value={selectedDoctor.telefono}
            onChange={handleEditChange}
            placeholder="Ej: 9991234567"
          />
        </Form.Group>

      </Form>
    )}
  </Modal.Body>

  <Modal.Footer style={{ display: "flex", justifyContent: "space-between" }}>
    
    <Button
      variant="outline-secondary"
      onClick={() => setShowEditModal(false)}
    >
      Cancelar
    </Button>

    <Button
      variant="primary"
      onClick={updateDoctor}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px"
      }}
    >
       Guardar cambios
    </Button>

  </Modal.Footer>
</Modal>

      {/* MODAL DELETE */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Doctor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Seguro que quieres eliminar este doctor?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteDoctor}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}