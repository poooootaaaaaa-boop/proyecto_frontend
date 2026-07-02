import Layout_Medicos from "./Layout_Medicos";
import { Typography} from "@mui/material";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Button from 'react-bootstrap/Button';
import { useState ,useEffect } from "react";
import { Link } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import Mensaje from "./mensaje";
import dayjs from "dayjs";
import axios from "axios";
import "./calendar.css";

const API_URL = import.meta.env.VITE_API_URL;

function citas({ data, setData }){

    
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    const doctor_id = usuario?.doctor_id;
    const [tipoCita, setTipoCita] = useState("");
            const colorTipo = {
            rutina:  {background: "#d0e4ff", color: "#0066ff"} ,
            urgente:  { background: "#ffd6d6", color: "#ff1a1a" },
            seguimiento: { background: "#d8fff4", color: "#00775a" }
        };

        const[nombre, setNombre]=useState("");
        const[apellidoP, setApellidoP]=useState("");
        const[apellidoM, setApellidoM]=useState("");
        const[fechaCita, setFechaCita]=useState(null);
        const[motivoCita, setMotivoCita]=useState("");
        const [citasDoctor, setCitasDoctor] = useState([]);
        const [mostrarMensaje,setMostrarMensaje]=useState(false);
        const [pacientes, setPacientes] = useState([]);
const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
useEffect(() => {
    if (!doctor_id) return;

    axios
        .get(`${API_URL}/pacientes-doctor/${doctor_id}`)
        .then(res => setPacientes(res.data))
        .catch(err => console.error(err));
}, [doctor_id]);

useEffect(() => {
  if (!doctor_id) return;

  axios
    .get(`${API_URL}/citas-doctor/${doctor_id}`)
    .then(res => setCitasDoctor(res.data))
    .catch(err => console.error(err));
}, [doctor_id]);

        

const esHoraOcupada = (fecha) => {
  return citasDoctor.some(c =>
    dayjs(c.fecha_fin).format("YYYY-MM-DD HH:mm") ===
    dayjs(fecha).format("YYYY-MM-DD HH:mm")
  );
};

const FinalizarCita = async () => {

    if (!doctor_id) {
        alert("No hay doctor logueado");
        return;
    }

    const nuevaCita = {
        doctor_id,
        paciente_id: pacienteSeleccionado,
        fecha_inicio: fechaCita.format("YYYY-MM-DD HH:mm:ss"),
        fecha_fin: fechaCita.add(30, "minute").format("YYYY-MM-DD HH:mm:ss"),
        motivo: `${tipoCita.toUpperCase()} - ${motivoCita}`
    };

    try {
        const res = await axios.post(`${API_URL}/citas`, nuevaCita, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const data = await res.data;
        console.log(data);

        setMostrarMensaje(true);

    } catch (error) {
        console.error("Error al crear cita:", error);
    }
};

    return(
        <div>
             <Layout_Medicos>
                {mostrarMensaje ? (
                    <Mensaje
                            titulo="¡Cita Registrada!"
                            descripcion="La cita fue agregada correctamente."
                            botonPrincipal="Volver"
                            onPrincipal="/Medicos/agendar-cita"
                        />) : ( 
                <div className="container mt-4">
                     <h1 style={{fontWeight:"600"}}>Crear Nueva Cita</h1>
                    <Typography style={{fontSize: "17px",color: "gray"}}>Complete los datos para agendar una cita médica</Typography>
                    <br />

<div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd"}}>

    <h5 style={{fontWeight:"600"}}>
        <PersonIcon style={{color:"blue"}}/> Paciente
    </h5>

    <Row className="mt-3">
        <Col md={12}>
            <Form.Label>Seleccionar paciente</Form.Label>
            <Form.Select
                value={pacienteSeleccionado}
                onChange={(e) => setPacienteSeleccionado(e.target.value)}
            >
                <option value="">Selecciona un paciente</option>

              {pacientes?.map(p => (
    <option key={p.id} value={p.id}>
        {p.usuario?.nombre}
    </option>
))}
            </Form.Select>
        </Col>
    </Row>

</div>

                        <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
                        
                             <h5 style={{fontWeight:"600"}}><CalendarMonthIcon style={{fontSize:"25px",marginRight:"5px",color:"blue"}}/>Detalle de la cita</h5>
                             <br />
                        
                        
                            <Row className="mt-3">
                                                        
                                <Col md={12} className="d-flex justify-content-center">

                                    <div>
                                        <Form.Label>Fecha y hora de la cita</Form.Label>

                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                               <StaticDateTimePicker 
  orientation="landscape" 
  value={fechaCita} 
  onChange={(newValue) => {

    if (!newValue) return;

    if (esHoraOcupada(newValue)) {
      alert("Esta cita ya está ocupada en ese horario. Por favor, elige otro.");
      return; //  no deja seleccionar
    }

    setFechaCita(newValue); //  solo si está libre
  }} 
  className="calendar-clean"  
  slotProps={{actionBar: {actions: []}}}
/>
                                            </LocalizationProvider>

                                    </div>

                                </Col>

                        
                            </Row>
                        </div>

                        <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
                        
                             <h5 style={{fontWeight:"600"}}><FormatListBulletedIcon style={{fontSize:"25px",marginRight:"5px",color:"blue"}}/>Tipo de cita</h5>
                            <Row className="mt-3">
                                 <Col md={6}>
                                    <Form.Label>Tipo de cita</Form.Label>
                                      <Form.Select style={{ backgroundColor: tipoCita ? colorTipo[tipoCita].background : "white",color: tipoCita ? colorTipo[tipoCita].color : "black"}} value={tipoCita} onChange={(e) => setTipoCita(e.target.value)}>
                                            <option value="">Selecciona tipo</option>

                                            <option value="rutina">
                                            Rutina
                                            </option>

                                            <option value="urgente">
                                            Urgente
                                            </option>

                                            <option value="seguimiento">
                                            Seguimiento
                                            </option>

                                        </Form.Select>
                                 </Col>

                                 
                                <Col md={6}>
                                    <Form.Label>Motivo de la cita</Form.Label>
                                    <Form.Control 
  type="text"
  placeholder="Ingresa el motivo de la cita"
  value={motivoCita}
  onChange={(e) => setMotivoCita(e.target.value)}
  autoFocus
/>
                                </Col>
                        
                            </Row>
                        </div>

                        <div className="text-end mb-5">

                            <Button variant="danger" style={{width:"25%", marginRight: "10px" }}as={Link} to="/Medicos/agendar-cita"> Cancelar</Button>

                            <Button onClick={FinalizarCita}style={{width:"25%"}}> Finalizar Registro </Button>

                        </div>

                 </div> )}

             </Layout_Medicos>
        </div>
    )
} export default citas