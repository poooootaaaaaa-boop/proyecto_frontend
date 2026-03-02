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
import { useState } from "react";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import Mensaje from "./mensaje";

function citas({ data, setData }){
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
        const [mostrarMensaje,setMostrarMensaje]=useState(false);
        
        const FinalizarCita = () => {
            const nuevaCita = { nombre,apellidoP, apellidoM, fechaCita:fechaCita?.format("YYYY-MM-DD HH:mm"), tipoCita, motivoCita};
            console.log("Cita creada:", nuevaCita);

            if (typeof setData === "function") {
            setData(prev => [...prev, nuevaCita]);
             setMostrarMensaje(true); 
            } else {
            console.error("setData no es una función", setData);
            }
        }

    return(
        <div>
             <Layout_Medicos>
                {mostrarMensaje ? (
                    <Mensaje
                            titulo="¡Cita Registrada!"
                            descripcion="La cita fue agregada correctamente."
                            botonPrincipal="Volver"
                            onPrincipal={()=>setMostrarMensaje(false)}
                        />) : ( 
                <div className="container mt-4">
                     <h1 style={{fontWeight:"600"}}>Crear Nueva Cita</h1>
                    <Typography style={{fontSize: "17px",color: "gray"}}>Complete los datos para agendar una cita médica</Typography>
                    <br />

                        <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>

                            <h5 style={{fontWeight:"600"}}><PersonIcon style={{fontSize:"25px",marginRight:"5px",color:"blue"}}/>Información Personal</h5>

                            <Row className="mt-3">
                                <Col md={4}>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text"placeholder="Ingresa tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                </Col>

                                <Col md={4}>
                                    <Form.Label>Apellido Paterno</Form.Label>
                                    <Form.Control type="text" placeholder="ingresa tu apellido paterno" value={apellidoP} onChange={(e) => setApellidoP(e.target.value)} />
                                </Col>

                                <Col md={4}>
                                    <Form.Label>Apellido Materno</Form.Label>
                                    <Form.Control type="text" placeholder="ingresa tu apellido materno" value={apellidoM} onChange={(e) => setApellidoM(e.target.value)} />
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
                                                <StaticDateTimePicker orientation="landscape" value={fechaCita} onChange={(newValue) => setFechaCita(newValue)} />
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
                                    <Form.Control type="text" placeholder="Ingresa el motivo de la cita" value={motivoCita} onChange={(e) => setMotivoCita(e.target.value)} />
                                </Col>
                        
                            </Row>
                        </div>

                        <div className="text-end mb-5">

                            <Button variant="danger" style={{marginRight:"10px"}}> Cancelar</Button>

                            <Button onClick={FinalizarCita}> Finalizar Registro </Button>

                        </div>

                 </div> )}

             </Layout_Medicos>
        </div>
    )
} export default citas