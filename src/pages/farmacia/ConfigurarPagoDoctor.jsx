import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Pagination
} from "react-bootstrap";

import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

import { useState, useEffect } from "react";
import axios from "axios";

import "./Consultorios.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function ConfigurarPagoDoctor() {

  const [doctores, setDoctores] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);

  const [doctorId, setDoctorId] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");

  const [monto, setMonto] = useState("");

  const [nuevoTipo, setNuevoTipo] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [mostrarNuevoMetodo, setMostrarNuevoMetodo] =
  useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);
const [paginaActual, setPaginaActual] = useState(1);

const doctoresPorPagina = 3;

const ultimoDoctor =
  paginaActual * doctoresPorPagina;

const primerDoctor =
  ultimoDoctor - doctoresPorPagina;

const doctoresPaginados =
  doctores.slice(
    primerDoctor,
    ultimoDoctor
  );

const totalPaginas = Math.ceil(
  doctores.length / doctoresPorPagina
);
  const cargarDatos = async () => {

    const doctores = await axios.get(
      `${API_URL}/doctores-completo`
    );

    const tipos = await axios.get(
      `${API_URL}/tipos-pago`
    );

    setDoctores(doctores.data);
    setTiposPago(tipos.data);
  };

  const guardarPago = async () => {

    await axios.post(
      `${API_URL}/pagos-doctores`,
      {
        doctor_id: doctorId,
        tipo_pago_id: tipoSeleccionado,
        monto
      }
    );

    setMensaje(
      "Configuración guardada correctamente"
    );
  };

  const agregarTipo = async () => {

    if (!nuevoTipo) return;

    await axios.post(
      `${API_URL}/tipos-pago`,
      {
        nombre: nuevoTipo
      }
    );

    setNuevoTipo("");

    cargarDatos();
  };

  const eliminarTipo = async (id) => {

    await axios.delete(
      `${API_URL}/tipos-pago/${id}`
    );

    cargarDatos();
  };

  return (
    <div className="home-layout">

      <Sidebar />

      <div className="home-content-modern">

        <Topbar />

        <div className="page-consultorio">

          <div className="consultorio-header">
            <h2>💰 Pago de Doctores</h2>
            <p>
              Configuración de honorarios y renta
            </p>
          </div>

          {mensaje && (
            <Alert variant="success">
              {mensaje}
            </Alert>
          )}

<Card className="card-modern-consultorio p-4 mb-4">

  <h5 className="mb-4">
    Seleccionar Doctor
  </h5>

  <Row className="g-3">

    {doctoresPaginados.map((doctor) => (

      <Col md={12} key={doctor.id}>

        <div
          className={`doctor-card-pago ${
            doctorId == doctor.id
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setDoctorId(doctor.id)
          }
        >

          <div className="doctor-photo">

            <img
              src={
                doctor.usuario?.foto ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(
                    doctor.usuario?.nombre
                  )
              }
              alt=""
            />

          </div>

          <div className="doctor-info">

            <h5>
              {doctor.usuario?.nombre}
            </h5>

            <p>
              Especialidad:
              {" "}
              {doctor.especialidad?.nombre ||
                "General"}
            </p>

            <span>
              ID: {doctor.id}
            </span>

          </div>

          <div className="doctor-check">

            {doctorId == doctor.id
              ? "✓"
              : ""}

          </div>

        </div>

      </Col>

    ))}

  </Row>

  <div className="d-flex justify-content-center mt-4">

    <Pagination>

      <Pagination.Prev
        disabled={paginaActual === 1}
        onClick={() =>
          setPaginaActual(
            paginaActual - 1
          )
        }
      />

      {[...Array(totalPaginas)].map(
        (_, i) => (
          <Pagination.Item
            key={i}
            active={
              paginaActual === i + 1
            }
            onClick={() =>
              setPaginaActual(i + 1)
            }
          >
            {i + 1}
          </Pagination.Item>
        )
      )}

      <Pagination.Next
        disabled={
          paginaActual === totalPaginas
        }
        onClick={() =>
          setPaginaActual(
            paginaActual + 1
          )
        }
      />

    </Pagination>

  </div>

</Card>
          

          <Card className="card-modern-consultorio p-4 mb-4">

            <h5>Métodos de pago</h5>

            <Row className="g-3">

              {tiposPago.map((tipo) => (

                <Col md={3} key={tipo.id}>

                  <div
                    className={`tipo-pago-card ${
                      tipoSeleccionado == tipo.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setTipoSeleccionado(tipo.id)
                    }
                  >

                    <div className="tipo-pago-icon">
                      💰
                    </div>

                    <h6>{tipo.nombre}</h6>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarTipo(tipo.id);
                      }}
                    >
                      Eliminar
                    </Button>

                  </div>

                </Col>

              ))}

            </Row>

          </Card>

  <Card className="card-modern-consultorio p-4 mb-4">

  <div className="d-flex justify-content-between align-items-center">

    <h5 className="mb-0">
      Métodos personalizados
    </h5>

    <Button
      variant="outline-primary"
      onClick={() =>
        setMostrarNuevoMetodo(
          !mostrarNuevoMetodo
        )
      }
    >
      + Nuevo Método
    </Button>

  </div>

  {mostrarNuevoMetodo && (

    <Row className="mt-3">

      <Col md={10}>
        <Form.Control
          placeholder="Nombre del método"
          value={nuevoTipo}
          onChange={(e) =>
            setNuevoTipo(e.target.value)
          }
        />
      </Col>

      <Col md={2}>
        <Button
          className="btn-primary-modern w-100"
          onClick={agregarTipo}
        >
          Guardar
        </Button>
      </Col>

    </Row>

  )}

</Card>

          <Card className="card-modern-consultorio p-4">

            <Form.Label>
              Cantidad de Pago
            </Form.Label>

            <Form.Control
              type="number"
              placeholder="$0.00"
              value={monto}
              onChange={(e) =>
                setMonto(e.target.value)
              }
            />

          </Card>

          <div className="text-end mt-4">

            <Button
              className="btn-primary-modern"
              onClick={guardarPago}
            >
              Guardar Configuración
            </Button>

          </div>

        </div>

      </div>

    </div>
  );
}

