import { useState,useEffect} from "react";
import Layout_Medicos from "./Layout_Medicos";
import {  CardContent, Typography,Chip} from "@mui/material";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Mensaje from "./mensaje";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { Link } from "react-router-dom";
import './Consulta.css';
import Axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Consulta({data,setData /*dataPacientes*/}){
    const [pacienteId, setPacienteId] = useState("");
    const [dataPacientes, setDataPacientes] = useState([]);
    const[motivo, setMotivo]=useState("");
    const[sintomas, setSintomas]=useState("");
    const[examen, setExamen]=useState("");
    const [mostrarMensaje,setMostrarMensaje]=useState(false);
    const [notas, setNotas] = useState("");
    const [tratamientoLargo, setTratamientoLargo] = useState("");
    const [fechaTratamiento, setFechaTratamiento] = useState(null);
const [diagnostico, setDiagnostico] = useState("");
    const [medicamentos, setMedicamentos] = useState([]);
const [listaMedicamentos, setListaMedicamentos] = useState([]);
const [citaSeleccionada, setCitaSeleccionada] = useState("");
const [citas, setCitas] = useState([]);
const [tipoConsulta, setTipoConsulta] = useState("");
const [requiereSeguimiento, setRequiereSeguimiento] = useState(false);
const [fechaSeguimiento, setFechaSeguimiento] = useState(null);
const [medicamentoActivo, setMedicamentoActivo] = useState(null);
const usuario = JSON.parse(localStorage.getItem("usuario"));
useEffect(() => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || !usuario.doctor_id) return;

  const doctor_id = usuario.doctor_id;

  Axios.get(`${API_URL}/citas-doctor/${doctor_id}`)
    .then(res => {

      const hoy = new Date().toLocaleDateString("sv-SE"); 

      const pendientesHoy = res.data.filter(c => {
        const fechaCita = c.fecha_fin.split(" ")[0];
        return c.estado === "pendiente" && fechaCita === hoy;
      });

      setCitas(pendientesHoy);
    })
    .catch(err => console.error(err));

}, []);
useEffect(() => {
  Axios.get(`${API_URL}/medicamentos`)
    .then(res => setListaMedicamentos(res.data));
}, []);

    useEffect(() => {
  Axios.get(`${API_URL}/MostrarPaciente`)
    .then((response) => {
      setDataPacientes(response.data.paciente);
    })
    .catch((error) => {
      console.error("Error cargando pacientes:", error);
    });
}, []);

    const agregarMedicamento = () => {
  setMedicamentos([
    ...medicamentos,
    {
      medicamento_id: "",
      dosis: "",
      frecuencia: "",
      duracion: "",
      instrucciones: ""
    }
  ]);
  setMedicamentoActivo(medicamentos.length); // abre el nuevo automáticamente
};


const actualizarMedicamento = (index, campo, valor) => {
  const nuevos = [...medicamentos];
  nuevos[index][campo] = valor;
  setMedicamentos(nuevos);
};


