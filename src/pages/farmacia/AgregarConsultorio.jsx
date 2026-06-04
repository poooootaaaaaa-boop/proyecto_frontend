import {
Card,
Form,
Button,
Row,
Col
} from "react-bootstrap";

import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

import { useState, useEffect } from "react";
import axios from "axios";

import "./Consultorios.css";
import Table from "react-bootstrap/Table";

export default function AgregarConsultorio() {

const [consultorio,setConsultorio] = useState({
nombre:"",
numero:"",
piso:"",
descripcion:""
});
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");
const [success,setSuccess] = useState("");
const [consultorios,setConsultorios] = useState([]);

const handleChange=(e)=>{
setConsultorio({
...consultorio,
[e.target.name]:e.target.value
});
};
const guardarConsultorio = async () => {

  try {

    setLoading(true);
    setError("");

    const usuario = JSON.parse(
      localStorage.getItem("usuario")
    );

    await axios.post(
      "http://127.0.0.1:8000/api/consultorios",
      {
        clinica_id: usuario.clinica_id,
        nombre: consultorio.nombre,
        numero: consultorio.numero,
        piso: consultorio.piso,
        descripcion: consultorio.descripcion
      }
    );

    setSuccess("Consultorio registrado correctamente");

    obtenerConsultorios();
    setConsultorio({
      nombre:"",
      numero:"",
      piso:"",
      descripcion:""
    });

  } catch(err) {

    console.error(err);

    setError(
      err.response?.data?.message ||
      "Error al registrar"
    );

  } finally {
    setLoading(false);
  }

};
const obtenerConsultorios = async () => {

  try {

    const response = await axios.get(
      "http://127.0.0.1:8000/api/consultorios"
    );

    setConsultorios(response.data);

  } catch (error) {

    console.error(error);

  }

};

useEffect(() => {
  obtenerConsultorios();
}, []);

return(
<div className="home-layout">

<Sidebar />

<div className="home-content-modern">

<Topbar />

<div className="page-consultorio">

<div className="consultorio-header">
<h2>🏥 Registro de Consultorio</h2>
<p>Configura los espacios médicos de tu clínica</p>
</div>

<Row>

<Col md={8}>

<Card className="card-modern-consultorio p-4">

<Row className="g-3">

<Col md={6}>
<Form.Label>Nombre</Form.Label>
<Form.Control
name="nombre"
onChange={handleChange}
className="form-control-modern"
/>
</Col>

<Col md={3}>
<Form.Label>Número</Form.Label>
<Form.Control
name="numero"
onChange={handleChange}
className="form-control-modern"
/>
</Col>

<Col md={3}>
<Form.Label>Piso</Form.Label>
<Form.Control
name="piso"
onChange={handleChange}
className="form-control-modern"
/>
</Col>

<Col md={12}>
<Form.Label>Descripción</Form.Label>
<Form.Control
as="textarea"
rows={4}
name="descripcion"
onChange={handleChange}
/>
</Col>

</Row>

</Card>

</Col>

<Col md={4}>

<div className="consultorio-preview">

<h5>Vista previa</h5>

<div className="consultorio-box">
{consultorio.numero || "101"}
</div>

<h6>{consultorio.nombre || "Consultorio"}</h6>

<p>{consultorio.descripcion || "Descripción..."}</p>

</div>

</Col>

</Row>

<div className="mt-4 text-end">
<Button
  className="btn-primary-modern"
  onClick={guardarConsultorio}
  disabled={loading}
>
  {loading
    ? "Guardando..."
    : "Guardar Consultorio"}
</Button>
</div>
{error && (
  <div className="alert alert-danger">
    {error}
  </div>
)}

{success && (
  <div className="alert alert-success">
    {success}
  </div>
)}

<Card className="card-modern-consultorio p-4 mt-4">

  <div className="d-flex justify-content-between align-items-center mb-3">

    <h4 className="mb-0">
      Consultorios Registrados
    </h4>

    <span className="badge bg-primary">
      {consultorios.length}
    </span>

  </div>

  <div className="table-responsive">

    <Table
      hover
      bordered={false}
      className="table-modern align-middle"
    >

      <thead>

        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Número</th>
          <th>Piso</th>
          <th>Descripción</th>
        </tr>

      </thead>

      <tbody>

        {consultorios.length > 0 ? (

          consultorios.map((consultorio,index) => (

            <tr key={consultorio.id}>

              <td>{index + 1}</td>

              <td>
                <strong>
                  {consultorio.nombre}
                </strong>
              </td>

              <td>
                {consultorio.numero}
              </td>

              <td>
                {consultorio.piso}
              </td>

              <td>
                {consultorio.descripcion}
              </td>

            </tr>

          ))

        ) : (

          <tr>

            <td
              colSpan="5"
              className="text-center py-4"
            >
              No hay consultorios registrados
            </td>

          </tr>

        )}

      </tbody>

    </Table>

  </div>

</Card>

</div>

</div>

</div>
);
}