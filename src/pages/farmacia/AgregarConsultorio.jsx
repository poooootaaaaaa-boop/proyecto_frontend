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

const API_URL = import.meta.env.VITE_API_URL;

export default function AgregarConsultorio() {

const [consultorio,setConsultorio] = useState({
nombre:"",
numero:"",
piso:"",
descripcion:""
});

const [habitaciones,setHabitaciones] = useState([]);

const [habitacion,setHabitacion] = useState({
  numero:"",
  piso:"",
  tipo:"Individual",
  estado:"Disponible",
  descripcion:""
});

const [instrumentos,setInstrumentos] = useState([]);

const [instrumento,setInstrumento] = useState({
  nombre:"",
  categoria:"",
  cantidad:1,
  estado:"Disponible",
  descripcion:""
});

const [asignacion,setAsignacion] = useState({
  consultorio_id:"",
  instrumento_id:"",
  cantidad:1
});

const [loading,setLoading] = useState(false);
const [error,setError] = useState("");
const [success,setSuccess] = useState("");
const [inventario, setInventario] = useState([]);
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
      `${API_URL}/consultorios`,
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

const guardarHabitacion = async () => {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  await axios.post(
    `${API_URL}/habitaciones`,
    {
      ...habitacion,
      clinica_id: usuario.clinica_id
    }
  );

  obtenerHabitaciones();
};


const obtenerInstrumentos = async () => {

  const response = await axios.get(
    `${API_URL}/instrumentos`
  );

  setInstrumentos(response.data);
};
const obtenerHabitaciones = async () => {

  const response = await axios.get(
    `${API_URL}/habitaciones`
  );

  setHabitaciones(response.data);
};


const guardarInstrumento = async () => {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  await axios.post(
    `${API_URL}/instrumentos`,
    {
      ...instrumento,
      clinica_id: usuario.clinica_id
    }
  );

  obtenerInstrumentos();
};

const obtenerInventario = async () => {

  try {

    const response = await axios.get(
      `${API_URL}/consultorio-instrumentos/inventario`
    );

    setInventario(response.data);

  } catch (error) {

    console.error(error);

  }

};

const obtenerConsultorios = async () => {

  try {

    const response = await axios.get(
      `${API_URL}/consultorios`
    );

    setConsultorios(response.data);

  } catch (error) {

    console.error(error);

  }

};


const asignarInstrumento = async () => {

  await axios.post(
    `${API_URL}/consultorio-instrumentos`,
    asignacion
  );

  alert("Instrumento asignado");
};

useEffect(() => {

  obtenerConsultorios();

  obtenerHabitaciones();

  obtenerInstrumentos();

  obtenerInventario();


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


<Row className="mb-4">

  <Col md={4}>
    <Card className="text-center p-3">
      <h2>{consultorios.length}</h2>
      <small>Consultorios</small>
    </Card>
  </Col>

  <Col md={4}>
    <Card className="text-center p-3">
      <h2>{habitaciones.length}</h2>
      <small>Habitaciones</small>
    </Card>
  </Col>

  <Col md={4}>
    <Card className="text-center p-3">
      <h2>{instrumentos.length}</h2>
      <small>Instrumentos</small>
    </Card>
  </Col>

</Row>

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



<Card className="card-modern-consultorio p-4 mt-5">

<h4>🛏 Registro de Habitaciones</h4>

<Row>

  <Col md={3}>
    <Form.Control
      placeholder="Número"
      onChange={(e)=>
        setHabitacion({
          ...habitacion,
          numero:e.target.value
        })
      }
    />
  </Col>

  <Col md={2}>
    <Form.Control
      placeholder="Piso"
      onChange={(e)=>
        setHabitacion({
          ...habitacion,
          piso:e.target.value
        })
      }
    />
  </Col>

  <Col md={3}>
    <Form.Select
      value={habitacion.tipo}
      onChange={(e)=>
        setHabitacion({
          ...habitacion,
          tipo:e.target.value
        })
      }
    >
      <option value="Individual">Individual</option>
      <option value="Compartida">Compartida</option>
      <option value="Urgencias">Urgencias</option>
      <option value="Quirófano">Quirófano</option>
      <option value="UCI">UCI</option>
    </Form.Select>
  </Col>

  <Col md={2}>
    <Form.Select
      value={habitacion.estado}
      onChange={(e)=>
        setHabitacion({
          ...habitacion,
          estado:e.target.value
        })
      }
    >
      <option value="Disponible">Disponible</option>
      <option value="Ocupada">Ocupada</option>
      <option value="Mantenimiento">Mantenimiento</option>
      <option value="Limpieza">Limpieza</option>
    </Form.Select>
  </Col>

  <Col md={2}>
    <Button onClick={guardarHabitacion}>
      Guardar
    </Button>
  </Col>

  <Col md={12} className="mt-3">
    <Form.Control
      as="textarea"
      rows={2}
      placeholder="Descripción"
      onChange={(e)=>
        setHabitacion({
          ...habitacion,
          descripcion:e.target.value
        })
      }
    />
  </Col>

</Row>

</Card>







<Card className="mt-4 p-4">

<h5>Habitaciones</h5>

<Table>

<thead>

<tr>
<th>Nombre</th>
<th>Número</th>
<th>Tipo</th>
<th>Estado</th>
</tr>

</thead>

<tbody>
  {habitaciones.map(h => (
    <tr key={h.id}>
      <td>{h.numero}</td>
      <td>{h.piso}</td>
      <td>{h.tipo}</td>
      <td>{h.estado}</td>
    </tr>
  ))}
</tbody>

</Table>

</Card>

<Card className="card-modern-consultorio p-4 mt-5">

<h4>🩺 Instrumentos Médicos</h4>

<Row>

<Col md={4}>
<Form.Control
placeholder="Nombre"
onChange={(e)=>
setInstrumento({
...instrumento,
nombre:e.target.value
})
}
/>
</Col>

<Col md={3}>
<Form.Control
placeholder="Categoría"
onChange={(e)=>
setInstrumento({
...instrumento,
categoria:e.target.value
})
}
/>
</Col>

<Col md={2}>
<Form.Control
type="number"
placeholder="Cantidad"
onChange={(e)=>
setInstrumento({
...instrumento,
cantidad:e.target.value
})
}
/>
</Col>

<Col md={3}>

<Button
onClick={guardarInstrumento}
>

Guardar

</Button>

</Col>

</Row>

</Card>



<Card className="mt-4 p-4">

<h5>Instrumentos Registrados</h5>

<Table>

<thead>

<tr>
<th>Nombre</th>
<th>Categoría</th>
<th>Cantidad</th>
<th>Estado</th>
</tr>

</thead>

<tbody>

{instrumentos.map(i=>(

<tr key={i.id}>

<td>{i.nombre}</td>

<td>{i.categoria}</td>

<td>{i.cantidad}</td>

<td>{i.estado}</td>

</tr>

))}

</tbody>

</Table>

</Card>


<Card className="mt-5 p-4">

<h4>🔗 Asignar Instrumentos</h4>

<Row>

<Col md={4}>

<Form.Select
onChange={(e)=>
setAsignacion({
...asignacion,
consultorio_id:e.target.value
})
}
>

<option>
Seleccione Consultorio
</option>

{
consultorios.map(c=>(
<option
key={c.id}
value={c.id}
>
{c.nombre}
</option>
))
}

</Form.Select>

</Col>

<Col md={4}>

<Form.Select
onChange={(e)=>
setAsignacion({
...asignacion,
instrumento_id:e.target.value
})
}
>

<option>
Seleccione Instrumento
</option>

{
instrumentos.map(i=>(
<option
key={i.id}
value={i.id}
>
{i.nombre}
</option>
))
}

</Form.Select>

</Col>

<Col md={2}>

<Form.Control
type="number"
placeholder="Cantidad"
onChange={(e)=>
setAsignacion({
...asignacion,
cantidad:e.target.value
})
}
/>

</Col>

<Col md={2}>

<Button
onClick={asignarInstrumento}
>

Asignar

</Button>

</Col>

</Row>

</Card>



<Card className="mt-5 p-4">

<h4>🏥 Instrumentos por Consultorio</h4>

<Table hover>

<thead>

<tr>
  <th>Consultorio</th>
  <th>Número</th>
  <th>Instrumento</th>
  <th>Categoría</th>
  <th>Cantidad</th>
</tr>

</thead>

<tbody>

{
inventario.map(item => (

<tr key={item.id}>

<td>{item.consultorio.nombre}</td>

<td>{item.consultorio.numero}</td>

<td>{item.instrumento.nombre}</td>

<td>{item.instrumento.categoria}</td>

<td>{item.cantidad}</td>

</tr>

))
}

</tbody>

</Table>

</Card>


</div>

</div>

</div>
);
}