const finalizarConsulta = async () => {
  try {

    // 1. GUARDAR CONSULTA
    await Axios.post(`${API_URL}/finalizar-consulta`, {
      cita_id: citaSeleccionada,
      doctor_id: usuario.doctor_id,
      paciente_id: pacienteId,
      motivo,
      sintomas,
      diagnostico,
      notas,
      examen,
      medicamentos
    });

    // 2. MARCAR COMO COMPLETADA (ESTO SIEMPRE)
    await Axios.put(`${API_URL}/citas/${citaSeleccionada}/estado`, {
      estado: "completada"
    });

    // 3. SI HAY SEGUIMIENTO → CREAR NUEVA CITA
    if (requiereSeguimiento && fechaSeguimiento) {

          const ocupado = citas.some(c =>
    new Date(c.fecha_fin).getTime() === fechaSeguimiento.toDate().getTime()
  );

  if (ocupado) {
    alert("Ese horario ya está ocupado");
    return;
  }
      await Axios.post(`${API_URL}/citas`, {
        doctor_id: usuario.doctor_id,
        paciente_id: pacienteId,
        fecha_inicio: fechaSeguimiento.format("YYYY-MM-DD HH:mm:ss"),
        fecha_fin: fechaSeguimiento.add(30, "minute").format("YYYY-MM-DD HH:mm:ss"),
        estado: "pendiente",
        motivo: "SEGUIMIENTO - " + motivo
      });
    }

    // 4. MENSAJE FINAL
    setMostrarMensaje(true);

  } catch (err) {
    console.error(err);
  }
};

  console.log(fechaTratamiento)


    return (
<div>
<Layout_Medicos>

{mostrarMensaje ? (

    <Mensaje
        titulo="¡Consulta Registrada!"
        descripcion="Consulta y receta creadas correctamente."
        botonPrincipal="Volver"
        onPrincipal="/Medicos/recetas_medicas"
    />

) : (

<div className="container-fluid mt-3 consulta-container">

<Row>

    {/* 🟣 IZQUIERDA - PACIENTE */}
    <Col md={3}>
        <div className="bg-white p-4" style={{borderRadius:"20px",border:"1px solid #ddd"}}>
            
            <h5 className="fw-bold mb-3">Paciente</h5>

      <Form.Label>Seleccionar cita</Form.Label>
<Form.Select
  value={citaSeleccionada}
  onChange={(e) => {
    const cita = citas.find(c => c.id == e.target.value);
    setCitaSeleccionada(cita.id);

    //  AUTO SET PACIENTE
    setPacienteId(cita.paciente_id);
  }}
>
  <option value="">Seleccionar</option>

{citas.map(c => {
  const paciente = dataPacientes.find(p => p.id === c.paciente_id);

  return (
<option key={c.id} value={c.id}>
  {paciente ? paciente.nombre : "Sin nombre"} - {new Date(c.fecha_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</option>
  );
})}
</Form.Select>

        </div>
    </Col>


    {/* 🔵 CENTRO - CONSULTA */}
    <Col md={5}>
        <div className="bg-white p-4" style={{borderRadius:"20px",border:"1px solid #ddd"}}>

            <h5 className="fw-bold mb-3">Consulta</h5>

            <Form.Label>Motivo</Form.Label>
            <Form.Control
                value={motivo}
                onChange={(e)=>setMotivo(e.target.value)}
            />

            <Form.Label className="mt-3">Síntomas</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={sintomas}
                onChange={(e)=>setSintomas(e.target.value)}
            />

            <Form.Label className="mt-3">Diagnóstico</Form.Label>
            <Form.Control
                as="textarea"
                rows={2}
                value={diagnostico}
                onChange={(e)=>setDiagnostico(e.target.value)}
            />

            <Form.Label className="mt-3">Notas</Form.Label>
            <Form.Control
                as="textarea"
                rows={4}
                value={notas}
                onChange={(e)=>setNotas(e.target.value)}
            />

            <Form.Label className="mt-3">Examen</Form.Label>
            <Form.Control
                type="text"
                value={examen}
                onChange={(e)=>setExamen(e.target.value)}
            />

            <Form.Check 
  type="checkbox"
  label="¿Requiere seguimiento?"
  checked={requiereSeguimiento}
  onChange={(e) => setRequiereSeguimiento(e.target.checked)}
/>
{requiereSeguimiento && (
  <div className="mt-3">
    <Form.Label>Fecha de seguimiento</Form.Label>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateTimePicker
        value={fechaSeguimiento}
        onChange={(newValue) => setFechaSeguimiento(newValue)}
        className="calendar-clean"
        slotProps={{ actionBar: { actions: [] } }}
      />
    </LocalizationProvider>
  </div>
)}
        </div>
    </Col>


    {/* 🟢 DERECHA - RECETA */}
    <Col md={4}>
        <div className="bg-white p-4" style={{borderRadius:"20px",border:"1px solid #ddd"}}>

            <h5 className="fw-bold mb-3">Receta</h5>

{medicamentos.map((med, index) => (
  <div key={index} className="mb-2">

    {/* HEADER CLICKABLE */}
    <div 
      onClick={() => setMedicamentoActivo(medicamentoActivo === index ? null : index)}
      style={{
        cursor: "pointer",
        background: "#f5f5f5",
        padding: "10px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #ddd"
      }}
    >
      <span><b>Medicamento {index + 1}</b></span>
      <span>{medicamentoActivo === index ? "▲" : "▼"}</span>
    </div>

    {/* CONTENIDO DESPLEGABLE */}
    {medicamentoActivo === index && (
      <div className="mt-2 p-2 border rounded">

        <Form.Select
          className="mb-2"
            value={med.medicamento_id}
          onChange={(e)=>actualizarMedicamento(index,"medicamento_id",e.target.value)}
        >
          <option>Medicamento</option>
          {listaMedicamentos.map((m)=>(
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </Form.Select>

        <Form.Control
          placeholder="Dosis"
          className="mb-2"
           value={med.dosis}
          onChange={(e)=>actualizarMedicamento(index,"dosis",e.target.value)}
        />

        <Form.Control
          placeholder="Frecuencia"
          className="mb-2"
            value={med.frecuencia}
          onChange={(e)=>actualizarMedicamento(index,"frecuencia",e.target.value)}
        />

        <Form.Control
          placeholder="Duración"
          className="mb-2"
            value={med.duracion}
          onChange={(e)=>actualizarMedicamento(index,"duracion",e.target.value)}
        />

        <Form.Control
          placeholder="Instrucciones"
          className="mb-2"
            value={med.instrucciones}
          onChange={(e)=>actualizarMedicamento(index,"instrucciones",e.target.value)}
        />

      </div>
    )}

  </div>
))}

            <Button onClick={agregarMedicamento} variant="outline-primary">
                + Agregar medicamento
            </Button>

        </div>
    </Col>

</Row>


{/* 🔥 BOTONES */}
<Row className="mt-4">
    <Col className="text-end">

        <Button 
            variant="danger" 
            className="me-2"
            as={Link} 
            to="/Medicos/recetas_medicas"
        >
            Cancelar
        </Button>

        <Button 
            onClick={finalizarConsulta}
        >
            Finalizar Consulta
        </Button>

    </Col>
</Row>

</div>

)}

</Layout_Medicos>
</div>
);
}
export default Consulta