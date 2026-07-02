import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import {
  Card,
  Button,
  Row,
  Col,
  Modal,
  Form
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Distribuidores() {

  const [distribuidores, setDistribuidores] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [distribuidorEdit, setDistribuidorEdit] = useState(null);
  const [distribuidorDelete, setDistribuidorDelete] = useState(null);

  /*const [nombre, setNombre] = useState("");*/

  const [formData, setFormData] = useState({
  nombre: "",
  rfc: "",
  categoria: "",
  contacto: "",
  correo: "",
  telefono: "",
  direccion: "",
  ciudad: ""
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ===== CARGAR DATOS =====
  /* 
  useEffect(() => {

    const data = JSON.parse(localStorage.getItem("distribuidores"));

    if (data && data.length > 0) {

      setDistribuidores(data);

    } else {

      const ejemplo = [
        { id: 1, nombre: "PharmaFirst" },
        { id: 2, nombre: "MediGlobal" },
        { id: 3, nombre: "SaludPlus" },
        { id: 4, nombre: "Farmatech" },
        { id: 5, nombre: "BioHealth Supply" },
        { id: 6, nombre: "Distribuidora Médica MX" },
        { id: 7, nombre: "Mediservicios" },
        { id: 8, nombre: "PharmaLogistics" }
      ];

      setDistribuidores(ejemplo);
      localStorage.setItem("distribuidores", JSON.stringify(ejemplo));
    }

  }, []); */ 


  useEffect(() => {

  Axios.get(`${API_URL}/api/MostrarDistribuidor`)
    .then((response) => {

     setDistribuidores(response.data.distribuidor || []);

    })
    .catch((error) => {

      console.error("Error al obtener distribuidores:", error);

    });

}, []);

  // ===== ABRIR EDITAR =====
  /*
  const abrirEditar = (item) => {
    setDistribuidorEdit(item);
    setNombre(item.nombre);
    setShowModal(true);
  };*/
  const abrirEditar = (item) => {
  setDistribuidorEdit(item);
  setFormData(item); 
  setShowModal(true);
};

  // ===== GUARDAR =====
  /* 
  const guardarEdicion = () => {

    const actualizados = distribuidores.map((d) =>
      d.id === distribuidorEdit.id ? { ...d, nombre } : d
    );

    setDistribuidores(actualizados);
    localStorage.setItem("distribuidores", JSON.stringify(actualizados));

    setShowModal(false);
  };
  */
const guardarEdicion = () => {

  Axios.put(
    `${API_URL}/api/UpdateDistribuidor/${distribuidorEdit.id}`,
     formData
  )
  .then((response) => {

    const actualizado = response.data.distribuidor;

    const actualizados = distribuidores.map((d) =>
      d.id === actualizado.id ? actualizado : d
    );

    setDistribuidores(actualizados);
    setShowModal(false);

  })
  .catch((error) => {
    console.error("Error al actualizar:", error);
  });
};

  // ===== ABRIR ELIMINAR =====
  const abrirEliminar = (item) => {
    setDistribuidorDelete(item);
    setShowDelete(true);
  };

  // ===== CONFIRMAR ELIMINAR =====
  /* 
  const eliminarDistribuidor = () => {

    const filtrados = distribuidores.filter(
      (d) => d.id !== distribuidorDelete.id
    );

    setDistribuidores(filtrados);
    localStorage.setItem("distribuidores", JSON.stringify(filtrados));

    setShowDelete(false);
  };
  */

  const eliminarDistribuidor = () => {

  Axios.delete(
       `${API_URL}/api/DeleteDistribuidor/${distribuidorDelete.id}`
  )
  .then(() => {

    // quitar del estado (UI inmediata)
    const filtrados = distribuidores.filter(
      (d) => d.id !== distribuidorDelete.id
    );

    setDistribuidores(filtrados);
    setShowDelete(false);

  })
  .catch((error) => {
    console.error("Error al eliminar:", error);
    alert("No se pudo eliminar");
  });

};

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ flex: 1, background: "#f7f7f7", minHeight: "100vh" }}>

        <Topbar />

        <div style={{ padding: "30px" }}>

          {/* HEADER */}
          <div className="d-flex align-items-center gap-3 mb-4">

            <h4 className="mb-0">Gestión de distribuidores</h4>

            <Button
              as={NavLink}
              to="/farmacia/AgregarDistribuidor"
              size="sm"
              variant="primary"
            >
              + Add
            </Button>

          </div>

          <Row className="g-4">

            {/* LISTA PRINCIPAL */}
            <Col md={8}>

              <Card className="p-4 rounded-4 border-0">

                <div className="d-flex justify-content-between mb-3">
                  <h6>Lista de distribuidores</h6>
                </div>

                {distribuidores.map((item) => (

                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center py-3 border-bottom"
                  >

                    <div className="d-flex align-items-center gap-3">

                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#eaeaea",
                        }}
                      />

                      <strong>{item.nombre}</strong>

                    </div>

                    <div className="d-flex gap-2">

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => abrirEditar(item)}
                      >
                        <PencilSquare />
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => abrirEliminar(item)}
                      >
                        <Trash />
                      </Button>

                    </div>

                  </div>

                ))}

              </Card>

            </Col>

            {/* PANEL DERECHO */}
            <Col md={4}>

              <Card className="p-4 rounded-4 border-0">

                <h6 className="mb-3">Distribuidores activos</h6>

                {distribuidores.map((item) => (

                  <div
                    key={item.id}
                    className="d-flex align-items-center gap-3 p-3 mb-3 rounded-3"
                    style={{ background: "#f5f5f5" }}
                  >

                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#e0e0e0",
                      }}
                    />

                    <strong>{item.nombre}</strong>

                  </div>

                ))}

              </Card>

            </Col>

          </Row>

        </div>

      </div>

      {/* MODAL EDITAR */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>

        <Modal.Header closeButton>
          <Modal.Title>Editar distribuidor</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group>
                <Form>
                      <Form.Group className="mb-2">
                         <Form.Label>Nombre del distribuidor</Form.Label>
                        <Form.Control
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>RFC</Form.Label>
                        <Form.Control
                          name="rfc"
                          value={formData.rfc}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Contacto</Form.Label>
                        <Form.Control
                          name="contacto"
                          value={formData.contacto}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                        />
                      </Form.Group>

                </Form>

            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={guardarEdicion}
          >
            Guardar
          </Button>

        </Modal.Footer>

      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>

        <Modal.Header closeButton>
          <Modal.Title>Eliminar distribuidor</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          ¿Estás seguro que deseas eliminar a
          <strong> {distribuidorDelete?.nombre}</strong>?

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowDelete(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={eliminarDistribuidor}
          >
            Eliminar
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
}